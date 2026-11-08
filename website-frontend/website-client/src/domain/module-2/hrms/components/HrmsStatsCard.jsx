import React from 'react'
import PropTypes from 'prop-types'

export default function HrmsStatsCard({
  title,
  value,
  description,
  icon: Icon,
  variant = 'primary',
}) {
  const variantStyles = {
    primary: 'border-l-primary bg-primary/5 text-primary',
    success: 'border-l-emerald-600 bg-emerald-50 text-emerald-700',
    warning: 'border-l-amber-500 bg-amber-50 text-amber-700',
    purple: 'border-l-purple-600 bg-purple-50 text-purple-700',
  }

  const badgeStyle = variantStyles[variant] || variantStyles.primary

  return (
    <div
      className="ds-card p-5 border-l-4 transition-all hover:shadow-md flex items-center justify-between"
      style={{ borderLeftColor: variant === 'primary' ? 'var(--ds-primary, #003366)' : undefined }}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          {title}
        </p>
        <h3 className="text-3xl font-bold tracking-tight text-foreground">{value}</h3>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {Icon && (
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${badgeStyle}`}
          aria-hidden="true"
        >
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  )
}

HrmsStatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string,
  icon: PropTypes.elementType,
  variant: PropTypes.oneOf(['primary', 'success', 'warning', 'purple']),
}
