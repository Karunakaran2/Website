import { Eye, UserPlus } from 'lucide-react'
import {
  GIGW_EDIT_ICON,
  GigwIconButton,
  TableEditAction,
  TableRowActionsGroup,
  TableViewAction,
} from '@/shared/components/buttons'
import { isViewAllAssetNotAllocated } from '../constants/assetViewAll'

export default function AssetViewAllActionCell({ row, onView, onEdit, onAllocate }) {
  const label = row.assetId || 'asset'
  const showAllocate = isViewAllAssetNotAllocated(row) && onAllocate

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
    {
      key: 'edit',
      label: 'Edit',
      icon: GIGW_EDIT_ICON,
      onClick: () => onEdit(row),
      render: () => (
        <TableEditAction
          type="button"
          aria-label={`Edit description for ${label}`}
          title="Edit"
          onClick={() => onEdit(row)}
        />
      ),
    },
  ]

  if (showAllocate) {
    items.push({
      key: 'allocate',
      label: 'Allocate',
      icon: UserPlus,
      onClick: () => onAllocate(row),
      render: () => (
        <GigwIconButton
          type="button"
          icon={UserPlus}
          tone="primary"
          tooltip="Allocate"
          aria-label={`Allocate ${label}`}
          onClick={() => onAllocate(row)}
        />
      ),
    })
  }

  return <TableRowActionsGroup className="justify-center" items={items} />
}
