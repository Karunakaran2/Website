import { forwardRef, useCallback, useLayoutEffect, useRef } from 'react'
import { readOnlyTextareaClass } from './readOnlyFieldStyles'

/**
 * Slightly taller than {@link inputControlClass} (`h-11`); grows with content and `resize-y`.
 */
export const textareaControlClass =
  'input-field !mt-0 min-h-[3.5rem] box-border w-full max-h-[24rem] resize-y overflow-y-auto touch-manipulation rounded border border-slate-300 bg-white px-3 py-2.5 text-[13px] leading-normal text-slate-800 placeholder:text-slate-400 transition-colors focus:border-[#01458e] focus:outline-none focus:ring-1 focus:ring-[#01458e] disabled:cursor-not-allowed disabled:bg-white disabled:text-slate-500 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-[#01458e] dark:disabled:bg-slate-900'

const DEFAULT_MAX_HEIGHT_REM = 24
/** Floor height — ~2 lines at 13px + padding (slightly above single-line inputs) */
export const TEXTAREA_INPUT_MATCH_MIN_HEIGHT_PX = 56

function mergeRefs(...refs) {
  return (node) => {
    refs.forEach((item) => {
      if (!item) return
      if (typeof item === 'function') item(node)
      else item.current = node
    })
  }
}

export function resolveTextareaControlClassName({ readOnly, error, className = '' }) {
  const base = readOnly ? readOnlyTextareaClass : textareaControlClass
  const errorClass = error ? '!border-rose-400 focus:!border-rose-500 focus:!ring-rose-400' : ''
  const extra = className.includes('input-field')
    ? className.replace(/\binput-field\b/g, '').replace(/\s+/g, ' ').trim()
    : className
  return `${base} ${errorClass} ${extra}`.trim()
}

/** Grow with content; empty state uses CSS `min-h` + `rows`. */
export function syncTextareaHeight(
  textarea,
  { maxHeightRem = DEFAULT_MAX_HEIGHT_REM, minHeightPx = TEXTAREA_INPUT_MATCH_MIN_HEIGHT_PX } = {},
) {
  if (!textarea) {
    return
  }
  const raw = textarea.value ?? ''
  if (String(raw).length === 0) {
    textarea.style.height = ''
    return
  }
  const maxPx = maxHeightRem * 16
  textarea.style.height = 'auto'
  const next = Math.min(Math.max(textarea.scrollHeight, minHeightPx), maxPx)
  textarea.style.height = `${next}px`
}

const ProbityTextarea = forwardRef(function ProbityTextarea(
  {
    rows = 2,
    readOnly = false,
    disabled = false,
    error,
    className = '',
    autoGrow = true,
    maxHeightRem = DEFAULT_MAX_HEIGHT_REM,
    value,
    onChange,
    onInput,
    style,
    ...props
  },
  ref,
) {
  const innerRef = useRef(null)
  const shouldAutoGrow = autoGrow && !disabled

  const syncHeight = useCallback(() => {
    if (!shouldAutoGrow && !readOnly) {
      return
    }
    syncTextareaHeight(innerRef.current, { maxHeightRem })
  }, [maxHeightRem, readOnly, shouldAutoGrow])

  useLayoutEffect(() => {
    syncHeight()
  }, [value, rows, syncHeight])

  const handleInput = (event) => {
    onInput?.(event)
    syncHeight()
  }

  const handleChange = (event) => {
    onChange?.(event)
    syncHeight()
  }

  return (
    <textarea
      ref={mergeRefs(ref, innerRef)}
      rows={rows}
      readOnly={readOnly}
      disabled={disabled}
      value={value}
      aria-invalid={error ? true : undefined}
      aria-readonly={readOnly || undefined}
      className={resolveTextareaControlClassName({ readOnly, error, className })}
      onInput={handleInput}
      onChange={handleChange}
      style={style}
      {...props}
    />
  )
})

export default ProbityTextarea
