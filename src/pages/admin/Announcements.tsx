import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { 
  useAnnouncements, 
  useCreateAnnouncement, 
  useDeleteAnnouncement,
  type Announcement 
} from '../../features/admin/hooks/useAnnouncements'
import AnnouncementEditor from '../../features/admin/components/AnnouncementEditor'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Tabs from '../../components/ui/Tabs'
import { Plus, Megaphone, Edit2, Trash2, Eye } from 'lucide-react'

type StatusTab = 'all' | 'published' | 'draft' | 'scheduled'

export default function Announcements() {
  const { user } = useAuth()
  const isSuperAdmin = user?.role === 'super_admin'
  
  const [statusTab, setStatusTab] = useState<StatusTab>('all')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [viewAnnouncement, setViewAnnouncement] = useState<Announcement | null>(null)
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null)
  
  const { data: announcements, isLoading } = useAnnouncements({
    status: statusTab === 'all' ? undefined : statusTab,
    schoolId: isSuperAdmin ? undefined : (user?.schoolId || undefined),
  })
  
  const createAnnouncement = useCreateAnnouncement()
  const deleteAnnouncement = useDeleteAnnouncement()
  
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'published', label: 'Published' },
    { id: 'draft', label: 'Drafts' },
    { id: 'scheduled', label: 'Scheduled' },
  ]
  
  const handleSave = async (data: Parameters<typeof createAnnouncement.mutateAsync>[0]) => {
    await createAnnouncement.mutateAsync(data)
    setEditorOpen(false)
    setEditingAnnouncement(null)
  }
  
  const handleDelete = async () => {
    if (!announcementToDelete) return
    await deleteAnnouncement.mutateAsync(announcementToDelete.id)
    setAnnouncementToDelete(null)
  }
  
  const getStatusVariant = (status: string): 'success' | 'warning' | 'gray' => {
    switch (status) {
      case 'published': return 'success'
      case 'scheduled': return 'warning'
      default: return 'gray'
    }
  }
  
  const getAudienceLabel = (audience: Announcement['audience']) => {
    if (audience.type === 'all') return 'All Users'
    if (audience.type === 'school') return `School: ${audience.schoolNames?.join(', ')}`
    if (audience.type === 'role') return `Roles: ${audience.roles?.join(', ')}`
    return 'Custom'
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600 mt-1">
            {isSuperAdmin 
              ? 'Create system-wide announcements for all users'
              : 'Create announcements for your school'}
          </p>
        </div>
        <Button onClick={() => setEditorOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          New Announcement
        </Button>
      </div>
      
      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={statusTab}
        onChange={(id) => setStatusTab(id as StatusTab)}
      />
      
      {/* Announcements List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
      ) : announcements && announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map(announcement => (
            <Card key={announcement.id} className="hover:shadow-md transition-shadow">
              <Card.Body>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{announcement.title}</h3>
                      <Badge variant={getStatusVariant(announcement.status)} size="sm" className="capitalize">
                        {announcement.status}
                      </Badge>
                      {announcement.priority === 'high' && (
                        <Badge variant="danger" size="sm">High Priority</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {announcement.content}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span>Audience: {getAudienceLabel(announcement.audience)}</span>
                      <span>Created: {new Date(announcement.createdAt).toLocaleDateString()}</span>
                      {announcement.publishedAt && (
                        <span>Published: {new Date(announcement.publishedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setViewAnnouncement(announcement)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setEditingAnnouncement(announcement)
                        setEditorOpen(true)
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setAnnouncementToDelete(announcement)}
                    >
                      <Trash2 className="w-4 h-4 text-danger-600" />
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Megaphone}
          title={statusTab === 'all' ? 'No announcements yet' : `No ${statusTab} announcements`}
          description="Create your first announcement to communicate with users"
          actionLabel="Create Announcement"
          onAction={() => setEditorOpen(true)}
        />
      )}
      
      {/* Editor Modal */}
      <AnnouncementEditor
        isOpen={editorOpen}
        onClose={() => {
          setEditorOpen(false)
          setEditingAnnouncement(null)
        }}
        onSave={handleSave}
        announcement={editingAnnouncement}
        isSuperAdmin={isSuperAdmin}
        loading={createAnnouncement.isPending}
      />
      
      {/* View Modal */}
      {viewAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-900">{viewAnnouncement.title}</h2>
                  <Badge variant={getStatusVariant(viewAnnouncement.status)} className="capitalize">
                    {viewAnnouncement.status}
                  </Badge>
                </div>
                <Button variant="ghost" onClick={() => setViewAnnouncement(null)}>
                  &times;
                </Button>
              </div>
              
              <div className="prose max-w-none mb-4">
                <p>{viewAnnouncement.content}</p>
              </div>
              
              <div className="border-t pt-4 space-y-2 text-sm text-gray-500">
                <p><strong>Audience:</strong> {getAudienceLabel(viewAnnouncement.audience)}</p>
                <p><strong>Priority:</strong> {viewAnnouncement.priority}</p>
                <p><strong>Created:</strong> {new Date(viewAnnouncement.createdAt).toLocaleString()}</p>
                {viewAnnouncement.publishedAt && (
                  <p><strong>Published:</strong> {new Date(viewAnnouncement.publishedAt).toLocaleString()}</p>
                )}
                {viewAnnouncement.scheduledFor && (
                  <p><strong>Scheduled for:</strong> {new Date(viewAnnouncement.scheduledFor).toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!announcementToDelete}
        onClose={() => setAnnouncementToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Announcement"
        message={`Are you sure you want to delete "${announcementToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteAnnouncement.isPending}
      />
    </div>
  )
}
