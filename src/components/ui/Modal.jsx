import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { X } from 'lucide-react'

function Modal({ isOpen, onClose, title, children, size = 'md', showCloseButton = true }) {
  const modalRef = useRef(null)
  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl' }
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      const handleEsc = (e) => e.key === 'Escape' && onClose()
      document.addEventListener('keydown', handleEsc)
      return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', handleEsc) }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-900/50" onClick={onClose} />
      <div ref={modalRef} className={clsx('relative w-full bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto', sizes[size])}>
        {(title || showCloseButton) && (
          <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            {title && <h2 className="text-xl font-semibold text-gray-900">{title}</h2>}
            {showCloseButton && <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>}
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>,
    document.body
  )
}
Modal.propTypes = { isOpen: PropTypes.bool.isRequired, onClose: PropTypes.func.isRequired, title: PropTypes.string, children: PropTypes.node, size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']), showCloseButton: PropTypes.bool }
Modal.Footer = ({ children, className }) => <div className={clsx('px-6 py-4 border-t border-gray-200 flex justify-end gap-3', className)}>{children}</div>
Modal.Footer.propTypes = { children: PropTypes.node, className: PropTypes.string }
export default Modal
