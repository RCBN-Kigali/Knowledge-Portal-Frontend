import { MessageSquare } from 'lucide-react'
import clsx from 'clsx'
import { Avatar, Badge, EmptyState, Spinner } from '../../../components/ui'
import type { Conversation } from '../../../types'

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

interface ConversationListProps {
  conversations: Conversation[]
  isLoading: boolean
  activeId?: string
  onSelect: (conversation: Conversation) => void
}

function ConversationList({ conversations, isLoading, activeId, onSelect }: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="md" />
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          icon={MessageSquare}
          title="No messages yet"
          description="Start a conversation with your course teacher or student"
        />
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {conversations.map(conv => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv)}
          className={clsx(
            'w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-gray-50',
            activeId === conv.id && 'bg-primary-50 hover:bg-primary-50'
          )}
        >
          <Avatar name={conv.participantName} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-gray-900 truncate">
                {conv.participantName}
              </p>
              {conv.lastMessageAt && (
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {timeAgo(conv.lastMessageAt)}
                </span>
              )}
            </div>
            <p className="text-xs text-primary-600 mb-0.5">{conv.courseName}</p>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-gray-500 truncate">
                {conv.lastMessage || 'No messages yet'}
              </p>
              {conv.unreadCount > 0 && (
                <Badge variant="primary" size="sm">{conv.unreadCount}</Badge>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

export default ConversationList
