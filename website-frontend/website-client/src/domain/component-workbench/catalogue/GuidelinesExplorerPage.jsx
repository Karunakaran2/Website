import { Link } from 'react-router-dom'
import { useModuleSecondaryTab } from '@/domain/component-workbench/hooks/useModuleSecondaryTab'
import {
  ShieldCheck,
  Smartphone,
  LayoutTemplate,
  CheckCircle2,
  XCircle,
  Code,
  Layers,
  ArrowRight,
  Sparkles,
  Eye,
  Pencil,
  Trash2,
  Table,
  FormInput,
  Sliders,
  Maximize2,
  Keyboard,
  Contrast,
  Volume2,
} from 'lucide-react'
import {
  ActionButton,
  TableViewAction,
  TableEditAction,
  TableDeleteAction,
  TableApproveAction,
  TableRowActionsGroup,
} from '@/shared/components/buttons'
import { GIGW_EDIT_ICON, GIGW_FINALIZE_ICON } from '@/shared/components/buttons/gigw/gigwLucideIcons'
import StatusChip from '@/shared/components/status/StatusChip'

export default function GuidelinesExplorerPage() {
  const secondaryTab = useModuleSecondaryTab('component-usage')

  // 1. COMPONENT USAGE GUIDELINES
  if (secondaryTab === 'component-usage') {
    return (
      <div className="space-y-8 pb-12 w-full">
        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#01458e]">
            <LayoutTemplate size={16} />
            <span>Design Guidelines & Architecture</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Component Selection & Reuse Guidelines
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Comprehensive developer reference for selecting, importing, and composing standard KRAN Design System components.
          </p>
        </div>

        {/* Golden Rule Banner */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-5 text-xs text-blue-950 flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-[#01458e] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="font-bold text-sm text-[#01458e]">Golden Rule: Zero Duplicate Primitives</h2>
            <p className="leading-relaxed text-blue-900">
              Never author custom raw HTML <code>&lt;button&gt;</code>, <code>&lt;input&gt;</code>, <code>&lt;select&gt;</code>, <code>&lt;table&gt;</code>, or <code>&lt;div role=&quot;dialog&quot;&gt;</code> components inside business modules.
              The centralised component library in <code>@/shared/components</code> is the <strong>single source of truth</strong> for the entire KRAN Design System.
            </p>
          </div>
        </div>

        {/* 1. Core Component Map */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            1. Standard Component Inventory & Import Registry
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-bold">Category</th>
                  <th className="px-4 py-3 font-bold">Official Component</th>
                  <th className="px-4 py-3 font-bold">Import Path</th>
                  <th className="px-4 py-3 font-bold">Usage Purpose & Supported Variants</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Action Triggers</td>
                  <td className="px-4 py-3 font-mono text-[#01458e]">ActionButton</td>
                  <td className="px-4 py-3 font-mono text-slate-500">@/shared/components/buttons</td>
                  <td className="px-4 py-3">
                    Semantic action variants: <code>primary</code>, <code>submit</code>, <code>save</code>, <code>reset</code>, <code>cancel</code>, <code>delete</code>, <code>excel</code>, <code>pdf</code>, <code>verify</code>, <code>approve</code>.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Table Row Actions</td>
                  <td className="px-4 py-3 font-mono text-[#01458e]">TableViewAction, TableEditAction, TableDeleteAction</td>
                  <td className="px-4 py-3 font-mono text-slate-500">@/shared/components/buttons</td>
                  <td className="px-4 py-3">
                    Standard circular 36px GIGW icon buttons with info, primary, and destructive tones.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Data Tables</td>
                  <td className="px-4 py-3 font-mono text-[#01458e]">DataTable</td>
                  <td className="px-4 py-3 font-mono text-slate-500">@/shared/components/DataTable</td>
                  <td className="px-4 py-3">
                    Server-side or local listing table with sorting, search, column visibility toggle, and pagination.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Form Inputs</td>
                  <td className="px-4 py-3 font-mono text-[#01458e]">InputField, SelectField, IndianAmountField, OrgDateField, TextAreaField</td>
                  <td className="px-4 py-3 font-mono text-slate-500">@/shared/components/forms</td>
                  <td className="px-4 py-3">
                    Consistent 44px fixed height form controls with built-in validation error slots and helper text.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Modals & Dialogs</td>
                  <td className="px-4 py-3 font-mono text-[#01458e]">PortalModalShell, ConfirmDialog</td>
                  <td className="px-4 py-3 font-mono text-slate-500">@/shared/components/modals</td>
                  <td className="px-4 py-3">
                    React portal overlays with focus trapping, backdrop dismissal, and standardized header/footer actions.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Status Badges</td>
                  <td className="px-4 py-3 font-mono text-[#01458e]">StatusChip</td>
                  <td className="px-4 py-3 font-mono text-slate-500">@/shared/components/status</td>
                  <td className="px-4 py-3">
                    Status indicators automatically styled by workflow keyword (Active, Pending, Rejected, Draft).
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-900">Notifications</td>
                  <td className="px-4 py-3 font-mono text-[#01458e]">appToast</td>
                  <td className="px-4 py-3 font-mono text-slate-500">@/shared/components/toast/appToast</td>
                  <td className="px-4 py-3">
                    Standard imperative toast notifications: <code>appToast.success()</code>, <code>appToast.error()</code>, <code>appToast.info()</code>.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Interactive Demonstrations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Button Hierarchy & Actions
            </h3>
            <p className="text-xs text-slate-600">
              Use semantic <code>ActionButton</code> variants to communicate action priority and intent:
            </p>
            <div className="flex flex-wrap gap-2.5 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <ActionButton variant="primary">Primary Action</ActionButton>
              <ActionButton variant="submit">Submit Proposal</ActionButton>
              <ActionButton variant="save">Save Changes</ActionButton>
              <ActionButton variant="reset">Reset Form</ActionButton>
              <ActionButton variant="cancel">Cancel</ActionButton>
              <ActionButton variant="delete">Delete Record</ActionButton>
            </div>
            <div className="space-y-3 pt-2">
              <div>
                <span className="mb-2 block text-xs font-semibold text-slate-700">
                  Two inline actions (≤2 total):
                </span>
                <div className="flex items-center gap-3">
                  <TableViewAction onClick={() => {}} title="View Record" />
                  <TableEditAction onClick={() => {}} title="Edit Record" />
                </div>
              </div>
              <div>
                <span className="mb-2 block text-xs font-semibold text-slate-700">
                  Four actions (2 inline + ⋮ overflow):
                </span>
                <TableRowActionsGroup
                  items={[
                    {
                      key: 'view',
                      label: 'View',
                      icon: Eye,
                      render: () => <TableViewAction onClick={() => {}} title="View Record" />,
                    },
                    {
                      key: 'edit',
                      label: 'Edit',
                      icon: GIGW_EDIT_ICON,
                      render: () => <TableEditAction onClick={() => {}} title="Edit Record" />,
                    },
                    {
                      key: 'approve',
                      label: 'Approve',
                      icon: GIGW_FINALIZE_ICON,
                      render: () => <TableApproveAction onClick={() => {}} title="Approve Record" />,
                    },
                    {
                      key: 'delete',
                      label: 'Delete',
                      icon: Trash2,
                      render: () => <TableDeleteAction onClick={() => {}} title="Delete Record" />,
                    },
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Status Chips & Workflow Indicators
            </h3>
            <p className="text-xs text-slate-600">
              <code>StatusChip</code> normalizes color mappings across all enterprise transaction tables:
            </p>
            <div className="flex flex-wrap gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <StatusChip label="Approved" />
              <StatusChip label="Active" />
              <StatusChip label="Pending" />
              <StatusChip label="Under Review" />
              <StatusChip label="Rejected" />
              <StatusChip label="Draft" />
              <StatusChip label="Cancelled" />
            </div>
          </div>
        </div>

        {/* 3. Good vs Bad Code Comparison */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            2. Anti-Patterns vs. Recommended Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* INCORRECT */}
            <div className="rounded-lg border border-rose-200 bg-rose-50/40 p-4 space-y-3">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
                <XCircle size={16} />
                <span>Incorrect (Bypasses Design System)</span>
              </div>
              <pre className="overflow-x-auto rounded bg-slate-900 p-3 text-[11px] font-mono text-rose-300">
{`// ❌ DO NOT render raw buttons with custom Tailwind
<button
  className="bg-blue-600 text-white px-4 py-2 rounded"
  onClick={handleSubmit}
>
  <Send className="w-4 h-4 mr-2 inline" />
  Submit
</button>

// ❌ DO NOT build custom tables
<table className="w-full border">
  <thead><tr><th>Name</th></tr></thead>
  <tbody>{rows.map(r => ...)}</tbody>
</table>`}
              </pre>
              <p className="text-[11px] text-rose-900">
                Breaks application-wide theming, focus rings, GIGW sizing, and forces duplication across screens.
              </p>
            </div>

            {/* CORRECT */}
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 size={16} />
                <span>Correct (Standard Shared Components)</span>
              </div>
              <pre className="overflow-x-auto rounded bg-slate-900 p-3 text-[11px] font-mono text-emerald-300">
{`// ✅ USE official ActionButton
import { ActionButton } from '@/shared/components/buttons'

<ActionButton variant="submit" onClick={handleSubmit}>
  Submit Proposal
</ActionButton>

// ✅ USE official DataTable
import DataTable from '@/shared/components/DataTable'

<DataTable
  columns={columns}
  rows={rows}
  total={total}
  page={page}
  pageSize={pageSize}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
/>`}
              </pre>
              <p className="text-[11px] text-emerald-950">
                Automatically delivers WCAG 2.2 AA compliance, GIGW touch targets, dark mode, and responsive layout.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 2. ACCESSIBILITY GUIDELINES
  if (secondaryTab === 'accessibility') {
    return (
      <div className="space-y-8 pb-12 w-full">
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <ShieldCheck size={16} />
            <span>Accessibility & Compliance</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Accessibility Standards (WCAG 2.2 AA & GIGW)
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Actionable technical requirements ensuring every application module satisfies Indian e-governance (GIGW 3.0 / MeitY) and international W3C WCAG 2.2 Level AA accessibility mandates.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <Contrast size={20} />
            </div>
            <h2 className="font-bold text-sm text-slate-900">1. Color Contrast</h2>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Minimum 4.5:1 ratio for regular text and 3:1 for large text and UI boundaries. Never communicate state using color alone.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="h-10 w-10 rounded-lg bg-blue-50 text-[#01458e] flex items-center justify-center mb-3">
              <Keyboard size={20} />
            </div>
            <h2 className="font-bold text-sm text-slate-900">2. Keyboard Access</h2>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              100% of interactive controls must be reachable and operable using Tab, Space, Enter, Escape, and Arrow keys without a mouse.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
              <Eye size={20} />
            </div>
            <h2 className="font-bold text-sm text-slate-900">3. Focus Visibility</h2>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              2px high-contrast focus rings with 2px offset on all focused elements. Never disable outlines with <code>outline: none</code>.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <Volume2 size={20} />
            </div>
            <h2 className="font-bold text-sm text-slate-900">4. Screen Readers</h2>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Strict semantic markup with proper ARIA attributes, form label associations, and <code>aria-live</code> dynamic status updates.
            </p>
          </div>
        </div>

        {/* Detailed Guidelines Table */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Mandatory Engineering Checklist
          </h2>
          <div className="space-y-3 text-xs text-slate-700">
            <div className="rounded-lg border border-slate-200 p-4 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-xs mb-1">Form Input Labels & Instructions</h3>
              <p className="text-slate-600 leading-relaxed">
                Every form field must have a programmatically linked <code>&lt;label htmlFor=&quot;id&quot;&gt;</code>. Required fields must display an asterisk with <code>aria-hidden=&quot;true&quot;</code> and the <code>required</code> attribute. Error messages must be linked using <code>aria-describedby=&quot;id-error&quot;</code> and set <code>aria-invalid=&quot;true&quot;</code>.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 p-4 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-xs mb-1">Dialog & Modal Focus Trapping</h3>
              <p className="text-slate-600 leading-relaxed">
                When a dialog opens, focus must automatically move inside the modal (to the first interactive field or title). Tab navigation must be trapped inside the modal container so users cannot tab into the background page. On dismissal, focus must restore to the button that triggered the dialog.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 p-4 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-xs mb-1">Table Semantics & Sorting Announcements</h3>
              <p className="text-slate-600 leading-relaxed">
                DataTables must use semantic <code>&lt;table&gt;</code>, <code>&lt;thead&gt;</code>, <code>&lt;th scope=&quot;col&quot;&gt;</code>, and <code>&lt;tbody&gt;</code>. Sortable headers must specify <code>aria-sort=&quot;ascending&quot; | &quot;descending&quot; | &quot;none&quot;</code> and announce state changes to screen readers.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 p-4 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-xs mb-1">Text Zoom & Reflow (WCAG 1.4.10)</h3>
              <p className="text-slate-600 leading-relaxed">
                Pages must support up to 400% browser zoom at 1280px without horizontal scroll bars or text clipping. All interactive controls must maintain a minimum touch target size of 44×44 pixels or 36×36 pixels with sufficient surrounding target clearance.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 3. RESPONSIVE BEHAVIOR GUIDELINES
  return (
    <div className="space-y-8 pb-12 w-full">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700">
          <Smartphone size={16} />
          <span>Layout & Breakpoints</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Responsive Behavior & Breakpoint Specifications
        </h1>
        <p className="mt-1.5 text-sm text-slate-600">
          Rules for responsive grid systems, table overflow, navigation menus, and form reflow across standard desktop, tablet, and mobile devices.
        </p>
      </div>

      {/* Breakpoint Token Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          1. Standard Tailwind Breakpoint Tokens
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-bold">Token</th>
                <th className="px-4 py-3 font-bold">Min-Width</th>
                <th className="px-4 py-3 font-bold">Device Profile</th>
                <th className="px-4 py-3 font-bold">Layout Adaptation Rules</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-purple-700">default</td>
                <td className="px-4 py-3 font-mono">&lt; 640px</td>
                <td className="px-4 py-3">Mobile phones (320px - 639px)</td>
                <td className="px-4 py-3">Single column forms, stacked toolbar, action buttons span full width</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-purple-700">sm</td>
                <td className="px-4 py-3 font-mono">640px</td>
                <td className="px-4 py-3">Small tablets, landscape mobile</td>
                <td className="px-4 py-3">2-column form grids, inline toolbar search, modal widths max-sm</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-purple-700">md</td>
                <td className="px-4 py-3 font-mono">768px</td>
                <td className="px-4 py-3">Standard tablets (iPad portrait)</td>
                <td className="px-4 py-3">Secondary navigation strip visible without horizontal scrolling</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-purple-700">lg</td>
                <td className="px-4 py-3 font-mono">1024px</td>
                <td className="px-4 py-3">Laptops, tablet landscape</td>
                <td className="px-4 py-3">3-column complex form grids, standard 8+ column DataTables without collapse</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-purple-700">xl</td>
                <td className="px-4 py-3 font-mono">1280px</td>
                <td className="px-4 py-3">Enterprise desktop monitors</td>
                <td className="px-4 py-3">Multi-pane views, side-by-side verification panels</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-bold text-purple-700">2xl</td>
                <td className="px-4 py-3 font-mono">1536px</td>
                <td className="px-4 py-3">Wide enterprise monitors</td>
                <td className="px-4 py-3">4-column KPI cards, full expanded data grids</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
          <div className="h-9 w-9 rounded-lg bg-blue-50 text-[#01458e] flex items-center justify-center font-bold">
            <Maximize2 size={18} />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Full Content Width</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Content pages render inside <code>ModuleContentShell</code> using <code>w-full px-5 py-5</code>. Never wrap pages with <code>max-w-7xl mx-auto</code> or fixed pixel widths which create artificial gutters.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
          <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Table size={18} />
          </div>
          <h3 className="font-bold text-sm text-slate-900">DataTable Responsive Columns</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            DataTables automatically calculate container width. On narrow viewports, secondary columns collapse into an expandable accordion drawer (<code>+</code>) instead of causing page-level horizontal overflow.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
          <div className="h-9 w-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <Sliders size={18} />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Modal Dialog Sizing</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Modal shells adapt automatically: <code>sm</code> (384px), <code>md</code> (512px), <code>lg</code> (768px), and <code>xl</code> (1024px). On mobile devices (&lt; 640px), all modals resize to <code>w-full max-w-[calc(100vw-2rem)]</code>.
          </p>
        </div>
      </div>
    </div>
  )
}
