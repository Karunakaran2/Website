import { Eye } from 'lucide-react'
import {
  TableApproveAction,
  TableRowActionsGroup,
  TableVerifyAction,
  TableViewAction,
  TableWorkflowAction,
} from '@/shared/components/buttons'

export default function AssetInformationApprovalActionCell({
  row,
  status,
  onView,
  onForward,
  onVerify,
  onApprove,
  disabled = false,
}) {
  const canAct = status === 'received'
  const isSubmitted = row.status === 'S'
  const isVerified = row.status === 'V'
  const label = row.assetId || row.assetDescription || 'asset'

  const items = [
    {
      key: 'view',
      label: 'View',
      icon: Eye,
      onClick: () => onView?.(row),
      render: () => (
        <TableViewAction
          type="button"
          aria-label={`View ${label}`}
          onClick={() => onView?.(row)}
        />
      ),
    },
  ]

  const rowCanForward = row.canForward !== false
  const rowCanVerify = row.canVerify === true
  const rowCanApprove = row.canApprove === true

  if (canAct && (isSubmitted || isVerified) && rowCanForward) {
    items.push({
      key: 'forward',
      label: 'Forward',
      onClick: () => onForward?.(row),
      render: () => (
        <TableWorkflowAction
          type="button"
          title="Forward"
          aria-label={`Forward ${label}`}
          disabled={disabled}
          onClick={() => onForward?.(row)}
        />
      ),
    })
  }

  if (canAct && isSubmitted && rowCanVerify) {
    items.push({
      key: 'verify',
      label: 'Verify',
      onClick: () => onVerify?.(row),
      render: () => (
        <TableVerifyAction
          type="button"
          title="Verify"
          aria-label={`Verify ${label}`}
          disabled={disabled}
          onClick={() => onVerify?.(row)}
        />
      ),
    })
  }

  if (canAct && isVerified && rowCanApprove) {
    items.push({
      key: 'approve',
      label: 'Approve',
      onClick: () => onApprove?.(row),
      render: () => (
        <TableApproveAction
          type="button"
          aria-label={`Approve ${label}`}
          disabled={disabled}
          onClick={() => onApprove?.(row)}
        />
      ),
    })
  }

  return <TableRowActionsGroup className="justify-start" items={items} />
}
