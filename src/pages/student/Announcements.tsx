import { Bell } from 'lucide-react'
import { Card, Skeleton, EmptyState } from '../../components/ui'
import AnnouncementCard from '../../features/student/components/AnnouncementCard'
import { useAnnouncements, useMarkAnnouncementRead } from '../../features/student/hooks/useAnnouncements'
import { useMemo } from 'react'

function Announcements() {
  const { data: announcements, isLoading } = useAnnouncements()
  const markReadMutation = useMarkAnnouncementRead()

  // Group by date
  const groupedAnnouncements = useMemo(() => {
    if (!announcements) return {}
    const groups: Record<string, typeof announcements> = {}
    for (const a of announcements) {
      const date = new Date(a.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
      if (!groups[date]) groups[date] = []
      groups[date].push(a)
    }
    return groups
  }, [announcements])

  const dates = Object.keys(groupedAnnouncements)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" lines={1} width="200px" />
        {[1, 2, 3].map(i => <Skeleton key={i} variant="card" height="100px" />)}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        <p className="text-gray-500">Stay updated with the latest news</p>
      </div>

      {dates.length === 0 ? (
        <Card className="p-12">
          <EmptyState
            icon={Bell}
            title="No announcements"
            description="You're all caught up! Check back later for updates."
          />
        </Card>
      ) : (
        <div className="space-y-8">
          {dates.map(date => (
            <div key={date}>
              <h2 className="text-sm font-medium text-gray-500 mb-3">{date}</h2>
              <div className="space-y-3">
                {groupedAnnouncements[date].map(announcement => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                    onExpand={() => {
                      if (!announcement.isRead) {
                        markReadMutation.mutate(announcement.id)
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Announcements
