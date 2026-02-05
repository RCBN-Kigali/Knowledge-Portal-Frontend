interface ProgressBarChartProps {
  data: { label: string; value: number }[]
  color?: 'primary' | 'success' | 'warning' | 'danger'
}

const colorClasses = {
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
}

function ProgressBarChart({ data, color = 'primary' }: ProgressBarChartProps) {
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700 truncate">{item.label}</span>
            <span className="text-gray-500 font-medium">{item.value}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${colorClasses[color]}`}
              style={{ width: `${Math.min(100, item.value)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProgressBarChart
