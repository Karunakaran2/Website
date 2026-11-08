import { useState } from 'react'
import { CheckCircle2, AlertTriangle, Info, AlertCircle, X, RefreshCw } from 'lucide-react'
import ActionButton from '@/shared/components/buttons/ActionButton'
import { WORKBENCH_SECTION_CARD_CLASS } from '../constants/workbenchPreviewStyles'

export default function AlertsFeedbackPage() {
  const [dismissedAlerts, setDismissedAlerts] = useState({})
  const [lastAction, setLastAction] = useState(null)

  const handleDismiss = (id) => {
    setDismissedAlerts((prev) => ({ ...prev, [id]: true }))
    setLastAction(`Dismissed alert: ${id}`)
  }

  const handleResetAlerts = () => {
    setDismissedAlerts({})
    setLastAction('Reset all alerts to visible state')
  }

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* 1. Standard System Alert Banners */}
      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Standard Alert Banners</h2>
          <p className="mt-1 text-xs text-slate-500">
            Conforming to GIGW 3.0 & WCAG 2.2 AA: minimum 4.5:1 text contrast, high-visibility semantic status icons, and accessible screen reader live regions.
          </p>
        </div>

        <div className="space-y-4">
          {/* Success Banner */}
          {!dismissedAlerts['alert-success'] && (
            <div
              role="status"
              aria-live="polite"
              className="flex items-start justify-between gap-3 rounded-lg border border-emerald-300 bg-emerald-50/90 p-4 text-emerald-900 transition-all"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-emerald-950">Administrative Sanction Approved</h3>
                  <p className="mt-0.5 text-xs text-emerald-800 leading-relaxed">
                    Capital works proposal #CW-2026-0814 has been approved by the Competent Authority. Budget allocation of ₹48,50,000 is sanctioned for immediate disbursement.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDismiss('alert-success')}
                className="text-emerald-700 hover:text-emerald-950 p-1 rounded-md hover:bg-emerald-100/60 transition-colors"
                aria-label="Dismiss success alert"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Warning Banner */}
          {!dismissedAlerts['alert-warning'] && (
            <div
              role="alert"
              aria-live="assertive"
              className="flex items-start justify-between gap-3 rounded-lg border border-amber-300 bg-amber-50/90 p-4 text-amber-900 transition-all"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-amber-950">Quarterly Audit Reconciliation Approaching</h3>
                  <p className="mt-0.5 text-xs text-amber-800 leading-relaxed">
                    Financial Year 2026-27 Quarter 3 audit freeze takes effect in 48 hours. Ensure all outstanding vouchers, contra entries, and bank reconciliation files are posted.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDismiss('alert-warning')}
                className="text-amber-700 hover:text-amber-950 p-1 rounded-md hover:bg-amber-100/60 transition-colors"
                aria-label="Dismiss warning alert"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Info Banner */}
          {!dismissedAlerts['alert-info'] && (
            <div
              role="status"
              aria-live="polite"
              className="flex items-start justify-between gap-3 rounded-lg border border-sky-300 bg-sky-50/90 p-4 text-sky-900 transition-all"
            >
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-[#01458e] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-[#01458e]">System Maintenance Window Scheduled</h3>
                  <p className="mt-0.5 text-xs text-sky-800 leading-relaxed">
                    Core state treasury gateway services will undergo planned security updates on Sunday between 02:00 AM and 04:00 AM IST. Offline voucher entry remains enabled.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDismiss('alert-info')}
                className="text-[#01458e] hover:text-[#002f6c] p-1 rounded-md hover:bg-sky-100/60 transition-colors"
                aria-label="Dismiss info alert"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Destructive / Error Banner */}
          {!dismissedAlerts['alert-error'] && (
            <div
              role="alert"
              aria-live="assertive"
              className="flex items-start justify-between gap-3 rounded-lg border border-rose-300 bg-rose-50/90 p-4 text-rose-900 transition-all"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-rose-950">Statutory Tax Validation Failure</h3>
                  <p className="mt-0.5 text-xs text-rose-800 leading-relaxed">
                    E-Invoice authentication gateway reported an invalid GSTIN checksum for Party Ref #GST-KL-9082. Correct the master profile before resubmitting payment voucher.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDismiss('alert-error')}
                className="text-rose-700 hover:text-rose-950 p-1 rounded-md hover:bg-rose-100/60 transition-colors"
                aria-label="Dismiss error alert"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Reset & Status Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <span className="text-xs text-slate-500">
            {lastAction || 'All alert banners active'}
          </span>
          {Object.keys(dismissedAlerts).length > 0 && (
            <ActionButton
              type="button"
              variant="reset"
              onClick={handleResetAlerts}
              className="inline-flex items-center gap-1.5"
            >
              <RefreshCw size={13} />
              <span>Restore Dismissed Alerts</span>
            </ActionButton>
          )}
        </div>
      </div>

      {/* 2. Accessibility & Behavior Spec */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Accessibility & Implementation Rules</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-1">Live Region Semantics</h4>
            <p>Critical errors and security warnings must use <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">role="alert"</code> and <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">aria-live="assertive"</code> to notify screen readers immediately.</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-1">Color Contrast Guarantee</h4>
            <p>Never rely solely on color to convey severity. Every banner incorporates a distinct semantic icon and high-contrast text conforming to WCAG 2.2 AA (4.5:1 minimum).</p>
          </div>
        </div>
      </div>
    </div>
  )
}
