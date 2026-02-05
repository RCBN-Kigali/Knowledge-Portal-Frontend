import { forwardRef, useId } from 'react'
import clsx from 'clsx'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string
  description?: string
  error?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, error, disabled, className, ...props },
  ref
) {
  const id = useId()
  const hasError = Boolean(error)

  return (
    <div className={clsx('relative', className)}>
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          disabled={disabled}
          aria-invalid={hasError}
          className={clsx(
            'mt-0.5 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
            hasError && 'border-danger-500'
          )}
          {...props}
        />
        {(label || description) && (
          <div>
            {label && (
              <label
                htmlFor={id}
                className={clsx(
                  'text-sm font-medium cursor-pointer',
                  disabled ? 'text-gray-400' : 'text-gray-700'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-500 mt-0.5">{description}</p>
            )}
          </div>
        )}
      </div>
      {hasError && (
        <p className="text-sm text-danger-600 mt-1 ml-8" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})

export default Checkbox
