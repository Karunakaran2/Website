import { Link } from 'react-router-dom'
import { useModuleSecondaryTab } from '@/domain/component-workbench/hooks/useModuleSecondaryTab'
import {
  Box,
  CheckCircle2,
  ArrowRight,
  BookOpen,
} from 'lucide-react'
import { getModuleRoute } from '@/shared/constants'
import HostShellReference from './HostShellReference'

export default function OverviewPage() {
  const secondaryTab = useModuleSecondaryTab('module-overview')

  if (secondaryTab === 'getting-started') {
    return (
      <div className="space-y-6 pb-12">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-[13px] text-slate-700 leading-relaxed">
            You are already running the <strong>KRAN Design System</strong> app. These steps describe how to
            work in this repo or integrate the same UI into another host — not a separate npm install inside
            this project.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#01458e] font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Run or copy the design system</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              In this repo: install dependencies and start Vite. In a host app: copy{' '}
              <code className="text-[11px]">src/shared/</code> (or use the source ZIP from the footer) and align
              Tailwind — see <code className="text-[11px]">docs/DEVELOPER_ONBOARDING.md</code>.
            </p>
            <div className="rounded bg-slate-900 p-2.5 font-mono text-[11px] text-slate-100">
              npm install
              <br />
              npm run dev
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#01458e] font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Use shared components</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Import from <code className="text-[11px]">@/shared/components</code> (and forms, confirm, skeleton).
              Browse live demos in the Component Catalog. Host apps must also wire shell, routes, and session — see
              below.
            </p>
            <div className="rounded bg-slate-900 p-2.5 font-mono text-[11px] text-slate-100 break-all">
              import &#123; DataTable, GigwButton &#125; from &apos;@/shared/components&apos;
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#01458e] font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Accessibility &amp; quality</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Use <code className="text-[11px]">FormLabel</code>, visible focus, and keyboard-friendly controls
              (see Guidelines → Accessibility). There is no <code className="text-[11px]">test:a11y</code> script in
              this repo — run unit tests and manual checks on Workbench previews.
            </p>
            <div className="rounded bg-slate-900 p-2.5 font-mono text-[11px] text-slate-100">
              npm run test:run
              <br />
              npm run build
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50/30 p-6 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#01458e]" />
            <span>Host shell (separate products only)</span>
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            <code className="text-[11px]">MainLayout</code>, <code className="text-[11px]">DashboardHeader</code>,
            primary/secondary nav, <code className="text-[11px]">#main-content</code> scroll, and multi-tab session
            are already mounted in this app. When embedding KRAN UI elsewhere, follow{' '}
            <code className="text-[11px]">docs/HOST_SHELL_INTEGRATION.md</code> — do not duplicate that wiring on
            every domain page.
          </p>
        </div>

        <HostShellReference compact />
      </div>
    )
  }

  // Default: module-overview
  return (
    <div className="space-y-6 pb-12">
      {/* Hero Strip */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#01458e]">
            <Box className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Component Explorer — Sample Application Module
            </h2>
            <p className="mt-1 text-xs text-slate-600 max-w-2xl">
              This module demonstrates how a production KRAN enterprise application should be organized. Explore working interactive components, data tables, forms, and practical design patterns.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 pt-4 border-t border-slate-100">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Architecture</span>
            <div className="mt-1 text-sm font-bold text-slate-900">React 18 MFE</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Compliance</span>
            <div className="mt-1 text-sm font-bold text-emerald-700">WCAG 2.2 AA / GIGW</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Styling</span>
            <div className="mt-1 text-sm font-bold text-slate-900">Tailwind + CSS Tokens</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Interactive Tests</span>
            <div className="mt-1 text-sm font-bold text-blue-700">265+ Passing Tests</div>
          </div>
        </div>
      </div>

      <HostShellReference />

      {/* Feature Sections Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: 'Component Catalog',
            desc: 'Search all shared UI components, demo status, and jump to live previews.',
            tab: 'overview',
            sub: 'component-catalog',
          },
          {
            title: 'Actions & Buttons',
            desc: 'Primary, secondary, destructive buttons, icon buttons, and toolbars.',
            tab: 'actions',
            sub: 'buttons',
          },
          {
            title: 'Enterprise Forms',
            desc: 'Validated input controls, select dropdowns, radio groups, and currency fields.',
            tab: 'forms',
            sub: 'text-inputs',
          },
          {
            title: 'Domain patterns',
            desc: 'Inline CRUD, upload modal, and workflow notes/query panels.',
            tab: 'patterns',
            sub: 'overview',
          },
          {
            title: 'Modals & Dialogs',
            desc: 'ConfirmDialog presets, FormModal, view modals, and PortalModalShell sizes.',
            tab: 'feedback',
            sub: 'modals-gallery',
          },
          {
            title: 'Date & Time',
            desc: 'OrgDateField with RHF, min/max, validation, and native date picker behavior.',
            tab: 'forms',
            sub: 'date-time',
          },
          {
            title: 'Feedback & Alerts',
            desc: 'Alerts, toasts, loading indicators, and empty states.',
            tab: 'feedback',
            sub: 'alerts',
          },
          {
            title: 'Data Display',
            desc: 'Structured data tables with search, sorting, pagination, and status chips.',
            tab: 'data-display',
            sub: 'tables',
          },
          {
            title: 'Report Overview',
            desc: 'Probity-style report filters, KPI cards, charts, tables, export, and line preview.',
            tab: 'data-display',
            sub: 'report-overview',
          },
          {
            title: 'Navigation Patterns',
            desc: 'Breadcrumb trails, tab bars, overflow menus, and profile dropdowns.',
            tab: 'navigation',
            sub: 'breadcrumbs',
          },
          {
            title: 'Design Guidelines',
            desc: 'Component usage rules, accessibility checklists, and responsive rules.',
            tab: 'guidelines',
            sub: 'component-usage',
          },
        ].map((item) => (
          <Link
            key={item.title}
            to={getModuleRoute(item.tab, item.sub)}
            className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-blue-400 hover:shadow-md transition-all"
          >
            <div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#01458e] transition-colors">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#01458e] group-hover:translate-x-1 transition-transform">
              <span>Explore Section</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
