import PropTypes from 'prop-types'
import { AlertTriangle, Trash2 } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

function ConfirmDialog({ isOpen, onClose, onConfirm, title = 'Are you sure?', message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', variant = 'danger', loading = false }) {
  const config = { danger: { icon: AlertTriangle, bg: 'bg-danger-100', color: 'text-danger-500', btn: 'danger' }, warning: { icon: AlertTriangle, bg: 'bg-warning-100', color: 'text-warning-500', btn: 'primary' } }[variant]
  const Icon = config.icon
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center">
        <div className={clsx('mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4', config.bg)}><Icon className={clsx('w-7 h-7', config.color)} /></div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        {message && <p className="text-gray-500 mb-6">{message}</p>}
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={onClose} disabled={loading}>{cancelLabel}</Button>
          <Button variant={config.btn} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </div>
      </div>
    </Modal>
  )
}
ConfirmDialog.propTypes = { isOpen: PropTypes.bool.isRequired, onClose: PropTypes.func.isRequired, onConfirm: PropTypes.func.isRequired, title: PropTypes.string, message: PropTypes.string, confirmLabel: PropTypes.string, cancelLabel: PropTypes.string, variant: PropTypes.oneOf(['danger', 'warning']), loading: PropTypes.bool }
ConfirmDialog.Delete = ({ isOpen, onClose, onConfirm, itemName = 'item', loading }) => <ConfirmDialog isOpen={isOpen} onClose={onClose} onConfirm={onConfirm} title={`Delete ${itemName}?`} message="This action cannot be undone." confirmLabel="Delete" cancelLabel="Keep" variant="danger" loading={loading} />
ConfirmDialog.Delete.propTypes = { isOpen: PropTypes.bool.isRequired, onClose: PropTypes.func.isRequired, onConfirm: PropTypes.func.isRequired, itemName: PropTypes.string, loading: PropTypes.bool }
export default ConfirmDialog
