import { Eye, Trash2 } from 'lucide-react'
import {
  TableApproveAction,
  TableDeleteAction,
  TableEditAction,
  TableViewAction,
} from '@/shared/components/buttons'
import {
  GIGW_EDIT_ICON,
  GIGW_FINALIZE_ICON,
} from '@/shared/components/buttons/gigw/gigwLucideIcons'

/**
 * Workbench asset table — status-driven row actions (0–4) using shared overflow rules.
 */
export function buildAssetTableRowActions(row, onAction) {
  const run = (name) => () => onAction(name, row)

  if (row.status === 'Draft') {
    return [
      {
        key: 'edit',
        label: 'Edit',
        icon: GIGW_EDIT_ICON,
        onClick: run('Edit'),
        render: () => (
          <TableEditAction onClick={run('Edit')} ariaLabel={`Edit ${row.id}`} />
        ),
      },
      {
        key: 'delete',
        label: 'Delete',
        icon: Trash2,
        onClick: run('Delete'),
        render: () => (
          <TableDeleteAction onClick={run('Delete')} ariaLabel={`Delete ${row.id}`} />
        ),
      },
    ]
  }

  if (row.status === 'Pending' || row.status === 'In Progress') {
    return [
      {
        key: 'view',
        label: 'View',
        icon: Eye,
        onClick: run('View'),
        render: () => (
          <TableViewAction onClick={run('View')} ariaLabel={`View ${row.id}`} />
        ),
      },
      {
        key: 'edit',
        label: 'Edit',
        icon: GIGW_EDIT_ICON,
        onClick: run('Edit'),
        render: () => (
          <TableEditAction onClick={run('Edit')} ariaLabel={`Edit ${row.id}`} />
        ),
      },
      {
        key: 'approve',
        label: 'Approve',
        icon: GIGW_FINALIZE_ICON,
        onClick: run('Approve'),
        render: () => (
          <TableApproveAction onClick={run('Approve')} ariaLabel={`Approve ${row.id}`} />
        ),
      },
      {
        key: 'delete',
        label: 'Delete',
        icon: Trash2,
        onClick: run('Delete'),
        render: () => (
          <TableDeleteAction onClick={run('Delete')} ariaLabel={`Delete ${row.id}`} />
        ),
      },
    ]
  }

  return [
    {
      key: 'view',
      label: 'View',
      icon: Eye,
      onClick: run('View'),
      render: () => (
        <TableViewAction onClick={run('View')} ariaLabel={`View ${row.id}`} />
      ),
    },
  ]
}
