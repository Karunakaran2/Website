import { useState } from 'react'
import { ShieldCheck, CheckCircle2, Clock, FileCheck, AlertTriangle, Send } from 'lucide-react'
import SampleModuleLayout from '../layouts/SampleModuleLayout'
import StatusChip from '@/shared/components/status/StatusChip'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { confirmBeforeAction, useActionConfirm } from '@/shared/components/confirm'
import { showAppToast } from '@/shared/components'
import { TextAreaField, formCheckboxControlClass } from '@/shared/components/forms'

const STATUTORY_CRITERIA = [
  {
    id: 'crit-1',
    code: 'GIGW-3.0-ACC',
    title: 'GIGW 3.0 & WCAG 2.2 AA Web Accessibility Mandate',
    authority: 'Ministry of Electronics & Information Technology (MeitY)',
    description: 'All public digital interfaces meet 4.5:1 color contrast, visible focus rings, screen reader labels, and keyboard operability.',
    mandatory: true,
  },
  {
    id: 'crit-2',
    code: 'PWD-ENG-702',
    title: 'Technical Feasibility & Soil Investigation Order',
    authority: 'Superintending Engineer (Civil Wing)',
    description: 'Structural foundation design certified against seismic zone III criteria and Kerala PWD Code standards.',
    mandatory: true,
  },
  {
    id: 'crit-3',
    code: 'FIN-DFPR-04',
    title: 'Delegation of Financial Powers (DFPR) Limit Compliance',
    authority: 'Finance Department (Government of Kerala)',
    description: 'Sanction amount falls strictly within delegated threshold of Principal Secretary without requiring cabinet referral.',
    mandatory: true,
  },
  {
    id: 'crit-4',
    code: 'ENV-PCB-2026',
    title: 'State Pollution Control Board Site Consent',
    authority: 'Kerala State Pollution Control Board',
    description: 'Environmental impact assessment submitted and temporary consent to establish obtained for the execution site.',
    mandatory: true,
  },
  {
    id: 'crit-5',
    code: 'AG-STAT-09',
    title: 'Accountant General (Audit) Statutory Notation',
    authority: 'Principal Accountant General (Audit)',
    description: 'Capital asset classification numbers assigned in fixed asset register for fiscal depreciation schedules.',
    mandatory: false,
  },
]

export default function SampleAccessibilityPage() {
  const requestConfirm = useActionConfirm()
  const [checkedItems, setCheckedItems] = useState({
    'crit-1': true,
    'crit-2': true,
    'crit-3': true,
    'crit-4': true,
    'crit-5': false,
  })
  const [auditorRemarks, setAuditorRemarks] = useState(
    'All mandatory engineering, financial, and digital accessibility prerequisites have been inspected and confirmed in conformity with government norms.'
  )
  const [certified, setCertified] = useState(false)

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const completedCount = Object.values(checkedItems).filter(Boolean).length
  const totalCount = STATUTORY_CRITERIA.length
  const progressPercent = Math.round((completedCount / totalCount) * 100)

  const handleSignCertificate = () => {
    confirmBeforeAction(requestConfirm, {
      action: 'approve',
      stack: 'base',
      title: 'Sign Statutory Compliance Certificate',
      message: 'Endorse and submit the Statutory Compliance Certificate for Project #CW-2026-9042?',
      description: 'Your digital signature token will be appended to the permanent audit record.',
      confirmLabel: 'Yes, Sign Certificate',
      successMessage: 'Statutory Compliance Certificate signed and archived.',
      runAction: async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 1200)
        })
        setCertified(true)
        return true
      },
    })
  }

  return (
    <SampleModuleLayout activeTab="accessibility">
      <div className="space-y-6 w-full">
        {/* Certificate Issued Banner */}
        {certified && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-xl border border-emerald-300 bg-emerald-50/90 p-4 text-emerald-950 flex items-start gap-3 animate-fadeIn"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-xs">Statutory Compliance Certificate Issued (#SCC-2026-0814)</h3>
              <p className="mt-0.5 text-xs text-emerald-800 leading-relaxed">
                Project CW-2026-9042 has satisfied all mandatory GIGW 3.0, DFPR, and technical audit checks. Certificate token registered in State Audit Repository.
              </p>
            </div>
          </div>
        )}

        {/* Progress & Telemetry Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Compliance Audit Progress</h3>
              <p className="text-xs text-slate-500 mt-0.5">Statutory prerequisites verified for Capital Sanction Work #CW-2026-9042</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-[#01458e] text-sm">
                {completedCount} of {totalCount} Cleared ({progressPercent}%)
              </span>
              <StatusChip label={progressPercent === 100 ? 'Approved' : 'In Progress'} />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-[#01458e] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Verification Checklist Items */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="mb-4 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Mandatory Inspection Criteria</h3>
            <p className="text-xs text-slate-500 mt-0.5">Each criterion must be signed off by the verifying officer prior to fiscal endorsement.</p>
          </div>

          <div className="space-y-4">
            {STATUTORY_CRITERIA.map((crit) => {
              const isChecked = checkedItems[crit.id]
              return (
                <div
                  key={crit.id}
                  onClick={() => toggleCheck(crit.id)}
                  className={`rounded-lg border p-4 transition-all cursor-pointer flex items-start gap-4 ${
                    isChecked
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                  role="checkbox"
                  aria-checked={isChecked}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault()
                      toggleCheck(crit.id)
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    tabIndex={-1}
                    aria-hidden
                    className={`mt-1 shrink-0 pointer-events-none ${formCheckboxControlClass}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#01458e]">{crit.code}</span>
                        <h4 className="text-xs font-bold text-slate-900">{crit.title}</h4>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">Authority: {crit.authority}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">{crit.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Auditor Remarks */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <TextAreaField
              id="auditor-remarks"
              name="auditorRemarks"
              label="Verifying Auditor Formal Endorsement Remarks"
              rows={3}
              value={auditorRemarks}
              onChange={(e) => setAuditorRemarks(e.target.value)}
            />
          </div>

          {/* Submit Actions */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <span className="text-xs text-slate-500">
              Verified by: <strong>Er. Suresh Kumar (Chief Auditor)</strong> on 23-Oct-2026
            </span>
            <GigwButton
              type="button"
              variant="success"
              size="sm"
              icon={Send}
              iconSize={13}
              onClick={handleSignCertificate}
              className="text-xs"
            >
              Sign & Endorse Compliance Certificate
            </GigwButton>
          </div>
        </div>
      </div>

    </SampleModuleLayout>
  )
}
