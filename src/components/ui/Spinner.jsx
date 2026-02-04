import PropTypes from 'prop-types'
import clsx from 'clsx'

function Spinner({ size = 'md', className }) {
  const sizes = { sm: 'w-4 h-4 border-2', md: 'w-6 h-6 border-2', lg: 'w-8 h-8 border-3', xl: 'w-12 h-12 border-4' }
  return (
    <div className={clsx('inline-flex items-center', className)} role="status">
      <span className={clsx('animate-spin rounded-full border-primary-500 border-t-transparent', sizes[size])} />
      <span className="sr-only">Loading</span>
    </div>
  )
}
Spinner.propTypes = { size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']), className: PropTypes.string }
export default Spinner
