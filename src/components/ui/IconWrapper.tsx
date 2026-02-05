import type { ComponentType } from 'react'
import clsx from 'clsx'

export interface IconWrapperProps {
  icon: ComponentType<{ className?: string }>
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  className?: string
}

const sizeStyles: Record<string, { container: string; icon: string }> = {
  sm: { container: 'w-8 h-8', icon: 'w-4 h-4' },
  md: { container: 'w-10 h-10', icon: 'w-5 h-5' },
  lg: { container: 'w-12 h-12', icon: 'w-6 h-6' },
  xl: { container: 'w-16 h-16', icon: 'w-8 h-8' },
}

const variantStyles: Record<string, { bg: string; text: string }> = {
  default: { bg: 'bg-gray-100', text: 'text-gray-600' },
  primary: { bg: 'bg-primary-100', text: 'text-primary-600' },
  success: { bg: 'bg-success-100', text: 'text-success-600' },
  warning: { bg: 'bg-warning-100', text: 'text-warning-600' },
  danger: { bg: 'bg-danger-100', text: 'text-danger-600' },
}

function IconWrapper({ icon: Icon, size = 'md', variant = 'default', className }: IconWrapperProps) {
  const s = sizeStyles[size]
  const v = variantStyles[variant]

  return (
    <div
      className={clsx(
        'inline-flex items-center justify-center rounded-lg',
        s.container,
        v.bg,
        className
      )}
    >
      <Icon className={clsx(s.icon, v.text)} />
    </div>
  )
}

export default IconWrapper
