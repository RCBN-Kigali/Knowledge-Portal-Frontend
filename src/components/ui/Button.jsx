import { forwardRef } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import Spinner from './Spinner'

const Button = forwardRef(function Button({ children, variant = 'primary', size = 'md', type = 'button', disabled = false, loading = false, fullWidth = false, className, ...props }, ref) {
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500',
    danger: 'bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-500',
    ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
  }
  const sizes = { sm: 'py-2 px-4 text-sm', md: 'py-3 px-6 text-base', lg: 'py-4 px-8 text-lg' }
  return (
    <button ref={ref} type={type} disabled={disabled || loading}
      className={clsx('inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]', variants[variant], sizes[size], fullWidth && 'w-full', className)} {...props}>
      {loading ? <><Spinner size="sm" className="mr-2" /><span>Loading...</span></> : children}
    </button>
  )
})
Button.propTypes = { children: PropTypes.node.isRequired, variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost']), size: PropTypes.oneOf(['sm', 'md', 'lg']), type: PropTypes.string, disabled: PropTypes.bool, loading: PropTypes.bool, fullWidth: PropTypes.bool, className: PropTypes.string }
export default Button
