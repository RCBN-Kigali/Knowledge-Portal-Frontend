import { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { Search, X } from 'lucide-react'
import Spinner from './Spinner'

export interface SearchBarProps {
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  placeholder?: string
  loading?: boolean
  debounceMs?: number
  className?: string
}

function SearchBar({
  value: controlledValue,
  onChange,
  onSearch,
  placeholder = 'Search...',
  loading = false,
  debounceMs = 300,
  className,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(controlledValue || '')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const value = controlledValue !== undefined ? controlledValue : internalValue

  useEffect(() => {
    if (controlledValue !== undefined) setInternalValue(controlledValue)
  }, [controlledValue])

  const handleChange = (newValue: string) => {
    setInternalValue(newValue)
    onChange?.(newValue)

    if (onSearch) {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => onSearch(newValue), debounceMs)
    }
  }

  const handleClear = () => {
    handleChange('')
    onSearch?.('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      onSearch(value)
    }
  }

  return (
    <div className={clsx('relative', className)}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        {loading ? (
          <Spinner size="sm" />
        ) : (
          <Search className="w-5 h-5 text-gray-400" />
        )}
      </div>
      <input
        type="search"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default SearchBar
