import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useTeacherCourse, useCreateCourse, useUpdateCourse, useSubmitForReview } from '../../features/teacher/hooks/useTeacherCourses'
import { useModules, useCreateModule, useUpdateModule, useDeleteModule, useReorderModules } from '../../features/teacher/hooks/useModules'
import { useCreateLesson, useUpdateLesson, useDeleteLesson, useReorderLesson } from '../../features/teacher/hooks/useLessons'
import SyllabusBuilder from '../../features/teacher/components/SyllabusBuilder'
import LessonEditorModal from '../../features/teacher/components/LessonEditorModal'
import ValidationChecklist from '../../features/teacher/components/ValidationChecklist'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import Select from '../../components/ui/Select'
import Alert from '../../components/ui/Alert'
import Skeleton from '../../components/ui/Skeleton'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import type { CourseVisibility, CourseCategory, DifficultyLevel, Lesson, Module } from '../../types'
import { ArrowLeft, ArrowRight, Save, Send, Check, BookOpen, ListChecks, FileCheck } from 'lucide-react'

type BuilderStep = 'basic' | 'syllabus' | 'review'

const STEPS: { key: BuilderStep; label: string; icon: typeof BookOpen }[] = [
  { key: 'basic', label: 'Basic Info', icon: BookOpen },
  { key: 'syllabus', label: 'Syllabus', icon: ListChecks },
  { key: 'review', label: 'Review', icon: FileCheck },
]

const CATEGORIES = [
  { value: '', label: 'Select category...' },
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'science', label: 'Science' },
  { value: 'languages', label: 'Languages' },
  { value: 'arts', label: 'Arts' },
  { value: 'technology', label: 'Technology' },
  { value: 'social_studies', label: 'Social Studies' },
  { value: 'health', label: 'Health' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'other', label: 'Other' },
]

