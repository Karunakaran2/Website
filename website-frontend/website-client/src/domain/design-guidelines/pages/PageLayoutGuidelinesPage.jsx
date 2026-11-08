import { Link } from 'react-router-dom'
import GuidelineCard from '../components/GuidelineCard'
import { getModuleRoute } from '@/shared/constants'

export default function PageLayoutGuidelinesPage() {
  return (
    <div className="space-y-6 pb-12 w-full">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Page Layout, Headers, and Reports</h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-3xl leading-relaxed">
          KRAN module pages use the dashboard shell{' '}
          <code className="text-xs">PageSectionHeaderBar</code> for title, subtitle, and right-side actions.
          Report modules follow the Probity split layout: filter criteria card on the left, results on the right.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <GuidelineCard title="In-page section headings" badge="Probity parity">
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            <li>
              Match Probity voucher sections (e.g. “Sales voucher information”):{' '}
              <code className="text-[11px]">FormProfileSection</code> or{' '}
              <code className="text-[11px]">ModuleInnerCard</code> — #F4FAFF band, 16px semibold title, optional 16px Lucide icon.
            </li>
            <li>
              Multi-block forms: one card per section (setup uses <code className="text-[11px]">SetupFormSection</code>; reports use{' '}
              <code className="text-[11px]">ReportSplitLayout</code> + <code className="text-[11px]">FormProfileSection</code>).
            </li>
            <li>
              Do not use ad-hoc <code className="text-[11px]">text-sm font-bold</code> headers inside bordered panels — use shared section chrome.
            </li>
            <li>
              Page shell title stays <code className="text-[11px]">PageSectionHeaderBar</code> (20px navy) — inner sections use the card pattern above.
            </li>
          </ul>
        </GuidelineCard>

        <GuidelineCard title="Page Header" badge="Layout">
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            <li>Title and subtitle come from the route registry and i18n — do not duplicate an in-page H1 unless the screen is a standalone demo.</li>
            <li>
              Register right-side controls with{' '}
              <code className="text-[11px]">useListPageHeaderActions</code> — category filter and export only.
            </li>
            <li>
              List search: pass <code className="text-[11px]">search</code> /{' '}
              <code className="text-[11px]">onSearchChange</code> on <code className="text-[11px]">DataTable</code>{' '}
              (toolbar, right of Columns). Non-table pages use{' '}
              <code className="text-[11px]">PageContentToolbar</code> +{' '}
              <code className="text-[11px]">PageToolbarSearchInput</code>.
            </li>
          </ul>
        </GuidelineCard>

        <GuidelineCard title="Report Overview Pattern" badge="Probity parity">
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            <li>
              Use{' '}
              <code className="text-[11px]">ReportSplitLayout</code>,{' '}
              <code className="text-[11px]">ReportTypeSelect</code>, and{' '}
              <code className="text-[11px]">ReportFilterFooter</code> from{' '}
              <code className="text-[11px]">@/shared/components/report</code>.
            </li>
            <li>Validate filters before generate; show inline errors — no toast for client validation.</li>
            <li>Empty results area until generate succeeds; then KPI cards, charts, and tabular detail.</li>
            <li>Export must produce a real file (CSV/Excel); print/PDF may use the browser print dialog on the results region.</li>
            <li>
              View modals use <code className="text-[11px]">OrgDataDisplay</code> — field labels are Title Cased automatically
              (opt out with <code className="text-[11px]">labelTitleCase: false</code> on an item).
            </li>
          </ul>
          <p className="mt-3 text-xs">
            <Link className="font-semibold text-[#01458e] hover:underline" to="/component-workbench/data-display/report-overview">
              Open live Report Overview demo
            </Link>
          </p>
        </GuidelineCard>

        <GuidelineCard title="Internal Tabs" badge="Navigation">
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            <li>Use shell secondary navigation for module tabs — avoid duplicating pill nav inside page content.</li>
            <li>
              Shell tabs are <code className="text-[11px]">NavLink</code> targets only — no Redux{' '}
              <code className="text-[11px]">onClick</code> nav updates (required for Ctrl+click / new tab isolation).
            </li>
            <li>
              Detail screens and report hubs may use <code className="text-[11px]">EnterpriseDetailTabs</code> (for example
              catalog vs generate workspace on the report demo).
            </li>
            <li>Active tab: visible focus ring and <code className="text-[11px]">aria-current</code> where applicable.</li>
          </ul>
        </GuidelineCard>

        <GuidelineCard title="Main scroll region" badge="Mandatory">
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            <li>
              Module body scrolls inside <code className="text-[11px]">#main-content</code> — mount{' '}
              <code className="text-[11px]">AppScrollManager</code> at the app root.
            </li>
            <li>
              Route changes scroll the main region to top; browser Back restores saved position when available (
              <code className="text-[11px]">appScrollContainer.js</code>).
            </li>
            <li>
              Inline add/edit on list pages: <code className="text-[11px]">useInlineFormScroll</code> with{' '}
              <code className="text-[11px]">ListWithFormModal</code>.
            </li>
            <li>Do not rely on <code className="text-[11px]">window.scrollTo</code> for module navigation.</li>
          </ul>
        </GuidelineCard>

        <GuidelineCard title="Responsive Behavior" badge="Layout">
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            <li>
              <code className="text-[11px]">PageSectionHeader</code> stacks title then a full-width action row below{' '}
              <code className="text-[11px]">2xl</code>; side-by-side only on very wide screens (
              <code className="text-[11px]">2xl</code>+).
            </li>
            <li>
              Header and page toolbars use <code className="text-[11px]">PageToolbarSelect</code> /{' '}
              <code className="text-[11px]">PageToolbarSearchInput</code> — <code className="text-[11px]">h-11</code>,
              labels visually hidden (<code className="text-[11px]">sr-only</code>) so controls align with{' '}
              <code className="text-[11px]">PageToolbarGigwButton</code>. Use{' '}
              <code className="text-[11px]">showLabel</code> only for stacked filter panels.
            </li>
            <li>Report split layout stacks to a single column below <code className="text-[11px]">lg</code>.</li>
            <li>Header filters and Export align to form control height (<code className="text-[11px]">h-11</code>).</li>
            <li>Chrome horizontal inset: 20px (<code className="text-[11px]">page-shell</code> / <code className="text-[11px]">ORG_CHROME_GUTTER_CLASS</code>).</li>
          </ul>
        </GuidelineCard>
      </div>
    </div>
  )
}
