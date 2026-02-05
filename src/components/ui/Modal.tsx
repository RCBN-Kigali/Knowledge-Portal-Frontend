import { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import clsx from 'clsx'
import { X } from 'lucide-react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
}

interface ModalFooterProps {
  children?: ReactNode
  className?: string
}

const sizeStyles: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

function Modal({ isOpen, onClose, title, children, size = 'md', showCloseButton = true }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Focus trap
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key !== 'Tab' || !modalRef.current) return

      const focusable = modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeyDown)

      // Focus first focusable element in modal
      requestAnimationFrame(() => {
        if (modalRef.current) {
          const focusable = modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
          if (focusable.length > 0) focusable[0].focus()
        }
      })

      return () => {
        document.body.style.overflow = ''
        document.removeEventListener('keydown', handleKeyDown)
        previousFocusRef.current?.focus()
      }
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-900/50" onClick={onClose} aria-hidden="true" />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={clsx(
          'relative w-full bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto',
          sizeStyles[size]
        )}
      >
        {(title || showCloseButton) && (
          <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between rounded-t-xl">
            {title && (
              <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>,
    document.body
  )
}

function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={clsx('px-6 py-4 border-t border-gray-200 flex justify-end gap-3', className)}>
      {children}
    </div>
  )
}

export default Object.assign(Modal, { Footer: ModalFooter })
