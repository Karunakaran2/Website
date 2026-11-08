import { Eye } from 'lucide-react'
import {
  GIGW_EDIT_ICON,
  TableEditAction,
  TableRowActionsGroup,
  TableViewAction,
} from '@/shared/components/buttons'
import { canEditAssetInformationFromList } from '../utils/assetInformationFormFooterActions'

export default function AssetInformationActionCell({
  row,
  onView,
  onEdit,
}) {
  const label = row.assetId || row.assetDescription || 'asset'
  const canEdit = canEditAssetInformationFromList(row)

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

  if (canEdit) {
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

  return <TableRowActionsGroup className="justify-start" items={items} />
}
