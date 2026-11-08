import { PlusCircle, Trash2 } from 'lucide-react'
import GigwIconButton from './GigwIconButton'

/**
 * Standard GIGW trash + circle-plus row actions with tooltips (form grids / modals).
 * Remove is always shown unless `showRemove` is false; add shows on last row via `showAdd` or `onAdd`.
 */
export default function GigwFormIconRowActions({
  canRemove = true,
  showRemove = true,
  showAdd,
  onRemove,
  onAdd,
  removeLabel = 'Remove row',
  addLabel = 'Add row',
  disabled = false,
  /** Keeps column alignment when add is hidden on non-last rows. */
  reserveAddSlot = true,
  className = 'flex items-center gap-1 pb-0',
}) {
  const showAddButton = showAdd ?? Boolean(onAdd)

  return (
    <div className={className}>
      {showRemove && onRemove ? (
        <GigwIconButton
          icon={Trash2}
          tone="destructive"
          type="button"
          aria-label={removeLabel}
          title={removeLabel}
          disabled={!canRemove || disabled}
          onClick={onRemove}
        />
      ) : null}
      {showAddButton && onAdd ? (
        <GigwIconButton
          icon={PlusCircle}
          tone="info"
          type="button"
          aria-label={addLabel}
          title={addLabel}
          disabled={disabled}
          onClick={onAdd}
        />
      ) : reserveAddSlot ? (
        <span className="inline-block size-9 shrink-0 max-md:size-11 min-[1600px]:size-10" aria-hidden="true" />
      ) : null}
    </div>
  )
}
