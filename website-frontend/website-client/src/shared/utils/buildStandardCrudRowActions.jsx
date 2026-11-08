import { Eye, Trash2 } from 'lucide-react'
import {
  TableDeleteAction,
  TableEditAction,
  TableViewAction,
} from '@/shared/components/buttons'
import { GIGW_EDIT_ICON } from '@/shared/components/buttons/gigw/gigwLucideIcons'

/**
 * View + Edit + Delete row actions using TableRowActionsGroup overflow rules (>2 → ⋮).
 */
export function buildStandardCrudRowActions({
  rowKey,
  onView,
  onEdit,
  onDelete,
  viewAriaLabel,
  editAriaLabel,
  deleteAriaLabel,
}) {
  return [
    {
      key: 'view',
      label: 'View',
      icon: Eye,
      onClick: onView,
      render: () => <TableViewAction onClick={onView} ariaLabel={viewAriaLabel} />,
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: GIGW_EDIT_ICON,
      onClick: onEdit,
      render: () => <TableEditAction onClick={onEdit} ariaLabel={editAriaLabel} />,
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: Trash2,
      onClick: onDelete,
      render: () => <TableDeleteAction onClick={onDelete} ariaLabel={deleteAriaLabel} />,
    },
  ]
}
