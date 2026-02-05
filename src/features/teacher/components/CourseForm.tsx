import { Plus, Minus } from 'lucide-react'
import { Input, Textarea, Button, Card } from '../../../components/ui'
import type { CourseFormData } from '../hooks/useCourseBuilder'
import type { CourseCategory, DifficultyLevel, CourseVisibility } from '../../../types'

const categories: { value: CourseCategory; label: string }[] = [
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

const difficulties: { value: DifficultyLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

interface CourseFormProps {
  formData: CourseFormData
  updateField: <K extends keyof CourseFormData>(field: K, value: CourseFormData[K]) => void
  addListItem: (field: 'whatYouLearn' | 'requirements') => void
  updateListItem: (field: 'whatYouLearn' | 'requirements', index: number, value: string) => void
  removeListItem: (field: 'whatYouLearn' | 'requirements', index: number) => void
  isSchoolTeacher: boolean
}

function CourseForm({ formData, updateField, addListItem, updateListItem, removeListItem, isSchoolTeacher }: CourseFormProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="space-y-4">
          <Input
            label="Course Title"
            required
            value={formData.title}
            onChange={e => updateField('title', e.target.value)}
            placeholder="e.g., Introduction to Mathematics"
          />
          <Textarea
            label="Description"
            required
            value={formData.description}
            onChange={e => updateField('description', e.target.value)}
            rows={4}
            placeholder="Describe what students will learn..."
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={e => updateField('category', e.target.value as CourseCategory)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select category</option>
                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty *</label>
              <select
                value={formData.difficulty}
                onChange={e => updateField('difficulty', e.target.value as DifficultyLevel)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select difficulty</option>
                {difficulties.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
              <select
                value={formData.visibility}
                onChange={e => updateField('visibility', e.target.value as CourseVisibility)}
                disabled={!isSchoolTeacher}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
              >
                {isSchoolTeacher ? (
                  <>
                    <option value="private">Private (your school only)</option>
                    <option value="public">Public (all schools)</option>
                  </>
                ) : (
                  <option value="public">Public (all schools)</option>
                )}
              </select>
            </div>
            <Input
              label="Estimated Hours"
              type="number"
              min={1}
              value={formData.estimatedHours || ''}
              onChange={e => updateField('estimatedHours', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="e.g., 10"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Objectives</h3>
        <p className="text-sm text-gray-500 mb-3">What will students learn from this course?</p>
        <div className="space-y-2">
          {formData.whatYouLearn.map((item, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={item}
                onChange={e => updateListItem('whatYouLearn', i, e.target.value)}
                placeholder="e.g., Understand basic algebra"
                className="flex-1"
              />
              {formData.whatYouLearn.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => removeListItem('whatYouLearn', i)}>
                  <Minus className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={() => addListItem('whatYouLearn')} leftIcon={<Plus className="w-4 h-4" />}>
            Add objective
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Prerequisites</h3>
        <p className="text-sm text-gray-500 mb-3">What should students know before starting?</p>
        <div className="space-y-2">
          {formData.requirements.map((item, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={item}
                onChange={e => updateListItem('requirements', i, e.target.value)}
                placeholder="e.g., Basic math skills"
                className="flex-1"
              />
              {formData.requirements.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => removeListItem('requirements', i)}>
                  <Minus className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={() => addListItem('requirements')} leftIcon={<Plus className="w-4 h-4" />}>
            Add prerequisite
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default CourseForm
