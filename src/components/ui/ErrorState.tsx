import type { ComponentType } from 'react'
import clsx from 'clsx'
import { AlertCircle, WifiOff } from 'lucide-react'
import Button from './Button'

export interface ErrorStateProps {
  icon?: ComponentType<{ className?: string }>
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

function ErrorState({
  icon: Icon = AlertCircle,
  title = 'Something went wrong',
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={clsx('flex flex-col items-center justify-center py-12 px-4 text-center', className)}
      role="alert"
    >
      <div className="w-16 h-16 rounded-full bg-danger-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-danger-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      {message && <p className="text-gray-500 max-w-sm mb-6">{message}</p>}
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}

ErrorState.Network = ({ onRetry }: { onRetry?: () => void }) => (
  <ErrorState
    icon={WifiOff}
    title="No internet connection"
    message="Please check your connection and try again."
    onRetry={onRetry}
  />
)

export default ErrorState
