import { useState } from 'react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Textarea from '../../../components/ui/Textarea'
import type { Module, Lesson } from '../../../types'
import { 
  ChevronDown, ChevronUp, Plus, Edit2, Trash2, 
  GripVertical, BookOpen, FileQuestion, ClipboardList,
  Check, X, ArrowUp, ArrowDown
} from 'lucide-react'

export interface ModuleAccordionProps {
  module: Module
  index: number
  isFirst: boolean
  isLast: boolean
  isExpanded: boolean
  onToggle: () => void
  onUpdate: (title: string, description?: string) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onAddLesson: () => void
  onEditLesson: (lesson: Lesson) => void
  onDeleteLesson: (lessonId: string) => void
  onReorderLesson: (lessonId: string, direction: 'up' | 'down') => void
}

const lessonTypeIcons = {
  lecture: BookOpen,
  quiz: FileQuestion,
  assignment: ClipboardList,
}

const lessonTypeLabels = {
  lecture: 'Lecture',
  quiz: 'Quiz',
  assignment: 'Assignment',
}

function ModuleAccordion({
  module,
  index,
  isFirst,
  isLast,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onReorderLesson,
}: ModuleAccordionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(module.title)
  const [editDescription, setEditDescription] = useState(module.description || '')
  
  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdate(editTitle.trim(), editDescription.trim() || undefined)
      setIsEditing(false)
    }
  }
  
  const handleCancelEdit = () => {
    setEditTitle(module.title)
    setEditDescription(module.description || '')
    setIsEditing(false)
  }
  
  const lessonCount = module.lessons?.length || 0
  
  return (
    <Card className="overflow-hidden">
      {/* Module Header */}
      <div 
        className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
          isExpanded ? 'border-b border-gray-200' : ''
        }`}
        onClick={() => !isEditing && onToggle()}
      >
        {/* Drag handle / Order controls */}
        <div className="flex flex-col gap-0.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move up"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move down"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
        
        {/* Module number */}
        <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-medium">
          {index + 1}
        </span>
        
        {/* Module title/edit form */}
        <div className="flex-1 min-w-0" onClick={(e) => isEditing && e.stopPropagation()}>
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Module title"
                autoFocus
              />
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Module description (optional)"
                rows={2}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveEdit} leftIcon={<Check className="w-4 h-4" />}>
                  Save
                </Button>
                <Button size="sm" variant="secondary" onClick={handleCancelEdit} leftIcon={<X className="w-4 h-4" />}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-medium text-gray-900 truncate">{module.title}</h3>
              {module.description && (
                <p className="text-sm text-gray-500 truncate">{module.description}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}
              </p>
            </div>
          )}
        </div>
        
        {/* Actions */}
        {!isEditing && (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              title="Edit module"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDelete}
              className="text-danger-600 hover:bg-danger-50"
              title="Delete module"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-gray-200 mx-1" />
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        )}
      </div>
      
      {/* Lessons List */}
      {isExpanded && (
        <div className="p-4 bg-gray-50">
          {module.lessons && module.lessons.length > 0 ? (
            <div className="space-y-2">
              {module.lessons.map((lesson, lessonIndex) => {
                const Icon = lessonTypeIcons[lesson.type]
                const isFirstLesson = lessonIndex === 0
                const isLastLesson = lessonIndex === module.lessons.length - 1
                
                return (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    {/* Reorder buttons */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => onReorderLesson(lesson.id, 'up')}
                        disabled={isFirstLesson}
                        className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onReorderLesson(lesson.id, 'down')}
                        disabled={isLastLesson}
                        className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                    
                    {/* Lesson type icon */}
                    <div className={`w-8 h-8 rounded flex items-center justify-center ${
                      lesson.type === 'lecture' ? 'bg-blue-100 text-blue-600' :
                      lesson.type === 'quiz' ? 'bg-purple-100 text-purple-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    
                    {/* Lesson info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{lesson.title}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{lessonTypeLabels[lesson.type]}</span>
                        {lesson.durationMinutes && (
                          <>
                            <span>•</span>
                            <span>{lesson.durationMinutes} min</span>
                          </>
                        )}
                        {lesson.content && (
                          <>
                            <span>•</span>
                            <span className="text-success-600">Has content</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Lesson actions */}
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEditLesson(lesson)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDeleteLesson(lesson.id)}
                        className="text-danger-600 hover:bg-danger-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No lessons yet
            </div>
          )}
          
          <Button
            size="sm"
            variant="secondary"
            onClick={onAddLesson}
            className="mt-3 w-full"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Lesson
          </Button>
        </div>
      )}
    </Card>
  )
}

export default ModuleAccordion
