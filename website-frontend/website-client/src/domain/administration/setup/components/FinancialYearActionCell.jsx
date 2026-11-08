import {
  GIGW_FREEZE_ICON,
  TableActivateAction,
  TableDeactivateAction,
  TableEditAction,
  TableRowActionsGroup,
  TableSubmitAction,
} from '@/shared/components/buttons'
import { confirmBeforeAction, useActionConfirm } from '@/shared/components/confirm'
import { useAuditClosureData } from '../constants/auditClosureStore'

export default function FinancialYearActionCell({
  row,
  onEdit,
  onActivate,
  onDeactivate,
  onFreeze,
  years,
}) {
  const requestConfirm = useActionConfirm()
  const stored = useAuditClosureData()
  const yearRows = years ?? stored.years
  const items = []
  const isActive = Boolean(row.active)
  const anotherYearFrozen = yearRows.some((year) => year.frozen && year.idMask !== row.idMask)

  if (!row.frozen) {
    items.push({
      key: 'edit',
      label: 'Edit',
      onClick: () => onEdit(row),
      render: () => (
        <TableEditAction
          type="button"
          aria-label={`Edit ${row.label}`}
          onClick={() => onEdit(row)}
        />
      ),
    })
  }

  if (row.isDeleted) {
    items.push({
      key: 'activate',
      label: 'Activate',
      onClick: () => confirmBeforeAction(requestConfirm, {
        action: 'activate',
        recordLabel: row.label,
        runAction: async () => {
          if (!onActivate) {
            return false
          }
          return onActivate(row)
        },
      }),
      render: () => (
        <TableActivateAction
          type="button"
          aria-label={`Activate ${row.label}`}
          onClick={() => items.find((item) => item.key === 'activate')?.onClick()}
        />
      ),
    })
  }

  if (!row.isDeleted) {
    items.push({
      key: 'deactivate',
      label: 'Deactivate',
      onClick: () => confirmBeforeAction(requestConfirm, {
        action: 'deactivate',
        recordLabel: row.label,
        runAction: async () => {
          if (!onDeactivate) {
            return false
          }
          return onDeactivate(row)
        },
      }),
      render: () => (
        <TableDeactivateAction
          type="button"
          aria-label={`Deactivate ${row.label}`}
          onClick={() => items.find((item) => item.key === 'deactivate')?.onClick()}
        />
      ),
    })
  }

  if (isActive && !row.frozen && !anotherYearFrozen) {
    items.push({
      key: 'freeze',
      label: 'Freeze',
      icon: GIGW_FREEZE_ICON,
      onClick: () => confirmBeforeAction(requestConfirm, {
        action: 'submit',
        submitLabel: 'Freeze',
        recordLabel: row.label,
        message: 'Do you want to freeze this financial year?',
        successMessage: 'Frozen successfully.',
        runAction: async () => {
          if (!onFreeze) {
            return false
          }
          return onFreeze(row)
        },
      }),
      render: () => (
        <TableSubmitAction
          type="button"
          icon={GIGW_FREEZE_ICON}
          tooltip="Freeze"
          aria-label={`Freeze ${row.label}`}
          onClick={() => items.find((item) => item.key === 'freeze')?.onClick()}
        />
      ),
    })
  }

  if (items.length === 0) {
    return null
  }

  return <TableRowActionsGroup className="justify-center" items={items} />
}
