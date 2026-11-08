import { Link } from 'react-router-dom'
import {
  Folder,
  Layers,
  LayoutTemplate,
  ShieldCheck,
  Smartphone,
  FormInput,
  Table,
  Sliders,
  Compass,
  Code2,
  CheckCircle2,
  XCircle,
  FileCheck,
  Send,
  Save,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { ActionButton, TableViewAction, TableEditAction, TableDeleteAction } from '@/shared/components/buttons'
import StatusChip from '@/shared/components/status/StatusChip'

export default function DesignPrinciplesPage() {
  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Module Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#01458e]">
          <LayoutTemplate size={16} />
          <span>Core Engineering Standards</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          KRAN Design System: Architectural Guidelines & Development Standards
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-4xl leading-relaxed">
          The single authoritative engineering reference for building scalable, accessible, and consistent business modules across the KRAN enterprise ecosystem.
        </p>
      </div>

      {/* SECTION 1: CORE DESIGN PRINCIPLES */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Sparkles className="h-5 w-5 text-[#01458e]" />
          <h2 className="text-lg font-bold text-slate-900">1. Core Design Principles</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900">1. Enterprise Consistency</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standardize typography, controls, and workflows across accounting, procurement, HRMS, and asset registers so civil administrators navigate with immediate familiarity.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900">2. Reusability by Default</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Never recreate common UI controls. Always consume official components from <code>@/shared/components</code> to preserve global styling and test coverage.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900">3. Accessibility First (WCAG 2.2 AA)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every screen must be 100% operable via keyboard alone, provide 4.5:1 text contrast, support screen readers, and reflow fluidly up to 400% zoom.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900">4. Predictable Interaction</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Buttons and links exhibit deterministic behavior. Primary actions sit on the right in footers, cancel sit on the left, and destructive triggers mandate explicit confirmation.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900">5. Error Prevention & Recovery</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Validate fields early with inline feedback. High-impact operations (deleting records, sanctioning funds) require a high-friction <code>ConfirmDialog</code>.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900">6. Clear Visual Hierarchy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Maintain a single <code>&lt;h1&gt;</code> per document, clean <code>FormSection</code> blocks, and strict typographic scale to keep dense government data scannable.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: COMPONENT USAGE & REUSE ARCHITECTURE */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Layers className="h-5 w-5 text-[#01458e]" />
          <h2 className="text-lg font-bold text-slate-900">2. Shared Component Architecture & Imports</h2>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            All generic UI primitives are centralized in <code>src/shared/components/</code>. The table below details authoritative components, their import paths, and usage parameters:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-bold">Domain Primitives</th>
                  <th className="px-4 py-3 font-bold">Authoritative Component</th>
                  <th className="px-4 py-3 font-bold">Official Import Path</th>
                  <th className="px-4 py-3 font-bold">Core Props & Signatures</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Action Buttons</td>
                  <td className="px-4 py-3 font-mono text-[#01458e]">ActionButton</td>
                  <td className="px-4 py-3 font-mono text-slate-500">@/shared/components/buttons</td>
                  <td className="px-4 py-3"><code>variant=&quot;primary|submit|save|reset|cancel|delete|excel|pdf&quot;</code>, <code>loading</code>, <code>disabled</code></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Row Action Toolbar</td>
                  <td className="px-4 py-3 font-mono text-[#01458e]">TableViewAction, TableEditAction, TableDeleteAction</td>
                  <td className="px-4 py-3 font-mono text-slate-500">@/shared/components/buttons</td>
                  <td className="px-4 py-3"><code>onClick</code>, <code>title</code>, <code>disabled</code>, wrapped inside <code>TABLE_ROW_ACTIONS_CLASS</code></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Data Tables</td>
                  <td className="px-4 py-3 font-mono text-[#01458e]">DataTable</td>
                  <td className="px-4 py-3 font-mono text-slate-500">@/shared/components/DataTable</td>
                  <td className="px-4 py-3"><code>columns</code>, <code>rows</code>, <code>page</code>, <code>pageSize</code>, <code>total</code>, <code>onPageChange</code>, <code>onPageSizeChange</code></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Form Fields</td>
                  <td className="px-4 py-3 font-mono text-[#01458e]">InputField, SelectField, IndianAmountField, OrgDateField, TextAreaField</td>
                  <td className="px-4 py-3 font-mono text-slate-500">@/shared/components/forms</td>
                  <td className="px-4 py-3"><code>label</code>, <code>required</code>, <code>value</code>, <code>onChange</code>, <code>error</code>, <code>hint</code></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Modals & Dialogs</td>
                  <td className="px-4 py-3 font-mono text-[#01458e]">PortalModalShell, ConfirmDialog</td>
                  <td className="px-4 py-3 font-mono text-slate-500">@/shared/components/modals</td>
                  <td className="px-4 py-3"><code>isOpen</code>, <code>onClose</code>, <code>size=&quot;sm|md|lg|xl&quot;</code>, <code>footer</code>, <code>tone=&quot;delete|submit&quot;</code></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Status Chips</td>
                  <td className="px-4 py-3 font-mono text-[#01458e]">StatusChip</td>
                  <td className="px-4 py-3 font-mono text-slate-500">@/shared/components/status</td>
                  <td className="px-4 py-3"><code>label=&quot;Approved|Pending|Rejected|Draft&quot;</code>, <code>status</code></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Notifications</td>
                  <td className="px-4 py-3 font-mono text-[#01458e]">appToast</td>
                  <td className="px-4 py-3 font-mono text-slate-500">@/shared/components/toast/appToast</td>
                  <td className="px-4 py-3"><code>appToast.success(msg)</code>, <code>appToast.error(msg)</code>, <code>appToast.info(msg)</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 3: LAYOUT & RESPONSIVE DESIGN */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Smartphone className="h-5 w-5 text-[#01458e]" />
          <h2 className="text-lg font-bold text-slate-900">3. Layout & Responsive Design Standards</h2>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-slate-700">
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Full Content Width (No Max-Width Containers)</h3>
              <p className="leading-relaxed">
                Pages mount directly inside <code>ModuleContentShell</code> with full width (<code>w-full</code>) and uniform padding (<code>px-5 py-5</code>).
                <strong>Never wrap domain screens in <code>max-w-7xl mx-auto</code> or <code>max-w-5xl</code></strong>, which create artificial empty gutters on enterprise displays.
              </p>
              <h3 className="font-bold text-slate-900 text-sm pt-2">No Duplicate Internal Navbars</h3>
              <p className="leading-relaxed">
                Application navigation is entirely provided by the host shell via <code>PrimaryNav</code> (the yellow menu bar) and <code>SecondaryNav</code> (the white subtab strip).
                Domain screens must never render redundant secondary sidebars, pill menus, or duplicate subtab bars.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Responsive Breakpoint Conventions</h3>
              <ul className="space-y-1.5 list-disc pl-4">
                <li><code>default (&lt; 640px)</code>: 1-column forms, stacked action toolbars.</li>
                <li><code>sm (640px)</code>: 2-column form grids, inline search inputs.</li>
                <li><code>md (768px)</code>: Full secondary subtab strip without overflow.</li>
                <li><code>lg (1024px)</code>: Standard 3-column complex forms, full DataTables.</li>
                <li><code>xl (1280px)</code>: Side-by-side verification and preview panels.</li>
                <li><code>2xl (1536px)</code>: Maximized data analytics grids.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: TYPOGRAPHY & DESIGN TOKENS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Sliders className="h-5 w-5 text-[#01458e]" />
          <h2 className="text-lg font-bold text-slate-900">4. Typography & Design Tokens</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900">Font Stack: 'Noto Sans'</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Configured in <code>tailwind.config.js</code> as <code>['&quot;Noto Sans&quot;', 'sans-serif']</code>. Optimized for multilingual official government documents.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900">Brand Color: Navy (#01458e)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Primary action button backgrounds, active tabs, header text links, and key brand emblems. Hover: <code>#01356f</code>, Active: <code>#002752</code>.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900">Accent Color: Gold (#f5c518)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dedicated primary application navbar menu strip (<code>#f5c518</code>) and subtle highlight accents.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: FORMS & VALIDATION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <FormInput className="h-5 w-5 text-[#01458e]" />
          <h2 className="text-lg font-bold text-slate-900">5. Forms & Validation Standards</h2>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">Control Heights & Layout</h3>
              <p className="leading-relaxed">
                All form controls (<code>InputField</code>, <code>SelectField</code>, <code>IndianAmountField</code>, <code>OrgDateField</code>) maintain a fixed 44px height (<code>h-11</code>).
                Primary toolbar and form actions use <code>GigwButton</code> / <code>ActionButton</code> size <code>md</code> (also <code>h-11</code>); table row icons stay 36px.
                Group form fields in <code>grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5</code>.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">Error & Validation Behavior</h3>
              <p className="leading-relaxed">
                Display validation errors immediately below the field with red border (<code>!border-rose-400</code>), <code>aria-invalid=&quot;true&quot;</code>, and <code>aria-describedby=&quot;id-error&quot;</code>.
                Always provide a form footer with <code>variant=&quot;submit&quot;</code> and <code>variant=&quot;reset&quot;</code> action buttons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: DATATABLES & DATA DISPLAY */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Table className="h-5 w-5 text-[#01458e]" />
          <h2 className="text-lg font-bold text-slate-900">6. DataTables & Listing Standards</h2>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 text-xs text-slate-700">
          <p className="leading-relaxed">
            DataTables represent the core transactional surface of the design system. Adhere strictly to the following requirements:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
            <li><strong>Always use shared DataTable:</strong> Import from <code>@/shared/components/DataTable</code>. Never write custom HTML <code>&lt;table&gt;</code> elements.</li>
            <li><strong>Toolbar controls:</strong> Enable search, page size selector (options: 10, 25, 50, 100), and column visibility menus via <code>DataTableToolbar</code>.</li>
            <li><strong>Row Actions Group:</strong> Standard action toolbars must compose <code>TableViewAction</code>, <code>TableEditAction</code>, and <code>TableDeleteAction</code> inside <code>TABLE_ROW_ACTIONS_CLASS</code>. When more than 2 actions exist, use <code>TableRowActionsGroup</code> for two inline icon buttons and a ⋮ overflow menu for the rest.</li>
            <li><strong>Currency Alignment:</strong> Financial amounts must align right using <code>align: &apos;right&apos;</code> and format with Indian comma grouping (₹ Lakh / Crore).</li>
          </ul>
        </div>
      </section>

      {/* SECTION 7: ACTIONS & FEEDBACK */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <CheckCircle2 className="h-5 w-5 text-[#01458e]" />
          <h2 className="text-lg font-bold text-slate-900">7. Actions & User Feedback</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900">Toast Notifications (appToast)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Use <code>showAppToast(message, &apos;success&apos;)</code> after confirmed API success; <code>showAppToast(message, &apos;error&apos;)</code> for server failures. Do not toast client validation — use <code>FieldError</code>. Mount <code>AppSuccessToastContainer</code> once at the app root.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900">ConfirmDialog for Destructive Acts</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Deleting vouchers, revoking sanctions, or rejecting files mandates a <code>ConfirmDialog</code> with <code>tone=&quot;delete&quot;</code> before persisting state changes.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 8: NAVIGATION & ROUTING */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Compass className="h-5 w-5 text-[#01458e]" />
          <h2 className="text-lg font-bold text-slate-900">8. Navigation & Route Architecture</h2>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-3 text-xs text-slate-700 leading-relaxed">
          <p>
            Routes use module-scoped URLs without <code>/dashboard</code> or account/location prefixes (e.g. <code>/administration/asset/fa-group</code>, <code>/administration/setup/company-setup/overview</code>).
            Legacy URLs redirect to these canonical paths for backward compatibility.
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Each browser tab owns its URL and history. <code>DashboardContent</code> reads{' '}
              <code>useDashboardRouteIds()</code>; <code>useDashboardRouteSync</code> keeps Redux aligned with the URL.
            </li>
            <li>
              Shell navigation uses <code>NavLink</code> — never dispatch dashboard nav from <code>onClick</code> on those links.
            </li>
            <li>
              Multi-tab auth, scroll, and logout rules: <code>docs/HOST_SHELL_INTEGRATION.md</code> and Design Guidelines → Architecture.
            </li>
          </ul>
        </div>
      </section>

      {/* SECTION 9: ACCESSIBILITY (WCAG 2.2 AA & GIGW) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <ShieldCheck className="h-5 w-5 text-emerald-700" />
          <h2 className="text-lg font-bold text-slate-900">9. Accessibility & Government Mandates (GIGW 3.0 / MeitY)</h2>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6 shadow-xs space-y-3 text-xs text-slate-800 leading-relaxed">
          <p>
            In accordance with the Ministry of Electronics and Information Technology (MeitY) and the Web Content Accessibility Guidelines (WCAG 2.2 Level AA), all modules must maintain:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Text contrast ratio ≥ 4.5:1 (9.8:1 achieved with primary brand navy #01458e on white).</li>
            <li>Visible 2px focus indicators on every interactive element without exception.</li>
            <li>Screen reader alternative text for all informational imagery and icons.</li>
            <li>Target sizes for buttons ≥ 36×36px desktop and ≥ 44×44px on touch viewports.</li>
          </ul>
        </div>
      </section>

      {/* SECTION 10: CODE QUALITY & REGRESSION TESTING */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Code2 className="h-5 w-5 text-[#01458e]" />
          <h2 className="text-lg font-bold text-slate-900">10. Code Quality & Verification Protocol</h2>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-3 text-xs text-slate-700 leading-relaxed">
          <p>
            Before submitting or merging any pull request in the <code>design-system</code> repository, run and pass both validation gates:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 font-mono">
              <span className="font-bold text-slate-900 block mb-1">1. Unit & Regression Tests:</span>
              <code className="text-[#01458e]">npx vitest run</code>
              <p className="mt-1 text-[11px] text-slate-500 font-sans">Must pass 100% of test suites without regressions.</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 font-mono">
              <span className="font-bold text-slate-900 block mb-1">2. Production Build:</span>
              <code className="text-[#01458e]">npm run build</code>
              <p className="mt-1 text-[11px] text-slate-500 font-sans">Vite production bundle must build cleanly with 0 syntax or bundling errors.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 space-y-2">
        <h2 className="text-base font-bold text-slate-900">Related guideline sections</h2>
        <ul className="text-sm text-slate-700 space-y-1 list-disc pl-5">
          <li>
            <Link to="/design-guidelines/guide-layout/overview" className="text-[#01458e] font-semibold hover:underline">
              Page layout, headers, and report overview
            </Link>
          </li>
          <li>
            <Link to="/design-guidelines/guide-datatable/overview" className="text-[#01458e] font-semibold hover:underline">
              DataTable standards
            </Link>
          </li>
          <li>
            <Link to="/design-guidelines/guide-feedback/overview" className="text-[#01458e] font-semibold hover:underline">
              Feedback and interaction patterns
            </Link>
          </li>
          <li>
            <Link to="/component-workbench/data-display/report-overview" className="text-[#01458e] font-semibold hover:underline">
              Live report overview demo (Component Workbench)
            </Link>
          </li>
        </ul>
      </section>
    </div>
  )
}
