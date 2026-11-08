import { useState } from 'react'
import { AlertTriangle, CheckCircle2, ShieldCheck, Trash2, HelpCircle } from 'lucide-react'
import ConfirmDialog from '@/shared/components/modals/ConfirmDialog'
import ActionButton from '@/shared/components/buttons/ActionButton'

export default function DialogsFeedbackPage() {
  const [activeDialog, setActiveDialog] = useState(null)
  const [phase, setPhase] = useState('idle')
  const [lastResult, setLastResult] = useState(null)

  const openDialog = (type) => {
    setActiveDialog(type)
    setPhase('idle')
  }

  const handleConfirm = () => {
    setPhase('working')
    setTimeout(() => {
      setPhase('done')
      setTimeout(() => {
        setLastResult(`Confirmed action for: ${activeDialog}`)
        setActiveDialog(null)
        setPhase('idle')
      }, 700)
    }, 1200)
  }

  const handleCancel = () => {
    setActiveDialog(null)
    setPhase('idle')
    setLastResult('Dialog cancelled by user')
  }

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* 1. Modal Dialog Showcase */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Confirmation Dialogs (ConfirmDialog)</h2>
          <p className="mt-1 text-xs text-slate-500">
            Standard SEEPZ modal shell with compact width, accessible focus trap, backdrop dimming, and contextual action button styling.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Primary / Save Dialog */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#01458e] font-bold text-xs mb-1">
                <HelpCircle size={16} />
                <span>Save / Submit Dialog</span>
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Primary workflow confirmation before persisting ledger or configuration changes.
              </p>
            </div>
            <ActionButton
              type="button"
              variant="save"
              className="w-full text-xs"
              onClick={() => openDialog('save')}
            >
              Open Save Dialog
            </ActionButton>
          </div>

          {/* Delete Dialog */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs mb-1">
                <Trash2 size={16} />
                <span>Destructive Delete</span>
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                High-friction confirmation with red CTA tone for irreversible record deletions.
              </p>
            </div>
            <ActionButton
              type="button"
              variant="delete"
              className="w-full text-xs"
              onClick={() => openDialog('delete')}
            >
              Open Delete Dialog
            </ActionButton>
          </div>

          {/* Approve Dialog */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs mb-1">
                <CheckCircle2 size={16} />
                <span>Approve Sanction</span>
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Workflow approval dialog triggering financial sanction and digital endorsement.
              </p>
            </div>
            <ActionButton
              type="button"
              variant="submit"
              className="w-full text-xs bg-emerald-600 hover:bg-emerald-700 border-emerald-700"
              onClick={() => openDialog('approve')}
            >
              Open Approve Dialog
            </ActionButton>
          </div>

          {/* Verify Dialog */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-teal-700 font-bold text-xs mb-1">
                <ShieldCheck size={16} />
                <span>Verify Step</span>
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Supervisory verification step for audit trails and physical asset inspections.
              </p>
            </div>
            <ActionButton
              type="button"
              variant="primary"
              className="w-full text-xs bg-teal-700 hover:bg-teal-800 border-teal-800"
              onClick={() => openDialog('verify')}
            >
              Open Verify Dialog
            </ActionButton>
          </div>
        </div>

        {/* Telemetry Display */}
        {lastResult && (
          <div className="mt-6 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50/70 px-4 py-2.5 text-xs text-[#01458e]">
            <span>Last Dialog Action: <strong>{lastResult}</strong></span>
            <button
              type="button"
              onClick={() => setLastResult(null)}
              className="text-xs font-semibold underline hover:text-[#002f6c]"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* 2. Dialog Accessibility Specifications */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Modal Focus & Keyboard Conventions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-1">Focus Trapping</h4>
            <p>Upon modal launch, focus transfers to the primary action button. <kbd className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">Tab</kbd> cycle is strictly confined within the modal shell.</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-1">Escape Key Dismissal</h4>
            <p>Pressing <kbd className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">Escape</kbd> safely dismisses the dialog unless an asynchronous submission is in <code className="font-mono text-[11px]">phase="working"</code>.</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-1">Restoration of Trigger Focus</h4>
            <p>Closing the modal automatically restores focus to the triggering element, preserving the user's sequential workflow on the parent page.</p>
          </div>
        </div>
      </div>

      {/* Live ConfirmDialog Instances */}
      <ConfirmDialog
        open={activeDialog === 'save'}
        title="Confirm Record Save"
        message="Are you sure you want to save this voucher record?"
        description="All entered account heads and tax ledger entries will be validated and queued for supervisory verification."
        confirmLabel="Yes, Save"
        cancelLabel="Cancel"
        tone="save"
        phase={phase}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <ConfirmDialog
        open={activeDialog === 'delete'}
        title="Confirm Record Deletion"
        message="Are you sure you want to permanently delete Asset Record #AST-2026-081?"
        description="This action cannot be undone. The asset classification and associated depreciation schedules will be purged."
        confirmLabel="Yes, Delete"
        cancelLabel="Keep Record"
        tone="delete"
        phase={phase}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <ConfirmDialog
        open={activeDialog === 'approve'}
        title="Confirm Financial Sanction"
        message="Approve capital allocation of ₹48,50,000 for this project?"
        description="This will issue a sanctioned voucher token and notify the treasury disbursing officer."
        confirmLabel="Approve Sanction"
        cancelLabel="Return"
        tone="approve"
        phase={phase}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <ConfirmDialog
        open={activeDialog === 'verify'}
        title="Confirm Asset Verification"
        message="Mark physical verification checklist as verified?"
        description="Your user credentials and timestamp will be logged in the statutory audit register."
        confirmLabel="Mark Verified"
        cancelLabel="Cancel"
        tone="verify"
        phase={phase}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  )
}
