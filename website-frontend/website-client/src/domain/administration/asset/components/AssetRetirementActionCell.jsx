import { Eye } from 'lucide-react'
import {
  TableDeleteAction,
  TableEditAction,
  TableRowActionsGroup,
  TableViewAction,
} from '@/shared/components/buttons'
import {
  canDeleteAssetDisposalFromList,
  canEditAssetDisposalFromList,
} from '../utils/assetDisposalFormFooterActions'

export default function AssetRetirementActionCell({ row, onView, onEdit, onDelete }) {
  const label = row.assetId || 'asset'
  const showEdit = canEditAssetDisposalFromList(row) && onEdit
  const showDelete = canDeleteAssetDisposalFromList(row) && onDelete

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

  if (showEdit) {
    items.push({
      key: 'edit',
      label: 'Edit',
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

  if (showDelete) {
    items.push({
      key: 'delete',
      label: 'Delete',
      onClick: () => onDelete(row),
      render: () => (
        <TableDeleteAction
          type="button"
          aria-label={`Remove ${label} from disposal`}
          title="Delete"
          onClick={() => onDelete(row)}
        />
      ),
    })
  }

  return <TableRowActionsGroup className="justify-center" items={items} />
}
