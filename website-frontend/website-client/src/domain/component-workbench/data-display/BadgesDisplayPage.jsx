import { useState } from 'react'
import StatusChip from '@/shared/components/status/StatusChip'
import { SelectField } from '@/shared/components/forms'
import { ActionButton } from '@/shared/components/buttons'
import {
  GIGW_STATUS_VARIANT_CLASS,
} from '@/shared/components/status/gigwStatusBadgeStyles'

const STATUS_CATALOGUE = [
  { label: 'Active', category: 'Operational', variant: 'success', description: 'Entity is active, authorized, and functioning.' },
  { label: 'Approved', category: 'Workflow', variant: 'success', description: 'Administrative or financial sanction granted.' },
  { label: 'Verified', category: 'Workflow', variant: 'success', description: 'Maker-checker audit verified successfully.' },
  { label: 'Completed', category: 'Lifecycle', variant: 'success', description: 'Lifecycle finished and ledger closed.' },
  { label: 'Paid', category: 'Financial', variant: 'success', description: 'Disbursement executed through treasury gateway.' },
  { label: 'Pending', category: 'Workflow', variant: 'warning', description: 'Awaiting review or supervisory action.' },
  { label: 'Draft', category: 'Lifecycle', variant: 'warning', description: 'Unsubmitted record saved by author.' },
  { label: 'Waiting', category: 'Workflow', variant: 'warning', description: 'Queued for external dependency resolution.' },
  { label: 'Forwarded', category: 'Workflow', variant: 'info', description: 'Transmitted to subsequent department desk.' },
  { label: 'In Progress', category: 'Lifecycle', variant: 'info', description: 'Currently undergoing active processing.' },
  { label: 'Frozen', category: 'Administrative', variant: 'info', description: 'Temporarily locked for fiscal year closure.' },
  { label: 'Rejected', category: 'Workflow', variant: 'danger', description: 'Disapproved by sanctioning officer.' },
  { label: 'Deleted', category: 'Lifecycle', variant: 'danger', description: 'Flagged for archival or removal.' },
  { label: 'Inactive', category: 'Operational', variant: 'neutral', description: 'Disabled or decommissioned system record.' },
  { label: 'Archived', category: 'Lifecycle', variant: 'neutral', description: 'Historical record preserved for statutory audit.' },
]

export default function BadgesDisplayPage() {
  const [interactiveStatus, setInteractiveStatus] = useState('Approved')
  const [customText, setCustomText] = useState('')

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* 1. GIGW Semantic Status Badges */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">GIGW Compliant Status Chips (StatusChip)</h2>
          <p className="mt-1 text-xs text-slate-500">
            Standard status pills based on government portal .seepz-btn-status styling with high-contrast text and non-reliant color semantics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {STATUS_CATALOGUE.map((item) => (
            <div
              key={item.label}
              className="flex items-start justify-between rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 hover:bg-white transition-colors"
            >
              <div className="pr-3">
                <span className="text-xs font-semibold text-slate-800">{item.label}</span>
                <p className="mt-0.5 text-[11px] text-slate-500 leading-tight">{item.description}</p>
                <span className="mt-2 inline-block text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  {item.category}
                </span>
              </div>
              <StatusChip label={item.label} />
            </div>
          ))}
        </div>
      </div>

      {/* 2. Interactive Status Tester */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Interactive Status Evaluator</h2>
          <p className="mt-1 text-xs text-slate-500">
            Select a preset or input any custom label to verify how StatusChip automatically computes tone tokens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <SelectField
              id="badge-status-select"
              name="interactiveStatus"
              label="Select Standard Status Label"
              value={interactiveStatus}
              onChange={(e) => {
                setInteractiveStatus(e.target.value)
                setCustomText('')
              }}
              options={[
                { value: 'Active', label: 'Active (Success)' },
                { value: 'Approved', label: 'Approved (Success)' },
                { value: 'Verified', label: 'Verified (Success)' },
                { value: 'Pending', label: 'Pending (Warning)' },
                { value: 'Draft', label: 'Draft (Warning)' },
                { value: 'Forwarded', label: 'Forwarded (Info)' },
                { value: 'Rejected', label: 'Rejected (Danger)' },
                { value: 'Inactive', label: 'Inactive (Neutral)' },
                { value: 'Deactivated', label: 'Deactivated (Neutral)' },
              ]}
            />

            <div>
              <label htmlFor="custom-status-input" className="block text-xs font-medium text-slate-700 mb-1">
                Or Type Custom Status String
              </label>
              <input
                id="custom-status-input"
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. Under Audit Review, Dispatched, Quarantined"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-[#01458e] focus:outline-none focus:ring-1 focus:ring-[#01458e]"
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <span className="text-xs font-medium text-slate-500 mb-2">Evaluated StatusChip Output</span>
            <div className="my-2">
              <StatusChip label={customText.trim() || interactiveStatus} />
            </div>
            <p className="mt-3 text-[11px] text-slate-500 max-w-xs">
              Label: <strong className="text-slate-800">&quot;{customText.trim() || interactiveStatus}&quot;</strong>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Tone Tokens Specimen Strip */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Color Contrast & Accessibility Tokens</h2>
          <p className="mt-1 text-xs text-slate-500">
            All status chip tokens maintain minimum 4.5:1 WCAG 2.2 AA contrast ratios between background and foreground text.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <div className="rounded-lg border border-slate-200 p-3 text-center bg-white">
            <span className="block text-xs font-semibold text-slate-700 mb-2">Success</span>
            <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${GIGW_STATUS_VARIANT_CLASS.success}`}>
              Approved
            </span>
            <span className="mt-2 block text-[10px] text-slate-400">#1b5e20 on #e8f5e9</span>
          </div>

          <div className="rounded-lg border border-slate-200 p-3 text-center bg-white">
            <span className="block text-xs font-semibold text-slate-700 mb-2">Warning</span>
            <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${GIGW_STATUS_VARIANT_CLASS.warning}`}>
              Pending
            </span>
            <span className="mt-2 block text-[10px] text-slate-400">#8a4b00 on #fff4e5</span>
          </div>

          <div className="rounded-lg border border-slate-200 p-3 text-center bg-white">
            <span className="block text-xs font-semibold text-slate-700 mb-2">Danger</span>
            <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${GIGW_STATUS_VARIANT_CLASS.danger}`}>
              Rejected
            </span>
            <span className="mt-2 block text-[10px] text-slate-400">#b42318 on #fdecec</span>
          </div>

          <div className="rounded-lg border border-slate-200 p-3 text-center bg-white">
            <span className="block text-xs font-semibold text-slate-700 mb-2">Info</span>
            <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${GIGW_STATUS_VARIANT_CLASS.info}`}>
              Forwarded
            </span>
            <span className="mt-2 block text-[10px] text-slate-400">#005a9c on #e0f2fe</span>
          </div>

          <div className="rounded-lg border border-slate-200 p-3 text-center bg-white">
            <span className="block text-xs font-semibold text-slate-700 mb-2">Neutral</span>
            <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${GIGW_STATUS_VARIANT_CLASS.neutral}`}>
              Inactive
            </span>
            <span className="mt-2 block text-[10px] text-slate-400">#344054 on #f2f4f7</span>
          </div>
        </div>
      </div>
    </div>
  )
}
