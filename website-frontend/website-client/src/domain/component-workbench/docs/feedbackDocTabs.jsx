import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  XCircle,
} from 'lucide-react'

export function feedbackPreviewForTab(tab) {
  switch (tab) {
    case 'toasts':
      return (
        <p className="max-w-2xl text-sm text-slate-600">
          Toasts appear bottom-center via <code className="text-xs">AppSuccessToastContainer</code>. Style is
          Tailwind-only in <code className="text-xs">toastAppearance.js</code> — success tint uses confirm{' '}
          <code className="text-xs">action</code> (save, approve, delete).
        </p>
      )
    case 'dialogs-modals':
      return (
        <p className="max-w-2xl text-sm text-slate-600">
          Use <code className="text-xs">ConfirmDialog</code> after client validation passes. Use{' '}
          <code className="text-xs">FormModal</code> for CRUD; set <code className="text-xs">showFooter=false</code>{' '}
          when the form footer lives inside the body.
        </p>
      )
    case 'tooltips':
      return (
        <p className="max-w-2xl text-sm text-slate-600">
          <code className="text-xs">ActionIconTooltip</code> closes on click and stays closed until a new hover — do
          not rely on CSS :hover alone for table row icons.
        </p>
      )
    case 'loading-states':
      return (
        <div className="flex max-w-md items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <Loader2 className="h-5 w-5 shrink-0 animate-spin text-[#01458e]" aria-hidden />
          <span>Loading table data…</span>
        </div>
      )
    case 'empty-states':
      return (
        <div className="max-w-md rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="text-sm font-semibold text-slate-800">No data available in table</p>
          <p className="mt-1 text-xs text-slate-500">Adjust filters or add a record to populate this list.</p>
        </div>
      )
    case 'alerts':
    default:
      return (
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
            <div>
              <h4 className="text-xs font-bold text-emerald-900">Success</h4>
              <p className="mt-0.5 text-xs text-emerald-700">Operation completed; user can continue working.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
            <div>
              <h4 className="text-xs font-bold text-amber-900">Warning</h4>
              <p className="mt-0.5 text-xs text-amber-700">Non-blocking notice; does not require immediate action.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden />
            <div>
              <h4 className="text-xs font-bold text-red-900">Error</h4>
              <p className="mt-0.5 text-xs text-red-700">Blocking or failed operation; pair with field errors when applicable.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-sky-200 bg-sky-50 p-4 text-sky-900">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" aria-hidden />
            <div>
              <h4 className="text-xs font-bold">Information</h4>
              <p className="mt-0.5 text-xs text-sky-800">Neutral guidance or policy reminder.</p>
            </div>
          </div>
        </div>
      )
  }
}

export function feedbackUsageForTab(tab) {
  const map = {
    alerts: (
      <>
        <p>
          <strong>Inline only:</strong> Do not toast client validation — use <code>FieldError</code> on the field.
        </p>
        <p>
          <strong>Persist errors:</strong> Error banners stay until the underlying issue is resolved or dismissed.
        </p>
      </>
    ),
    toasts: (
      <>
        <p>
          <strong>After confirm + API success:</strong>{' '}
          <code>showAppToast(message, &apos;success&apos;, &#123; action: &apos;save&apos; &#125;)</code>.
        </p>
        <p>
          <strong>Never</strong> toast before the server confirms the mutation.
        </p>
      </>
    ),
    'dialogs-modals': (
      <>
        <p>
          <strong>Order:</strong> validate → confirm → mutate. Pass <code>stack: &apos;nested&apos;</code> when a list
          modal is open.
        </p>
        <p>
          <strong>Tones:</strong> primary (save), approve (green filled), verify (green outline), danger (delete).
        </p>
      </>
    ),
    tooltips: (
      <p>
        Icon-only controls must expose an accessible name via tooltip or <code>aria-label</code> on the button.
      </p>
    ),
    'loading-states': (
      <p>Use domain skeletons where available; DataTable <code>loading</code> shows row placeholders.</p>
    ),
    'empty-states': (
      <p>
        DataTable default empty copy: <code>No data available in table</code>. Provide actionable next steps in domain
        empty panels.
      </p>
    ),
  }
  return <div className="space-y-3">{map[tab] || map.alerts}</div>
}

export function feedbackCodeForTab(tab) {
  const examples = {
    alerts: `// Inline banner — contextual, non-blocking
<div className="rounded-lg border border-amber-200 bg-amber-50 p-4" role="status">
  <p className="text-sm font-semibold text-amber-900">Unsaved changes</p>
</div>`,
    toasts: `import { showAppToast } from '@/shared/components/toast/appToast'

// After confirm + successful save:
showAppToast('Record saved.', 'success', { action: 'save' })`,
    'dialogs-modals': `import { confirmBeforeAction } from '@/shared/components/confirm'

await confirmBeforeAction(requestConfirm, {
  action: 'delete',
  validate: () => validateTriggerForm(trigger),
  runAction: () => deleteMutation(idMask),
})`,
    tooltips: `import { TableViewAction } from '@/shared/components/buttons'

<TableViewAction title="View" onClick={() => openView(row.idMask)} />`,
    'loading-states': `<DataTable loading={isFetching} columns={columns} rows={rows} />`,
    'empty-states': `<DataTable emptyMessage="No data available in table" rows={[]} />`,
  }
  return examples[tab] || examples.alerts
}

export function feedbackPropsForTab(tab) {
  if (tab === 'toasts') {
    return [
      { name: 'message', type: 'string', required: true, description: 'User-visible toast text.' },
      { name: 'tone', type: "'success' | 'error' | 'warning' | 'info'", description: 'Visual severity.' },
      { name: 'options.action', type: 'string', description: 'Confirm action key for success text colour.' },
    ]
  }
  if (tab === 'dialogs-modals') {
    return [
      { name: 'open', type: 'boolean', description: 'Controls dialog visibility.' },
      { name: 'title', type: 'string', description: 'Dialog heading.' },
      { name: 'onConfirm', type: '() => void | Promise', description: 'Runs after user confirms.' },
    ]
  }
  return [
    { name: 'variant', type: "'success' | 'warning' | 'error' | 'info'", default: "'info'", description: 'Alert tone.' },
    { name: 'title', type: 'string', description: 'Short summary.' },
    { name: 'children', type: 'ReactNode', required: true, description: 'Body copy.' },
  ]
}
