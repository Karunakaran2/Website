import { useState } from 'react'
import ComponentDocPageShell from './ComponentDocPageShell'
import { useModuleSecondaryTab } from '@/domain/component-workbench/hooks/useModuleSecondaryTab'
import {
  AlertTriangle,
  Info,
  Calendar,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  ArrowRight,
  FileText,
} from 'lucide-react'
import { ActionButton } from '@/shared/components/buttons'
import GigwIconGallery from '../components/GigwIconGallery'
import TableRowActionsLiveStrip from '../components/TableRowActionsLiveStrip'

export default function FoundationsDocs() {
  const secondaryTab = useModuleSecondaryTab('tokens')

  // 1. TYPOGRAPHY
  if (secondaryTab === 'typography') {
    return (
      <ComponentDocPageShell
        title="Typography & Type Scale"
        badge="Foundation"
        lead="The KRAN typography scale uses 'Noto Sans' as the primary font family with robust system fallbacks. Designed for dense data density in e-governance applications while fulfilling GIGW and WCAG 2.2 AA readability requirements."
        preview={
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-mono text-slate-400">text-3xl (30px / font-bold / leading-tight)</span>
              <h1 className="text-3xl font-bold text-slate-900 mt-1">
                Display Title: Primary Page Heading
              </h1>
            </div>
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-mono text-slate-400">text-2xl (24px / font-bold / leading-snug)</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Section Heading: Module Domain Level
              </h2>
            </div>
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-mono text-slate-400">text-xl (20px / font-semibold)</span>
              <h3 className="text-xl font-semibold text-slate-900 mt-1">
                Subheading: Card & Panel Header
              </h3>
            </div>
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-mono text-slate-400">text-base (16px / font-medium)</span>
              <h4 className="text-base font-medium text-slate-900 mt-1">
                Standard Form Section & Tab Title
              </h4>
            </div>
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-mono text-slate-400">text-sm (14px / font-normal / leading-relaxed)</span>
              <p className="text-sm text-slate-700 leading-relaxed mt-1">
                Body text used for general content, field labels, table cells, descriptions, and user guidance. Provides high legibility on standard government desktop displays and mobile viewports.
              </p>
            </div>
            <div>
              <span className="text-xs font-mono text-slate-400">text-xs (12px / font-medium / text-slate-500)</span>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Captions, helper text, breadcrumbs, timestamp labels, and table header column titles.
              </p>
            </div>
          </div>
        }
        usage={
          <div className="space-y-3">
            <p><strong>Primary Font:</strong> <code>&quot;Noto Sans&quot;, sans-serif</code> is configured in <code>tailwind.config.js</code>. Noto Sans provides universal Unicode coverage including multilingual Indian official scripts.</p>
            <p><strong>Heading Hierarchy:</strong> Every page renders exactly one <code>&lt;h1&gt;</code> element. Never jump heading depths (e.g., h1 to h3 without an h2).</p>
            <p><strong>Zoom & Reflow:</strong> All text scales linearly up to 200% without clipping or content truncation, compliant with WCAG 2.2 AA Success Criterion 1.4.4.</p>
          </div>
        }
        codeExample={`// Typical typography patterns in application pages
<h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
  Capital Works Management
</h1>
<h2 className="text-base font-semibold text-slate-800">
  1. Administrative Identification
</h2>
<p className="text-sm text-slate-600 leading-relaxed">
  Provide statutory sanctioned order details and administrative approval tokens.
</p>
<span className="text-xs text-slate-500 font-medium">
  Last modified on 24-Oct-2026 by Section Officer
</span>`}
        dosAndDonts={{
          dos: [
            'Use standard semantic HTML elements (h1-h4, p, span, strong).',
            'Ensure minimum 4.5:1 text-to-background contrast ratio (3:1 for text-xl and larger).',
            'Use tabular numbers (font-mono or font-feature-settings) for currency and financial figures.',
          ],
          donts: [
            'Do not skip heading levels merely for visual sizing; use Tailwind utility classes instead.',
            'Avoid hardcoding fixed pixel font sizes in inline styles.',
            'Do not use light font weights (font-light) for small body or label text.',
          ],
        }}
      />
    )
  }

  // 2. SPACING & GRID
  if (secondaryTab === 'spacing') {
    return (
      <ComponentDocPageShell
        title="Spacing & Grid System"
        badge="Foundation"
        lead="The KRAN layout system is governed by a predictable 4px/8px incremental scale. Consistent spacing ensures enterprise forms, multi-column grids, and data toolbars maintain visual rhythm and alignment."
        preview={
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Core Spacing Scale (Tailwind Increment: 1 unit = 4px)
              </h3>
              <div className="space-y-2">
                {[
                  { token: 'gap-1 / p-1', px: '4px', desc: 'Tight inline icon spacing, button group gap' },
                  { token: 'gap-2 / p-2', px: '8px', desc: 'Action toolbar buttons, badge padding, compact grid gap' },
                  { token: 'gap-3 / p-3', px: '12px', desc: 'Table cell padding, modal header gap, field gap in compact forms' },
                  { token: 'gap-4 / p-4', px: '16px', desc: 'Card padding, dialog body padding, standard responsive gap' },
                  { token: 'gap-5 / p-5', px: '20px', desc: 'Standard shell padding (px-5 py-5), complex form field grid' },
                  { token: 'gap-6 / p-6', px: '24px', desc: 'Major card containers, page section separation' },
                  { token: 'gap-8 / p-8', px: '32px', desc: 'Major view division, dashboard widget spacing' },
                ].map((s) => (
                  <div key={s.token} className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-2.5">
                    <span className="w-28 font-mono text-xs font-bold text-slate-800">{s.token}</span>
                    <span className="w-16 font-mono text-xs text-[#01458e] font-semibold">{s.px}</span>
                    <div className="h-4 bg-[#01458e]/20 rounded-xs border border-[#01458e]" style={{ width: s.px }} />
                    <span className="text-xs text-slate-500 flex-1 truncate">{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Standard Complex Form Grid (3 Columns Desktop, 2 Columns Tablet, 1 Column Mobile)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <div className="rounded-md border border-dashed border-slate-300 bg-white p-3 text-center text-xs font-medium text-slate-700">
                  Column 1 (Span 1)
                </div>
                <div className="rounded-md border border-dashed border-slate-300 bg-white p-3 text-center text-xs font-medium text-slate-700">
                  Column 2 (Span 1)
                </div>
                <div className="rounded-md border border-dashed border-slate-300 bg-white p-3 text-center text-xs font-medium text-slate-700">
                  Column 3 (Span 1)
                </div>
                <div className="lg:col-span-2 rounded-md border border-dashed border-slate-300 bg-white p-3 text-center text-xs font-medium text-slate-700">
                  Wide Input (lg:col-span-2)
                </div>
                <div className="rounded-md border border-dashed border-slate-300 bg-white p-3 text-center text-xs font-medium text-slate-700">
                  Column 3 (Span 1)
                </div>
              </div>
            </div>
          </div>
        }
        usage={
          <div className="space-y-3">
            <p><strong>Page Shell Padding:</strong> Module content pages render inside <code>ModuleContentShell</code> using <code>px-5 py-5</code>. Never add nested wrappers with arbitrary padding like <code>p-12</code> or <code>p-0</code> that disrupt the shell alignment.</p>
            <p><strong>Complex Form Fields:</strong> Group input rows using <code>grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5</code>. Text areas or expansive description fields span 2 or 3 columns with <code>lg:col-span-2</code> or <code>lg:col-span-3</code>.</p>
            <p><strong>Fixed Control Heights:</strong> Inputs, selects, date pickers, and default text buttons (<code>GigwButton</code> / <code>ActionButton</code> size <code>md</code>) use <code>h-11</code> (44px). Compact toolbar actions use <code>sm</code> (<code>h-8</code>). DataTable row icon buttons remain <code>size-9</code> (36px).</p>
          </div>
        }
        codeExample={`// Standard 3-column form layout
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
  <InputField label="Field 1" name="field1" required />
  <InputField label="Field 2" name="field2" />
  <SelectField label="Field 3" name="field3" options={options} />
  <TextAreaField label="Description" name="desc" className="lg:col-span-2" />
</div>`}
        dosAndDonts={{
          dos: [
            'Use standard Tailwind spacing units (gap-2, gap-3, gap-4, gap-5).',
            'Maintain full available content width (w-full) without fixed max-w restrictions.',
            'Keep button action groups consistently spaced with gap-2 or gap-3.',
          ],
          donts: [
            'Do not use arbitrary fractional spacing (e.g. p-[13px] or m-[7px]).',
            'Do not wrap pages in max-w-7xl mx-auto which causes artificial gutters.',
            'Avoid zero-gap layouts where inputs or buttons touch borders directly.',
          ],
        }}
      />
    )
  }

  // 3. RADIUS & SHADOWS
  if (secondaryTab === 'radius-shadows') {
    return (
      <ComponentDocPageShell
        title="Radius & Shadow Elevation"
        badge="Foundation"
        lead="Border radius and shadow elevation tokens communicate interactive affordance, modal layering, and container hierarchy across the KRAN enterprise workspace."
        preview={
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Border Radius Tokens
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { token: 'rounded-none', val: '0px', usage: 'Table cell borders, full-bleed dividers' },
                  { token: 'rounded-xs', val: '2px', usage: 'Tiny indicators, focus outlines' },
                  { token: 'rounded-sm', val: '4px', usage: 'Status badges, inline chips, small tags' },
                  { token: 'rounded-md', val: '6px', usage: 'Buttons, inputs, selects, table toolbar' },
                  { token: 'rounded-lg', val: '8px', usage: 'Card sections, dropdown menus, popovers' },
                  { token: 'rounded-xl', val: '12px', usage: 'Main container cards, modal dialogs' },
                ].map((r) => (
                  <div key={r.token} className="rounded-lg border border-slate-200 bg-white p-3 text-center">
                    <div className={`mx-auto mb-2 h-12 w-12 border-2 border-[#01458e] bg-[#01458e]/10 ${r.token}`} />
                    <div className="font-mono text-xs font-bold text-slate-800">{r.token}</div>
                    <div className="font-mono text-[10px] text-[#01458e]">{r.val}</div>
                    <p className="mt-1 text-[11px] text-slate-500">{r.usage}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Shadow Elevation Scale
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { token: 'shadow-2xs', desc: 'Micro elevation for cards on light backgrounds' },
                  { token: 'shadow-xs', desc: 'Standard section container cards and form blocks' },
                  { token: 'shadow-md', desc: 'Floating toolbars, active popover menus, sticky headers' },
                  { token: 'shadow-xl', desc: 'Portal modal dialogs and critical confirmation overlays' },
                ].map((s) => (
                  <div key={s.token} className={`rounded-xl border border-slate-200 bg-white p-4 ${s.token}`}>
                    <span className="font-mono text-xs font-bold text-slate-900 block mb-1">{s.token}</span>
                    <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
        usage={
          <div className="space-y-3">
            <p><strong>Input & Button Radius:</strong> Form controls and action buttons use <code>rounded-md</code> (6px). Status badges and tags use <code>rounded-sm</code> (4px) or <code>rounded-full</code>.</p>
            <p><strong>Modal & Card Elevation:</strong> Modals use <code>shadow-xl</code> paired with a semi-transparent black overlay (<code>bg-black/40 backdrop-blur-xs</code>). General page cards use subtle <code>shadow-xs</code> with <code>border border-slate-200</code>.</p>
          </div>
        }
        codeExample={`// Applying radius and elevation tokens
<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
  <button className="rounded-md bg-[#01458e] px-4 py-2 text-white shadow-2xs hover:bg-[#01356f]">
    Submit Action
  </button>
</div>`}
        dosAndDonts={{
          dos: [
            'Use rounded-md for all interactive form inputs and action buttons.',
            'Always combine shadows with subtle border (border border-slate-200) for clean definition.',
            'Use rounded-xl for primary outer card shells.',
          ],
          donts: [
            'Do not use heavy, harsh black shadows (e.g. shadow-2xl) on regular page content.',
            'Avoid mixing rounded-full buttons with sharp rounded-none inputs in the same form.',
            'Do not apply borders without specifying border color (fallback to slate-200/slate-300).',
          ],
        }}
      />
    )
  }

  // 4. BREAKPOINTS
  if (secondaryTab === 'breakpoints') {
    return (
      <ComponentDocPageShell
        title="Responsive Breakpoints"
        badge="Foundation"
        lead="The KRAN Design System adopts the standard Tailwind CSS mobile-first responsive breakpoint grid. Layouts reflow fluidly from high-resolution multi-monitor desktop setups down to mobile government field tablets."
        preview={
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Configured Breakpoint Tokens
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                    <tr>
                      <th className="px-4 py-3 font-bold">Breakpoint</th>
                      <th className="px-4 py-3 font-bold">Min-Width</th>
                      <th className="px-4 py-3 font-bold">Target Device Profile</th>
                      <th className="px-4 py-3 font-bold">Application Reflow Behavior</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-[#01458e]">default</td>
                      <td className="px-4 py-3 font-mono">&lt; 640px</td>
                      <td className="px-4 py-3">Mobile phones, narrow windows</td>
                      <td className="px-4 py-3">Single-column forms, stacked action bars, drawer navigation</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-[#01458e]">sm</td>
                      <td className="px-4 py-3 font-mono">640px</td>
                      <td className="px-4 py-3">Small tablets, horizontal mobile</td>
                      <td className="px-4 py-3">2-column form grid, inline toolbar search</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-[#01458e]">md</td>
                      <td className="px-4 py-3 font-mono">768px</td>
                      <td className="px-4 py-3">Standard tablets (iPad portrait)</td>
                      <td className="px-4 py-3">Dual-pane layouts, full subtab navigation</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-[#01458e]">lg</td>
                      <td className="px-4 py-3 font-mono">1024px</td>
                      <td className="px-4 py-3">Laptops, iPad landscape</td>
                      <td className="px-4 py-3">3-column form grid, full DataTable columns visible</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-[#01458e]">xl</td>
                      <td className="px-4 py-3 font-mono">1280px</td>
                      <td className="px-4 py-3">Desktop displays, standard monitors</td>
                      <td className="px-4 py-3">Expanded dashboard widgets, side-by-side verification panels</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-[#01458e]">2xl</td>
                      <td className="px-4 py-3 font-mono">1536px</td>
                      <td className="px-4 py-3">Wide enterprise monitors (1080p, 1440p)</td>
                      <td className="px-4 py-3">4-column analytics cards, maximized data table real estate</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <h4 className="text-xs font-bold text-slate-800 mb-2">Live Viewport State</h4>
              <p className="text-xs text-slate-600">
                Resize the browser window to see responsive utility classes dynamically activate:
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-mono font-semibold">
                <span className="block sm:hidden px-2.5 py-1 rounded bg-rose-100 text-rose-800 border border-rose-300">
                  Active: &lt; 640px (Mobile)
                </span>
                <span className="hidden sm:inline-block md:hidden px-2.5 py-1 rounded bg-amber-100 text-amber-800 border border-amber-300">
                  Active: sm (640px - 767px)
                </span>
                <span className="hidden md:inline-block lg:hidden px-2.5 py-1 rounded bg-sky-100 text-sky-800 border border-sky-300">
                  Active: md (768px - 1023px)
                </span>
                <span className="hidden lg:inline-block xl:hidden px-2.5 py-1 rounded bg-blue-100 text-blue-800 border border-blue-300">
                  Active: lg (1024px - 1279px)
                </span>
                <span className="hidden xl:inline-block 2xl:hidden px-2.5 py-1 rounded bg-indigo-100 text-indigo-800 border border-indigo-300">
                  Active: xl (1280px - 1535px)
                </span>
                <span className="hidden 2xl:inline-block px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Active: 2xl (&gt;= 1536px)
                </span>
              </div>
            </div>
          </div>
        }
        usage={
          <div className="space-y-3">
            <p><strong>Mobile First Approach:</strong> Write base styles for mobile viewports without prefixes, then layer responsive enhancements using <code>sm:</code>, <code>md:</code>, and <code>lg:</code>.</p>
            <p><strong>Table Responsiveness:</strong> Use <code>DataTable</code> with <code>responsiveColumns</code> enabled so that lower-priority columns collapse automatically into expandable child rows on narrower viewports.</p>
          </div>
        }
        codeExample={`// Responsive grid pattern for forms
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
  <InputField label="Project Code" />
  <InputField label="Department" />
  <InputField label="Financial Year" />
</div>`}
        dosAndDonts={{
          dos: [
            'Test all pages across 320px, 768px, 1024px, and 1440px viewports.',
            'Ensure horizontal scrolling never occurs at page level (w-full overflow-x-hidden).',
            'Allow DataTables to manage horizontal scroll or responsive column collapse cleanly.',
          ],
          donts: [
            'Do not use desktop-only fixed widths (e.g. w-[900px]) on containers.',
            'Avoid hardcoded media query pixel values in custom CSS files.',
            'Do not hide critical transaction confirmation actions on mobile.',
          ],
        }}
      />
    )
  }

  // 5. ICONS
  if (secondaryTab === 'icons') {
    return (
      <ComponentDocPageShell
        title="Icon Guidelines & Semantics"
        badge="Foundation"
        lead="The KRAN Design System standardizes exclusively on Lucide React icons. Icons provide visual signposts for quick scanning, consistent semantic action mappings, and high-contrast vector clarity across all device densities."
        preview={
          <div className="space-y-8 w-full min-w-0">
            <GigwIconGallery />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Live table row action components (all exports)
              </h3>
              <TableRowActionsLiveStrip />
            </div>
          </div>
        }
        usage={
          <div className="space-y-3">
            <p><strong>GIGW workflow icons:</strong> Import <code>GIGW_*_ICON</code> from <code>@/shared/components/buttons/gigw/gigwLucideIcons</code> (or the buttons barrel). Row actions use <code>Table*Action</code> shorthands — do not substitute generic Lucide names (e.g. use <code>SquarePen</code> via <code>GIGW_EDIT_ICON</code>, not <code>Pencil</code>).</p>
            <p><strong>Package:</strong> Underlying glyphs come from <code>lucide-react</code>. Never install alternate icon packs or render emoji in enterprise tables.</p>
            <p><strong>Size Conventions:</strong> Use 14px (<code>size={14}</code>) for small badges, 16px (<code>size={16}</code>) for button icons and table row action buttons, 18px (<code>size={18}</code>) for modal headers, and 20px (<code>size={20}</code>) for alert icons.</p>
            <p><strong>Accessibility:</strong> If an icon is used alone in an interactive button, always provide a descriptive <code>aria-label</code> or <code>title</code> attribute. If accompanied by text, add <code>aria-hidden=&quot;true&quot;</code> to the icon.</p>
          </div>
        }
        codeExample={`import { GIGW_ADD_ICON, GIGW_EDIT_ICON } from '@/shared/components/buttons/gigw/gigwLucideIcons'
import { GigwButton, TableEditAction, TableDeleteAction } from '@/shared/components/buttons'

<GigwButton variant="primary" icon={GIGW_ADD_ICON}>
  Add Sanction Record
</GigwButton>

<TableEditAction onClick={handleEdit} title="Edit sanction CW-2026-9042" />
<TableDeleteAction onClick={handleDelete} title="Delete sanction CW-2026-9042" />`}
        dosAndDonts={{
          dos: [
            'Use GIGW_*_ICON tokens and Table*Action components for list row semantics.',
            'Include aria-label or title for standalone icon buttons.',
            'Maintain minimum 36px touch target for standalone icon buttons.',
          ],
          donts: [
            'Do not mix multiple icon packs with differing stroke weights.',
            'Avoid using decorative emojis (e.g., ⚠️, ❌, ✅) in lieu of vector SVG icons.',
            'Do not render icon-only buttons without accessible text labels.',
          ],
        }}
      />
    )
  }

  // 6. DEFAULT: DESIGN TOKENS & COLORS
  return (
    <ComponentDocPageShell
      title="Design Tokens & Colors"
      badge="Foundation"
      lead="Core design tokens define the visual foundation of the KRAN Design System. These include enterprise brand palettes, neutral grayscale tones, semantic status colors, and WCAG AA verified contrast pairings."
      preview={
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Brand Primary Palette
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { name: 'Primary Main', hex: '#01458e', desc: 'Main brand navy', dark: true },
                { name: 'Primary Hover', hex: '#01356f', desc: 'Button hover state', dark: true },
                { name: 'Primary Active', hex: '#002752', desc: 'Pressed / active state', dark: true },
                { name: 'Primary Light', hex: '#e8f0fe', desc: 'Subtle tint background', dark: false },
              ].map((c) => (
                <div key={c.name} className="overflow-hidden rounded-lg border border-slate-200 shadow-2xs">
                  <div className="h-16 flex items-end p-2" style={{ backgroundColor: c.hex }}>
                    <span className={`text-xs font-mono font-bold ${c.dark ? 'text-white' : 'text-slate-900'}`}>
                      {c.hex}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white text-xs">
                    <div className="font-semibold text-slate-800">{c.name}</div>
                    <div className="text-slate-500 text-[11px]">{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Brand Accent Palette (Yellow Navigation)
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { name: 'Accent Gold', hex: '#f5c518', desc: 'Navbar strip (#f5c518)', dark: false },
                { name: 'Accent Light', hex: '#fef3c7', desc: 'Active tab / highlight', dark: false },
                { name: 'Accent Dark', hex: '#d9a70f', desc: 'Border / emphasis', dark: false },
              ].map((c) => (
                <div key={c.name} className="overflow-hidden rounded-lg border border-slate-200 shadow-2xs">
                  <div className="h-16 flex items-end p-2" style={{ backgroundColor: c.hex }}>
                    <span className={`text-xs font-mono font-bold ${c.dark ? 'text-white' : 'text-slate-900'}`}>
                      {c.hex}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white text-xs">
                    <div className="font-semibold text-slate-800">{c.name}</div>
                    <div className="text-slate-500 text-[11px]">{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Semantic Status Colors (WCAG 2.2 AA Compliant)
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { name: 'Success / Stable', bg: 'bg-emerald-600', hex: '#059669', badge: 'bg-emerald-50 text-emerald-700' },
                { name: 'Warning / Beta', bg: 'bg-amber-500', hex: '#f59e0b', badge: 'bg-amber-50 text-amber-700' },
                { name: 'Danger / Error', bg: 'bg-red-600', hex: '#dc2626', badge: 'bg-red-50 text-red-700' },
                { name: 'Info / Notice', bg: 'bg-sky-600', hex: '#0284c7', badge: 'bg-sky-50 text-sky-700' },
              ].map((s) => (
                <div key={s.name} className="overflow-hidden rounded-lg border border-slate-200 p-3 bg-white shadow-2xs">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`h-4 w-4 rounded-full ${s.bg}`} />
                    <span className="text-xs font-semibold text-slate-800">{s.name}</span>
                  </div>
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${s.badge}`}>
                    Sample Tag
                  </span>
                  <div className="mt-1 font-mono text-[10px] text-slate-400">{s.hex}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      usage={
        <div className="space-y-3">
          <p><strong>Usage Rules:</strong> Use <code>#01458e</code> for all primary action triggers, active navigation markers, and brand emblems. Use the amber/gold <code>#f5c518</code> strictly as the primary application menu strip and subtle indicator highlights.</p>
          <p><strong>Enterprise Contrast:</strong> Every semantic color has an approved pairing for text and background. Do not place light text over light yellow or emerald backgrounds.</p>
        </div>
      }
      codeExample={`/* Consuming tokens via CSS variables or Tailwind classes */
:root {
  --kran-brand-primary: #01458e;
  --kran-brand-primary-hover: #01356f;
  --kran-brand-accent: #f5c518;
  --kran-bg-surface: #ffffff;
  --kran-border-subtle: #e2e8f0;
}

/* Tailwind usage */
<div className="bg-[#01458e] text-white p-4 rounded-lg shadow-sm">
  Primary Brand Container
</div>`}
      dosAndDonts={{
        dos: [
          'Use approved brand tokens for all primary buttons and headers.',
          'Verify color contrast against light and high-contrast modes.',
          'Pair status indicators with text labels so color is not the only signal.',
        ],
        donts: [
          'Do not introduce random hex values outside the curated token set.',
          'Never rely on color alone to communicate state or errors.',
          'Do not use plain primary red or green for unstyled links.',
        ],
      }}
    />
  )
}
