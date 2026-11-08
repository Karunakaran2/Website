import React, { isValidElement } from 'react'
import PropTypes from 'prop-types'

function renderMetricIcon(icon) {
  if (!icon) return null
  if (isValidElement(icon)) return icon
  if (typeof icon === 'function') {
    const Icon = icon
    return <Icon className="h-5 w-5" aria-hidden />
  }
  return icon
}

/**
 * SampleMetricCard
 * Implements Section 7: Summary Metric Card pattern.
 * Displays metric value, title, icon, and trend badge.
 */
export default function SampleMetricCard({
  title,
  value,
  subtitle = null,
  icon = null,
  trend = null, // { text: '+12%', isPositive: true }
  variant = 'default', // 'default' | 'primary' | 'success' | 'warning'
  onClick = null,
}) {
  const variantStyles = {
    default: 'bg-card text-card-foreground border-border',
    primary: 'bg-blue-50/50 text-blue-950 border-blue-200',
    success: 'bg-emerald-50/50 text-emerald-950 border-emerald-200',
    warning: 'bg-amber-50/50 text-amber-950 border-amber-200',
  }[variant] || 'bg-card text-card-foreground border-border'

  const iconBgStyles = {
    default: 'bg-primary/10 text-primary',
    primary: 'bg-blue-600 text-white shadow-xs',
    success: 'bg-emerald-600 text-white shadow-xs',
    warning: 'bg-amber-600 text-white shadow-xs',
  }[variant] || 'bg-primary/10 text-primary'

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`rounded-xl border p-4 sm:p-5 shadow-xs transition-all hover:shadow-md ${variantStyles} ${
        onClick ? 'cursor-pointer hover:border-primary/50' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        {icon ? (
          <div className={`p-2 rounded-lg flex items-center justify-center shrink-0 ${iconBgStyles}`}>
            {renderMetricIcon(icon)}
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {value}
        </div>
        {trend && (
          <span
            className={`inline-flex items-center text-xs font-bold px-1.5 py-0.5 rounded ${
              trend.isPositive
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {trend.text}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
          {subtitle}
        </p>
      )}
    </div>
  )
}

SampleMetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
  trend: PropTypes.shape({
    text: PropTypes.string.isRequired,
    isPositive: PropTypes.bool.isRequired,
  }),
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning']),
  onClick: PropTypes.func,
}
