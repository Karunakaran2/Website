import React from 'react'
import PropTypes from 'prop-types'
import StatusChip from '@/shared/components/status/StatusChip'
import ActionButton from '@/shared/components/buttons/ActionButton'

export default function SetupModuleHeader({
  title,
  subtitle = null,
  primaryAction = null,
  secondaryActions = [],
  status = null,
  className = '',
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 ${className}`}>
      {/* Title & Status */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        {status && <StatusChip label={status} />}
        {subtitle && (
          <p className="w-full text-xs text-slate-500 font-normal mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {/* Action Controls */}
      {(primaryAction || secondaryActions.length > 0) && (
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {secondaryActions.map((sec, i) => (
            <ActionButton
              key={sec.label || i}
              variant={sec.variant || 'cancel'}
              onClick={sec.onClick}
              disabled={sec.disabled}
              className="text-xs"
            >
              {sec.icon && <span className="mr-1.5">{sec.icon}</span>}
              {sec.label}
            </ActionButton>
          ))}

          {primaryAction && (
            <ActionButton
              variant={primaryAction.variant || 'primary'}
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled}
              className="text-xs"
            >
              {primaryAction.icon && <span className="mr-1.5">{primaryAction.icon}</span>}
              {primaryAction.label}
            </ActionButton>
          )}
        </div>
      )}
    </div>
  )
}

SetupModuleHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  primaryAction: PropTypes.shape({
    label: PropTypes.string.isRequired,
    icon: PropTypes.node,
    onClick: PropTypes.func.isRequired,
    variant: PropTypes.string,
    disabled: PropTypes.bool,
  }),
  secondaryActions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      onClick: PropTypes.func.isRequired,
      variant: PropTypes.string,
      disabled: PropTypes.bool,
    })
  ),
  status: PropTypes.string,
  className: PropTypes.string,
}
