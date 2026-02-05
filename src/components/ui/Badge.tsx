import type { ReactNode } from 'react'
import clsx from 'clsx'

export interface BadgeProps {
  children: ReactNode
  variant?: 'gray' | 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  className?: string
}

const variants: Record<string, string> = {
  gray: 'bg-gray-100 text-gray-700',
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-success-100 text-success-700',
  warning: 'bg-warning-100 text-warning-700',
  danger: 'bg-danger-100 text-danger-700',
}

const dotColors: Record<string, string> = {
  gray: 'bg-gray-500',
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
}

const sizes: Record<string, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
}

function Badge({ children, variant = 'gray', size = 'md', dot = false, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full mr-1.5', dotColors[variant])} />
      )}
      {children}
    </span>
  )
}

Badge.Draft = (props: Omit<BadgeProps, 'variant' | 'dot' | 'children'>) => (
  <Badge variant="gray" dot {...props}>Draft</Badge>
)
Badge.Pending = (props: Omit<BadgeProps, 'variant' | 'dot' | 'children'>) => (
  <Badge variant="warning" dot {...props}>Pending</Badge>
)
Badge.Approved = (props: Omit<BadgeProps, 'variant' | 'dot' | 'children'>) => (
  <Badge variant="success" dot {...props}>Approved</Badge>
)
Badge.Rejected = (props: Omit<BadgeProps, 'variant' | 'dot' | 'children'>) => (
  <Badge variant="danger" dot {...props}>Rejected</Badge>
)
Badge.Active = (props: Omit<BadgeProps, 'variant' | 'dot' | 'children'>) => (
  <Badge variant="primary" dot {...props}>Active</Badge>
)

export default Badge
