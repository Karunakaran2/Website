import { Eye } from 'lucide-react'
import {
  TableApproveAction,
  TableEditAction,
  TableRejectAction,
  TableViewAction,
} from '@/shared/components/buttons'
import {
  GIGW_EDIT_ICON,
  GIGW_FINALIZE_ICON,
  GIGW_REJECT_ICON,
} from '@/shared/components/buttons/gigw/gigwLucideIcons'

export function buildSampleQueueRowActions(row, { onView, onApprove, onReject, onEdit }) {
  if (row.status === 'Draft') {
    return [
      {
        key: 'edit',
        label: 'Edit',
        icon: GIGW_EDIT_ICON,
        onClick: () => onEdit?.(row),
        render: () => (
          <TableEditAction onClick={() => onEdit?.(row)} ariaLabel={`Edit ${row.id}`} />
        ),
      },
    ]
  }

  const items = [
    {
      key: 'view',
      label: 'View',
      icon: Eye,
      onClick: () => onView?.(row),
      render: () => (
        <TableViewAction onClick={() => onView?.(row)} ariaLabel={`View ${row.id}`} />
      ),
    },
  ]

  if (row.status === 'Pending' || row.status === 'In Progress') {
    items.push(
      {
        key: 'approve',
        label: 'Approve',
        icon: GIGW_FINALIZE_ICON,
        onClick: () => onApprove?.(row),
        render: () => (
          <TableApproveAction onClick={() => onApprove?.(row)} ariaLabel={`Approve ${row.id}`} />
        ),
      },
      {
        key: 'reject',
        label: 'Reject',
        icon: GIGW_REJECT_ICON,
        onClick: () => onReject?.(row),
        render: () => (
          <TableRejectAction onClick={() => onReject?.(row)} ariaLabel={`Reject ${row.id}`} />
        ),
      },
    )
  }

  return items
}
