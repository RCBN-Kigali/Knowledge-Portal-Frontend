import type { ReactNode } from 'react'
import Card from '../../../components/ui/Card'

export interface SimpleStatsCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
}

function SimpleStatsCard({ title, value, icon, trend }: SimpleStatsCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>
      {trend && (
        <div className={`mt-2 text-xs ${trend.isPositive !== false ? 'text-success-600' : 'text-warning-600'}`}>
          {trend.value} {trend.label}
        </div>
      )}
    </Card>
  )
}

export default SimpleStatsCard
