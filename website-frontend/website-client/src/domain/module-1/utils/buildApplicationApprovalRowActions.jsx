import { Eye } from 'lucide-react'
import {
  TableApproveAction,
  TableRejectAction,
  TableReverseAction,
  TableViewAction,
  TableWorkflowAction,
} from '@/shared/components/buttons'
import {
  GIGW_FINALIZE_ICON,
  GIGW_REJECT_ICON,
  GIGW_REVERSE_ICON,
  GIGW_WORKFLOW_ICON,
} from '@/shared/components/buttons/gigw/gigwLucideIcons'

/**
 * Icon-only approval row actions with overflow when more than two applicable actions.
 */
export function buildApplicationApprovalRowActions({
  row,
  onView,
  onStartReview,
  onApprove,
  onReject,
  onReturn,
}) {
  const items = [
    {
      key: 'view',
      label: 'View',
      icon: Eye,
      onClick: () => onView(row),
      render: () => (
        <TableViewAction
          onClick={() => onView(row)}
          ariaLabel={`View application ${row.code}`}
        />
      ),
    },
  ]

  if (row.applicationStatus === 'Submitted' && onStartReview) {
    items.push({
      key: 'start-review',
      label: 'Start review',
      icon: GIGW_WORKFLOW_ICON,
      onClick: () => onStartReview(row),
      render: () => (
        <TableWorkflowAction
          onClick={() => onStartReview(row)}
          tooltip="Start review"
          ariaLabel={`Start review for ${row.code}`}
        />
      ),
    })
  }

  if (['Submitted', 'Under Review'].includes(row.applicationStatus)) {
    items.push(
      {
        key: 'approve',
        label: 'Approve',
        icon: GIGW_FINALIZE_ICON,
        onClick: () => onApprove(row),
        render: () => (
          <TableApproveAction
            onClick={() => onApprove(row)}
            ariaLabel={`Approve ${row.code}`}
          />
        ),
      },
      {
        key: 'reject',
        label: 'Reject',
        icon: GIGW_REJECT_ICON,
        onClick: () => onReject(row),
        render: () => (
          <TableRejectAction
            onClick={() => onReject(row)}
            ariaLabel={`Reject ${row.code}`}
          />
        ),
      },
      {
        key: 'return',
        label: 'Return for correction',
        icon: GIGW_REVERSE_ICON,
        onClick: () => onReturn(row),
        render: () => (
          <TableReverseAction
            onClick={() => onReturn(row)}
            tooltip="Return for correction"
            ariaLabel={`Return ${row.code} for correction`}
          />
        ),
      },
    )
  }

  return items
}
