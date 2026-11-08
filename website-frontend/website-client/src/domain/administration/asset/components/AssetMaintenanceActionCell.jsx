import { Eye } from 'lucide-react'
import {
  GIGW_EDIT_ICON,
  TableDeleteAction,
  TableEditAction,
  TableRowActionsGroup,
  TableViewAction,
} from '@/shared/components/buttons'
import { isMaintenanceApproved } from '../constants/assetMaintenance'
import { canEditAssetMaintenanceFromList } from '../utils/assetMaintenanceFormFooterActions'

export default function AssetMaintenanceActionCell({ row, onView, onEdit, onDelete }) {
  const label = row.assetId || 'maintenance record'
  const isDraft = !isMaintenanceApproved(row.approve)
  const canEdit = isDraft && canEditAssetMaintenanceFromList(row)

  const items = [
    {
      key: 'view',
      label: 'View',
      icon: Eye,
      onClick: () => onView(row),
      render: () => (
        <TableViewAction
          type="button"
          aria-label={`View ${label}`}
          title="View"
          onClick={() => onView(row)}
        />
      ),
    },
  ]

  if (canEdit && onEdit) {
    items.push({
      key: 'edit',
      label: 'Edit',
      icon: GIGW_EDIT_ICON,
      onClick: () => onEdit(row),
      render: () => (
        <TableEditAction
          type="button"
          aria-label={`Edit ${label}`}
          title="Edit"
          onClick={() => onEdit(row)}
        />
      ),
    })
  }

  if (isDraft && onDelete) {
    items.push({
      key: 'delete',
      label: 'Delete',
      onClick: () => onDelete(row),
      render: () => (
        <TableDeleteAction
          type="button"
          aria-label={`Delete ${label}`}
          title="Delete"
          onClick={() => onDelete(row)}
        />
      ),
    })
  }

  return <TableRowActionsGroup className="justify-center" items={items} />
}
