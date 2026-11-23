import PropTypes from 'prop-types'

export default function CmsStatsCard({
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
      className={`flex items-center justify-between rounded-lg border border-slate-200 border-l-4 bg-white p-4 shadow-xs transition hover:shadow-sm ${borderClass}`}
    >
      <div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">{value}</h3>
        {description ? <p className="mt-0.5 text-xs text-slate-500">{description}</p> : null}
      </div>
      {Icon ? (
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200/60 ${iconStyle}`}
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" />
        </div>
      ) : null}
    </div>
  )
}

CmsStatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string,
  icon: PropTypes.elementType,
  variant: PropTypes.string,
}