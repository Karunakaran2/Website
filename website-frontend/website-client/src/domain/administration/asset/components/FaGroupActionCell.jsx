import { Eye } from 'lucide-react'
import {
  GIGW_ACTIVATE_ICON,
  GIGW_DEACTIVATE_ICON,
  GIGW_EDIT_ICON,
  TableActiveStatusAction,
  TableEditAction,
  TableRowActionsGroup,
  TableViewAction,
} from '@/shared/components/buttons'
import { isRowActive } from '@/shared/components/status/statusLabels'

export default function FaGroupActionCell({
  row,
  onView,
  onEdit,
  onToggleActive,
  onRequestConfirm,
}) {
  const isActive = isRowActive(row)
  const label = row.assetType || 'FA group'

  const handleToggle = () => {
    const run = () => onToggleActive(row)
    if (onRequestConfirm) {
      onRequestConfirm(run, {
        action: isActive ? 'deactivate' : 'activate',
        recordLabel: label,
      })
      return
    }
    run()
  }

  const activeLabel = isActive ? 'Deactivate' : 'Activate'

  return (
    <TableRowActionsGroup
      className="justify-start"
      items={[
        {
          key: 'view',
          label: 'View',
          icon: Eye,
          onClick: () => onView(row),
          render: () => (
            <TableViewAction
              type="button"
              aria-label={`View FA group ${label}`}
              title="View"
              onClick={() => onView(row)}
            />
          ),
        },
        {
          key: 'edit',
          label: 'Edit',
          icon: GIGW_EDIT_ICON,
          onClick: () => onEdit(row),
          render: () => (
            <TableEditAction
              type="button"
              aria-label={`Edit FA group ${label}`}
              title="Edit"
              onClick={() => onEdit(row)}
            />
          ),
        },
        {
          key: 'active',
          label: activeLabel,
          icon: isActive ? GIGW_DEACTIVATE_ICON : GIGW_ACTIVATE_ICON,
          onClick: handleToggle,
          render: () => (
            <TableActiveStatusAction
              isActive={isActive}
              onActivate={handleToggle}
              onDeactivate={handleToggle}
              aria-label={`${activeLabel} ${label}`}
              title={activeLabel}
            />
          ),
        },
      ]}
    />
  )
}
