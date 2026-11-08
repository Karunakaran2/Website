import { useState } from 'react'
import {
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react'
import { ConfirmDialog } from '@/shared/components/modals'
import ActionButton from '@/shared/components/buttons/ActionButton'

export default function FeedbackExplorerPage() {
  const [showConfirm, setShowConfirm] = useState(false)
  const [outcome, setOutcome] = useState('')

  return (
    <div className="space-y-6 pb-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Alerts Section */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">
            Inline Feedback Banners
          </h3>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Sanction Approved</span>
              <p className="text-emerald-700 mt-0.5">Budget allocation of ₹12,50,000 has been sanctioned for release.</p>
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800 flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Fiscal Period Closing</span>
              <p className="text-amber-700 mt-0.5">Monthly audit closure deadline is in 3 days. Complete all voucher reconciliations.</p>
            </div>
          </div>

          <div className="rounded-lg border border-sky-200 bg-sky-50 p-3.5 text-xs text-sky-800 flex items-start gap-2.5">
            <Info className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">System Update</span>
              <p className="text-sky-700 mt-0.5">KRAN Design System v2.4 introduces enhanced keyboard focus indicators.</p>
            </div>
          </div>
        </div>

        {/* Modal Dialog Trigger */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-2">
              Confirmation Dialog Trigger
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Trigger a real modal dialog to test user confirmation workflows, background scrolling lock, and focus management.
            </p>

            <ActionButton
              type="button"
              variant="delete"
              onClick={() => setShowConfirm(true)}
            >
              Trigger Deletion Confirmation
            </ActionButton>
          </div>

          {outcome ? (
            <div className="mt-4 rounded bg-slate-100 p-2.5 text-xs text-slate-700 font-mono">
              Result: {outcome}
            </div>
          ) : null}
        </div>
      </div>

      {showConfirm ? (
        <ConfirmDialog
          title="Delete Accounting Record"
          message="Are you sure you want to delete this sample record? This will trigger an event in the audit trail."
          confirmLabel="Delete Record"
          tone="delete"
          onConfirm={() => {
            setShowConfirm(false)
            setOutcome('Record deleted successfully.')
          }}
          onCancel={() => {
            setShowConfirm(false)
            setOutcome('Deletion cancelled by user.')
          }}
        />
      ) : null}
    </div>
  )
}
