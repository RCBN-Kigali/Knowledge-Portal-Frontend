import { forwardRef, useId } from 'react'
import clsx from 'clsx'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helperText, type = 'text', required = false, disabled = false, className, ...props },
  ref
) {
  const id = useId()
  const hasError = Boolean(error)

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        disabled={disabled}
        required={required}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        className={clsx(
          'w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed min-h-[44px]',
          hasError
            ? 'border-danger-500 focus:ring-danger-500'
            : 'border-gray-300 focus:ring-primary-500',
          className
        )}
        {...props}
      />
      {hasError && (
        <p id={`${id}-error`} className="text-sm text-danger-600" role="alert">
          {error}
        </p>
      )}
      {helperText && !hasError && (
        <p id={`${id}-helper`} className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
})

export default Input
