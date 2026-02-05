import clsx from 'clsx'

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card'
  width?: string | number
  height?: string | number
  lines?: number
  className?: string
}

function Skeleton({ variant = 'text', width, height, lines = 1, className }: SkeletonProps) {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  if (variant === 'circular') {
    return (
      <div
        className={clsx('animate-pulse bg-gray-200 rounded-full', className)}
        style={{ width: width || '40px', height: height || '40px', ...style }}
      />
    )
  }

  if (variant === 'rectangular') {
    return (
      <div
        className={clsx('animate-pulse bg-gray-200 rounded-lg', className)}
        style={style}
      />
    )
  }

  if (variant === 'card') {
    return (
      <div className={clsx('animate-pulse rounded-xl border border-gray-200 p-6', className)}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-3 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
          <div className="h-3 bg-gray-200 rounded w-4/6" />
        </div>
      </div>
    )
  }

  // text variant
  return (
    <div className={clsx('space-y-2', className)} style={style}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            'animate-pulse bg-gray-200 rounded h-4',
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

Skeleton.Text = ({ lines = 3, className }: { lines?: number; className?: string }) => (
  <Skeleton variant="text" lines={lines} className={className} />
)

Skeleton.Avatar = ({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) => {
  const sizes = { sm: '32px', md: '40px', lg: '48px' }
  return <Skeleton variant="circular" width={sizes[size]} height={sizes[size]} className={className} />
}

Skeleton.Card = ({ className }: { className?: string }) => (
  <Skeleton variant="card" className={className} />
)

export default Skeleton
