import PropTypes from 'prop-types'
import clsx from 'clsx'
import { Inbox } from 'lucide-react'
import Button from './Button'

function EmptyState({ icon: Icon = Inbox, title = 'No items found', description, actionLabel, onAction, className }) {
  return (
    <div className={clsx('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      {description && <p className="text-gray-500 max-w-sm mb-6">{description}</p>}
      {actionLabel && onAction && <Button onClick={onAction}>{actionLabel}</Button>}
    </div>
  )
}
EmptyState.propTypes = { icon: PropTypes.elementType, title: PropTypes.string, description: PropTypes.string, actionLabel: PropTypes.string, onAction: PropTypes.func, className: PropTypes.string }
EmptyState.NoCourses = ({ onAction }) => <EmptyState title="No courses yet" description="Get started by creating your first course" actionLabel="Create Course" onAction={onAction} />
EmptyState.NoLessons = ({ onAction }) => <EmptyState title="No lessons yet" description="Add lessons to build your course content" actionLabel="Add Lesson" onAction={onAction} />
export default EmptyState
