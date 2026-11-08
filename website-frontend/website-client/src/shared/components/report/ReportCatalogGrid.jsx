import { useMemo, useState } from 'react'
import { InputField } from '@/shared/components/forms'

/**
 * Searchable grid of report entry tiles (Probity ReportCatalog pattern).
 * @param {{ id: string, label: string }[]} reports
 * @param {(id: string) => void} onSelect
 */
export default function ReportCatalogGrid({
  reports = [],
  onSelect,
  searchLabel = 'Search Reports',
  searchPlaceholder = 'Search by report name…',
  emptyMessage = 'No reports match your search.',
}) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return reports
    return reports.filter((r) => r.label.toLowerCase().includes(q))
  }, [reports, search])

  return (
    <div className="w-full min-w-0">
      <div className="mb-4 max-w-xs">
        <InputField
          label={searchLabel}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={searchPlaceholder}
        />
      </div>
      {filtered.length === 0 ? (
        <p className="m-0 text-sm text-slate-500">{emptyMessage}</p>
      ) : (
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((report) => (
            <button
              key={report.id}
              type="button"
              onClick={() => onSelect(report.id)}
              className="min-h-[4.5rem] w-full rounded-xl border border-slate-200 bg-white px-4 py-5 text-left text-sm font-semibold uppercase tracking-wide text-[#01458e] shadow-sm transition hover:border-[#01458e] hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#01458e]"
            >
              {report.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
