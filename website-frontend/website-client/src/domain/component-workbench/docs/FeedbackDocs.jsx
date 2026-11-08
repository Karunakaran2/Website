import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import ComponentDocPageShell from './ComponentDocPageShell'
import DialogPlayground from '../playgrounds/DialogPlayground'
import { useModuleSecondaryTab } from '@/domain/component-workbench/hooks/useModuleSecondaryTab'
import { PrimaryButton } from '@/shared/components/buttons'
import { WORKBENCH_PREVIEW_ROW_CLASS } from '../constants/workbenchPreviewStyles'
import { showAppToast } from '@/shared/components/toast/appToast'
import {
  feedbackCodeForTab,
  feedbackPreviewForTab,
  feedbackPropsForTab,
  feedbackUsageForTab,
} from './feedbackDocTabs'

const TAB_COPY = {
  alerts: { title: 'Alerts & Banners', lead: 'Inline status banners for contextual warnings that do not block workflow.' },
  toasts: { title: 'Toasts & Notifications', lead: 'Transient feedback via showAppToast (react-toastify) after confirmed actions succeed.' },
  'dialogs-modals': { title: 'Dialogs & Modals', lead: 'ConfirmDialog and FormModal patterns for blocking decisions.' },
  tooltips: { title: 'Tooltips', lead: 'ActionIconTooltip for icon-only controls in tables and toolbars.' },
  'loading-states': { title: 'Loading States', lead: 'Skeletons and inline spinners while async data resolves.' },
  'empty-states': { title: 'Empty States', lead: 'Guidance when lists or tables have no rows to display.' },
}

export default function FeedbackDocs() {
  const secondaryTab = useModuleSecondaryTab('alerts')
  const copy = TAB_COPY[secondaryTab] || TAB_COPY.alerts
  const propsList = feedbackPropsForTab(secondaryTab)
  const codeExample = feedbackCodeForTab(secondaryTab)

  return (
    <ComponentDocPageShell
      title={copy.title}
      badge="Stable"
      lead={copy.lead}
      preview={feedbackPreviewForTab(secondaryTab)}
      states={
        secondaryTab === 'alerts' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2 rounded border border-slate-200 bg-white p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Loading</h4>
              <div className="flex items-center gap-3 rounded border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                <Loader2 className="h-4 w-4 animate-spin text-[#01458e]" aria-hidden />
                <span>Fetching data…</span>
              </div>
            </div>
            <div className="space-y-2 rounded border border-slate-200 bg-white p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Empty</h4>
              <div className="rounded border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
                No records for this filter.
              </div>
            </div>
          </div>
        ) : null
      }
      playground={
        secondaryTab === 'toasts' ? (
          <div className={WORKBENCH_PREVIEW_ROW_CLASS}>
            <PrimaryButton type="button" onClick={() => showAppToast('Record saved successfully.', 'success', { action: 'save' })}>
              Trigger success toast
            </PrimaryButton>
            <PrimaryButton type="button" onClick={() => showAppToast('Unable to reach the service.', 'error')}>
              Trigger error toast
            </PrimaryButton>
          </div>
        ) : secondaryTab === 'dialogs-modals' ? (
          <DialogPlayground />
        ) : secondaryTab === 'loading-states' ? (
          <Link className="font-semibold text-[#01458e] hover:underline" to="/component-workbench/feedback/loading-states">
            Open Loading States demo
          </Link>
        ) : secondaryTab === 'empty-states' ? (
          <Link className="font-semibold text-[#01458e] hover:underline" to="/component-workbench/feedback/empty-states">
            Open Empty States demo
          </Link>
        ) : secondaryTab === 'tooltips' ? (
          <Link className="font-semibold text-[#01458e] hover:underline" to="/component-workbench/feedback/tooltips">
            Open ActionIconTooltip demo
          </Link>
        ) : (
          <Link className="font-semibold text-[#01458e] hover:underline" to="/component-workbench/feedback/alerts">
            Open Alerts demo page
          </Link>
        )
      }
      usage={feedbackUsageForTab(secondaryTab)}
      propsList={propsList}
      codeExample={codeExample}
      accessibility={
        <ul className="list-disc pl-4 space-y-1 text-xs sm:text-sm">
          <li><strong>Live Regions:</strong> Dynamic alerts use <code>role="alert"</code> or <code>aria-live="polite"</code>.</li>
          <li><strong>Focus Restoration:</strong> When a dialog closes, keyboard focus immediately returns to the button that opened it.</li>
          <li><strong>Escape Key:</strong> All non-mandatory dialogs dismiss gracefully via <kbd>Escape</kbd>.</li>
        </ul>
      }
      dosAndDonts={{
        dos: [
          'Pair alert icons with concise heading summaries.',
          'Always provide a "Cancel" button in confirmation dialogs.',
          'Ensure focus is trapped inside active modal windows.',
        ],
        donts: [
          'Never trigger a destructive action without a confirmation dialog.',
          'Do not auto-dismiss error alerts before the user can read the error message.',
          'Avoid stacking multiple modals on top of each other.',
        ],
      }}
      relatedComponents={[
        { title: 'Dialog Playground', to: '/component-workbench/lib-playgrounds/dialog-playground' },
        { title: 'Buttons & Triggers', to: '/component-workbench/lib-actions/buttons' },
        { title: 'Form Validation', to: '/component-workbench/lib-forms/validation' },
      ]}
    />
  )
}
