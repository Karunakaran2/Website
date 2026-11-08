import { useState } from 'react'
import { FileText, Users, DollarSign, History } from 'lucide-react'

export default function TabsNavPage() {
  const [activeUnderlineTab, setActiveUnderlineTab] = useState('summary')
  const [activePillTab, setActivePillTab] = useState('active')

  const underlineTabs = [
    { id: 'summary', label: 'Proposal Summary', count: null },
    { id: 'budget', label: 'Budget Allotment', count: '₹48.5L' },
    { id: 'approvals', label: 'Approval Hierarchy', count: '3/4' },
    { id: 'audit', label: 'Statutory Audit Log', count: null },
  ]

  const pillTabs = [
    { id: 'active', label: 'Active Projects (14)' },
    { id: 'pending', label: 'Pending Review (6)' },
    { id: 'archived', label: 'Archived (48)' },
  ]

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* 1. Probity Secondary Tab Strip (Underline Style) */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">In-Page Tab Navigation (Underline Pattern)</h2>
          <p className="mt-1 text-xs text-slate-500">
            Replicates Probity sub-tab styling: 45px row height, Navy Blue active text (#01458e), 3px bottom yellow active indicator (#f5c518), and full WAI-ARIA tablist semantics.
          </p>
        </div>

        {/* Tab Strip */}
        <div className="border-b border-slate-200" role="tablist" aria-label="Proposal details tabs">
          <div className="flex gap-6 overflow-x-auto">
            {underlineTabs.map((tab) => {
              const isSelected = activeUnderlineTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isSelected}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setActiveUnderlineTab(tab.id)}
                  className={`relative flex items-center gap-2 pb-3 pt-1 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer focus:outline-none ${
                    isSelected
                      ? 'text-[#01458e]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count && (
                    <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                      {tab.count}
                    </span>
                  )}
                  {isSelected && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-[3px] rounded-t bg-[#f5c518]"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content Panels */}
        <div className="mt-4 rounded-lg bg-slate-50/70 p-4 border border-slate-200 text-xs text-slate-700 min-h-[140px]">
          {activeUnderlineTab === 'summary' && (
            <div role="tabpanel" id="panel-summary" aria-labelledby="tab-summary" className="space-y-2 animate-fadeIn">
              <h3 className="font-bold text-slate-900 text-sm">Proposal Summary & Scope</h3>
              <p className="leading-relaxed text-slate-600">
                Capital expenditure for Tier-3 State Secretariat Data Center upgrade. Project covers power distribution redundancy, enterprise rack servers, and high-speed fiber interconnects.
              </p>
              <div className="flex gap-4 pt-2 text-[11px] text-slate-500">
                <span>DDO Code: <strong>KL-TVM-902</strong></span>
                <span>Initiated Date: <strong>14-Oct-2026</strong></span>
                <span>Priority: <strong>High</strong></span>
              </div>
            </div>
          )}

          {activeUnderlineTab === 'budget' && (
            <div role="tabpanel" id="panel-budget" aria-labelledby="tab-budget" className="space-y-2 animate-fadeIn">
              <h3 className="font-bold text-slate-900 text-sm">Fiscal Budget & Allotment</h3>
              <p className="leading-relaxed text-slate-600">
                Head of Account: <span className="font-mono font-medium">4059-80-051-99 (Capital Outlay on Public Works)</span>. Allotted budget: ₹50,00,000. Sanction proposed: ₹48,50,000.
              </p>
            </div>
          )}

          {activeUnderlineTab === 'approvals' && (
            <div role="tabpanel" id="panel-approvals" aria-labelledby="tab-approvals" className="space-y-2 animate-fadeIn">
              <h3 className="font-bold text-slate-900 text-sm">Workflow Approval Stage</h3>
              <p className="leading-relaxed text-slate-600">
                Stage 3 of 4: Desk Officer (Verified) → Under Secretary (Recommended) → Finance Secretary (Pending Action).
              </p>
            </div>
          )}

          {activeUnderlineTab === 'audit' && (
            <div role="tabpanel" id="panel-audit" aria-labelledby="tab-audit" className="space-y-2 animate-fadeIn">
              <h3 className="font-bold text-slate-900 text-sm">Statutory Audit Trail</h3>
              <p className="leading-relaxed text-slate-600">
                Immutable event stream logged with SHA-256 digital signature hashes and timestamps conforming to state IT security mandates.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Pill Style Tab Strip */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Segmented Pill Navigation (Filter Pattern)</h3>
          <p className="mt-1 text-xs text-slate-500">
            Enclosed pill tabs used for quick dataset filtering, view switching, and queue segmentation.
          </p>
        </div>

        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1" role="tablist">
          {pillTabs.map((tab) => {
            const isSelected = activePillTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActivePillTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-[#01458e] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
