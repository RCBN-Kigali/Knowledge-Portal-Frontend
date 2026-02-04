import { forwardRef } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

const Card = forwardRef(function Card({ children, variant = 'default', padding = 'md', className, ...props }, ref) {
  const variants = {
    default: 'bg-white rounded-xl border border-gray-200 shadow-sm',
    interactive: 'bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer',
    highlighted: 'bg-primary-50 rounded-xl border-2 border-primary-500',
  }
  const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }
  return <div ref={ref} className={clsx(variants[variant], paddings[padding], className)} {...props}>{children}</div>
})
Card.propTypes = { children: PropTypes.node, variant: PropTypes.oneOf(['default', 'interactive', 'highlighted']), padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg']), className: PropTypes.string }
export default Card
