import { useEffect, useId, useRef, useState } from 'react'
import { InputField } from '@/shared/components/forms'
import { useLazyListDepreciationCategorySuggestionsQuery } from '../services/assetApi'

export default function AssetDepreciationCategorySearch({
  category,
  value,
  onChange,
  error,
}) {
  const listId = useId()
  const wrapperRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [fetchSuggestions, { data: suggestions = [] }] =
    useLazyListDepreciationCategorySuggestionsQuery()

  useEffect(() => {
    if (!category) {
      return
    }
    fetchSuggestions({ category, query: value })
  }, [category, value, fetchSuggestions])

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const pick = (item) => {
    onChange(item)
    setOpen(false)
  }

  return (
    <div ref={wrapperRef} className="relative min-w-0">
      <InputField
        label="Category value"
        name="categoryList"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setOpen(true)}
        placeholder="Type to search…"
        required
        error={error}
        autoComplete="off"
        aria-expanded={open && suggestions.length > 0}
        aria-controls={listId}
      />
      {open && suggestions.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-md dark:border-slate-600 dark:bg-slate-900"
        >
          {suggestions.map((item) => (
            <li key={item} role="option">
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => pick(item)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
