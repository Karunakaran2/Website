import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { MoreVertical } from 'lucide-react'
import GigwIconButton from './gigw/GigwIconButton'
import { TABLE_ROW_ACTIONS_CLASS } from './tableRowActions'

/** More than two actions → show two inline icon buttons + ⋮ overflow for the rest. */
const OVERFLOW_THRESHOLD = 2
const INLINE_VISIBLE_WHEN_OVERFLOW = 2

function placeOverflowMenu(anchor, menu) {
  const rect = anchor.getBoundingClientRect()
  const menuWidth = menu?.offsetWidth ?? 176
  const menuHeight = menu?.offsetHeight ?? 0
  const gap = 4
  let top = rect.bottom + gap
  if (menuHeight && top + menuHeight > window.innerHeight - 8 && rect.top - gap - menuHeight > 8) {
    top = rect.top - gap - menuHeight
  }
  let left = rect.right - menuWidth
  if (left < 8) {
    left = 8
  }
  if (left + menuWidth > window.innerWidth - 8) {
    left = Math.max(8, window.innerWidth - 8 - menuWidth)
  }
  return { top, left }
}

function TableRowActionsOverflowMenu({ items }) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState(null)
  const rootRef = useRef(null)
  const menuRef = useRef(null)
  const menuId = useId()

  const close = useCallback(() => setOpen(false), [])

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null)
      return undefined
    }

    const update = () => {
      const anchor = rootRef.current
      if (!anchor) {
        return
      }
      const next = placeOverflowMenu(anchor, menuRef.current)
      setCoords((previous) => (
        previous && previous.top === next.top && previous.left === next.left
          ? previous
          : next
      ))
    }

    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open, items])

  useEffect(() => {
    if (!open) {
      return undefined
    }
    const onPointerDown = (event) => {
      const target = event.target
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return
      }
      close()
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        close()
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [close, open])

  return (
    <div ref={rootRef} className="relative inline-flex shrink-0">
      <GigwIconButton
        type="button"
        icon={MoreVertical}
        tone="system"
        context="table"
        tooltip="More actions"
        aria-label="More actions"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        onClick={() => setOpen((previous) => !previous)}
      />
      {open
        ? createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            style={{
              top: coords?.top ?? 0,
              left: coords?.left ?? 0,
              visibility: coords ? 'visible' : 'hidden',
            }}
            className="fixed z-[1200] min-w-[12.5rem] rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-600 dark:bg-slate-800"
          >
            {items.map((item) => {
              const Icon = item.icon
              const label = item.label || item.key
              const isDestructive =
                item.destructive === true ||
                item.tone === 'danger' ||
                item.tone === 'delete' ||
                item.key === 'delete' ||
                item.key === 'reject'
              return (
                <button
                  key={item.key}
                  type="button"
                  role="menuitem"
                  className={`flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700/60 ${
                    isDestructive
                      ? 'text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/40'
                      : 'text-slate-700 dark:text-slate-200'
                  }`}
                  onClick={() => {
                    item.onClick?.()
                    close()
                  }}
                >
                  {Icon ? (
                    <span
                      className={`inline-flex size-5 shrink-0 items-center justify-center ${
                        isDestructive ? 'text-rose-600 dark:text-rose-400' : 'text-[#005a9c]'
                      }`}
                    >
                      <Icon size={16} strokeWidth={2} aria-hidden />
                    </span>
                  ) : null}
                  <span className="min-w-0 flex-1">{label}</span>
                </button>
              )
            })}
          </div>,
          document.body,
        )
        : null}
    </div>
  )
}

/**
 * Row action toolbar — always one line (`flex-nowrap`).
 * When more than 2 actions: first 2 icons inline, remaining actions in ⋮ menu with labels.
 *
 * @param {Array<{ key: string, label: string, icon?: import('react').ComponentType, onClick?: () => void, render: () => import('react').ReactNode }>} items
 */
export default function TableRowActionsGroup({ items = [], children, className = '' }) {
  if (children && (!items || items.length === 0)) {
    return (
      <div className={`${TABLE_ROW_ACTIONS_CLASS} ${className}`.trim()}>
        {children}
      </div>
    )
  }

  const safeItems = Array.isArray(items) ? items.filter(Boolean) : []
  const useOverflow = safeItems.length > OVERFLOW_THRESHOLD
  const inlineItems = useOverflow
    ? safeItems.slice(0, INLINE_VISIBLE_WHEN_OVERFLOW)
    : safeItems
  const overflowItems = useOverflow
    ? safeItems.slice(INLINE_VISIBLE_WHEN_OVERFLOW)
    : []

  return (
    <div className={`${TABLE_ROW_ACTIONS_CLASS} ${className}`.trim()}>
      {inlineItems.map((item) => (
        <span key={item.key} className="inline-flex shrink-0">
          {typeof item.render === 'function' ? item.render() : item.render}
        </span>
      ))}
      {overflowItems.length > 0 ? (
        <TableRowActionsOverflowMenu items={overflowItems} />
      ) : null}
    </div>
  )
}

export { OVERFLOW_THRESHOLD, INLINE_VISIBLE_WHEN_OVERFLOW }
