import { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

function Avatar({ src, alt, name, size = 'md', className }) {
  const [error, setError] = useState(false)
  const sizes = { xs: 'w-6 h-6 text-xs', sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base', lg: 'w-12 h-12 text-lg', xl: 'w-16 h-16 text-xl' }
  const getInitials = (n) => n ? n.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase() : '?'
  const colors = ['bg-primary-500', 'bg-success-500', 'bg-warning-500', 'bg-danger-500', 'bg-purple-500']
  const getBg = (n) => n ? colors[n.length % colors.length] : 'bg-gray-400'
  const showImg = src && !error
  return (
    <div className={clsx('inline-flex items-center justify-center rounded-full font-medium text-white', sizes[size], !showImg && getBg(name), className)}>
      {showImg ? <img src={src} alt={alt || name} className="w-full h-full object-cover rounded-full" onError={() => setError(true)} /> : <span>{getInitials(name)}</span>}
    </div>
  )
}
Avatar.propTypes = { src: PropTypes.string, alt: PropTypes.string, name: PropTypes.string, size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']), className: PropTypes.string }
export default Avatar