const DIFFICULTIES = [
  { value: '', label: 'Select difficulty...' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

export default function CourseBuilder() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isEditing = !!courseId
  
  // Step management
  const [currentStep, setCurrentStep] = useState<BuilderStep>('basic')
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  
  // Basic info form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [visibility, setVisibility] = useState<CourseVisibility>('private')
  const [formDirty, setFormDirty] = useState(false)
  
  // Lesson editor state
  const [lessonEditorOpen, setLessonEditorOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<{ moduleId: string; lesson?: Lesson } | null>(null)
  
  // Queries
  const { data: existingCourse, isLoading: courseLoading } = useTeacherCourse(courseId)
  const { data: modules = [], isLoading: modulesLoading } = useModules(courseId)
  
  // Mutations
  const createCourse = useCreateCourse()
  const updateCourse = useUpdateCourse()
  const submitForReview = useSubmitForReview()
  const createModule = useCreateModule()
  const updateModule = useUpdateModule()
  const deleteModule = useDeleteModule()
  const reorderModules = useReorderModules()
  const createLesson = useCreateLesson()
  const updateLesson = useUpdateLesson()
  const deleteLesson = useDeleteLesson()
  const reorderLesson = useReorderLesson()
  
  const isIndependentTeacher = user?.role === 'independent_teacher'
  
  // Initialize form with existing course data
  useEffect(() => {
    if (existingCourse) {
      setTitle(existingCourse.title)
      setDescription(existingCourse.description)
      setCategory(existingCourse.category)
      setDifficulty(existingCourse.difficulty)
      setVisibility(existingCourse.visibility)
      setFormDirty(false)
    }
  }, [existingCourse])
  
  // Mark form as dirty when values change
  const handleFieldChange = (setter: (value: any) => void) => (value: any) => {
    setter(value)
    setFormDirty(true)
  }
  
  // Auto-save draft on step transitions
  const saveBasicInfo = async () => {
    if (!title || !category || !difficulty) return null
    
    if (!isEditing) {
      const result = await createCourse.mutateAsync({
        title,
        description,
        category: category as CourseCategory,
        difficulty: difficulty as DifficultyLevel,
        visibility,
        teacherId: user!.id,
      })
      setFormDirty(false)
      return result
    } else if (formDirty) {
      await updateCourse.mutateAsync({
        id: courseId!,
        data: {
          title,
          description,
          category: category as CourseCategory,
          difficulty: difficulty as DifficultyLevel,
          visibility,
        },
      })
      setFormDirty(false)
    }
    return existingCourse
  }
  
  // Step navigation
  const goToStep = async (step: BuilderStep) => {
    if (step === 'syllabus' || step === 'review') {
      // Save basic info first
      const course = await saveBasicInfo()
      if (!course && !courseId) {
        // Need to create course first
        return
      }
      if (course && !courseId) {
        // Redirect to edit URL after creating
        navigate(`/teacher/courses/${course.id}/edit`, { replace: true })
      }
    }
    setCurrentStep(step)
  }
  
  const handleNext = async () => {
    if (currentStep === 'basic') {
      await goToStep('syllabus')
    } else if (currentStep === 'syllabus') {
      await goToStep('review')
    }
  }
  
  const handleBack = () => {
    if (currentStep === 'syllabus') {
      setCurrentStep('basic')
    } else if (currentStep === 'review') {
      setCurrentStep('syllabus')
    }
  }
  
  // Module handlers
  const handleAddModule = async (moduleTitle: string, moduleDescription?: string) => {
    if (!courseId) return
    await createModule.mutateAsync({ courseId, title: moduleTitle, description: moduleDescription })
  }
  
  const handleUpdateModule = async (moduleId: string, moduleTitle: string, moduleDescription?: string) => {
    await updateModule.mutateAsync({ id: moduleId, title: moduleTitle, description: moduleDescription })
  }
  
  const handleDeleteModule = async (moduleId: string) => {
    await deleteModule.mutateAsync(moduleId)
  }
  
  const handleReorderModule = async (moduleId: string, direction: 'up' | 'down') => {
    if (!courseId) return
    await reorderModules.mutateAsync({ courseId, moduleId, direction })
  }
  
  // Lesson handlers
  const handleAddLesson = (moduleId: string) => {
    setEditingLesson({ moduleId })
    setLessonEditorOpen(true)
  }
  
  const handleEditLesson = (moduleId: string, lesson: Lesson) => {
    setEditingLesson({ moduleId, lesson })
    setLessonEditorOpen(true)
  }
  
  const handleDeleteLesson = async (lessonId: string) => {
    await deleteLesson.mutateAsync(lessonId)
  }
  
  const handleReorderLesson = async (moduleId: string, lessonId: string, direction: 'up' | 'down') => {
    await reorderLesson.mutateAsync({ moduleId, lessonId, direction })
  }
  
  const handleSaveLesson = async (data: Partial<Lesson>) => {
    if (!editingLesson) return
    
    if (editingLesson.lesson) {
      await updateLesson.mutateAsync({
        id: editingLesson.lesson.id,
        data,
      })
    } else {
      await createLesson.mutateAsync({
        moduleId: editingLesson.moduleId,
        title: data.title!,
        type: data.type!,
        durationMinutes: data.durationMinutes,
        content: data.content,
      })
    }
    
    setLessonEditorOpen(false)
    setEditingLesson(null)
  }
  
  // Submit for review
  const handleSubmitForReview = async () => {
    if (!courseId) return
    await submitForReview.mutateAsync(courseId)
    setShowSubmitConfirm(false)
    navigate('/teacher/courses')
  }
  
  // Validation
  const isBasicInfoValid = title.trim() !== '' && category !== '' && difficulty !== ''
  
  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)
  const lessonsWithContent = modules.reduce((acc, m) => 
    acc + (m.lessons?.filter(l => l.content && (l.content.text || l.content.videoUrl || l.content.questions?.length || l.content.instructions))?.length || 0), 0)
  
  const validationItems = [
    {
      label: 'Course title and description',
      isValid: !!title.trim() && !!description.trim(),
      details: !title.trim() ? 'Add a title' : !description.trim() ? 'Add a description' : undefined,
    },
    {
      label: 'Category and difficulty selected',
      isValid: !!category && !!difficulty,
    },
    {
      label: 'At least one module',
      isValid: modules.length > 0,
      details: 'Add at least one module to your course',
    },
    {
      label: 'At least one lesson per module',
      isValid: modules.length > 0 && modules.every(m => m.lessons && m.lessons.length > 0),
      details: modules.filter(m => !m.lessons || m.lessons.length === 0).map(m => `"${m.title}" has no lessons`).join(', '),
    },
    {
      label: 'All lessons have content',
      isValid: totalLessons > 0 && lessonsWithContent === totalLessons,
      isWarning: true,
      details: lessonsWithContent < totalLessons ? `${totalLessons - lessonsWithContent} lesson(s) missing content` : undefined,
    },
  ]
  
  const canSubmit = validationItems.filter(i => !i.isWarning).every(i => i.isValid)
  
  // Loading state
  if (isEditing && courseLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-16" />
        <Skeleton className="h-96" />
      </div>
    )
  }
  
  const stepIndex = STEPS.findIndex(s => s.key === currentStep)
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Course' : 'Create New Course'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? existingCourse?.title : 'Build your course step by step'}
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing && (
            <Link to={`/teacher/courses/${courseId}/analytics`}>
              <Button variant="secondary" size="sm">View Analytics</Button>
            </Link>
          )}
          <Button variant="secondary" onClick={() => navigate('/teacher/courses')}>
            Cancel
          </Button>
        </div>
      </div>
      
      {/* Step Indicator */}
      <div className="flex items-center justify-center">
        {STEPS.map((step, index) => {
          const Icon = step.icon
          const isCompleted = index < stepIndex
          const isCurrent = index === stepIndex
          const isClickable = index === 0 || (index === 1 && courseId) || (index === 2 && courseId && modules.length > 0)
          
          return (
            <div key={step.key} className="flex items-center">
              <button
                onClick={() => isClickable && goToStep(step.key)}
                disabled={!isClickable}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isCurrent 
                    ? 'bg-primary-100 text-primary-700' 
                    : isCompleted 
                      ? 'bg-success-50 text-success-700'
                      : 'text-gray-400'
                } ${isClickable ? 'cursor-pointer hover:bg-opacity-80' : 'cursor-not-allowed'}`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  isCurrent 
                    ? 'bg-primary-600 text-white' 
                    : isCompleted 
                      ? 'bg-success-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {index < STEPS.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-2 ${
                  index < stepIndex ? 'bg-success-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          )
        })}
      </div>
      
      {/* Step Content */}
      {currentStep === 'basic' && (
        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold">Course Information</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4 max-w-2xl">
              <Input
                label="Course Title"
                value={title}
                onChange={(e) => handleFieldChange(setTitle)(e.target.value)}
                placeholder="Enter course title..."
                required
              />
              
              <Textarea
                label="Description"
                value={description}
                onChange={(e) => handleFieldChange(setDescription)(e.target.value)}
                placeholder="Describe what students will learn in this course..."
                rows={4}
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Category"
                  value={category}
                  onChange={handleFieldChange(setCategory)}
                  options={CATEGORIES}
                  required
                />
                
                <Select
                  label="Difficulty Level"
                  value={difficulty}
                  onChange={handleFieldChange(setDifficulty)}
                  options={DIFFICULTIES}
                  required
                />
              </div>
              
              {!isIndependentTeacher && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        checked={visibility === 'private'}
                        onChange={() => handleFieldChange(setVisibility)('private')}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">Private</span>
                        <p className="text-xs text-gray-500">Only students in your school</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        checked={visibility === 'public'}
                        onChange={() => handleFieldChange(setVisibility)('public')}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">Public</span>
                        <p className="text-xs text-gray-500">Students from all schools</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={handleNext}
                  disabled={!isBasicInfoValid}
                  loading={createCourse.isPending || updateCourse.isPending}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {isEditing ? 'Continue to Syllabus' : 'Create & Continue'}
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
      
      {currentStep === 'syllabus' && (
        <div className="space-y-6">
          {modulesLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          ) : (
            <SyllabusBuilder
              modules={modules}
              onAddModule={handleAddModule}
              onUpdateModule={handleUpdateModule}
              onDeleteModule={handleDeleteModule}
              onReorderModule={handleReorderModule}
              onAddLesson={handleAddLesson}
              onEditLesson={handleEditLesson}
              onDeleteLesson={handleDeleteLesson}
              onReorderLesson={handleReorderLesson}
            />
          )}
          
          <div className="flex justify-between pt-4">
            <Button
              variant="secondary"
              onClick={handleBack}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Basic Info
            </Button>
            <Button
              onClick={handleNext}
              disabled={modules.length === 0}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Review
            </Button>
          </div>
        </div>
      )}
      
      {currentStep === 'review' && (
        <div className="space-y-6">
          {/* Course Summary */}
          <Card>
            <Card.Header>
              <h2 className="text-lg font-semibold">Course Summary</h2>
            </Card.Header>
            <Card.Body>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <dt className="text-sm text-gray-500">Title</dt>
                  <dd className="font-medium text-gray-900">{title}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Category</dt>
                  <dd className="font-medium text-gray-900 capitalize">{category.replace('_', ' ')}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Difficulty</dt>
                  <dd className="font-medium text-gray-900 capitalize">{difficulty}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Visibility</dt>
                  <dd className="font-medium text-gray-900 capitalize">{visibility}</dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-sm text-gray-500">Description</dt>
                  <dd className="font-medium text-gray-900">{description || <span className="text-gray-400 italic">No description</span>}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Modules</dt>
                  <dd className="font-medium text-gray-900">{modules.length}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Total Lessons</dt>
                  <dd className="font-medium text-gray-900">{totalLessons}</dd>
                </div>
              </dl>
            </Card.Body>
          </Card>
          
          {/* Syllabus Preview */}
          <Card>
            <Card.Header>
              <h2 className="text-lg font-semibold">Syllabus Preview</h2>
            </Card.Header>
            <Card.Body>
              {modules.length > 0 ? (
                <div className="space-y-4">
                  {modules.map((module, index) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900">
                        Module {index + 1}: {module.title}
                      </h3>
                      {module.description && (
                        <p className="text-sm text-gray-500 mt-1">{module.description}</p>
                      )}
                      {module.lessons && module.lessons.length > 0 ? (
                        <ul className="mt-3 space-y-2">
                          {module.lessons.map((lesson, lIndex) => (
                            <li key={lesson.id} className="flex items-center gap-2 text-sm">
                              <span className="w-6 h-6 rounded bg-gray-100 text-gray-600 flex items-center justify-center text-xs">
                                {lIndex + 1}
                              </span>
                              <span className="text-gray-700">{lesson.title}</span>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                lesson.type === 'lecture' ? 'bg-blue-100 text-blue-700' :
                                lesson.type === 'quiz' ? 'bg-purple-100 text-purple-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {lesson.type}
                              </span>
                              {!lesson.content && (
                                <span className="text-xs text-warning-600">(no content)</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-danger-600 mt-2">No lessons in this module</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No modules added yet</p>
              )}
            </Card.Body>
          </Card>
          
          {/* Validation Checklist */}
          <ValidationChecklist items={validationItems} />
          
          {/* Submit Info */}
          <Alert variant="info">
            {isIndependentTeacher ? (
              <>
                Your course will be submitted for <strong>Super Admin</strong> review.
                Once approved, it will be visible to all students across all schools.
              </>
            ) : visibility === 'public' ? (
              <>
                Public courses require <strong>Super Admin</strong> approval before
                becoming visible to students outside your school.
              </>
            ) : (
              <>
                Private courses require <strong>School Admin</strong> approval before
                becoming visible to students in your school.
              </>
            )}
          </Alert>
          
          <div className="flex justify-between pt-4">
            <Button
              variant="secondary"
              onClick={handleBack}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Syllabus
            </Button>
            <div className="flex gap-3">
              <Link to="/teacher/courses">
                <Button variant="secondary" leftIcon={<Save className="w-4 h-4" />}>
                  Save as Draft
                </Button>
              </Link>
              <Button
                onClick={() => setShowSubmitConfirm(true)}
                disabled={!canSubmit}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Submit for Review
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Lesson Editor Modal */}
      <LessonEditorModal
        isOpen={lessonEditorOpen}
        onClose={() => {
          setLessonEditorOpen(false)
          setEditingLesson(null)
        }}
        onSave={handleSaveLesson}
        lesson={editingLesson?.lesson}
        loading={createLesson.isPending || updateLesson.isPending}
      />
      
      {/* Submit Confirmation */}
      <ConfirmDialog
        isOpen={showSubmitConfirm}
        onClose={() => setShowSubmitConfirm(false)}
        onConfirm={handleSubmitForReview}
        title="Submit for Review"
        message="Are you sure you want to submit this course for review? You won't be able to make major changes until it's reviewed."
        confirmLabel="Submit for Review"
        loading={submitForReview.isPending}
      />
    </div>
  )
}
