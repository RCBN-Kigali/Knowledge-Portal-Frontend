import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import clsx from 'clsx'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'highlighted'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

interface CardSubProps {
  children?: ReactNode
  className?: string
}

const variantStyles: Record<string, string> = {
  default: 'bg-white rounded-xl border border-gray-200 shadow-sm',
  interactive:
    'bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer',
  highlighted: 'bg-primary-50 rounded-xl border-2 border-primary-500',
}

const paddings: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { children, variant = 'default', padding = 'md', className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={clsx(variantStyles[variant], paddings[padding], className)}
      {...props}
    >
      {children}
    </div>
  )
})

function CardHeader({ children, className }: CardSubProps) {
  return (
    <div className={clsx('px-6 py-4 border-b border-gray-200', className)}>
      {children}
    </div>
  )
}

function CardBody({ children, className }: CardSubProps) {
  return <div className={clsx('px-6 py-4', className)}>{children}</div>
}

function CardFooter({ children, className }: CardSubProps) {
  return (
    <div className={clsx('px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl', className)}>
      {children}
    </div>
  )
}

export default Object.assign(Card, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
})
