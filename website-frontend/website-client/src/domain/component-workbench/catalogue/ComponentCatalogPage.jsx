import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ExternalLink, AlertCircle, CheckCircle2, CircleDashed } from 'lucide-react'
import { getModuleRoute } from '@/shared/constants'
import {
  WORKBENCH_CATALOG_CATEGORIES,
  WORKBENCH_COMPONENT_CATALOG,
  getCatalogStats,
  getCategoryLabel,
  searchWorkbenchCatalog,
} from './workbenchComponentRegistry'
import { WORKBENCH_SECTION_CARD_CLASS } from '../constants/workbenchPreviewStyles'

const STATUS_META = {
  interactive: {
    label: 'Interactive demo',
    icon: CheckCircle2,
    className: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  grouped: {
    label: 'On shared demo page',
    icon: CheckCircle2,
    className: 'text-teal-700 bg-teal-50 border-teal-200',
  },
  'docs-only': {
    label: 'Docs only',
    icon: CircleDashed,
    className: 'text-slate-600 bg-slate-50 border-slate-200',
  },
  partial: {
    label: 'Partial / shell',
    icon: AlertCircle,
    className: 'text-amber-700 bg-amber-50 border-amber-200',
  },
  'not-in-repo': {
    label: 'Not implemented',
    icon: AlertCircle,
    className: 'text-rose-700 bg-rose-50 border-rose-200',
  },
}

function DemoStatusBadge({ status }) {
  const meta = STATUS_META[status] ?? STATUS_META['docs-only']
  const Icon = meta.icon
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${meta.className}`}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden />
      {meta.label}
    </span>
  )
}

export default function ComponentCatalogPage() {
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const stats = useMemo(() => getCatalogStats(), [])

  const filtered = useMemo(() => {
    let list = searchWorkbenchCatalog(query)
    if (categoryFilter !== 'all') {
      list = list.filter((e) => e.category === categoryFilter)
    }
    return list.slice().sort((a, b) => a.name.localeCompare(b.name))
  }, [query, categoryFilter])

  return (
    <div className="space-y-6 pb-12 w-full min-w-0">
      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h2 className="text-base font-bold text-slate-900">Component catalog</h2>
        <p className="mt-1 text-[13px] text-slate-600 leading-relaxed max-w-3xl">
          Search and browse every reusable visual component registered in the KRAN shared library.
          Each entry links to a live demo when available. This catalogue is maintained in{' '}
          <code className="text-[12px]">workbenchComponentRegistry.js</code> and verified against
          workbench routes in CI.
        </p>
        <dl className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
          <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
            <dt className="text-slate-500 font-medium">Components tracked</dt>
            <dd className="text-lg font-bold text-slate-900 tabular-nums">{stats.total}</dd>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
            <dt className="text-slate-500 font-medium">Categories</dt>
            <dd className="text-lg font-bold text-slate-900 tabular-nums">{stats.categories}</dd>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
            <dt className="text-slate-500 font-medium">With live / grouped demo</dt>
            <dd className="text-lg font-bold text-[#01458e] tabular-nums">{stats.interactiveOrGrouped}</dd>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
            <dt className="text-slate-500 font-medium">Gaps (partial / missing)</dt>
            <dd className="text-lg font-bold text-amber-800 tabular-nums">{stats.missingPreviewCount}</dd>
          </div>
        </dl>
      </div>

      <div className={`${WORKBENCH_SECTION_CARD_CLASS} flex flex-col gap-4 sm:flex-row sm:items-end`}>
        <div className="flex-1 min-w-0">
          <label htmlFor="catalog-search" className="block text-[12px] font-semibold text-slate-700 mb-1">
            Search components
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <input
              id="catalog-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name, keyword, or import path…"
              className="input-field h-[44px] w-full rounded-lg border border-slate-300 pl-10 pr-3 text-[13px]"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="w-full sm:w-56 min-w-0">
          <label htmlFor="catalog-category" className="block text-[12px] font-semibold text-slate-700 mb-1">
            Category
          </label>
          <select
            id="catalog-category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-field h-[44px] w-full rounded-lg border border-slate-300 px-3 text-[13px]"
          >
            <option value="all">All categories</option>
            {WORKBENCH_CATALOG_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-[12px] text-slate-600">
        Showing <strong className="tabular-nums">{filtered.length}</strong> of{' '}
        <strong className="tabular-nums">{stats.total}</strong> components
      </p>

      <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {filtered.map((entry) => {
          const routePath = entry.routeKey
            ? getModuleRoute(...entry.routeKey.split(':'))
            : null
          return (
            <li
              key={entry.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs min-w-0"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <h3 className="text-[14px] font-bold text-slate-900">{entry.name}</h3>
                <DemoStatusBadge status={entry.demoStatus} />
              </div>
              <p className="text-[12px] text-slate-500 font-medium mb-1">
                {getCategoryLabel(entry.category)}
              </p>
              <p className="text-[13px] text-slate-700 leading-relaxed mb-2">{entry.description}</p>
              <p className="text-[12px] text-slate-600 mb-3">
                <span className="font-semibold text-slate-700">When to use: </span>
                {entry.purpose}
              </p>
              {entry.importPath ? (
                <p className="text-[11px] font-mono text-slate-500 mb-3 truncate" title={entry.importPath}>
                  {entry.importPath}
                </p>
              ) : null}
              {routePath ? (
                <Link
                  to={routePath}
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#01458e] hover:underline"
                >
                  Open demo
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </Link>
              ) : (
                <span className="text-[12px] text-slate-500 italic">No dedicated demo route</span>
              )}
            </li>
          )
        })}
      </ul>

      {filtered.length === 0 ? (
        <p className="text-center text-[13px] text-slate-600 py-8">No components match your search.</p>
      ) : null}
    </div>
  )
}
