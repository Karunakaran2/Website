import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Columns3 } from 'lucide-react'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { formCheckboxControlClass, formOptionLabelClass } from '@/shared/components/typography/typographyStyles'
import { DATATABLE_TOOLBAR_COLUMNS_BUTTON_CLASS } from '@/shared/components/DataTable/dataTableToolbarStyles'
import { TABLE_CHROME_TEXT_CLASS } from '@/shared/components/listing/listingTableStyles'

export default function DataTableColumnVisibilityMenu({
  columns = [],
  visibility = {},
  onToggleColumn,
  onSelectAll,
  onReset,
}) {
  const { t } = useTranslation()
  const menuId = useId()
  const rootRef = useRef(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return undefined
    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  if (!columns.length) return null

  return (
    <div className="relative shrink-0" ref={rootRef}>
      <GigwButton
        type="button"
        variant="secondary"
        size="sm"
        icon={Columns3}
        className={`${DATATABLE_TOOLBAR_COLUMNS_BUTTON_CLASS} whitespace-nowrap`}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        {t('table.columns', { defaultValue: 'Columns' })}
      </GigwButton>

      {open ? (
        <div
          id={menuId}
          role="dialog"
          aria-label={t('table.columnVisibility', { defaultValue: 'Column visibility' })}
          className="absolute right-0 top-[calc(100%+0.375rem)] z-[120] w-[min(18rem,calc(100vw-2rem))] rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-600 dark:bg-slate-900"
        >
          <div className={`mb-2 flex items-center justify-between gap-2 ${TABLE_CHROME_TEXT_CLASS}`}>
            <span className="font-semibold">
              {t('table.columnVisibility', { defaultValue: 'Column visibility' })}
            </span>
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                className="font-medium text-[#01458e] underline-offset-2 hover:underline"
                onClick={() => onSelectAll?.()}
              >
                {t('table.selectAllColumns', { defaultValue: 'Select all' })}
              </button>
              <button
                type="button"
                className="font-medium text-[#01458e] underline-offset-2 hover:underline"
                onClick={() => onReset?.()}
              >
                {t('table.resetColumns', { defaultValue: 'Reset' })}
              </button>
            </div>
          </div>

          <ul className="max-h-64 space-y-1 overflow-y-auto custom-scrollbar">
            {columns.map((column) => {
              const checked = visibility[column.id] !== false
              const inputId = `${menuId}-${column.id}`
              return (
                <li key={column.id}>
                  <label
                    htmlFor={inputId}
                    className={`flex min-h-[36px] cursor-pointer items-center gap-2 rounded-md px-1 py-1 hover:bg-slate-50 dark:hover:bg-slate-800 ${formOptionLabelClass}`}
                  >
                    <input
                      id={inputId}
                      type="checkbox"
                      className={formCheckboxControlClass}
                      checked={checked}
                      onChange={(event) => onToggleColumn?.(column.id, event.target.checked)}
                    />
                    <span className="min-w-0 truncate">{column.label}</span>
                  </label>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
