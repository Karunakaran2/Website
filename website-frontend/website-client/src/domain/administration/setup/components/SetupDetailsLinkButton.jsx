import { TableViewAction } from '@/shared/components/buttons/tableRowActions'
import { TABLE_CELL_TEXT_LINK_CLASS } from '@/shared/components/listing/listingTableStyles'

/**
 * Opens a setup details modal from a table cell.
 * Default: GIGW view icon. Pass `children` for a text link (e.g. office name on allocation tables).
 */
export default function SetupDetailsLinkButton({
  children,
  onClick,
  className = '',
  title = 'View',
  tooltip,
  ...props
}) {
  if (children != null && children !== '') {
    return (
      <button
        type="button"
        className={`${TABLE_CELL_TEXT_LINK_CLASS} ${className}`.trim()}
        onClick={onClick}
        title={title}
        {...props}
      >
        {children}
      </button>
    )
  }

  return (
    <TableViewAction
      type="button"
      className={className}
      onClick={onClick}
      title={title}
      tooltip={tooltip ?? title}
      aria-label={title}
      {...props}
    />
  )
}
