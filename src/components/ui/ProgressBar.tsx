import clsx from 'clsx'

export interface ProgressBarProps {
  value?: number
  max?: number
  label?: string
  showValue?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'success' | 'warning' | 'danger'
  className?: string
}

interface WithCountProps {
  current: number
  total: number
  label?: string
}

const sizeStyles: Record<string, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

const variantStyles: Record<string, string> = {
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
}

function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  variant = 'primary',
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={clsx('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1 text-sm">
          {label && <span className="text-gray-600">{label}</span>}
          {showValue && (
            <span className="font-medium text-gray-900">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div
        className={clsx('w-full bg-gray-200 rounded-full overflow-hidden', sizeStyles[size])}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={clsx('h-full rounded-full transition-all duration-300', variantStyles[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

ProgressBar.WithCount = function WithCount({ current, total, label = 'items' }: WithCountProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Progress</span>
        <span className="font-medium text-gray-900">
          {current} of {total} {label}
        </span>
      </div>
      <ProgressBar value={current} max={total} />
    </div>
  )
}

export default ProgressBar
