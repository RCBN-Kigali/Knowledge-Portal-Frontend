import type { ReactNode } from 'react'
import clsx from 'clsx'

export interface FormFieldProps {
  label?: string
  htmlFor?: string
  required?: boolean
  error?: string
  helperText?: string
  children: ReactNode
  className?: string
}

function FormField({
  label,
  htmlFor,
  required,
  error,
  helperText,
  children,
  className,
}: FormFieldProps) {
  const hasError = Boolean(error)

  return (
    <div className={clsx('space-y-1', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {hasError && (
        <p className="text-sm text-danger-600" role="alert">
          {error}
        </p>
      )}
      {helperText && !hasError && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}

export default FormField
