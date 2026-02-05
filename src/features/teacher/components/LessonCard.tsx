import { FileText, HelpCircle, ClipboardList, MoreVertical, Edit2, Trash2, GripVertical } from 'lucide-react'
import { Dropdown, Badge } from '../../../components/ui'
import type { Lesson } from '../../../types'

const typeConfig = {
  lecture: { icon: FileText, label: 'Lecture', color: 'bg-blue-100 text-blue-600' },
  quiz: { icon: HelpCircle, label: 'Quiz', color: 'bg-purple-100 text-purple-600' },
  assignment: { icon: ClipboardList, label: 'Assignment', color: 'bg-green-100 text-green-600' },
}

interface LessonCardProps {
  lesson: Lesson
  onEdit: () => void
  onDelete: () => void
}

function LessonCard({ lesson, onEdit, onDelete }: LessonCardProps) {
  const config = typeConfig[lesson.type]
  const Icon = config.icon
  const hasContent = lesson.content?.text || lesson.content?.videoUrl || lesson.durationMinutes

  return (
    <div className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      <GripVertical className="w-4 h-4 text-gray-400 cursor-grab flex-shrink-0" />
      <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${config.color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{lesson.title}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{config.label}</span>
          {!hasContent && <Badge variant="warning" size="sm">Empty</Badge>}
        </div>
      </div>
      <Dropdown>
        <Dropdown.Trigger className="p-1 hover:bg-gray-100 rounded">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </Dropdown.Trigger>
        <Dropdown.Menu align="right">
          <Dropdown.Item icon={<Edit2 className="w-4 h-4" />} onClick={onEdit}>Edit</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item icon={<Trash2 className="w-4 h-4" />} onClick={onDelete} className="text-danger-600">Delete</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default LessonCard
