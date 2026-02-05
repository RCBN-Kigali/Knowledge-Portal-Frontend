import Card from '../../../components/ui/Card'
import { Check, X, AlertTriangle } from 'lucide-react'

export interface ValidationItem {
  label: string
  isValid: boolean
  isWarning?: boolean
  details?: string
}

export interface ValidationChecklistProps {
  items: ValidationItem[]
  title?: string
}

function ValidationChecklist({ items, title = 'Submission Checklist' }: ValidationChecklistProps) {
  const validCount = items.filter(i => i.isValid).length
  const totalCount = items.length
  const allValid = validCount === totalCount
  const hasWarnings = items.some(i => i.isWarning && !i.isValid)
  
  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className={`text-sm font-medium ${
            allValid ? 'text-success-600' : hasWarnings ? 'text-warning-600' : 'text-danger-600'
          }`}>
            {validCount}/{totalCount} complete
          </span>
        </div>
      </Card.Header>
      <Card.Body>
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                item.isValid 
                  ? 'bg-success-100 text-success-600'
                  : item.isWarning
                    ? 'bg-warning-100 text-warning-600'
                    : 'bg-danger-100 text-danger-600'
              }`}>
                {item.isValid ? (
                  <Check className="w-3 h-3" />
                ) : item.isWarning ? (
                  <AlertTriangle className="w-3 h-3" />
                ) : (
                  <X className="w-3 h-3" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${item.isValid ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
                  {item.label}
                </p>
                {item.details && !item.isValid && (
                  <p className="text-xs text-gray-500 mt-0.5">{item.details}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
        
        {!allValid && (
          <div className={`mt-4 p-3 rounded-lg ${
            hasWarnings && !items.some(i => !i.isValid && !i.isWarning)
              ? 'bg-warning-50 text-warning-700'
              : 'bg-danger-50 text-danger-700'
          }`}>
            <p className="text-sm">
              {items.some(i => !i.isValid && !i.isWarning)
                ? 'Please complete all required items before submitting for review.'
                : 'You have some warnings. You can still submit, but consider addressing them.'}
            </p>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default ValidationChecklist
