import clsx from 'clsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize?: number
  pageSizeOptions?: number[]
  onPageSizeChange?: (size: number) => void
  totalItems?: number
  className?: string
}

function getVisiblePages(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | 'ellipsis')[] = [1]

  if (current > 3) pages.push('ellipsis')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push('ellipsis')

  pages.push(total)
  return pages
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  pageSizeOptions = [10, 25, 50],
  onPageSizeChange,
  totalItems,
  className,
}: PaginationProps) {
  const pages = getVisiblePages(currentPage, totalPages)

  const startItem = totalItems ? (currentPage - 1) * (pageSize || 10) + 1 : 0
  const endItem = totalItems ? Math.min(currentPage * (pageSize || 10), totalItems) : 0

  return (
    <div className={clsx('flex flex-col sm:flex-row items-center justify-between gap-4', className)}>
      {/* Info text */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        {totalItems !== undefined && (
          <span>
            Showing {startItem}-{endItem} of {totalItems}
          </span>
        )}
        {pageSize && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Page buttons */}
      <nav aria-label="Pagination" className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Desktop: page numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {pages.map((page, idx) =>
            page === 'ellipsis' ? (
              <span key={`e-${idx}`} className="px-2 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={clsx(
                  'min-w-[40px] h-10 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
                  page === currentPage
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Mobile: page X of Y */}
        <span className="sm:hidden text-sm text-gray-600 px-3">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </nav>
    </div>
  )
}

export default Pagination
