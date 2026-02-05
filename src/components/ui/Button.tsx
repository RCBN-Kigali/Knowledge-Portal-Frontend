import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import clsx from 'clsx'
import Spinner from './Spinner'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: ReactNode
}

const variantStyles: Record<string, string> = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
  secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500',
  danger: 'bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-500',
  ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
}

const sizeStyles: Record<string, string> = {
  sm: 'py-2 px-4 text-sm',
  md: 'py-3 px-6 text-base',
  lg: 'py-4 px-8 text-lg',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    loading = false,
    fullWidth = false,
    leftIcon,
    className,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size="sm" className="mr-2" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2 flex-shrink-0">{leftIcon}</span>}
          {children}
        </>
      )}
    </button>
  )
})

export default Button
