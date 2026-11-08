import { useState } from 'react'
import { RadioGroup } from '@/shared/components/forms'
import { ActionButton } from '@/shared/components/buttons'
import { formChoiceControlClass } from '@/shared/components/typography/typographyStyles'
import { ShieldCheck, UserCheck, Users, Building } from 'lucide-react'

export default function RadioButtonsFormPage() {
  const [accountingMethod, setAccountingMethod] = useState('accrual')
  const [fiscalPeriod, setFiscalPeriod] = useState('quarterly')
  const [disposalType, setDisposalType] = useState('auction')
  const [accountType, setAccountType] = useState('corporate')

  const accountingOptions = [
    { value: 'accrual', label: 'Accrual Basis (Recognize revenues when earned and expenses when incurred)' },
    { value: 'cash', label: 'Cash Basis (Recognize revenues when received and expenses when disbursed)' },
    { value: 'modified', label: 'Modified Accrual (Governmental fund accounting standard)' },
  ]

  const periodOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'half-yearly', label: 'Half-Yearly' },
    { value: 'annual', label: 'Annual' },
  ]

  const disposalOptions = [
    { value: 'auction', label: 'Public Auction Tender' },
    { value: 'transfer', label: 'Inter-Departmental Transfer' },
    { value: 'write-off', label: 'Scrap & Write-Off' },
    { value: 'restricted', label: 'Restricted Asset (Non-disposable)', disabled: true },
  ]

  const handleReset = () => {
    setAccountingMethod('accrual')
    setFiscalPeriod('quarterly')
    setDisposalType('auction')
    setAccountType('corporate')
  }

  return (
    <div className="space-y-6 pb-12 w-full">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Vertical Radio Group</h2>
          <p className="mt-1 text-xs text-slate-500">
            Utilizes standard shared RadioGroup with GIGW 20×20px circular controls, keyboard navigation (Arrow keys, Space selection), and active focus outlines.
          </p>
        </div>

        <div className="max-w-2xl">
          <RadioGroup
            label="Accounting Recognition Standard"
            name="accountingMethod"
            required
            options={accountingOptions}
            value={accountingMethod}
            onChange={(e) => setAccountingMethod(e.target.value)}
            hint="Defines financial audit compliance guidelines."
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Horizontal Inline Radio Group</h2>
          <p className="mt-1 text-xs text-slate-500">
            Horizontal arrangement suitable for compact option sets and frequency toggles.
          </p>
        </div>

        <div className="max-w-2xl">
          <RadioGroup
            label="Financial Audit Frequency"
            name="fiscalPeriod"
            direction="horizontal"
            options={periodOptions}
            value={fiscalPeriod}
            onChange={(e) => setFiscalPeriod(e.target.value)}
            hint="Frequency of statutory trial balance reconciliation."
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Radio Options with Disabled State</h2>
          <p className="mt-1 text-xs text-slate-500">
            Option list with individual disabled selection, preventing interaction on restricted modes.
          </p>
        </div>

        <div className="max-w-2xl">
          <RadioGroup
            label="Asset Decommissioning Workflow"
            name="disposalType"
            options={disposalOptions}
            value={disposalType}
            onChange={(e) => setDisposalType(e.target.value)}
            hint="Public auction requires state procurement clearance."
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Interactive Card-Style Radio Selector</h2>
          <p className="mt-1 text-xs text-slate-500">
            Custom card selector with icons and rich metadata for prominent user decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              id: 'corporate',
              title: 'Treasury & Secretariat Head',
              desc: 'Full administrative access across departments, approving sanctions, and ledger closing.',
              icon: Building,
            },
            {
              id: 'auditor',
              title: 'Statutory External Auditor',
              desc: 'Read-only verification access to ledgers, vouchers, depreciation logs, and reports.',
              icon: ShieldCheck,
            },
            {
              id: 'officer',
              title: 'Drawing & Disbursing Officer (DDO)',
              desc: 'Draft and submit payment vouchers, asset additions, and monthly reconciliations.',
              icon: UserCheck,
            },
            {
              id: 'departmental',
              title: 'Department Asset Custodian',
              desc: 'Manage fixed-asset location allocations, maintenance logs, and physical verification.',
              icon: Users,
            },
          ].map((item) => {
            const isSelected = accountType === item.id
            const Icon = item.icon
            return (
              <label
                key={item.id}
                className={`relative flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#01458e] bg-blue-50/20 ring-1 ring-[#01458e]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="cardAccountType"
                  value={item.id}
                  checked={isSelected}
                  onChange={(e) => setAccountType(e.target.value)}
                  className={`${formChoiceControlClass} mt-0.5`}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${isSelected ? 'text-[#01458e]' : 'text-slate-500'}`} />
                    <span className="text-[13px] font-bold text-slate-900">{item.title}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </label>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ActionButton variant="primary" onClick={() => alert('Radio selections saved!')}>
          Confirm Radio Choice
        </ActionButton>
        <ActionButton variant="reset" onClick={handleReset}>
          Reset Defaults
        </ActionButton>
      </div>
    </div>
  )
}
