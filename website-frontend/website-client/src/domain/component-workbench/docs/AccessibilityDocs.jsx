import { useModuleSecondaryTab } from '@/domain/component-workbench/hooks/useModuleSecondaryTab'
import ComponentDocPageShell from './ComponentDocPageShell'
import {
  ShieldCheck,
  Keyboard,
  Focus,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Contrast,
} from 'lucide-react'
import { ActionButton } from '@/shared/components/buttons'

export default function AccessibilityDocs() {
  const secondaryTab = useModuleSecondaryTab('wcag-standards')

  // 1. KEYBOARD NAVIGATION
  if (secondaryTab === 'keyboard-nav') {
    return (
      <ComponentDocPageShell
        title="Keyboard Navigation Standards"
        badge="Operable"
        lead="Every interactive feature across the KRAN Design System is operable without requiring a pointing device. Standard keyboard patterns ensure equal access for motor-disabled users, screen-reader users, and power keyboard users."
        preview={
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Standard Keyboard Interaction Matrix
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                    <tr>
                      <th className="px-4 py-3 font-bold">Key / Combination</th>
                      <th className="px-4 py-3 font-bold">Scope / Component</th>
                      <th className="px-4 py-3 font-bold">Expected Standard Behavior</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-[#01458e]">Tab</td>
                      <td className="px-4 py-3 font-semibold">Global / Forms</td>
                      <td className="px-4 py-3">Moves focus forward to next interactive element in logical reading order.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-[#01458e]">Shift + Tab</td>
                      <td className="px-4 py-3 font-semibold">Global / Forms</td>
                      <td className="px-4 py-3">Moves focus backward to previous interactive element.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-[#01458e]">Enter</td>
                      <td className="px-4 py-3 font-semibold">Buttons, Links, Dialogs</td>
                      <td className="px-4 py-3">Activates focused button, opens dialog, or submits form.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-[#01458e]">Space</td>
                      <td className="px-4 py-3 font-semibold">Buttons, Checkboxes, Radios</td>
                      <td className="px-4 py-3">Toggles checkbox, activates button, or selects radio button option.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-[#01458e]">Escape</td>
                      <td className="px-4 py-3 font-semibold">Modals, Drawers, Dropdowns</td>
                      <td className="px-4 py-3">Dismisses current overlay and returns focus to the initiating trigger.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-[#01458e]">Up / Down Arrows</td>
                      <td className="px-4 py-3 font-semibold">Selects, Menus, Radios</td>
                      <td className="px-4 py-3">Navigates between options in custom dropdowns and radio groups.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-bold text-[#01458e]">Left / Right Arrows</td>
                      <td className="px-4 py-3 font-semibold">Horizontal Tab Strips</td>
                      <td className="px-4 py-3">Moves focus across secondary subtab navigation bar.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        }
        usage={
          <div className="space-y-3">
            <p><strong>Natural Tab Order:</strong> Arrange DOM elements in the same sequence as their visual rendering. Avoid arbitrary positive <code>tabIndex</code> values (e.g., <code>tabIndex={1}</code>); use <code>tabIndex={0}</code> for custom focusable elements and <code>tabIndex={-1}</code> for programmatically focused items.</p>
            <p><strong>No Keyboard Traps (WCAG 2.1.2):</strong> A keyboard user must never get trapped inside any element. When a modal opens, Tab cycles inside, but Escape always allows exit.</p>
          </div>
        }
        codeExample={`// Ensuring keyboard accessible triggers
<button
  type="button"
  onClick={handleAction}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleAction();
    }
  }}
  className="focus-visible:ring-2 focus-visible:ring-[#01458e] focus-visible:ring-offset-2"
>
  Accessible Trigger
</button>`}
        dosAndDonts={{
          dos: [
            'Test every flow using exclusively Tab, Enter, Space, and Escape.',
            'Maintain logical DOM order matching the visual screen layout.',
            'Support Escape key dismissal on all overlays and menus.',
          ],
          donts: [
            'Never remove focus outlines using outline: none without providing a visible focus ring replacement.',
            'Avoid custom click handlers on unsemantic <div> elements without key handlers and role="button".',
            'Do not trap keyboard focus inside non-modal inline page sections.',
          ],
        }}
      />
    )
  }

  // 2. FOCUS MANAGEMENT
  if (secondaryTab === 'focus-management') {
    return (
      <ComponentDocPageShell
        title="Focus Management & Visible Indicators"
        badge="WCAG 2.2 AA"
        lead="WCAG 2.2 introduces stricter focus requirements: Focus Appearance (2.4.13) and Focus Not Obscured (2.4.11 / 2.4.12). All interactive elements must maintain prominent, non-obscured focus indicators."
        preview={
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Standard Focus Rings Demonstration
              </h3>
              <div className="flex flex-wrap items-center gap-4 p-5 rounded-xl border border-slate-200 bg-white shadow-2xs">
                <div>
                  <span className="text-xs text-slate-500 block mb-2">Primary Button Focus:</span>
                  <ActionButton variant="primary">
                    Focus Me with Tab
                  </ActionButton>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-2">Outline Button Focus:</span>
                  <ActionButton variant="cancel">
                    Focus Me with Tab
                  </ActionButton>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-2">Destructive Focus:</span>
                  <ActionButton variant="delete">
                    Focus Me with Tab
                  </ActionButton>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
                <h4 className="font-bold text-xs text-slate-900">Modal Focus Trapping Lifecycle</h4>
                <ol className="list-decimal pl-4 text-xs text-slate-600 space-y-1">
                  <li>User clicks button to trigger dialog.</li>
                  <li><code>triggerRef.current</code> saves the active button element.</li>
                  <li>Modal mounts into <code>#portal-root</code>; focus moves automatically to the first interactive input or close button.</li>
                  <li>Tab navigation cycles strictly within the modal boundaries.</li>
                  <li>On dismissal, focus returns to <code>triggerRef.current</code>.</li>
                </ol>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
                <h4 className="font-bold text-xs text-slate-900">Focus Not Obscured (WCAG 2.2 AA 2.4.11)</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  When sticky headers, floating notification bars, or bottom navigation strips exist, the currently focused element must never be hidden behind sticky chrome. <code>scroll-margin-top</code> is applied globally to prevent occlusion.
                </p>
              </div>
            </div>
          </div>
        }
        usage={
          <div className="space-y-3">
            <p><strong>Focus Ring Specifications:</strong> Use Tailwind <code>focus-visible:ring-2 focus-visible:ring-[#01458e] focus-visible:ring-offset-2</code>. In dark mode or high contrast mode, the ring adopts high-contrast yellow (<code>#f5c518</code>) or white.</p>
            <p><strong>Focus Restoration:</strong> All shared dialogs (<code>PortalModalShell</code>, <code>ConfirmDialog</code>) automatically restore focus to the triggering element upon dismissal.</p>
          </div>
        }
        codeExample={`// Tailwind focus-visible utility classes
className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#01458e] focus-visible:ring-offset-2"`}
        dosAndDonts={{
          dos: [
            'Use focus-visible so mouse clicks do not display distracting focus rings.',
            'Restore focus to triggers after modal or dropdown dismissals.',
            'Ensure minimum 2px thickness and 3:1 contrast against surrounding background.',
          ],
          donts: [
            'Never use outline: none without a focus-visible ring replacement.',
            'Do not allow focus to disappear into body root when a dialog closes.',
            'Avoid sticky elements that obscure focused inputs during keyboard navigation.',
          ],
        }}
      />
    )
  }

  // 3. SCREEN READERS
  if (secondaryTab === 'screen-readers') {
    return (
      <ComponentDocPageShell
        title="Screen Reader & ARIA Semantics"
        badge="Robust"
        lead="Screen reader compatibility ensures visually impaired citizens and administrators using NVDA, JAWS, or VoiceOver receive complete, accurate auditory feedback for all application interactions."
        preview={
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Core ARIA Implementation Patterns
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
                  <span className="font-mono text-xs font-bold text-[#01458e]">aria-live=&quot;polite&quot;</span>
                  <h4 className="font-bold text-xs text-slate-900">Dynamic Status Updates</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Used for search result counts, filter tallies, and toast notifications. Informs assistive tech without interrupting ongoing speech.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
                  <span className="font-mono text-xs font-bold text-[#01458e]">aria-invalid=&quot;true&quot;</span>
                  <h4 className="font-bold text-xs text-slate-900">Form Error Linkage</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Set on invalid form fields and coupled with <code>aria-describedby=&quot;field-error&quot;</code> so screen readers read the validation message when focusing the input.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
                  <span className="font-mono text-xs font-bold text-[#01458e]">aria-expanded=&quot;true|false&quot;</span>
                  <h4 className="font-bold text-xs text-slate-900">Collapsible & Dropdown State</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Announces whether menus, accordion drawers, or child rows in DataTables are currently opened or closed.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
                  <span className="font-mono text-xs font-bold text-[#01458e]">aria-hidden=&quot;true&quot;</span>
                  <h4 className="font-bold text-xs text-slate-900">Decorative Elements</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Hides purely decorative icons, chevrons, and background illustrations so screen readers avoid reading redundant clutter.
                  </p>
                </div>
              </div>
            </div>
          </div>
        }
        usage={
          <div className="space-y-3">
            <p><strong>First Rule of ARIA:</strong> If a native HTML element (e.g. <code>&lt;button&gt;</code>, <code>&lt;select&gt;</code>, <code>&lt;table&gt;</code>) provides the required semantics, use it instead of recreating custom ARIA widgets with <code>&lt;div&gt;</code> elements.</p>
            <p><strong>Accessible Names:</strong> Every interactive control must have an accessible name computed from text content, <code>aria-label</code>, or <code>aria-labelledby</code>.</p>
          </div>
        }
        codeExample={`// Accessible form field with linked error
<div>
  <label htmlFor="pan-input">Income Tax PAN *</label>
  <input
    id="pan-input"
    name="pan"
    required
    aria-invalid={hasError}
    aria-describedby={hasError ? "pan-error" : undefined}
  />
  {hasError && (
    <p id="pan-error" role="alert">
      Please enter a valid 10-character PAN.
    </p>
  )}
</div>`}
        dosAndDonts={{
          dos: [
            'Test screens with the NVDA or Windows Narrator screen reader.',
            'Add aria-label to all icon-only buttons.',
            'Use role="status" or role="alert" for dynamic confirmation notices.',
          ],
          donts: [
            'Do not introduce conflicting ARIA attributes on native elements.',
            'Never announce decorative icons with uninformative names like "image" or "icon".',
            'Avoid redundant labels (e.g. aria-label="Button to submit" on a submit button).',
          ],
        }}
      />
    )
  }

  // 4. DEFAULT: WCAG 2.2 AA STANDARDS
  return (
    <ComponentDocPageShell
      title="WCAG 2.2 Level AA & GIGW Standards"
      badge="Mandatory"
      lead="The KRAN Design System adheres to the latest W3C Web Content Accessibility Guidelines (WCAG 2.2) Level AA criteria, aligning with MeitY Guidelines for Indian Government Websites (GIGW 3.0)."
      preview={
        <div className="space-y-6">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 text-xs text-slate-800 space-y-3">
            <h4 className="font-bold text-emerald-900 text-sm">WCAG 2.2 Level AA Core Principles</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <div className="rounded-lg bg-white p-3 border border-emerald-200 shadow-2xs">
                <span className="font-bold text-emerald-800 block mb-1">1. Perceivable</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Contrast ≥ 4.5:1, text scaling to 200%, alternative text for images, non-reliance on color alone.
                </p>
              </div>
              <div className="rounded-lg bg-white p-3 border border-emerald-200 shadow-2xs">
                <span className="font-bold text-emerald-800 block mb-1">2. Operable</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  100% keyboard operability, no keyboard traps, 2px focus indicators, target size ≥ 24×24px (GIGW 44×44px).
                </p>
              </div>
              <div className="rounded-lg bg-white p-3 border border-emerald-200 shadow-2xs">
                <span className="font-bold text-emerald-800 block mb-1">3. Understandable</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Predictable navigation, descriptive error identification, bilingual support (EN/HI), clear helper instructions.
                </p>
              </div>
              <div className="rounded-lg bg-white p-3 border border-emerald-200 shadow-2xs">
                <span className="font-bold text-emerald-800 block mb-1">4. Robust</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Valid HTML5 markup, standard ARIA roles, verified with NVDA, JAWS, and VoiceOver.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Key WCAG 2.2 AA Success Criteria Implemented
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-bold">Criterion</th>
                    <th className="px-4 py-3 font-bold">Level</th>
                    <th className="px-4 py-3 font-bold">Name</th>
                    <th className="px-4 py-3 font-bold">Design System Implementation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="px-4 py-3 font-mono font-bold text-[#01458e]">1.4.3</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">AA</td>
                    <td className="px-4 py-3 font-semibold">Contrast (Minimum)</td>
                    <td className="px-4 py-3">All text meets 4.5:1 ratio; brand navy #01458e on white achieves 9.8:1.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono font-bold text-[#01458e]">1.4.10</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">AA</td>
                    <td className="px-4 py-3 font-semibold">Reflow</td>
                    <td className="px-4 py-3">Content reflows without horizontal scroll at 320px width or 400% zoom.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono font-bold text-[#01458e]">2.1.1</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">A</td>
                    <td className="px-4 py-3 font-semibold">Keyboard</td>
                    <td className="px-4 py-3">All buttons, selects, inputs, and modals are 100% keyboard operable.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono font-bold text-[#01458e]">2.4.7</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">AA</td>
                    <td className="px-4 py-3 font-semibold">Focus Visible</td>
                    <td className="px-4 py-3">High-contrast 2px focus ring with 2px offset applied globally.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono font-bold text-[#01458e]">2.4.11</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">AA</td>
                    <td className="px-4 py-3 font-semibold">Focus Not Obscured (Minimum)</td>
                    <td className="px-4 py-3">Sticky headers never hide active focused inputs (WCAG 2.2 new).</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono font-bold text-[#01458e]">2.5.8</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">AA</td>
                    <td className="px-4 py-3 font-semibold">Target Size (Minimum)</td>
                    <td className="px-4 py-3">Icon buttons maintain min 36×36px target size (WCAG 2.2 new).</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono font-bold text-[#01458e]">3.3.1</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">A</td>
                    <td className="px-4 py-3 font-semibold">Error Identification</td>
                    <td className="px-4 py-3">Errors clearly described in text and associated with aria-describedby.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
      usage={
        <div className="space-y-3">
          <p><strong>Integrated Accessibility Bar:</strong> The application shell includes a top accessibility bar allowing users to toggle languages (EN/HI), adjust text sizing (- / A / +), and select color contrast schemes (Standard / High Contrast / Dark).</p>
          <p><strong>Compliance Note:</strong> While components are designed to satisfy WCAG 2.2 Level AA specifications, final compliance depends on developers populating accessible labels, descriptions, and logical headings on custom screens.</p>
        </div>
      }
      codeExample={`// WCAG 2.2 AA compliant button focus state
<button
  type="button"
  className="px-4 py-2 bg-[#01458e] text-white rounded-md
             focus:outline-none focus-visible:ring-2 focus-visible:ring-[#01458e] focus-visible:ring-offset-2"
  aria-label="Submit Financial Sanction"
>
  Submit Sanction
</button>`}
      dosAndDonts={{
        dos: [
          'Verify contrast with automated tools (e.g. Lighthouse, axe-core).',
          'Include skip links to allow users to bypass primary navigation.',
          'Always provide text alternatives for non-text content.',
        ],
        donts: [
          'Do not assume a screen is compliant without performing keyboard-only navigation.',
          'Never disable browser zoom or user scaling in viewport meta tags.',
          'Avoid using generic link text like "click here" or "more".',
        ],
      }}
    />
  )
}
