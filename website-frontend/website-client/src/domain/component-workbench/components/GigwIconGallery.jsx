import { useMemo, useState } from 'react'
import { GigwIconButton } from '@/shared/components/buttons/gigw'
import {
  GIGW_TOKEN_CATALOG,
  GIGW_TABLE_ROW_CATALOG,
} from '../constants/gigwIconCatalog'
import { WORKBENCH_PREVIEW_GRID_CLASS } from '../constants/workbenchPreviewStyles'
import WorkbenchDemoSection from './WorkbenchDemoSection'
import WorkbenchSubsectionTitle from './WorkbenchSubsectionTitle'
import {
  Calendar,
  Download,
  Filter,
  Search,
  Upload,
  FileText,
  AlertTriangle,
  Info,
} from 'lucide-react'

/** Toolbar / form Lucide icons — not GIGW row-action substitutes */
const COMMON_UI_LUCIDE = [
  { icon: Search, lucide: 'Search', label: 'Search (DataTable toolbar)' },
  { icon: Filter, lucide: 'Filter', label: 'Filter controls' },
  { icon: Download, lucide: 'Download', label: 'Download / export affordance' },
  { icon: Upload, lucide: 'Upload', label: 'Upload / import' },
  { icon: Calendar, lucide: 'Calendar', label: 'Date fields (with label)' },
  { icon: FileText, lucide: 'FileText', label: 'Document / file meta' },
  { icon: AlertTriangle, lucide: 'AlertTriangle', label: 'Warning alert' },
  { icon: Info, lucide: 'Info', label: 'Info alert' },
]

function IconTile({ icon: Icon, lucide, title, subtitle, footer, tone }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-slate-200 bg-white p-3 text-center shadow-2xs min-w-0">
      <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-50">
        {tone != null ? (
          <GigwIconButton
            icon={Icon}
            tone={tone}
            context="table"
            aria-label={title}
            title={title}
            onClick={() => {}}
          />
        ) : (
          <Icon size={20} className="text-[#01458e]" aria-hidden />
        )}
      </div>
      <div className="text-[12px] font-semibold text-slate-900 leading-tight">{title}</div>
      {subtitle ? (
        <div className="mt-1 text-[11px] text-slate-600 leading-snug">{subtitle}</div>
      ) : null}
      <div className="mt-1.5 font-mono text-[10px] text-slate-500 break-all">{lucide}</div>
      {footer ? (
        <div className="mt-1 font-mono text-[10px] text-[#01458e] break-all">{footer}</div>
      ) : null}
    </div>
  )
}

export default function GigwIconGallery({ showCommonUi = true, compact = false }) {
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()

  const filteredTokens = useMemo(() => {
    if (!q) return GIGW_TOKEN_CATALOG
    return GIGW_TOKEN_CATALOG.filter(
      (e) =>
        e.token.toLowerCase().includes(q)
        || e.lucide.toLowerCase().includes(q)
        || e.label.toLowerCase().includes(q)
        || e.purpose.toLowerCase().includes(q),
    )
  }, [q])

  const filteredRows = useMemo(() => {
    if (!q) return GIGW_TABLE_ROW_CATALOG
    return GIGW_TABLE_ROW_CATALOG.filter(
      (e) =>
        e.component.toLowerCase().includes(q)
        || e.lucide.toLowerCase().includes(q)
        || e.label.toLowerCase().includes(q),
    )
  }, [q])

  const filteredCommon = useMemo(() => {
    if (!q) return COMMON_UI_LUCIDE
    return COMMON_UI_LUCIDE.filter(
      (e) => e.lucide.toLowerCase().includes(q) || e.label.toLowerCase().includes(q),
    )
  }, [q])

  const intro = (
    <>
      Import workflow icons from{' '}
      <code className="text-[12px]">@/shared/components/buttons/gigw/gigwLucideIcons</code>. Edit uses{' '}
      <strong>SquarePen</strong> (<code className="text-[12px]">GIGW_EDIT_ICON</code>), not{' '}
      <code className="text-[12px]">Pencil</code>. Approve uses{' '}
      <code className="text-[12px]">CircleCheck</code> (<code className="text-[12px]">GIGW_FINALIZE_ICON</code>
      ), not a plain Check. Reject uses <code className="text-[12px]">XCircle</code>, not{' '}
      <code className="text-[12px]">X</code>.
    </>
  )

  return (
    <div className={`space-y-6 ${compact ? '' : 'pb-4'} w-full min-w-0`}>
      <WorkbenchDemoSection
        title="GIGW icon reference"
        description={compact ? null : intro}
      >
        {!compact ? (
          <>
            <label className="block text-[12px] font-semibold text-slate-700" htmlFor="gigw-icon-search">
              Filter icons
            </label>
            <input
              id="gigw-icon-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Token, Lucide name, or label…"
              className="input-field mt-1 mb-6 h-[40px] w-full max-w-md rounded-lg border border-slate-300 px-3 text-[13px]"
            />
          </>
        ) : null}

      <div>
        <WorkbenchSubsectionTitle title={`GIGW tokens (${filteredTokens.length})`} />
        <div className={`${WORKBENCH_PREVIEW_GRID_CLASS} sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3`}>
          {filteredTokens.map((entry) => (
            <IconTile
              key={entry.token}
              icon={entry.icon}
              lucide={entry.lucide}
              title={entry.label}
              subtitle={entry.purpose}
              footer={entry.token}
              tone="info"
            />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <WorkbenchSubsectionTitle title={`Table row action components (${filteredRows.length})`} />
        <div className={`${WORKBENCH_PREVIEW_GRID_CLASS} sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3`}>
          {filteredRows.map((entry) => (
            <IconTile
              key={entry.component}
              icon={entry.icon}
              lucide={entry.lucide}
              title={entry.label}
              subtitle={`tone="${entry.tone}"`}
              footer={entry.component}
              tone={entry.tone}
            />
          ))}
        </div>
      </div>

      {showCommonUi ? (
        <div className="mt-6">
          <WorkbenchSubsectionTitle title={`Common UI Lucide (${filteredCommon.length})`} />
          <p className="text-[12px] text-slate-600 mb-3">
            Toolbar, alerts, and forms — do not replace GIGW row-action mappings above.
          </p>
          <div className={`${WORKBENCH_PREVIEW_GRID_CLASS} sm:grid-cols-4 lg:grid-cols-8 gap-3`}>
            {filteredCommon.map((entry) => (
              <IconTile
                key={entry.lucide}
                icon={entry.icon}
                lucide={entry.lucide}
                title={entry.label}
              />
            ))}
          </div>
        </div>
      ) : null}
      </WorkbenchDemoSection>
    </div>
  )
}
