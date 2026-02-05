import { useState } from 'react'
import { ChevronDown, ChevronRight, CheckCircle2, Circle, PlayCircle } from 'lucide-react'
import clsx from 'clsx'
import type { Module, Lesson } from '../../../types'

interface SyllabusNavProps {
  modules: Module[]
  currentLessonId?: string
  onLessonSelect: (lesson: Lesson) => void
  className?: string
}

function SyllabusNav({ modules, currentLessonId, onLessonSelect, className }: SyllabusNavProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(() => {
    const set = new Set<string>()
    for (const mod of modules) {
      for (const lesson of mod.lessons) {
        if (lesson.id === currentLessonId) {
          set.add(mod.id)
          break
        }
      }
    }
    if (set.size === 0 && modules.length > 0) set.add(modules[0].id)
    return set
  })

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev)
      if (next.has(moduleId)) next.delete(moduleId)
      else next.add(moduleId)
      return next
    })
  }

  const lessonIcon = (lesson: Lesson) => {
    if (lesson.id === currentLessonId) return <PlayCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
    if (lesson.isCompleted) return <CheckCircle2 className="w-4 h-4 text-success-500 flex-shrink-0" />
    return <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
  }

  return (
    <nav className={clsx('overflow-y-auto', className)}>
      {modules.map(mod => (
        <div key={mod.id} className="border-b border-gray-100 last:border-b-0">
          <button
            onClick={() => toggleModule(mod.id)}
            className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50"
          >
            {expandedModules.has(mod.id) ? (
              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            )}
            <span className="text-sm font-medium text-gray-900 truncate">{mod.title}</span>
          </button>
          {expandedModules.has(mod.id) && (
            <ul className="pb-2">
              {mod.lessons.map(lesson => (
                <li key={lesson.id}>
                  <button
                    onClick={() => onLessonSelect(lesson)}
                    className={clsx(
                      'w-full flex items-center gap-2 px-4 pl-10 py-2 text-left text-sm hover:bg-gray-50',
                      lesson.id === currentLessonId && 'bg-primary-50 text-primary-700 font-medium',
                      lesson.id !== currentLessonId && 'text-gray-600',
                    )}
                  >
                    {lessonIcon(lesson)}
                    <span className="truncate">{lesson.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </nav>
  )
}

export default SyllabusNav
