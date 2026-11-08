import React from 'react'
import PropTypes from 'prop-types'

export default function AssetStatsCard({
  title,
  value,
  description,
  icon: Icon,
  variant = 'primary',
}) {
  const variantStyles = {
    primary: 'border-l-[#01458e] text-[#01458e] bg-blue-50/50',
    success: 'border-l-emerald-600 text-emerald-700 bg-emerald-50/50',
    warning: 'border-l-amber-500 text-amber-700 bg-amber-50/50',
    purple: 'border-l-purple-600 text-purple-700 bg-purple-50/50',
    neutral: 'border-l-slate-500 text-slate-700 bg-slate-50/50',
  }

  const borderClass = {
    primary: 'border-l-[#01458e]',
    success: 'border-l-emerald-600',
    warning: 'border-l-amber-500',
    purple: 'border-l-purple-600',
    neutral: 'border-l-slate-500',
  }[variant] || 'border-l-[#01458e]'

  const iconStyle = variantStyles[variant] || variantStyles.primary

  return (
    <div
      className={`bg-white rounded-lg border border-slate-200 border-l-4 ${borderClass} p-4 shadow-xs transition hover:shadow-sm flex items-center justify-between`}
    >
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">{value}</h3>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
      {Icon && (
        <div
          className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 border border-slate-200/60 ${iconStyle}`}
          aria-hidden="true"
        >
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  )
}

AssetStatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string,
  icon: PropTypes.elementType,
  variant: PropTypes.oneOf(['primary', 'success', 'warning', 'purple', 'neutral']),
}
