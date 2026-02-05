import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Textarea from '../../../components/ui/Textarea'

export interface RejectionModalProps {
  isOpen: boolean
  onClose: () => void
  onReject: (reason: string) => Promise<void>
  loading?: boolean
  courseTitle?: string
}

function RejectionModal({ isOpen, onClose, onReject, loading, courseTitle }: RejectionModalProps) {
  const [reason, setReason] = useState('')
  
  const handleSubmit = async () => {
    await onReject(reason)
    setReason('')
    onClose()
  }
  
  const handleClose = () => {
    setReason('')
    onClose()
  }
  
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Reject Course">
      <div className="space-y-4">
        {courseTitle && (
          <p className="text-gray-600">
            Rejecting: <span className="font-medium text-gray-900">{courseTitle}</span>
          </p>
        )}
        <Textarea
          label="Rejection Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Provide feedback on why this course is being rejected and what changes are needed..."
          rows={4}
          required
        />
        <p className="text-sm text-gray-500">
          The teacher will be notified and can resubmit after making changes.
        </p>
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button 
            variant="danger" 
            onClick={handleSubmit} 
            disabled={!reason.trim()}
            loading={loading}
          >
            Reject Course
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default RejectionModal
