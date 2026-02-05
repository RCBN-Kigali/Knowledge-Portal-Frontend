import { forwardRef, useId, useState } from 'react'
import clsx from 'clsx'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, helperText, required = false, disabled = false, maxLength, rows = 4, className, onChange, ...props },
  ref
) {
  const id = useId()
  const [count, setCount] = useState(0)
  const hasError = Boolean(error)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCount(e.target.value.length)
    onChange?.(e)
  }

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        rows={rows}
        onChange={handleChange}
        aria-invalid={hasError}
        className={clsx(
          'w-full px-4 py-3 border rounded-lg text-base resize-y min-h-[120px] focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed',
          hasError
            ? 'border-danger-500 focus:ring-danger-500'
            : 'border-gray-300 focus:ring-primary-500',
          className
        )}
        {...props}
      />
      <div className="flex justify-between">
        <div>
          {hasError && <p className="text-sm text-danger-600" role="alert">{error}</p>}
          {helperText && !hasError && <p className="text-sm text-gray-500">{helperText}</p>}
        </div>
        {maxLength && (
          <p className={clsx('text-sm', count > maxLength * 0.9 ? 'text-danger-500' : 'text-gray-500')}>
            {count}/{maxLength}
          </p>
        )}
      </div>
    </div>
  )
})

export default Textarea
