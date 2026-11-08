import { TABLE_ACTION_COLUMN_CLASS } from '@/shared/components/listing/listingTableStyles'

/**
 * Builds a DataTable column definition. Omit `header` to derive a Title Case label from `id`
 * (see `formatDataTableHeaderLabel` at render time).
 *
 * @param {object} def
 * @param {string} def.id
 * @param {string} [def.header]
 * @param {string} [def.accessor]
 * @param {boolean} [def.headerTitleCase]
 */
export function dataTableColumn(def) {
  if (!def?.id) {
    throw new Error('dataTableColumn requires an id')
  }
  const { id, header, accessor, ...rest } = def
  const column = { id, ...rest }
  if (accessor !== undefined) {
    column.accessor = accessor
  } else if (!Object.prototype.hasOwnProperty.call(def, 'cell')) {
    column.accessor = id
  }
  if (header !== undefined) {
    column.header = header
  }
  return column
}

/** Standard centered action column for list tables. */
export function dataTableActionColumn({ cell, id = 'action', header = 'Action' } = {}) {
  return dataTableColumn({
    id,
    header,
    align: 'center',
    headerClassName: TABLE_ACTION_COLUMN_CLASS,
    cellClassName: TABLE_ACTION_COLUMN_CLASS,
    hideable: false,
    cell,
  })
}

export function dataTableColumns(defs) {
  return defs.map((def) => dataTableColumn(def))
}
