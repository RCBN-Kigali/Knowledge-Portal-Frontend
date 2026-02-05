import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { ComponentType } from 'react'
import clsx from 'clsx'
import { ChevronRight, MoreHorizontal } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: ComponentType<{ className?: string }>
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  maxVisible?: number
  className?: string
}

function Breadcrumb({ items, maxVisible = 4, className }: BreadcrumbProps) {
  const [expanded, setExpanded] = useState(false)

  const shouldTruncate = items.length > maxVisible && !expanded
  const visibleItems = shouldTruncate
    ? [items[0], ...items.slice(-(maxVisible - 1))]
    : items

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-1 text-sm flex-wrap">
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1
          const showEllipsis = shouldTruncate && index === 0

          return (
            <li key={item.label + index} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}

              {showEllipsis && (
                <>
                  <button
                    type="button"
                    onClick={() => setExpanded(true)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label="Show full path"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </>
              )}

              {isLast ? (
                <span className="flex items-center gap-1.5 text-gray-900 font-medium" aria-current="page">
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  to={item.href}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-primary-600 transition-colors"
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                </Link>
              ) : (
                <span className="flex items-center gap-1.5 text-gray-500">
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
