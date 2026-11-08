import StatusChip from '@/shared/components/status/StatusChip'
import {
  activeInactiveLabelFromRow,
  formatStatusLabel,
  yesNoLabel,
} from '@/shared/components/status/statusLabels'

const statusCellAlign = {
  headerClassName: '!text-center',
  cellClassName: '!text-center',
}

/** DataTable column — Active / Inactive from `activeStatus`, `isActive`, etc. */
export const LIST_COLUMN_ACTIVE_STATUS = {
  id: 'activeStatus',
  header: 'Status',
  ...statusCellAlign,
  cell: (row) => <StatusChip label={activeInactiveLabelFromRow(row)} />,
}

/** Same as LIST_COLUMN_ACTIVE_STATUS when the row uses boolean `isActive`. */
export const LIST_COLUMN_IS_ACTIVE_STATUS = {
  id: 'isActive',
  header: 'Status',
  ...statusCellAlign,
  cell: (row) => <StatusChip label={activeInactiveLabelFromRow(row)} />,
}

export function yesNoStatusColumn(id, header, valueFromRow) {
  return {
    id,
    header,
    ...statusCellAlign,
    cell: (row) => <StatusChip label={yesNoLabel(valueFromRow(row))} />,
  }
}

export function rawStatusColumn(id, header, valueFromRow) {
  return {
    id,
    header,
    ...statusCellAlign,
    cell: (row) => <StatusChip label={formatStatusLabel(valueFromRow(row))} />,
  }
}
