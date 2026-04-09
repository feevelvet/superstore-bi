import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: number | string
  unit?: string
  trend?: number
  icon?: React.ReactNode
  description?: string
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit = '',
  trend,
  icon,
  description,
}) => {
  const isPositive = trend ? trend >= 0 : false

  return (
    <div className="metric-card group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-100">
            {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
            <span className="text-lg ml-1 text-slate-500">{unit}</span>
          </p>
        </div>
        {icon && <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">{icon}</div>}
      </div>

      {description && <p className="text-xs text-slate-500 mb-3">{description}</p>}

      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{Math.abs(trend).toFixed(1)}%</span>
        </div>
      )}
    </div>
  )
}
