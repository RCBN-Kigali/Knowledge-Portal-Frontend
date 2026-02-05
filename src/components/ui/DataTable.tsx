import { type ReactNode } from 'react'
import clsx from 'clsx'
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import Skeleton from './Skeleton'
import EmptyState from './EmptyState'
import Checkbox from './Checkbox'

export interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  render?: (row: T) => ReactNode
  width?: string
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (column: string) => void
  selectable?: boolean
  selectedRows?: string[]
  onSelectionChange?: (ids: string[]) => void
  rowKey?: keyof T | ((row: T) => string)
  className?: string
}

function getRowId<T>(row: T, rowKey?: keyof T | ((row: T) => string)): string {
  if (typeof rowKey === 'function') return rowKey(row)
  if (rowKey) return String(row[rowKey])
  return String((row as Record<string, unknown>)['id'] || '')
}

function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data found',
  sortBy,
  sortOrder,
  onSort,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  rowKey,
  className,
}: DataTableProps<T>) {
  const allIds = data.map((row) => getRowId(row, rowKey))
  const allSelected = data.length > 0 && selectedRows.length === data.length

  const toggleAll = () => {
    onSelectionChange?.(allSelected ? [] : allIds)
  }

  const toggleRow = (id: string) => {
    onSelectionChange?.(
      selectedRows.includes(id)
        ? selectedRows.filter((r) => r !== id)
        : [...selectedRows, id]
    )
  }

  const renderSortIcon = (col: Column<T>) => {
    if (!col.sortable) return null
    if (sortBy !== col.key) return <ArrowUpDown className="w-4 h-4 text-gray-400" />
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-4 h-4 text-primary-500" />
    ) : (
      <ArrowDown className="w-4 h-4 text-primary-500" />
    )
  }

  if (loading) {
    return (
      <div className={clsx('border border-gray-200 rounded-xl overflow-hidden', className)}>
        <div className="divide-y divide-gray-200">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              {selectable && <Skeleton variant="rectangular" width={20} height={20} />}
              {columns.map((col) => (
                <div key={col.key} className="flex-1">
                  <Skeleton variant="text" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={clsx('border border-gray-200 rounded-xl', className)}>
        <EmptyState title={emptyMessage} />
      </div>
    )
  }

  return (
    <div className={clsx('border border-gray-200 rounded-xl overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {selectable && (
                <th className="px-6 py-3 w-12">
                  <Checkbox
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={clsx(
                    'px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider',
                    col.sortable && 'cursor-pointer select-none hover:text-gray-900'
                  )}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={() => col.sortable && onSort?.(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {renderSortIcon(col)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row) => {
              const id = getRowId(row, rowKey)
              const isSelected = selectedRows.includes(id)

              return (
                <tr
                  key={id}
                  className={clsx(
                    'hover:bg-gray-50 transition-colors',
                    isSelected && 'bg-primary-50'
                  )}
                >
                  {selectable && (
                    <td className="px-6 py-4 w-12">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleRow(id)}
                        aria-label={`Select row ${id}`}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-gray-700">
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
