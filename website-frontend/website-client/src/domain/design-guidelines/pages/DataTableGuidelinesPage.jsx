import { Link } from 'react-router-dom'
import GuidelineCard from '../components/GuidelineCard'

export default function DataTableGuidelinesPage() {
  return (
    <div className="space-y-6 pb-12 w-full">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">DataTable Standards</h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-3xl leading-relaxed">
          All enterprise listings use the shared <code className="text-xs">DataTable</code> from{' '}
          <code className="text-xs">@/shared/components</code>. Column definitions use{' '}
          <code className="text-xs">id</code>, <code className="text-xs">header</code>, and{' '}
          <code className="text-xs">accessor</code> (not legacy <code className="text-xs">key</code> /{' '}
          <code className="text-xs">label</code>).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <GuidelineCard title="Toolbar & Pagination" badge="DataTable">
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            <li>Page-size control label: <strong>Rows per page</strong> with options 10, 25, 50, 100.</li>
            <li>Pass <code className="text-[11px]">page</code>, <code className="text-[11px]">pageSize</code>,{' '}
              <code className="text-[11px]">total</code>, <code className="text-[11px]">onPageChange</code>, and{' '}
              <code className="text-[11px]">onPageSizeChange</code>; reset page to 1 when filters change.</li>
            <li>Empty message: <em>No data available in table</em> (or a context-specific variant).</li>
          </ul>
        </GuidelineCard>

        <GuidelineCard title="Columns & Alignment" badge="GIGW">
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            <li>Text and codes: <code className="text-[11px]">align: 'left'</code> (default).</li>
            <li>Amounts and quantities: <code className="text-[11px]">align: 'right'</code> with{' '}
              <code className="text-[11px]">tabular-nums</code> or <code className="text-[11px]">format: 'currency'</code>.</li>
            <li>Serial, status, actions: <code className="text-[11px]">align: 'center'</code>.</li>
            <li>Action column: <code className="text-[11px]">TABLE_ACTION_COLUMN_CLASS</code> on header and cells.</li>
          </ul>
        </GuidelineCard>

        <GuidelineCard title="Row Actions" badge="Actions">
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            <li>Use <code className="text-[11px]">TableRowActionsGroup</code> with GIGW icon actions.</li>
            <li>One or two actions: show inline icon buttons only. More than two: first two inline plus ⋮ overflow with icon + label items.</li>
            <li>Approve, verify, and reject use workflow icons — not delete for reject.</li>
            <li>Icon-only controls require <code className="text-[11px]">aria-label</code> and tooltips.</li>
          </ul>
        </GuidelineCard>

        <GuidelineCard title="Column Visibility & Toolbar" badge="DataTable">
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            <li>
              Column visibility menu is on by default (<code className="text-[11px]">enableColumnVisibility</code>).
              Non-pinned columns (not serial, status, or action) appear in the menu.
            </li>
            <li>Set <code className="text-[11px]">hideable: false</code> on columns that must always stay visible.</li>
            <li>
              Toolbar layout matches Probity: <strong>Show</strong> + page size + <strong>entries per page</strong> on
              the left; <strong>Search</strong> input and <strong>Columns</strong> menu grouped on the right. Wire{' '}
              <code className="text-[11px]">search</code> / <code className="text-[11px]">onSearchChange</code> on{' '}
              <code className="text-[11px]">DataTable</code> — do not duplicate search in the page header.
            </li>
            <li>
              String headers are normalized to Title Case via <code className="text-[11px]">toUiLabelCase</code>; pass{' '}
              <code className="text-[11px]">headerTitleCase: false</code> to preserve custom casing. Prefer{' '}
              <code className="text-[11px]">dataTableColumn</code> from{' '}
              <code className="text-[11px]">@/shared/utils/buildDataTableColumn</code> for new list screens.
            </li>
          </ul>
        </GuidelineCard>

        <GuidelineCard title="Search & Export" badge="Integration">
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            <li>
              Page header: filter and export via <code className="text-[11px]">useListPageHeaderActions</code>; table
              search stays in <code className="text-[11px]">DataTable</code> toolbar next to Columns.
            </li>
            <li>Export filtered rows with <code className="text-[11px]">exportTableCsv</code> — never fake success toasts.</li>
            <li>Read-only grids in modals: <code className="text-[11px]">OrgDataTable</code> /{' '}
              <code className="text-[11px]">ProbityDataTable</code>.</li>
          </ul>
          <p className="mt-3 text-xs">
            <Link className="font-semibold text-[#01458e] hover:underline" to="/component-workbench/data-display/tables">
              Tables demonstration
            </Link>
            {' · '}
            <Link className="font-semibold text-[#01458e] hover:underline" to="/component-workbench/lib-playgrounds/table-playground">
              Table playground
            </Link>
            {' · '}
            <Link className="font-semibold text-[#01458e] hover:underline" to="/component-workbench/data-display/report-overview">
              Report overview (table + export)
            </Link>
          </p>
        </GuidelineCard>
      </div>
    </div>
  )
}
