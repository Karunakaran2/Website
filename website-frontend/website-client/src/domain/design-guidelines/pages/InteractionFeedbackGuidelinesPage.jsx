import GuidelineCard from '../components/GuidelineCard'

export default function InteractionFeedbackGuidelinesPage() {
  return (
    <div className="space-y-6 pb-12 w-full">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Feedback, Confirmation, and Interaction</h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-3xl leading-relaxed">
          Meaningful feedback uses one toast stack (<code className="text-xs">showAppToast</code>), inline field errors for
          validation, and the centralized <code className="text-xs">ActionConfirmProvider</code> (
          <code className="text-xs">confirmBeforeAction</code> + shared <code className="text-xs">ConfirmDialog</code>)
          only when the user commits a meaningful, persisted, or irreversible action.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <GuidelineCard title="Confirmation provider" badge="Mandatory">
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            <li>
              App root mounts <code className="text-[11px]">ActionConfirmProvider</code> once (
              <code className="text-[11px]">AppProviders.jsx</code>) — one dialog stack for the whole app.
            </li>
            <li>
              Use <code className="text-[11px]">useActionConfirm()</code> /{' '}
              <code className="text-[11px]">useDeleteConfirm()</code> +{' '}
              <code className="text-[11px]">confirmBeforeAction</code> for save, update, delete, submit, approve,
              reject, process, upload, and similar mutations — not ad-hoc page-local confirm state.
            </li>
            <li>
              Copy and button tones come from <code className="text-[11px]">actionConfirmDefaults.js</code>; override{' '}
              <code className="text-[11px]">title</code> / <code className="text-[11px]">message</code> /{' '}
              <code className="text-[11px]">recordLabel</code> for context.
            </li>
          </ul>
        </GuidelineCard>

        <GuidelineCard title="When to confirm" badge="Policy">
          <p className="text-xs text-slate-700 mb-2 leading-relaxed">
            Centralized confirmation keeps UX consistent; it must not interrupt routine browsing.
          </p>
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            <li>
              <strong className="font-semibold text-slate-900">Confirm:</strong> user commits data (save/update/submit),
              deletes or deactivates records, workflow steps (approve/verify/reject/forward), file upload/import, or
              other actions that change authoritative state.
            </li>
            <li>
              <strong className="font-semibold text-slate-900">Do not confirm:</strong> opening a route or page,
              switching module tabs, opening view/edit modals to read data, search, filters, sort, pagination, row
              selection, Back/Cancel that discards no saved draft, or navigation between sections.
            </li>
            <li>
              Optional product calls: bulk export/download may confirm when the export is sensitive or heavy; a
              frictionless CSV of the current filtered view may export immediately with toast-only feedback.
            </li>
          </ul>
        </GuidelineCard>

        <GuidelineCard title="Validation Order" badge="Forms">
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            <li>Run client validation first (<code className="text-[11px]">trigger()</code>, rose border, <code className="text-[11px]">FieldError</code>).</li>
            <li>Do not toast required-field failures — show per-field errors.</li>
            <li>After validation passes, open confirm for save, delete, approve, upload, and process actions.</li>
          </ul>
        </GuidelineCard>

        <GuidelineCard title="Toasts" badge="Feedback">
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            <li>Mount <code className="text-[11px]">AppSuccessToastContainer</code> once at app root.</li>
            <li>Success toasts may pass <code className="text-[11px]">{`{ action: 'save' }`}</code> for tone alignment.</li>
            <li>Server and mutation failures: error toast or inline banner — not both for the same issue.</li>
          </ul>
        </GuidelineCard>

        <GuidelineCard title="Modals & Drawers" badge="Overlays">
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            <li>List CRUD: <code className="text-[11px]">FormModal</code> with <code className="text-[11px]">showFooter={false}</code> and in-form{' '}
              <code className="text-[11px]">DomainFormFooter</code>.</li>
            <li>View modals: <code className="text-[11px]">OrgDataDisplay</code> (three columns default).</li>
            <li>Trap focus in dialogs; restore focus to trigger on close.</li>
          </ul>
        </GuidelineCard>

        <GuidelineCard title="Loading & Empty States" badge="States">
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            <li>Use domain skeletons or table loading props — avoid blank panels during fetch.</li>
            <li>Empty states explain how to populate data; avoid developer implementation notes.</li>
            <li>Simulated errors (demos only) must use user-facing copy, not mock-storage jargon.</li>
          </ul>
        </GuidelineCard>
      </div>
    </div>
  )
}
