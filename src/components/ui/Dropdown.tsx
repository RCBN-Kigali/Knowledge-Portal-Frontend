import { useState, useRef, useEffect, createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'

interface DropdownContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const Ctx = createContext<DropdownContextType | null>(null)

function useDropdown() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('Dropdown compound components must be used within Dropdown')
  return ctx
}

export interface DropdownProps {
  children: ReactNode
  className?: string
}

function Dropdown({ children, className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    if (isOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  return (
    <Ctx.Provider value={{ isOpen, setIsOpen }}>
      <div ref={ref} className={clsx('relative inline-block', className)}>
        {children}
      </div>
    </Ctx.Provider>
  )
}

interface TriggerProps {
  children: ReactNode
  className?: string
}

function Trigger({ children, className }: TriggerProps) {
  const { isOpen, setIsOpen } = useDropdown()
  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={clsx(
        'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary-500',
        className
      )}
    >
      {children}
      <ChevronDown className={clsx('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
    </button>
  )
}

interface MenuProps {
  children: ReactNode
  align?: 'left' | 'right'
  className?: string
}

function Menu({ children, align = 'left', className }: MenuProps) {
  const { isOpen } = useDropdown()
  if (!isOpen) return null
  return (
    <div
      className={clsx(
        'absolute z-50 mt-2 py-1 min-w-[160px] bg-white rounded-lg border border-gray-200 shadow-lg',
        align === 'right' ? 'right-0' : 'left-0',
        className
      )}
    >
      {children}
    </div>
  )
}

interface ItemProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  icon?: ReactNode
  className?: string
}

function Item({ children, onClick, disabled, icon, className }: ItemProps) {
  const { setIsOpen } = useDropdown()
  return (
    <button
      type="button"
      onClick={() => {
        onClick?.()
        setIsOpen(false)
      }}
      disabled={disabled}
      className={clsx(
        'w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-2',
        className
      )}
    >
      {icon && <span className="flex-shrink-0 w-4 h-4">{icon}</span>}
      {children}
    </button>
  )
}

function Divider() {
  return <div className="my-1 border-t border-gray-200" />
}

export default Object.assign(Dropdown, {
  Trigger,
  Menu,
  Item,
  Divider,
})
