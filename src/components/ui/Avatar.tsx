import { useState } from 'react'
import clsx from 'clsx'

export interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  online?: boolean
  className?: string
}

const sizes: Record<string, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
}

const onlineDotSizes: Record<string, string> = {
  xs: 'w-1.5 h-1.5 border',
  sm: 'w-2 h-2 border',
  md: 'w-2.5 h-2.5 border-2',
  lg: 'w-3 h-3 border-2',
  xl: 'w-3.5 h-3.5 border-2',
}

const colors = [
  'bg-primary-500',
  'bg-success-500',
  'bg-warning-500',
  'bg-danger-500',
  'bg-purple-500',
]

function getInitials(name?: string): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function getBgColor(name?: string): string {
  if (!name) return 'bg-gray-400'
  return colors[name.length % colors.length]
}

function Avatar({ src, alt, name, size = 'md', online, className }: AvatarProps) {
  const [error, setError] = useState(false)
  const showImg = src && !error

  return (
    <div className={clsx('relative inline-flex', className)}>
      <div
        className={clsx(
          'inline-flex items-center justify-center rounded-full font-medium text-white',
          sizes[size],
          !showImg && getBgColor(name)
        )}
      >
        {showImg ? (
          <img
            src={src}
            alt={alt || name || ''}
            className="w-full h-full object-cover rounded-full"
            onError={() => setError(true)}
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {online !== undefined && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 rounded-full border-white',
            onlineDotSizes[size],
            online ? 'bg-success-500' : 'bg-gray-400'
          )}
        />
      )}
    </div>
  )
}

export default Avatar
