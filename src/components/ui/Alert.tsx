import { useState } from 'react'
import type { ReactNode } from 'react'
import clsx from 'clsx'
import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react'

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  children?: ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

const config = {
  info: {
    icon: Info,
    bg: 'bg-primary-50 border-primary-200',
    iconColor: 'text-primary-500',
    titleColor: 'text-primary-800',
    textColor: 'text-primary-700',
    role: 'status' as const,
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-success-50 border-success-200',
    iconColor: 'text-success-500',
    titleColor: 'text-success-800',
    textColor: 'text-success-700',
    role: 'status' as const,
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-warning-50 border-warning-200',
    iconColor: 'text-warning-500',
    titleColor: 'text-warning-800',
    textColor: 'text-warning-700',
    role: 'alert' as const,
  },
  error: {
    icon: XCircle,
    bg: 'bg-danger-50 border-danger-200',
    iconColor: 'text-danger-500',
    titleColor: 'text-danger-800',
    textColor: 'text-danger-700',
    role: 'alert' as const,
  },
}

function Alert({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className,
}: AlertProps) {
  const [dismissed, setDismissed] = useState(false)
  const c = config[variant]
  const Icon = c.icon

  if (dismissed) return null

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  return (
    <div
      role={c.role}
      className={clsx(
        'flex gap-3 p-4 border rounded-lg',
        c.bg,
        className
      )}
    >
      <Icon className={clsx('w-5 h-5 flex-shrink-0 mt-0.5', c.iconColor)} />
      <div className="flex-1 min-w-0">
        {title && <h4 className={clsx('text-sm font-semibold', c.titleColor)}>{title}</h4>}
        {children && <div className={clsx('text-sm', c.textColor, title && 'mt-1')}>{children}</div>}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className={clsx('flex-shrink-0 p-1 rounded hover:bg-black/5', c.iconColor)}
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default Alert
