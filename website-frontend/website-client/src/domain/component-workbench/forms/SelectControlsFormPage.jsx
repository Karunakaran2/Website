import { useState } from 'react'
import { SelectField } from '@/shared/components/forms'
import { ActionButton } from '@/shared/components/buttons'

export default function SelectControlsFormPage() {
  const [formData, setFormData] = useState({
    department: 'finance',
    officeLocation: 'tvm-central',
    ledgerGroup: '',
    disabledSelect: 'system-locked',
    status: 'active',
  })

  const [hasError, setHasError] = useState(true)

  const departmentOptions = [
    { value: '', label: 'Select department...' },
    { value: 'finance', label: 'Department of Finance & Accounts' },
    { value: 'revenue', label: 'Revenue & Taxation Directorate' },
    { value: 'public-works', label: 'Public Works & Infrastructure' },
    { value: 'it', label: 'Information Technology Cell' },
    { value: 'administration', label: 'General Administration' },
  ]

  const locationOptions = [
    { value: 'tvm-central', label: 'Thiruvananthapuram Head Office' },
    { value: 'kochi-regional', label: 'Kochi Regional Secretariat' },
    { value: 'kozhikode-north', label: 'Kozhikode North Zone' },
    { value: 'thrissur-central', label: 'Thrissur District Office' },
  ]

  const statusOptions = [
    { value: 'active', label: 'Active / Operational' },
    { value: 'pending', label: 'Pending Verification' },
    { value: 'suspended', label: 'Temporarily Suspended' },
    { value: 'archived', label: 'Archived / Decommissioned' },
  ]

  const handleReset = () => {
    setFormData({
      department: '',
      officeLocation: 'tvm-central',
      ledgerGroup: '',
      disabledSelect: 'system-locked',
      status: 'active',
    })
    setHasError(true)
  }

  return (
    <div className="space-y-6 pb-12 w-full">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Standard Select Controls</h2>
          <p className="mt-1 text-xs text-slate-500">
            Native and stylized dropdown controls matching 44px input height (h-11), 13px typography, custom chevron indicators, and full keyboard navigation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <SelectField
            id="select-department"
            name="department"
            label="Department Authority"
            required
            options={departmentOptions}
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            hint="Primary administrative department responsible."
          />

          <SelectField
            id="select-location"
            name="officeLocation"
            label="Operating Office"
            required
            options={locationOptions}
            value={formData.officeLocation}
            onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
            hint="Designated treasury or secretariat office."
          />

          <SelectField
            id="select-status"
            name="status"
            label="Lifecycle Status"
            options={statusOptions}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            hint="Current operational availability."
          />

          <SelectField
            id="select-disabled"
            name="disabledSelect"
            label="Locked Configuration"
            disabled
            options={[
              { value: 'system-locked', label: 'Standard Enterprise Policy (Immutable)' },
            ]}
            value={formData.disabledSelect}
            hint="Disabled state prevents user interaction."
          />

          <SelectField
            id="select-error"
            name="ledgerGroup"
            label="Account Ledger Group"
            required
            options={[
              { value: '', label: 'Select ledger classification...' },
              { value: 'assets', label: '1000 - Fixed Assets' },
              { value: 'liabilities', label: '2000 - Current Liabilities' },
              { value: 'revenue', label: '3000 - Tax Revenues' },
              { value: 'expenses', label: '4000 - Operating Expenses' },
            ]}
            value={formData.ledgerGroup}
            onChange={(e) => {
              setFormData({ ...formData, ledgerGroup: e.target.value })
              setHasError(e.target.value === '')
            }}
            error={hasError ? 'Please select a valid ledger classification group.' : undefined}
            hint="Selection required for transaction posting."
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-4 border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">Selection Summary</h2>
          <p className="mt-1 text-xs text-slate-500">Live JSON representation of controlled select values.</p>
        </div>
        <pre className="rounded-lg bg-slate-50 p-4 text-xs font-mono text-slate-800 border border-slate-200">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>

      <div className="flex items-center gap-3">
        <ActionButton variant="primary" onClick={() => alert('Dropdown selections verified!')}>
          Verify Selection
        </ActionButton>
        <ActionButton variant="reset" onClick={handleReset}>
          Reset Selections
        </ActionButton>
      </div>
    </div>
  )
}
