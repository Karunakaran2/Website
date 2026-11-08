import { Link } from 'react-router-dom'

const DEFAULT_FOOTER = [
  { label: 'Navigation (Workbench)', to: '/component-workbench/lib-navigation/headers' },
  { label: 'Architecture (Guidelines)', to: '/design-guidelines/guide-architecture/overview' },
]

/**
 * Integrator-facing host shell notes: per-tab routing, session mirror, scroll.
 * Used in Component Workbench Overview and Design Guidelines.
 */
export default function HostShellIntegratorGuide({
  compact = false,
  className = '',
  footerLinks = DEFAULT_FOOTER,
}) {
  const sectionClass = [
    compact
      ? 'rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4'
      : 'rounded-xl border border-slate-200 bg-slate-50/80 p-6 shadow-xs space-y-4',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section aria-labelledby="host-shell-reference-heading" className={sectionClass}>
      <div>
        <h3 id="host-shell-reference-heading" className="font-bold text-slate-900 text-sm">
          Host shell — routing, session &amp; scroll
        </h3>
        <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-3xl">
          Mandatory patterns for KRAN hosts (<code>AppProviders</code>, <code>DashboardLayout</code>). Domain modules
          must not reimplement these concerns locally.
        </p>
      </div>

      <ul className="space-y-3 text-xs text-slate-700 leading-relaxed">
        <li>
          <strong className="text-slate-900">URL is the source of truth per browser tab.</strong>{' '}
          <code>useDashboardRouteIds</code> and <code>DashboardContent</code> resolve the active page from{' '}
          <code>location.pathname</code>. <code>useDashboardRouteSync</code> hydrates Redux from the URL on load and
          back/forward. Shell <code>NavLink</code> items must not dispatch nav Redux in <code>onClick</code> — that
          breaks Ctrl+click / open-in-new-tab.
        </li>
        <li>
          <strong className="text-slate-900">Multi-tab authentication.</strong>{' '}
          <code>ensureSharedSessionHydrated(store)</code> in <code>AppProviders</code>; <code>SessionSync</code> for
          mirror hydration and cross-tab signals (event types only — no tokens in messages). Use{' '}
          <code>loginSuccess</code> for sign-in; <code>restoreAuthState</code> for mirror restore. Logout:{' '}
          <code>endAuthenticatedSession</code> with cross-tab broadcast. Never call{' '}
          <code>completeSessionLogout(&#123; broadcastCrossTab: true &#125;)</code> from guards when a tab is merely
          unauthenticated.
        </li>
        <li>
          <strong className="text-slate-900">Module scroll.</strong>{' '}
          <code>AppScrollManager</code> scrolls <code>#main-content</code> on route changes and restores position on POP.
          Inline list add/edit cards: <code>useInlineFormScroll</code> from <code>@/shared/navigation</code>.
        </li>
        <li>
          <strong className="text-slate-900">Control heights.</strong> Form fields and default text buttons (
          <code>GigwButton</code> / <code>ActionButton</code> size <code>md</code>) use <code>h-11</code> (44px). Table
          row icon buttons remain 36px (<code>GigwIconButton</code> table tokens).
        </li>
      </ul>

      {footerLinks?.length ? (
        <p className="text-xs text-slate-600">
          {footerLinks.map((item, index) => (
            <span key={item.to}>
              {index > 0 ? ' · ' : null}
              <Link to={item.to} className="font-semibold text-[#01458e] hover:underline">
                {item.label}
              </Link>
            </span>
          ))}
          {' · '}
          <span className="text-slate-500">
            Repo doc: <code className="text-[11px]">docs/HOST_SHELL_INTEGRATION.md</code>
          </span>
        </p>
      ) : null}
    </section>
  )
}
