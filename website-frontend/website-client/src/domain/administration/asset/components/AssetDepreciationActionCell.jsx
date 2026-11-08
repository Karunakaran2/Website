import { Eye } from 'lucide-react'
import { TableRowActionsGroup, TableViewAction } from '@/shared/components/buttons'

export default function AssetDepreciationActionCell({ row, onView }) {
  const label = row.depreciationNumber || row.depreciationNo || 'depreciation'

  return (
    <TableRowActionsGroup
      className="justify-center"
      items={[
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
      ]}
    />
  )
}
