import { useState } from 'react'
import { Bell, CheckCircle2, AlertTriangle, Info, AlertCircle, RefreshCw } from 'lucide-react'
import { showAppToast, toast } from '@/shared/components/toast/appToast'
import ActionButton from '@/shared/components/buttons/ActionButton'

export default function NotificationsFeedbackPage() {
  const [toastHistory, setToastHistory] = useState([])

  const triggerToast = (tone, message, action) => {
    showAppToast(message, tone, { action })
    setToastHistory((prev) => [
      {
        id: Date.now(),
        tone,
        message,
        time: new Date().toLocaleTimeString(),
      },
      ...prev.slice(0, 4),
    ])
  }

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* 1. App Toast Dispatcher */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Application Toast Notifications (showAppToast)</h2>
          <p className="mt-1 text-xs text-slate-500">
            Bottom-center notifications matching Probity Client specs with action-tinted progress indicators, auto-dismiss, and keyboard focus preservation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Success Toast */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs mb-1">
                <CheckCircle2 size={16} />
                <span>Success Toast</span>
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Dispatches green confirmation for completed saves, posting, and record submissions.
              </p>
            </div>
            <ActionButton
              type="button"
              variant="save"
              className="w-full text-xs"
              onClick={() => triggerToast('success', 'Asset record #AST-2026-081 saved successfully.', 'save')}
            >
              Trigger Success Toast
            </ActionButton>
          </div>

          {/* Warning Toast */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs mb-1">
                <AlertTriangle size={16} />
                <span>Warning Toast</span>
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Alerts user of approaching deadlines, fiscal period closures, and validation caveats.
              </p>
            </div>
            <ActionButton
              type="button"
              variant="submit"
              className="w-full text-xs bg-amber-600 hover:bg-amber-700 border-amber-700"
              onClick={() => triggerToast('warning', 'Budget limit utilization reached 92% of allotment.', 'submit')}
            >
              Trigger Warning Toast
            </ActionButton>
          </div>

          {/* Info Toast */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#01458e] font-bold text-xs mb-1">
                <Info size={16} />
                <span>Info / Update Toast</span>
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Communicates background queue updates, refreshed table states, and system notifications.
              </p>
            </div>
            <ActionButton
              type="button"
              variant="primary"
              className="w-full text-xs"
              onClick={() => triggerToast('info', 'Bank reconciliation cache synchronized.', 'update')}
            >
              Trigger Info Toast
            </ActionButton>
          </div>

          {/* Error Toast */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs mb-1">
                <AlertCircle size={16} />
                <span>Error Toast</span>
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                High-priority notification with extended auto-close duration (6s) for failed operations.
              </p>
            </div>
            <ActionButton
              type="button"
              variant="delete"
              className="w-full text-xs"
              onClick={() => triggerToast('error', 'Failed to transmit voucher: Server returned HTTP 503.')}
            >
              Trigger Error Toast
            </ActionButton>
          </div>
        </div>

        {/* Live Dispatch History */}
        {toastHistory.length > 0 && (
          <div className="mt-6 border-t border-slate-100 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Recent Dispatched Toasts
            </h3>
            <div className="space-y-2">
              {toastHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                      {item.tone}
                    </span>
                    <span>{item.message}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. System Notification Rules */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Toast Timing & Contrast Specifications</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-1">Success & Info Duration</h4>
            <p>Automatically dismisses after <strong>3,500ms</strong> to minimize screen clutter while allowing adequate cognitive comprehension.</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-1">Error & Destructive Duration</h4>
            <p>Extended duration of <strong>6,000ms</strong> ensures users with reading impairments can review the error details before dismissal.</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-1">Interactive Pause on Hover</h4>
            <p>Hovering or focusing over the toast halts the timer progress bar immediately, complying with WCAG 2.2 Success Criterion 2.2.1 (Timing Adjustable).</p>
          </div>
        </div>
      </div>
    </div>
  )
}
