import { useState } from 'react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import ModuleAccordion from './ModuleAccordion'
import type { Module, Lesson } from '../../../types'
import { Plus, BookOpen } from 'lucide-react'

export interface SyllabusBuilderProps {
  modules: Module[]
  onAddModule: (title: string, description?: string) => Promise<void>
  onUpdateModule: (moduleId: string, title: string, description?: string) => Promise<void>
  onDeleteModule: (moduleId: string) => Promise<void>
  onReorderModule: (moduleId: string, direction: 'up' | 'down') => Promise<void>
  onAddLesson: (moduleId: string) => void
  onEditLesson: (moduleId: string, lesson: Lesson) => void
  onDeleteLesson: (lessonId: string) => Promise<void>
  onReorderLesson: (moduleId: string, lessonId: string, direction: 'up' | 'down') => Promise<void>
  loading?: boolean
}

function SyllabusBuilder({
  modules,
  onAddModule,
  onUpdateModule,
  onDeleteModule,
  onReorderModule,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onReorderLesson,
  loading,
}: SyllabusBuilderProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [showAddModule, setShowAddModule] = useState(false)
  const [newModuleTitle, setNewModuleTitle] = useState('')
  const [newModuleDescription, setNewModuleDescription] = useState('')
  const [addingModule, setAddingModule] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'module' | 'lesson'; id: string; title: string } | null>(null)
  const [deleting, setDeleting] = useState(false)
  
  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }
  
  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) return
    setAddingModule(true)
    try {
      await onAddModule(newModuleTitle.trim(), newModuleDescription.trim() || undefined)
      setNewModuleTitle('')
      setNewModuleDescription('')
      setShowAddModule(false)
    } finally {
      setAddingModule(false)
    }
  }
  
  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return
    setDeleting(true)
    try {
      if (deleteConfirm.type === 'module') {
        await onDeleteModule(deleteConfirm.id)
      } else {
        await onDeleteLesson(deleteConfirm.id)
      }
      setDeleteConfirm(null)
    } finally {
      setDeleting(false)
    }
  }
  
  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <Card.Body>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Course Syllabus</h2>
              <p className="text-sm text-gray-500">
                {modules.length} {modules.length === 1 ? 'module' : 'modules'} • {totalLessons} {totalLessons === 1 ? 'lesson' : 'lessons'}
              </p>
            </div>
            <Button
              onClick={() => setShowAddModule(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Module
            </Button>
          </div>
        </Card.Body>
      </Card>
      
      {/* Add Module Form */}
      {showAddModule && (
        <Card className="border-primary-200 bg-primary-50">
          <Card.Body>
            <h3 className="font-medium text-gray-900 mb-3">New Module</h3>
            <div className="space-y-3">
              <Input
                label="Module Title"
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                placeholder="e.g., Introduction to the Course"
                autoFocus
              />
              <Input
                label="Description (optional)"
                value={newModuleDescription}
                onChange={(e) => setNewModuleDescription(e.target.value)}
                placeholder="Brief description of this module"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleAddModule}
                  loading={addingModule}
                  disabled={!newModuleTitle.trim()}
                >
                  Add Module
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowAddModule(false)
                    setNewModuleTitle('')
                    setNewModuleDescription('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
      
      {/* Modules List */}
      {modules.length > 0 ? (
        <div className="space-y-3">
          {modules.map((module, index) => (
            <ModuleAccordion
              key={module.id}
              module={module}
              index={index}
              isFirst={index === 0}
              isLast={index === modules.length - 1}
              isExpanded={expandedModules.has(module.id)}
              onToggle={() => toggleModule(module.id)}
              onUpdate={(title, description) => onUpdateModule(module.id, title, description)}
              onDelete={() => setDeleteConfirm({ type: 'module', id: module.id, title: module.title })}
              onMoveUp={() => onReorderModule(module.id, 'up')}
              onMoveDown={() => onReorderModule(module.id, 'down')}
              onAddLesson={() => onAddLesson(module.id)}
              onEditLesson={(lesson) => onEditLesson(module.id, lesson)}
              onDeleteLesson={(lessonId) => {
                const lesson = module.lessons?.find(l => l.id === lessonId)
                setDeleteConfirm({ type: 'lesson', id: lessonId, title: lesson?.title || 'this lesson' })
              }}
              onReorderLesson={(lessonId, direction) => onReorderLesson(module.id, lessonId, direction)}
            />
          ))}
        </div>
      ) : !showAddModule ? (
        <Card>
          <Card.Body className="py-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No modules yet</h3>
              <p className="text-gray-500 mb-4">Start building your course by adding the first module.</p>
              <Button
                onClick={() => setShowAddModule(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add First Module
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : null}
      
      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${deleteConfirm?.type === 'module' ? 'Module' : 'Lesson'}`}
        message={`Are you sure you want to delete "${deleteConfirm?.title}"? ${
          deleteConfirm?.type === 'module' ? 'All lessons in this module will also be deleted.' : ''
        } This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  )
}

export default SyllabusBuilder
