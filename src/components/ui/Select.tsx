import { forwardRef, useId, useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import { ChevronDown, Search, X } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  label?: string
  error?: string
  helperText?: string
  options?: SelectOption[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
  searchable?: boolean
  value?: string
  onChange?: (value: string) => void
  className?: string
}

// Native select (default, non-searchable)
const NativeSelect = forwardRef<HTMLSelectElement, SelectProps>(function NativeSelect(
  { label, error, helperText, options = [], placeholder = 'Select an option', required, disabled, value, onChange, className },
  ref
) {
  const id = useId()
  const hasError = Boolean(error)

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={id}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={clsx(
            'w-full px-4 py-3 border rounded-lg text-base bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 disabled:bg-gray-100 min-h-[44px] pr-10',
            hasError ? 'border-danger-500 focus:ring-danger-500' : 'border-gray-300 focus:ring-primary-500',
            className
          )}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      {hasError && <p className="text-sm text-danger-600" role="alert">{error}</p>}
      {helperText && !hasError && <p className="text-sm text-gray-500">{helperText}</p>}
    </div>
  )
})

// Searchable select
function SearchableSelect({
  label, error, helperText, options = [], placeholder = 'Select an option', required, disabled, value, onChange, className,
}: SelectProps) {
  const id = useId()
  const hasError = Boolean(error)
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)
  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <div ref={ref} className="relative">
        <button
          id={id}
          type="button"
          disabled={disabled}
          aria-invalid={hasError}
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            'w-full px-4 py-3 border rounded-lg text-base text-left bg-white focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed min-h-[44px] pr-10',
            hasError ? 'border-danger-500 focus:ring-danger-500' : 'border-gray-300 focus:ring-primary-500',
            className
          )}
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
            {selectedOption?.label || placeholder}
          </span>
        </button>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange?.(''); }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <ChevronDown className={clsx('w-5 h-5 text-gray-400 transition-transform', isOpen && 'rotate-180')} />
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <p className="px-4 py-3 text-sm text-gray-500">No options found</p>
              ) : (
                filtered.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange?.(opt.value)
                      setIsOpen(false)
                      setSearch('')
                    }}
                    className={clsx(
                      'w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100',
                      opt.value === value ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700'
                    )}
                  >
                    {opt.label}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      {hasError && <p className="text-sm text-danger-600" role="alert">{error}</p>}
      {helperText && !hasError && <p className="text-sm text-gray-500">{helperText}</p>}
    </div>
  )
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(props, ref) {
  if (props.searchable) {
    return <SearchableSelect {...props} />
  }
  return <NativeSelect ref={ref} {...props} />
})

export default Select
