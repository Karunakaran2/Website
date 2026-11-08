import { useState } from 'react'
import {
  TrendingUp,
  Building2,
  FileCheck2,
  Wallet,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'
import StatusChip from '@/shared/components/status/StatusChip'
import ActionButton from '@/shared/components/buttons/ActionButton'
import { OrgDataDisplay } from '@/shared/components/display'

export default function CardsDisplayPage() {
  const [selectedCard, setSelectedCard] = useState(null)

  const orgProfileData = [
    { label: 'Department Name', value: 'Department of Finance & Public Accounts' },
    { label: 'Treasury Code', value: 'KL-TVM-0084' },
    { label: 'Sanction Authority', value: 'Principal Secretary (Finance)' },
    { label: 'Accounting Cycle', value: 'FY 2026-27 (Quarter 3)' },
    { label: 'Active DDO Code', value: 'DDO-92841-KERALA' },
    { label: 'System Compliance', value: 'GIGW 3.0 / WCAG 2.2 AA Certified' },
  ]

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* 1. Metric & KPI Summary Cards */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">KPI Metric & Summary Cards</h2>
          <p className="mt-1 text-xs text-slate-500">
            Standard metrics containers for departmental dashboards, budget utilization, and operational telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Sanctioned</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-[#01458e]">
                <Wallet size={15} />
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">₹45,82,000</div>
            <div className="mt-2 flex items-center text-xs text-emerald-600 font-medium">
              <TrendingUp size={13} className="mr-1" />
              <span>+12.4% vs last quarter</span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Pending Vouchers</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-50 text-amber-700">
                <Clock size={15} />
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-amber-700">18 Entries</div>
            <div className="mt-2 text-xs text-slate-500">
              Awaiting DDO Level 2 Review
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Approved Assets</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                <FileCheck2 size={15} />
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">1,248 Units</div>
            <div className="mt-2 flex items-center gap-1.5">
              <StatusChip label="Active" />
              <span className="text-xs text-slate-400">100% verified</span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Regional Offices</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-50 text-purple-700">
                <Building2 size={15} />
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">14 Centers</div>
            <div className="mt-2 text-xs text-slate-500">
              Thiruvananthapuram Central HQ
            </div>
          </div>
        </div>
      </div>

      {/* 2. Structured Detail & Profile Cards */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Structured Data Display Cards</h2>
          <p className="mt-1 text-xs text-slate-500">
            Field-value pairs rendered with high-contrast labels and accessible information hierarchy via OrgDataDisplay.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
          <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-[#01458e]" />
              <h3 className="text-sm font-semibold text-slate-900">Organizational Profile & Authority</h3>
            </div>
            <StatusChip label="Operational" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orgProfileData.map((item) => (
              <div key={item.label} className="rounded-md bg-white p-3 border border-slate-200">
                <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  {item.label}
                </span>
                <span className="mt-1 block text-sm font-semibold text-slate-800">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Interactive Actionable Cards */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Interactive Action Cards</h2>
          <p className="mt-1 text-xs text-slate-500">
            Clickable cards for module gateways, task shortcuts, and workflow dispatchers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setSelectedCard('Asset Master')}
            className={`group text-left rounded-xl border p-5 transition-all focus:outline-none focus:ring-2 focus:ring-[#01458e] focus:ring-offset-2 ${
              selectedCard === 'Asset Master'
                ? 'border-[#01458e] bg-blue-50/40 ring-1 ring-[#01458e]'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#01458e]">
                <Wallet size={16} />
              </span>
              <StatusChip label="Operational" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-900 group-hover:text-[#01458e]">
              Asset Master Register
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Fixed asset group ledger, depreciation rules, and physical verification.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-[#01458e]">
              <span>Open Ledger</span>
              <ArrowRight size={13} className="ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCard('Voucher Approvals')}
            className={`group text-left rounded-xl border p-5 transition-all focus:outline-none focus:ring-2 focus:ring-[#01458e] focus:ring-offset-2 ${
              selectedCard === 'Voucher Approvals'
                ? 'border-[#01458e] bg-blue-50/40 ring-1 ring-[#01458e]'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                <FileCheck2 size={16} />
              </span>
              <StatusChip label="Pending" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-900 group-hover:text-amber-800">
              Voucher Approvals
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Multi-tier sanction queue, treasury cross-validation, and digital signing.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-amber-700">
              <span>View Queue</span>
              <ArrowRight size={13} className="ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCard('Audit Closure')}
            className={`group text-left rounded-xl border p-5 transition-all focus:outline-none focus:ring-2 focus:ring-[#01458e] focus:ring-offset-2 ${
              selectedCard === 'Audit Closure'
                ? 'border-[#01458e] bg-blue-50/40 ring-1 ring-[#01458e]'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Building2 size={16} />
              </span>
              <StatusChip label="Draft" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-900 group-hover:text-slate-800">
              Audit & Period Closure
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Monthly trial balance lock, reconciliation reports, and AG clearance.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-slate-700">
              <span>Inspect Closure</span>
              <ArrowRight size={13} className="ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        </div>

        {selectedCard && (
          <div className="mt-4 flex items-center justify-between rounded-lg bg-blue-50/60 p-3 text-xs text-[#01458e]">
            <span>Selected Action Card: <strong>{selectedCard}</strong></span>
            <button
              type="button"
              onClick={() => setSelectedCard(null)}
              className="font-medium underline hover:text-[#003366]"
            >
              Clear selection
            </button>
          </div>
        )}
      </div>

      {/* 4. Notice & Empty State Cards */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Notice & Empty State Cards</h2>
          <p className="mt-1 text-xs text-slate-500">
            Standard callout containers for system warnings, empty results, or security advisories.
          </p>
        </div>

        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <ShieldAlert size={20} />
          </div>
          <h3 className="mt-3 text-sm font-bold text-slate-800">No Discrepancy Records Detected</h3>
          <p className="mx-auto mt-1 max-w-md text-xs text-slate-500">
            All general ledger journal postings match treasury bank statements. Zero variances found for the current reconciliation cycle.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <ActionButton variant="primary" type="button">
              Re-run Reconcile
            </ActionButton>
            <ActionButton variant="excel" type="button">
              Download Audit Report
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  )
}
