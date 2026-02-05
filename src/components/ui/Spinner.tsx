import clsx from 'clsx'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes: Record<string, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
  xl: 'w-12 h-12 border-4',
}

function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div className={clsx('inline-flex items-center', className)} role="status">
      <span
        className={clsx(
          'animate-spin rounded-full border-primary-500 border-t-transparent',
          sizes[size]
        )}
      />
      <span className="sr-only">Loading</span>
    </div>
  )
}

export default Spinner
