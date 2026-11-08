export function navigationPreviewForTab(tab) {
  if (tab === 'headers') {
    return (
      <div className="overflow-hidden rounded-lg border border-slate-300 shadow-sm">
        <div className="flex h-12 items-center justify-between bg-[#01458e] px-4 text-white">
          <span className="text-sm font-bold">KRAN Design System</span>
          <span className="text-xs text-white/80">User Profile</span>
        </div>
        <div className="flex h-8 items-center gap-4 bg-[#f5c518] px-4 text-xs font-medium text-slate-900">
          <span className="rounded bg-white px-2.5 py-1 font-bold shadow-2xs">Active Module</span>
          <span className="cursor-pointer rounded px-2 py-0.5 hover:bg-white/50">Module Two</span>
        </div>
        <div className="flex h-8 items-center gap-4 border-b border-slate-200 bg-white px-4 text-xs font-medium text-slate-600">
          <span className="border-b-2 border-[#f5c518] pb-1 font-bold text-[#01458e]">Subtab Overview</span>
          <span className="cursor-pointer hover:text-slate-900">Configurations</span>
        </div>
        <div className="bg-slate-50 p-4 text-xs text-slate-500">ModuleContentShell → #main-content scroll region</div>
      </div>
    )
  }
  const copy = {
    sidebars: 'ModuleContentShell with page-shell 20px gutters — no artificial max-w-7xl on domain pages.',
    dropdowns: 'Account menu: My Profile, Account Settings, Logout. More overflow on primary nav.',
    breadcrumbs: 'In-module wayfinding; report workspace uses split layout + catalog tabs.',
    'grid-layout': 'PAGE_SECTION_SHELL_CLASS cards, ReportSplitLayout for reporting modules.',
  }
  return <p className="max-w-2xl text-sm text-slate-700">{copy[tab] || copy.sidebars}</p>
}

export function navigationCodeForTab(tab) {
  if (tab === 'grid-layout') {
    return `import { ReportSplitLayout } from '@/shared/components/report'

<ReportSplitLayout catalog={...} workspace={...} />`
  }
  if (tab === 'headers') {
    return `// DashboardLayout (host)
import { useDashboardRouteSync } from '@/app/shell/hooks/useDashboardRouteSync'
import DashboardContent from '@/app/shell/components/DashboardContent'
import PrimaryNav from '@/app/shell/components/PrimaryNav'
import SecondaryNav from '@/app/shell/components/SecondaryNav'
import AppScrollManager from '@/shared/navigation/AppScrollManager'

// Inside layout: useDashboardRouteSync() before paint.
// DashboardContent resolves pages from URL via useDashboardRouteIds().
// PrimaryNav / SecondaryNav: NavLink only — no onClick → setDashboardNav.

// Programmatic navigate from a custom control:
import { isModifiedNavigationClick } from '@/shared/navigation/modifiedNavigationClick'

function onRowLinkClick(event, to, navigate) {
  if (isModifiedNavigationClick(event)) return
  event.preventDefault()
  navigate(to)
}`
  }
  if (tab === 'sidebars') {
    return `import AppScrollManager from '@/shared/navigation/AppScrollManager'
import { useInlineFormScroll } from '@/shared/navigation/useInlineFormScroll'

// AppProviders: mount AppScrollManager once.
// ListWithFormModal: useInlineFormScroll when opening inline add/edit cards.

// Scroll target: document.getElementById('main-content')`
  }
  return `import MainLayout from '@/shared/layouts/MainLayout/MainLayout'
import PrimaryNav from '@/app/shell/components/PrimaryNav'
import SecondaryNav from '@/app/shell/components/SecondaryNav'`
}

function RoutingUsageBlock() {
  return (
    <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
      <p>
        <strong>Per-tab routing:</strong> Each browser tab has its own URL and history.{' '}
        <code>useDashboardRouteIds()</code> reads primary/secondary ids from <code>location.pathname</code>;{' '}
        <code>DashboardContent</code> loads the page component from those ids (not Redux alone).
      </p>
      <p>
        <strong>Redux sync:</strong> <code>useDashboardRouteSync</code> runs in <code>useLayoutEffect</code> so refresh,
        deep links, and browser back/forward restore the correct module tab before paint.
      </p>
      <p>
        <strong>Shell links:</strong> <code>PrimaryNav</code> and <code>SecondaryNav</code> use React Router{' '}
        <code>NavLink</code> with <code>to=&#123;getModuleRoute(...)\}</code>. Do not call{' '}
        <code>activatePrimary</code> / <code>activateSecondary</code> in <code>onClick</code> — modified clicks (Ctrl+click,
        middle-click, open in new tab) must leave the current tab unchanged.
      </p>
      <p>
        <strong>Workbench doc pages:</strong> <code>useModuleSecondaryTab</code> prefers the URL segment over Redux so
        library tabs match the address bar.
      </p>
    </div>
  )
}

function SessionUsageBlock() {
  return (
    <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
      <p>
        Mount <code>SessionSync</code>, <code>SessionGuard</code>, and call <code>ensureSharedSessionHydrated(store)</code>{' '}
        in <code>AppProviders</code> before routed content. New tabs hydrate tokens from the{' '}
        <code>localStorage</code> mirror; cross-tab signals carry event types only (no tokens).
      </p>
      <p>
        <code>RequireAuth</code> redirects unauthenticated users without broadcasting logout to other tabs. Real sign-out
        uses <code>endAuthenticatedSession</code>, which notifies all tabs.
      </p>
    </div>
  )
}

export function navigationUsageForTab(tab) {
  if (tab === 'breadcrumbs') {
    return (
      <p className="text-sm text-slate-700 leading-relaxed">
        Do not duplicate shell secondary tabs with in-page pill nav — module routing lives in <code>SecondaryNav</code>.
      </p>
    )
  }
  if (tab === 'sidebars') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-700 leading-relaxed">
          <code>ModuleContentShell</code> / <code>ModulePageContent</code> provide full-width module bodies with standard
          padding. The scrollable region is <code>#main-content</code> inside <code>MainLayout</code>.
        </p>
        <SessionUsageBlock />
      </div>
    )
  }
  if (tab === 'dropdowns') {
    return (
      <div className="space-y-4">
        <RoutingUsageBlock />
        <p className="text-sm text-slate-700 leading-relaxed">
          Footer and header links should use <code>&lt;Link&gt;</code> / <code>NavLink</code> so Ctrl+click opens a new
          tab with the correct route. Account menu entries follow the same pattern.
        </p>
      </div>
    )
  }
  if (tab === 'headers') {
    return (
      <div className="space-y-4">
        <RoutingUsageBlock />
        <p className="text-sm text-slate-700 leading-relaxed">
          Active primary/secondary highlights derive from <code>useDashboardRouteIds</code> so they stay aligned with the
          URL when users open multiple tabs.
        </p>
      </div>
    )
  }
  return (
    <div className="space-y-4">
      <RoutingUsageBlock />
      <p className="text-sm text-slate-700 leading-relaxed">
        Use <code>ReportSplitLayout</code> and section cards (<code>PAGE_SECTION_SHELL_CLASS</code>) for dense reporting
        UIs; avoid page-level <code>max-w-7xl mx-auto</code> on domain CRUD screens.
      </p>
    </div>
  )
}
