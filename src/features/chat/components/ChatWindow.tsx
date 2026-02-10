import { useState, useRef, useEffect, type FormEvent } from 'react'
import { Send, ArrowLeft } from 'lucide-react'
import clsx from 'clsx'
import { Avatar, Button, Spinner } from '../../../components/ui'
import { useAuth } from '../../../hooks/useAuth'
import { useSendMessage } from '../hooks/useChat'
import type { Conversation } from '../../../types'

interface ChatWindowProps {
  conversation: Conversation
  onBack?: () => void
}

function ChatWindow({ conversation, onBack }: ChatWindowProps) {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const sendMessage = useSendMessage()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation.messages.length])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return

    sendMessage.mutate({ conversationId: conversation.id, text: trimmed })
    setText('')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
        {onBack && (
          <button onClick={onBack} className="p-1 text-gray-400 hover:text-gray-600 lg:hidden">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <Avatar name={conversation.participantName} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {conversation.participantName}
          </p>
          <p className="text-xs text-gray-500 truncate">{conversation.courseName}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {conversation.messages.map(msg => {
          const isMe = msg.senderId === user?.id
          return (
            <div key={msg.id} className={clsx('flex gap-2', isMe ? 'justify-end' : 'justify-start')}>
              {!isMe && <Avatar name={msg.senderName} size="xs" />}
              <div className={clsx('max-w-[75%]')}>
                <div
                  className={clsx(
                    'px-4 py-2.5 rounded-2xl text-sm',
                    isMe
                      ? 'bg-primary-600 text-white rounded-br-md'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                  )}
                >
                  {msg.text}
                </div>
                <p className={clsx('text-xs text-gray-400 mt-1', isMe ? 'text-right' : 'text-left')}>
                  {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2 p-4 border-t border-gray-200 bg-white">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px] max-h-[120px]"
        />
        <Button
          type="submit"
          disabled={!text.trim() || sendMessage.isPending}
          className="rounded-xl h-[44px] w-[44px] !p-0 flex items-center justify-center"
        >
          {sendMessage.isPending ? <Spinner size="sm" /> : <Send className="w-4 h-4" />}
        </Button>
      </form>
    </div>
  )
}

export default ChatWindow
