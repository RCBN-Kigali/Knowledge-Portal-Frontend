import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import Card from '../../../components/ui/Card'

export interface StatsCardProps {
  title: string
  value: number | string
  icon: ReactNode
  trend?: { value: number; isPositive: boolean }
  link?: string
  linkLabel?: string
}

function StatsCard({ title, value, icon, trend, link, linkLabel }: StatsCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend.isPositive ? 'text-success-600' : 'text-danger-600'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}% from last month
            </p>
          )}
          {link && linkLabel && (
            <Link to={link} className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block">
              {linkLabel} &rarr;
            </Link>
          )}
        </div>
        <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
          {icon}
        </div>
      </div>
    </Card>
  )
}

export default StatsCard
