import { forwardRef, useId } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'

const Select = forwardRef(function Select({ label, error, helperText, options = [], placeholder = 'Select an option', required = false, disabled = false, className, ...props }, ref) {
  const id = useId()
  const hasError = Boolean(error)
  return (
    <div className="space-y-1">
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}{required && <span className="text-danger-500 ml-1">*</span>}</label>}
      <div className="relative">
        <select ref={ref} id={id} disabled={disabled} required={required} aria-invalid={hasError}
          className={clsx('w-full px-4 py-3 border rounded-lg text-base bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 disabled:bg-gray-100 min-h-[44px] pr-10', hasError ? 'border-danger-500 focus:ring-danger-500' : 'border-gray-300 focus:ring-primary-500', className)} {...props}>
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      {hasError && <p className="text-sm text-danger-600">{error}</p>}
      {helperText && !hasError && <p className="text-sm text-gray-500">{helperText}</p>}
    </div>
  )
})
Select.propTypes = { label: PropTypes.string, error: PropTypes.string, helperText: PropTypes.string, options: PropTypes.array, placeholder: PropTypes.string, required: PropTypes.bool, disabled: PropTypes.bool, className: PropTypes.string }
export default Select
