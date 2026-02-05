import { useState, useEffect } from 'react'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Textarea from '../../../components/ui/Textarea'
import Select from '../../../components/ui/Select'
import Card from '../../../components/ui/Card'
import type { Lesson, LessonType, LessonContent, QuizQuestionItem } from '../../../types'
import { Plus, Trash2, Check } from 'lucide-react'

export interface LessonEditorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Lesson>) => Promise<void>
  lesson?: Lesson
  loading?: boolean
}

const LESSON_TYPES = [
  { value: 'lecture', label: 'Lecture' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'assignment', label: 'Assignment' },
]

const SUBMISSION_TYPES = [
  { value: 'text', label: 'Text only' },
  { value: 'file', label: 'File upload only' },
  { value: 'both', label: 'Text or File' },
]

function generateId() {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function LessonEditorModal({ isOpen, onClose, onSave, lesson, loading }: LessonEditorModalProps) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<LessonType>('lecture')
  const [durationMinutes, setDurationMinutes] = useState<number | ''>('')
  
  // Lecture fields
  const [textContent, setTextContent] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  
  // Quiz fields
  const [timeLimit, setTimeLimit] = useState<number | ''>('')
  const [passingScore, setPassingScore] = useState<number | ''>(70)
  const [questions, setQuestions] = useState<QuizQuestionItem[]>([])
  
  // Assignment fields
  const [instructions, setInstructions] = useState('')
  const [submissionType, setSubmissionType] = useState<'file' | 'text' | 'both'>('both')
  const [totalPoints, setTotalPoints] = useState<number | ''>(100)
  const [dueDate, setDueDate] = useState('')
  
  // Initialize form when lesson changes or modal opens
  useEffect(() => {
    if (!isOpen) return
    
    if (lesson) {
      setTitle(lesson.title)
      setType(lesson.type)
      setDurationMinutes(lesson.durationMinutes || '')
      
      const content = lesson.content || {}
      setTextContent(content.text || '')
      setVideoUrl(content.videoUrl || '')
      setTimeLimit(content.timeLimit || '')
      setPassingScore(content.passingScore || 70)
      setQuestions(content.questions || [])
      setInstructions(content.instructions || '')
      setSubmissionType(content.submissionType || 'both')
      setTotalPoints(content.totalPoints || 100)
      setDueDate(content.dueDate || '')
    } else {
      // Reset form for new lesson
      setTitle('')
      setType('lecture')
      setDurationMinutes('')
      setTextContent('')
      setVideoUrl('')
      setTimeLimit('')
      setPassingScore(70)
      setQuestions([])
      setInstructions('')
      setSubmissionType('both')
      setTotalPoints(100)
      setDueDate('')
    }
  }, [lesson, isOpen])
  
  const handleSave = async () => {
    const content: LessonContent = {}
    
    if (type === 'lecture') {
      if (textContent) content.text = textContent
      if (videoUrl) content.videoUrl = videoUrl
    } else if (type === 'quiz') {
      content.timeLimit = timeLimit ? Number(timeLimit) : undefined
      content.passingScore = passingScore ? Number(passingScore) : 70
      content.questions = questions
    } else if (type === 'assignment') {
      content.instructions = instructions
      content.submissionType = submissionType
      content.totalPoints = totalPoints ? Number(totalPoints) : 100
      if (dueDate) content.dueDate = dueDate
    }
    
    await onSave({
      id: lesson?.id,
      title,
      type,
      durationMinutes: durationMinutes ? Number(durationMinutes) : undefined,
      content: Object.keys(content).length > 0 ? content : undefined,
    })
  }
  
  // Quiz question management
  const addQuestion = () => {
    const newQuestion: QuizQuestionItem = {
      id: generateId(),
      text: '',
      type: 'multiple_choice',
      options: [
        { id: generateId(), text: '' },
        { id: generateId(), text: '' },
      ],
      correctOptionId: '',
      points: 10,
    }
    setQuestions([...questions, newQuestion])
  }
  
  const updateQuestion = (index: number, updates: Partial<QuizQuestionItem>) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], ...updates }
    setQuestions(updated)
  }
  
  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }
  
  const addOption = (questionIndex: number) => {
    const updated = [...questions]
    updated[questionIndex].options.push({ id: generateId(), text: '' })
    setQuestions(updated)
  }
  
  const updateOption = (questionIndex: number, optionIndex: number, text: string) => {
    const updated = [...questions]
    updated[questionIndex].options[optionIndex].text = text
    setQuestions(updated)
  }
  
  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions]
    const removedId = updated[questionIndex].options[optionIndex]?.id
    updated[questionIndex].options = updated[questionIndex].options.filter((_, i) => i !== optionIndex)
    if (updated[questionIndex].correctOptionId === removedId) {
      updated[questionIndex].correctOptionId = ''
    }
    setQuestions(updated)
  }
  
  const setCorrectOption = (questionIndex: number, optionId: string) => {
    const updated = [...questions]
    updated[questionIndex].correctOptionId = optionId
    setQuestions(updated)
  }
  
  const isFormValid = () => {
    return title.trim() !== ''
  }
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lesson ? 'Edit Lesson' : 'Add New Lesson'}
      size="2xl"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Lesson Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter lesson title..."
            required
          />
          <Select
            label="Lesson Type"
            value={type}
            onChange={(val) => setType(val as LessonType)}
            options={LESSON_TYPES}
            disabled={!!lesson}
          />
        </div>
        
        <Input
          label="Duration (minutes, optional)"
          type="number"
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(e.target.value ? Number(e.target.value) : '')}
          placeholder="e.g., 30"
        />
        
        {type === 'lecture' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Lecture Content</h3>
            <Textarea
              label="Text Content (optional)"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Enter lecture content..."
              rows={6}
            />
            <Input
              label="Video URL (optional)"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
        )}
        
        {type === 'quiz' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Quiz Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Time Limit (minutes, optional)"
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value ? Number(e.target.value) : '')}
                placeholder="No limit"
              />
              <Input
                label="Passing Score (%)"
                type="number"
                min={0}
                max={100}
                value={passingScore}
                onChange={(e) => setPassingScore(e.target.value ? Number(e.target.value) : '')}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-700">Questions ({questions.length})</h4>
                <Button size="sm" variant="secondary" onClick={addQuestion} leftIcon={<Plus className="w-4 h-4" />}>
                  Add Question
                </Button>
              </div>
              
              {questions.map((question, qIndex) => (
                <Card key={question.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium text-gray-500 mt-2">Q{qIndex + 1}</span>
                      <div className="flex-1">
                        <Textarea
                          value={question.text}
                          onChange={(e) => updateQuestion(qIndex, { text: e.target.value })}
                          placeholder="Enter question..."
                          rows={2}
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-danger-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Select
                        value={question.type}
                        onChange={(val) => {
                          const newType = val as 'multiple_choice' | 'true_false'
                          const updates: Partial<QuizQuestionItem> = { type: newType }
                          if (newType === 'true_false') {
                            updates.options = [
                              { id: 'true', text: 'True' },
                              { id: 'false', text: 'False' },
                            ]
                            updates.correctOptionId = ''
                          }
                          updateQuestion(qIndex, updates)
                        }}
                        options={[
                          { value: 'multiple_choice', label: 'Multiple Choice' },
                          { value: 'true_false', label: 'True/False' },
                        ]}
                        className="w-40"
                      />
                      <Input
                        type="number"
                        value={question.points}
                        onChange={(e) => updateQuestion(qIndex, { points: Number(e.target.value) || 0 })}
                        className="w-24"
                        placeholder="Points"
                      />
                      <span className="text-sm text-gray-500">points</span>
                    </div>
                    
                    <div className="space-y-2 pl-6">
                      <p className="text-sm text-gray-600">Options (click to mark correct):</p>
                      {question.options.map((option, oIndex) => (
                        <div key={option.id} className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setCorrectOption(qIndex, option.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              question.correctOptionId === option.id
                                ? 'bg-success-500 border-success-500 text-white'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {question.correctOptionId === option.id && <Check className="w-4 h-4" />}
                          </button>
                          <Input
                            value={option.text}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${oIndex + 1}`}
                            className="flex-1"
                            disabled={question.type === 'true_false'}
                          />
                          {question.type !== 'true_false' && question.options.length > 2 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeOption(qIndex, oIndex)}
                              className="text-gray-400 hover:text-danger-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      {question.type !== 'true_false' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => addOption(qIndex)}
                          className="text-primary-600"
                        >
                          <Plus className="w-4 h-4 mr-1" /> Add Option
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              
              {questions.length === 0 && (
                <div className="text-center py-6 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                  No questions yet. Click "Add Question" to get started.
                </div>
              )}
            </div>
          </div>
        )}
        
        {type === 'assignment' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Assignment Details</h3>
            <Textarea
              label="Instructions (optional)"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Describe the assignment requirements..."
              rows={4}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Submission Type"
                value={submissionType}
                onChange={(val) => setSubmissionType(val as 'file' | 'text' | 'both')}
                options={SUBMISSION_TYPES}
              />
              <Input
                label="Total Points"
                type="number"
                min={0}
                value={totalPoints}
                onChange={(e) => setTotalPoints(e.target.value ? Number(e.target.value) : '')}
              />
              <Input
                label="Due Date (optional)"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        )}
        
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            loading={loading}
            disabled={!isFormValid()}
          >
            {lesson ? 'Update Lesson' : 'Add Lesson'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default LessonEditorModal
