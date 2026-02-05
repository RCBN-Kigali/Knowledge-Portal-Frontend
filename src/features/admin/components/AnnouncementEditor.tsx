import { useState, useEffect } from 'react'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Textarea from '../../../components/ui/Textarea'
import Select from '../../../components/ui/Select'
import Checkbox from '../../../components/ui/Checkbox'
import type { Announcement } from '../hooks/useAnnouncements'

export interface AnnouncementEditorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: {
    title: string
    content: string
    audience: Announcement['audience']
    priority: 'low' | 'normal' | 'high'
    status: 'published' | 'draft' | 'scheduled'
    scheduledFor?: string
  }) => Promise<void>
  announcement?: Announcement | null
  isSuperAdmin?: boolean
  loading?: boolean
}

function AnnouncementEditor({ 
  isOpen, 
  onClose, 
  onSave, 
  announcement,
  isSuperAdmin = false,
  loading
}: AnnouncementEditorProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [audienceType, setAudienceType] = useState<'all' | 'school' | 'role'>('all')
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal')
  const [scheduleForLater, setScheduleForLater] = useState(false)
  const [scheduledDate, setScheduledDate] = useState('')
  
  // Initialize form when announcement changes
  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title)
      setContent(announcement.content)
      setAudienceType(announcement.audience.type)
      setSelectedRoles(announcement.audience.roles || [])
      setPriority(announcement.priority)
      if (announcement.scheduledFor) {
        setScheduleForLater(true)
        setScheduledDate(announcement.scheduledFor.slice(0, 16))
      }
    } else {
      resetForm()
    }
  }, [announcement, isOpen])
  
  const resetForm = () => {
    setTitle('')
    setContent('')
    setAudienceType('all')
    setSelectedRoles([])
    setPriority('normal')
    setScheduleForLater(false)
    setScheduledDate('')
  }
  
  const audienceOptions = isSuperAdmin
    ? [
        { value: 'all', label: 'All Users (System-wide)' },
        { value: 'school', label: 'Specific Schools' },
        { value: 'role', label: 'By Role' },
      ]
    : [
        { value: 'all', label: 'All School Users' },
        { value: 'role', label: 'By Role' },
      ]
  
  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High (Banner)' },
  ]
  
  const roleOptions = [
    { label: 'Students', value: 'school_student' },
    { label: 'Teachers', value: 'school_teacher' },
    ...(isSuperAdmin ? [
      { label: 'School Admins', value: 'school_admin' },
      { label: 'Independent Teachers', value: 'independent_teacher' },
    ] : []),
  ]
  
  const handleRoleToggle = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    )
  }
  
  const handleSubmit = async (status: 'published' | 'draft' | 'scheduled') => {
    const audience: Announcement['audience'] = {
      type: audienceType,
      ...(audienceType === 'role' && { roles: selectedRoles }),
    }
    
    await onSave({
      title,
      content,
      audience,
      priority,
      status: scheduleForLater && status === 'published' ? 'scheduled' : status,
      ...(scheduleForLater && scheduledDate && { scheduledFor: new Date(scheduledDate).toISOString() }),
    })
    
    resetForm()
    onClose()
  }
  
  const handleClose = () => {
    resetForm()
    onClose()
  }
  
  const isValid = title.trim() && content.trim() && 
    (audienceType !== 'role' || selectedRoles.length > 0) &&
    (!scheduleForLater || scheduledDate)
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={announcement ? 'Edit Announcement' : 'Create Announcement'} 
      size="lg"
    >
      <div className="space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter announcement title"
          required
        />
        
        <Textarea
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your announcement content..."
          rows={6}
          required
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Audience"
            value={audienceType}
            onChange={(val) => setAudienceType(val as typeof audienceType)}
            options={audienceOptions}
          />
          
          <Select
            label="Priority"
            value={priority}
            onChange={(val) => setPriority(val as typeof priority)}
            options={priorityOptions}
          />
        </div>
        
        {audienceType === 'role' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Roles</label>
            <div className="flex flex-wrap gap-3">
              {roleOptions.map(role => (
                <label key={role.value} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={selectedRoles.includes(role.value)}
                    onChange={() => handleRoleToggle(role.value)}
                  />
                  <span className="text-sm text-gray-700">{role.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        
        <div className="border-t pt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={scheduleForLater}
              onChange={(e) => setScheduleForLater(e.target.checked)}
            />
            <span className="text-sm text-gray-700">Schedule for later</span>
          </label>
          
          {scheduleForLater && (
            <div className="mt-3">
              <Input
                type="datetime-local"
                label="Scheduled Date & Time"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => handleSubmit('draft')}
            disabled={!title.trim() || !content.trim()}
            loading={loading}
          >
            Save as Draft
          </Button>
          <Button 
            onClick={() => handleSubmit('published')}
            disabled={!isValid}
            loading={loading}
          >
            {scheduleForLater ? 'Schedule' : 'Publish Now'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default AnnouncementEditor
