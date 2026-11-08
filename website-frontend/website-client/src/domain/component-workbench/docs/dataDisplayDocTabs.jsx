import { StatusChip } from '@/shared/components/status'
import { WORKBENCH_PREVIEW_ROW_CLASS } from '../constants/workbenchPreviewStyles'

export function dataDisplayPreviewForTab(tab) {
  switch (tab) {
    case 'badges-status':
      return (
        <div className={`${WORKBENCH_PREVIEW_ROW_CLASS} gap-2`}>
          <StatusChip label="Approved" />
          <StatusChip label="Pending" />
          <StatusChip label="Rejected" />
        </div>
      )
    case 'tables':
      return (
        <p className="text-sm text-slate-600">
          Shared <code>DataTable</code>: search, sort, page size, column visibility, empty message{' '}
          <code>No data available in table</code>.
        </p>
      )
    case 'pagination':
      return (
        <p className="text-sm text-slate-600">
          <code>TablePaginationBar</code> — Showing X to Y of Z entries; keep in sync with server total when using APIs.
        </p>
      )
    case 'report-overview':
      return (
        <p className="text-sm text-slate-600">
          <code>ReportSplitLayout</code> + catalog grid + workspace tabs — aligned with Probity report overview pattern.
        </p>
      )
    case 'accordions-tabs':
      return <p className="text-sm text-slate-600">Module routing uses SecondaryNav tabs; in-page tabs only for report workspace.</p>
    case 'cards':
    default:
      return (
        <div className="max-w-sm rounded-lg border border-slate-200 bg-white p-4 shadow-none">
          <p className="text-xs font-medium text-slate-500">Metric</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">12,480</p>
          <p className="mt-1 text-xs text-slate-600">Sample summary card surface</p>
        </div>
      )
  }
}

export function dataDisplayCodeForTab(tab) {
  if (tab === 'tables') {
    return `import DataTable from '@/shared/components/DataTable'

<DataTable rowKey="idMask" columns={columns} rows={rows} emptyMessage="No data available in table" />`
  }
  if (tab === 'badges-status') {
    return `import { StatusChip } from '@/shared/components/status'

<StatusChip label="Submitted" status="info" />`
  }
  return `import { PAGE_SECTION_SHELL_CLASS } from '@/shared/components/page/pageHeaderStyles'`
}

export function dataDisplayUsageForTab(tab) {
  if (tab === 'tables') {
    return (
      <p>
        Amount columns: <code>format: &apos;currency&apos;</code> or <code>align: &apos;right&apos;</code>. Action column:{' '}
        <code>TABLE_ACTION_COLUMN_CLASS</code>.
      </p>
    )
  }
  return <p>Prefer shared display components over hand-rolled HTML tables in domain modules.</p>
}
