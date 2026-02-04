import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../ui'

export function PageHeader({ title, subtitle, actions, backButton }) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (typeof backButton === 'string') {
      navigate(backButton)
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          {backButton && (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg mt-0.5"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-gray-600">{subtitle}</p>
            )}
          </div>
        </div>

        {actions && actions.length > 0 && (
          <div className="flex items-center gap-3">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.primary ? 'primary' : 'secondary'}
                onClick={action.onClick}
                leftIcon={action.icon}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      primary: PropTypes.bool,
      icon: PropTypes.node,
    })
  ),
  backButton: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
}

export default PageHeader
