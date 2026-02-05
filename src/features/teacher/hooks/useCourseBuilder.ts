import { useState, useCallback } from 'react'
import type { TeacherCourse, CourseCategory, DifficultyLevel, CourseVisibility } from '../../../types'

export interface CourseFormData {
  title: string
  description: string
  category: CourseCategory | ''
  difficulty: DifficultyLevel | ''
  visibility: CourseVisibility
  thumbnailUrl?: string
  estimatedHours?: number
  whatYouLearn: string[]
  requirements: string[]
}

const initialFormData: CourseFormData = {
  title: '',
  description: '',
  category: '',
  difficulty: '',
  visibility: 'private',
  thumbnailUrl: '',
  estimatedHours: undefined,
  whatYouLearn: [''],
  requirements: [''],
}

export function useCourseBuilder(existingCourse?: TeacherCourse) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<CourseFormData>(() => {
    if (existingCourse) {
      return {
        title: existingCourse.title,
        description: existingCourse.description,
        category: existingCourse.category,
        difficulty: existingCourse.difficulty,
        visibility: existingCourse.visibility,
        thumbnailUrl: existingCourse.thumbnailUrl,
        estimatedHours: existingCourse.estimatedHours,
        whatYouLearn: existingCourse.whatYouLearn || [''],
        requirements: existingCourse.requirements || [''],
      }
    }
    return initialFormData
  })
  const [isDirty, setIsDirty] = useState(false)

  const updateField = useCallback(<K extends keyof CourseFormData>(field: K, value: CourseFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setIsDirty(true)
  }, [])

  const addListItem = useCallback((field: 'whatYouLearn' | 'requirements') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }))
    setIsDirty(true)
  }, [])

  const updateListItem = useCallback((field: 'whatYouLearn' | 'requirements', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item),
    }))
    setIsDirty(true)
  }, [])

  const removeListItem = useCallback((field: 'whatYouLearn' | 'requirements', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
    setIsDirty(true)
  }, [])

  const nextStep = useCallback(() => setStep(s => Math.min(s + 1, 4)), [])
  const prevStep = useCallback(() => setStep(s => Math.max(s - 1, 1)), [])
  const goToStep = useCallback((s: number) => setStep(s), [])

  const isValid = formData.title.trim() !== '' && formData.category !== '' && formData.difficulty !== ''

  return {
    step,
    formData,
    isDirty,
    isValid,
    updateField,
    addListItem,
    updateListItem,
    removeListItem,
    nextStep,
    prevStep,
    goToStep,
    setStep,
  }
}
