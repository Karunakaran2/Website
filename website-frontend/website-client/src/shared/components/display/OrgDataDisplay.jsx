import FormProfileSectionHeader from '@/shared/components/forms/FormProfileSectionHeader'
import { toUiLabelCase } from '@/shared/utils/uiLabelCase'
import {
  dataDisplayGridCellClass,
  dataDisplayGridColumnsClass,
  dataDisplayGridLabelClass,
  dataDisplayGridSpanClass,
  dataDisplayGridValueClass,
  dataDisplayShellClass,
  dataDisplayTableClass,
  dataDisplayTableLabelCellClass,
  dataDisplayTableValueCellClass,
} from './dataDisplayStyles'

/**
 * @typedef {object} OrgDataDisplayItem
 * @property {string} label
 * @property {import('react').ReactNode} [value]
 * @property {string} [id]
 * @property {boolean} [required]
 * @property {1|2|'full'} [span] — grid only: cell width (default 1)
 * @property {string} [valueClassName]
 * @property {string} [cellClassName]
 * @property {boolean} [labelTitleCase] — set to `false` to preserve custom `label` casing
 */

function formatOrgDataDisplayLabel(item) {
  if (!item?.label) return ''
  if (item.labelTitleCase === false) return item.label
  return toUiLabelCase(String(item.label))
}

function formatOrgDataDisplayTitle(title, titleTitleCase) {
  if (title == null || title === '') return title
  if (titleTitleCase === false) return title
  return toUiLabelCase(String(title))
}

function DataDisplayGridCell({ item }) {
  const label = formatOrgDataDisplayLabel(item)
  return (
    <div className={`${dataDisplayGridCellClass} ${item.cellClassName || ''}`.trim()}>
      <div className={dataDisplayGridLabelClass}>
        {label}
        {item.required ? <span className="text-rose-500"> *</span> : null}
      </div>
      <div className={`${dataDisplayGridValueClass} ${item.valueClassName || ''}`.trim()}>
        {item.value ?? '—'}
      </div>
    </div>
  )
}

function DataDisplayTableLayout({ title, titleTitleCase, items }) {
  const sectionTitle = formatOrgDataDisplayTitle(title, titleTitleCase)
  return (
    <>
      {sectionTitle ? <FormProfileSectionHeader title={sectionTitle} /> : null}
      <table className={dataDisplayTableClass}>
        {sectionTitle ? <caption className="sr-only">{sectionTitle}</caption> : null}
        <tbody>
          {items.map((item) => (
            <tr key={item.id || item.label}>
              <td className={dataDisplayTableLabelCellClass}>
                {formatOrgDataDisplayLabel(item)}
                {item.required ? <span className="text-rose-500"> *</span> : null}
              </td>
              <td className={`${dataDisplayTableValueCellClass} ${item.valueClassName || ''}`.trim()}>
                {item.value ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

/**
 * Org-standard read-only data display for view modals and detail panels.
 * Use `columns={1}` for a two-column table (label | value).
 * Use `columns={2}` or `columns={3}` for a responsive label/value grid.
 *
 * @param {object} props
 * @param {string} [props.title] — section heading
 * @param {OrgDataDisplayItem[]} props.items
 * @param {1|2|3} [props.columns=1]
 */
export default function OrgDataDisplay({
  title,
  titleTitleCase,
  items = [],
  rows,
  columns = 1,
  className = '',
}) {
  const displayItems = items.length ? items : rows || []

  if (!displayItems.length) {
    return null
  }

  const shellClass = `${dataDisplayShellClass} ${className}`.trim()

  if (columns <= 1) {
    return (
      <div className={shellClass}>
        <DataDisplayTableLayout title={title} titleTitleCase={titleTitleCase} items={displayItems} />
      </div>
    )
  }

  const sectionTitle = formatOrgDataDisplayTitle(title, titleTitleCase)

  return (
    <div className={shellClass}>
      {sectionTitle ? <FormProfileSectionHeader title={sectionTitle} /> : null}
      <div className={`grid ${dataDisplayGridColumnsClass(columns)}`}>
        {displayItems.map((item) => (
          <div
            key={item.id || item.label}
            className={dataDisplayGridSpanClass(columns, item.span ?? 1)}
          >
            <DataDisplayGridCell item={item} />
          </div>
        ))}
      </div>
    </div>
  )
}
