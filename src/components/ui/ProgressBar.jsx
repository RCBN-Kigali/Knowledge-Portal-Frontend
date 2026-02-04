import PropTypes from 'prop-types'
import clsx from 'clsx'

function ProgressBar({ value = 0, max = 100, label, showValue = false, size = 'md', variant = 'primary', className }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const sizes = { sm: 'h-1', md: 'h-2', lg: 'h-3' }
  const variants = { primary: 'bg-primary-500', success: 'bg-success-500', warning: 'bg-warning-500', danger: 'bg-danger-500' }
  return (
    <div className={clsx('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1 text-sm">
          {label && <span className="text-gray-600">{label}</span>}
          {showValue && <span className="font-medium text-gray-900">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={clsx('w-full bg-gray-200 rounded-full overflow-hidden', sizes[size])} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
        <div className={clsx('h-full rounded-full transition-all duration-300', variants[variant])} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
ProgressBar.propTypes = { value: PropTypes.number, max: PropTypes.number, label: PropTypes.string, showValue: PropTypes.bool, size: PropTypes.oneOf(['sm', 'md', 'lg']), variant: PropTypes.oneOf(['primary', 'success', 'warning', 'danger']), className: PropTypes.string }
ProgressBar.WithCount = ({ current, total, label = 'items' }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm"><span className="text-gray-600">Progress</span><span className="font-medium text-gray-900">{current} of {total} {label}</span></div>
    <ProgressBar value={current} max={total} />
  </div>
)
ProgressBar.WithCount.propTypes = { current: PropTypes.number.isRequired, total: PropTypes.number.isRequired, label: PropTypes.string }
export default ProgressBar
