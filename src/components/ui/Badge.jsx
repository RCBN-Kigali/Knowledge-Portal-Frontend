import PropTypes from 'prop-types'
import clsx from 'clsx'

function Badge({ children, variant = 'gray', size = 'md', dot = false, className }) {
  const variants = { gray: 'bg-gray-100 text-gray-700', primary: 'bg-primary-100 text-primary-700', success: 'bg-success-100 text-success-700', warning: 'bg-warning-100 text-warning-700', danger: 'bg-danger-100 text-danger-700' }
  const dotColors = { gray: 'bg-gray-500', primary: 'bg-primary-500', success: 'bg-success-500', warning: 'bg-warning-500', danger: 'bg-danger-500' }
  const sizes = { sm: 'px-2 py-0.5 text-xs', md: 'px-3 py-1 text-sm', lg: 'px-4 py-1.5 text-base' }
  return (
    <span className={clsx('inline-flex items-center rounded-full font-medium', variants[variant], sizes[size], className)}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full mr-1.5', dotColors[variant])} />}
      {children}
    </span>
  )
}
Badge.propTypes = { children: PropTypes.node.isRequired, variant: PropTypes.oneOf(['gray', 'primary', 'success', 'warning', 'danger']), size: PropTypes.oneOf(['sm', 'md', 'lg']), dot: PropTypes.bool, className: PropTypes.string }
Badge.Draft = (props) => <Badge variant="gray" dot {...props}>Draft</Badge>
Badge.Pending = (props) => <Badge variant="warning" dot {...props}>Pending Review</Badge>
Badge.Published = (props) => <Badge variant="success" dot {...props}>Published</Badge>
Badge.Rejected = (props) => <Badge variant="danger" dot {...props}>Rejected</Badge>
export default Badge
