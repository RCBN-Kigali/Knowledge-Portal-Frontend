import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Card, Badge, Avatar } from '../../../components/ui'
import type { Announcement } from '../../../types'

interface AnnouncementCardProps {
  announcement: Announcement
  onExpand?: () => void
}

function AnnouncementCard({ announcement, onExpand }: AnnouncementCardProps) {
  const [expanded, setExpanded] = useState(false)

  const handleToggle = () => {
    if (!expanded && onExpand) {
      onExpand()
    }
    setExpanded(!expanded)
  }

  return (
    <Card className="p-4">
      <button
        onClick={handleToggle}
        className="w-full text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <Avatar name={announcement.authorName} src={announcement.authorAvatarUrl} size="sm" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-900 truncate">{announcement.title}</h4>
                {!announcement.isRead && <Badge variant="primary" size="sm">New</Badge>}
              </div>
              <p className="text-sm text-gray-500">
                {announcement.authorName}
                {announcement.courseName && <> &middot; {announcement.courseName}</>}
              </p>
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
          )}
        </div>
      </button>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
          {announcement.content}
        </div>
      )}
    </Card>
  )
}

export default AnnouncementCard
