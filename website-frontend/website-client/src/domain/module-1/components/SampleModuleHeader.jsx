import React from 'react'
import PropTypes from 'prop-types'
import StatusChip from '@/shared/components/status/StatusChip'
import { GigwButton } from '@/shared/components/buttons/gigw'
import DashboardPageHeaderActions from '@/app/shell/components/DashboardPageHeaderActions'

/**
 * SampleModuleHeader
 * Connects module actions to DashboardPageHeaderActions to align with Probity
 * shell standards without creating redundant inner page titles.
 */
export default function SampleModuleHeader({
  title,
  subtitle = null,
  primaryAction = null,
  secondaryActions = [],
  status = null,
  className = '',
}) {
  const hasActions = Boolean(primaryAction || (secondaryActions && secondaryActions.length > 0) || status)

  if (!hasActions) {
    return null
  }

  return (
    <DashboardPageHeaderActions>
      <div
        className={`flex w-full min-w-0 max-w-full flex-wrap items-center justify-start gap-2 md:justify-end ${className}`.trim()}
      >
        {status && <StatusChip label={status} />}
        {secondaryActions.map((sec, i) => (
          <GigwButton
            key={sec.label || i}
            type="button"
            hideIcon
            variant={sec.variant === 'delete' ? 'outlineDanger' : 'outlineUtility'}
            size="sm"
            onClick={sec.onClick}
            disabled={sec.disabled}
            className="text-xs"
          >
            {sec.icon ? <span className="inline-flex shrink-0">{sec.icon}</span> : null}
            {sec.label}
          </GigwButton>
        ))}

        {primaryAction ? (
          <GigwButton
            type="button"
            hideIcon
            variant="primary"
            size="sm"
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled}
            className="text-xs"
          >
            {primaryAction.icon ? (
              <span className="inline-flex shrink-0">{primaryAction.icon}</span>
            ) : null}
            {primaryAction.label}
          </GigwButton>
        ) : null}
      </div>
    </DashboardPageHeaderActions>
  )
}

SampleModuleHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  primaryAction: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.node,
    variant: PropTypes.string,
    disabled: PropTypes.bool,
  }),
  secondaryActions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      icon: PropTypes.node,
      variant: PropTypes.string,
      disabled: PropTypes.bool,
    })
  ),
  status: PropTypes.string,
  className: PropTypes.string,
}
