import GuidelineCard from '../components/GuidelineCard'
import HostShellIntegratorGuide from '@/shared/documentation/HostShellIntegratorGuide'

export default function ArchitectureMfePage() {
  return (
    <div className="space-y-6 pb-12">
      <HostShellIntegratorGuide
        footerLinks={[
          { label: 'Page layout & scroll', to: '/design-guidelines/guide-layout/overview' },
          { label: 'Component Workbench → Navigation', to: '/component-workbench/lib-navigation/headers' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <GuidelineCard title="Host Composition & Route Registry" badge="Architecture">
          <p className="text-xs text-slate-700 leading-relaxed mb-2">
            The shell mounts domain modules through the central page registry in <code>src/app/routes/loadDomainPages.js</code>. Each domain owns its internal route table (<code>routes/index.js</code>) and maps paths to lazy remote imports.
          </p>
          <p className="text-xs text-slate-700 leading-relaxed mb-2">
            This repository is a <strong>single Vite application</strong> with modular domain boundaries — not Module Federation or independently deployed remotes. Pages load via <code>lazyPage</code> and React <code>lazy()</code> code splitting.
          </p>
          <pre className="rounded bg-slate-900 p-2.5 font-mono text-[11px] text-slate-100 overflow-x-auto">
{`export const DASHBOARD_PAGE_REGISTRY = {
  ...sampleModulePages,
  ...administrationPages,
  ...componentWorkbenchPages,
  ...designGuidelinesPages,
  ...workforceManagementPages,
  'inbox:overview': InboxOverviewPage,
}`}
          </pre>
        </GuidelineCard>

        <GuidelineCard title="State Management & Redux Isolation" badge="Architecture">
          <p className="text-xs text-slate-700 leading-relaxed mb-2">
            Domains manage their own slice of state. The root store in <code>src/app/redux/store.js</code> combines domain reducers without coupling business logic across domains.
          </p>
          <p className="text-xs text-slate-700 leading-relaxed">
            Local form interactions, dialog visibility, and UI toggles should use local React state (<code>useState</code>, <code>useReducer</code>) rather than polluting global Redux state.
          </p>
        </GuidelineCard>

        <GuidelineCard title="Shared UI Component Layer" badge="Architecture">
          <p className="text-xs text-slate-700 leading-relaxed">
            All generic components live in <code>src/shared/components/</code>:
          </p>
          <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700 mt-2">
            <li><strong>Buttons:</strong> <code>PrimaryButton</code>, <code>ActionButton</code>, <code>CancelButton</code></li>
            <li><strong>Forms:</strong> <code>OrgTextField</code>, <code>OrgSelectField</code>, <code>IndianAmountField</code></li>
            <li><strong>Data Tables:</strong> <code>DataTable</code>, <code>TablePaginationBar</code></li>
            <li><strong>Dialogs:</strong> <code>ConfirmDialog</code>, <code>PortalModal</code></li>
            <li><strong>Status:</strong> <code>StatusChip</code>, <code>gigwStatusBadgeStyles</code></li>
          </ul>
        </GuidelineCard>

        <GuidelineCard title="Lazy Loading & Code Splitting" badge="Architecture">
          <p className="text-xs text-slate-700 leading-relaxed">
            Domain pages must be exported via <code>lazyPage(() =&gt; import(...))</code>. This ensures that heavy domain dependencies (charts, pdf generators, excel export) are only loaded over the wire when the user navigates to that specific screen.
          </p>
        </GuidelineCard>

        <GuidelineCard title="Per-tab routing & Redux" badge="Mandatory">
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            <li>
              <code>DashboardContent</code> resolves the lazy page from the URL (<code>useDashboardRouteIds</code>), not
              Redux alone.
            </li>
            <li>
              <code>useDashboardRouteSync</code> updates Redux when the pathname changes (refresh, deep link, history).
            </li>
            <li>
              Do not dispatch <code>setDashboardNav</code> from shell <code>NavLink</code> click handlers — use links
              only so new-tab gestures stay isolated per tab.
            </li>
          </ul>
        </GuidelineCard>

        <GuidelineCard title="Session & providers" badge="Mandatory">
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            <li>
              Register <code>SessionSync</code>, <code>SessionGuard</code>, and{' '}
              <code>ensureSharedSessionHydrated(store)</code> in the host provider stack.
            </li>
            <li>
              Cross-tab logout uses explicit signals; mirror lives in <code>localStorage</code> — never put tokens in
              BroadcastChannel payloads.
            </li>
            <li>
              Repository reference: <code>docs/HOST_SHELL_INTEGRATION.md</code>.
            </li>
          </ul>
        </GuidelineCard>
      </div>
    </div>
  )
}
