import type { ReactNode } from 'react'
import clsx from 'clsx'

export interface Tab {
  id: string
  label: string
  count?: number
  disabled?: boolean
}

export interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  variant?: 'underline' | 'pills'
  className?: string
}

export interface TabPanelProps {
  id: string
  activeTab: string
  children: ReactNode
}

function Tabs({ tabs, activeTab, onChange, variant = 'underline', className }: TabsProps) {
  return (
    <div
      role="tablist"
      className={clsx(
        'flex',
        variant === 'underline' && 'border-b border-gray-200 gap-0',
        variant === 'pills' && 'gap-2 bg-gray-100 p-1 rounded-lg',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab

        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed',
              variant === 'underline' && [
                'border-b-2 -mb-px',
                isActive
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ],
              variant === 'pills' && [
                'rounded-md',
                isActive
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700',
              ]
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={clsx(
                  'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-medium',
                  isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-200 text-gray-600'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function TabPanel({ id, activeTab, children }: TabPanelProps) {
  if (id !== activeTab) return null
  return (
    <div role="tabpanel" id={`tabpanel-${id}`} aria-labelledby={id}>
      {children}
    </div>
  )
}

export default Object.assign(Tabs, { Panel: TabPanel })
