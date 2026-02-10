import { useState } from 'react'
import { MessageSquare, Plus } from 'lucide-react'
import clsx from 'clsx'
import { Button, Card, EmptyState } from '../../components/ui'
import { useConversations } from '../../features/chat/hooks/useChat'
import ConversationList from '../../features/chat/components/ConversationList'
import ChatWindow from '../../features/chat/components/ChatWindow'
import NewConversationModal from '../../features/chat/components/NewConversationModal'
import type { Conversation } from '../../types'

function Chat() {
  const { data: conversations, isLoading } = useConversations()
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [isNewConvOpen, setIsNewConvOpen] = useState(false)

  const handleSelect = (conversation: Conversation) => {
    setActiveConversation(conversation)
  }

  const handleBack = () => {
    setActiveConversation(null)
  }

  const handleConversationReady = (conversation: Conversation) => {
    setActiveConversation(conversation)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16)-2rem)] lg:h-[calc(100vh-theme(spacing.16)-3rem)]">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-500 mt-1">Chat with your course teachers and students</p>
        </div>
        <Button
          onClick={() => setIsNewConvOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Message
        </Button>
      </div>

      <Card className="overflow-hidden flex-1 min-h-0">
        <div className="flex h-full">
          {/* Conversation List - hidden on mobile when a conversation is active */}
          <div
            className={clsx(
              'w-full lg:w-80 border-r border-gray-200 flex-shrink-0 overflow-y-auto',
              activeConversation ? 'hidden lg:block' : 'block'
            )}
          >
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-700">Conversations</h2>
            </div>
            <ConversationList
              conversations={conversations || []}
              isLoading={isLoading}
              activeId={activeConversation?.id}
              onSelect={handleSelect}
            />
          </div>

          {/* Chat Window - hidden on mobile when no conversation is selected */}
          <div
            className={clsx(
              'flex-1 min-w-0',
              activeConversation ? 'block' : 'hidden lg:block'
            )}
          >
            {activeConversation ? (
              <ChatWindow conversation={activeConversation} onBack={handleBack} />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-50">
                <EmptyState
                  icon={MessageSquare}
                  title="Select a conversation"
                  description="Choose a conversation from the list to start chatting"
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      <NewConversationModal
        isOpen={isNewConvOpen}
        onClose={() => setIsNewConvOpen(false)}
        onConversationReady={handleConversationReady}
      />
    </div>
  )
}

export default Chat
