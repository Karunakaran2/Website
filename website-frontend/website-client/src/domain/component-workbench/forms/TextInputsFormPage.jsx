import { useState } from 'react'
import {
  InputField,
  OrgTextField,
  IndianAmountField,
  OrgDateField,
  TextAreaField,
  FormSection,
} from '@/shared/components/forms'
import { ActionButton } from '@/shared/components/buttons'
import { Eye, EyeOff, Search, Mail, Lock } from 'lucide-react'

export default function TextInputsFormPage() {
  const [formData, setFormData] = useState({
    standardText: 'Probity Design System',
    placeholderDemo: '',
    requiredField: 'CR-2026-0881',
    disabledField: 'Non-editable system parameter',
    readOnlyField: 'RO-ACCOUNT-KERALA-01',
    email: 'finance.admin@kerala.gov.in',
    password: 'SecurePassword123!',
    searchQuery: '',
    budgetAmount: '1250000',
    effectiveDate: '2026-10-22',
    description: 'Quarterly review of administrative capital expenditures and physical asset verification.',
    errorDemo: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [hasError, setHasError] = useState(true)

  const handleReset = () => {
    setFormData({
      standardText: '',
      placeholderDemo: '',
      requiredField: '',
      disabledField: 'Non-editable system parameter',
      readOnlyField: 'RO-ACCOUNT-KERALA-01',
      email: '',
      password: '',
      searchQuery: '',
      budgetAmount: '',
      effectiveDate: '',
      description: '',
      errorDemo: '',
    })
  }

  return (
    <div className="space-y-6 pb-12 w-full">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Standard Text Inputs</h2>
          <p className="mt-1 text-xs text-slate-500">
            Compliant with GIGW 3.0 and Probity UI specs: 44px height (h-11), 13px font size, 4px border radius, and high-visibility focus ring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <InputField
            id="text-input-default"
            name="standardText"
            label="Standard Input"
            value={formData.standardText}
            onChange={(e) => setFormData({ ...formData, standardText: e.target.value })}
            hint="Default active text input state."
          />

          <InputField
            id="text-input-placeholder"
            name="placeholderDemo"
            label="Input with Placeholder"
            placeholder="e.g. Enter department name"
            value={formData.placeholderDemo}
            onChange={(e) => setFormData({ ...formData, placeholderDemo: e.target.value })}
            hint="Placeholder text displays in muted slate-400."
          />

          <InputField
            id="text-input-required"
            name="requiredField"
            label="Required Input"
            required
            value={formData.requiredField}
            onChange={(e) => setFormData({ ...formData, requiredField: e.target.value })}
            hint="Marked with accessible required asterisk."
          />

          <InputField
            id="text-input-disabled"
            name="disabledField"
            label="Disabled Input"
            disabled
            value={formData.disabledField}
            hint="Disabled state with cursor-not-allowed."
          />

          <InputField
            id="text-input-readonly"
            name="readOnlyField"
            label="Read-Only Field"
            readOnly
            value={formData.readOnlyField}
            hint="Displays fixed value that cannot be altered."
          />

          <InputField
            id="text-input-error"
            name="errorDemo"
            label="Error Validation State"
            value={formData.errorDemo}
            onChange={(e) => {
              setFormData({ ...formData, errorDemo: e.target.value })
              setHasError(e.target.value.trim() === '')
            }}
            error={hasError ? 'This field is required and cannot be left blank.' : undefined}
            hint="Displays rose outline and accessible alert message."
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Specialized Form Inputs</h2>
          <p className="mt-1 text-xs text-slate-500">
            Email, password with visibility toggle, contextual search, and currency formatting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label htmlFor="input-email" className="field-label mb-1 block w-full text-[13px] font-medium leading-5 text-gray-700">
              Official Email Address <span className="font-semibold text-rose-600">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                id="input-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field !mt-0 h-11 min-h-11 max-h-11 box-border w-full rounded border border-slate-300 bg-white pl-9 pr-3 py-2.5 text-[13px] text-slate-800 placeholder:text-slate-400 focus:border-[#01458e] focus:outline-none focus:ring-1 focus:ring-[#01458e]"
                placeholder="officer@nic.in"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">Government or enterprise domain address.</p>
          </div>

          <div>
            <label htmlFor="input-password" className="field-label mb-1 block w-full text-[13px] font-medium leading-5 text-gray-700">
              Account Password <span className="font-semibold text-rose-600">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="input-password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field !mt-0 h-11 min-h-11 max-h-11 box-border w-full rounded border border-slate-300 bg-white pl-9 pr-10 py-2.5 text-[13px] text-slate-800 placeholder:text-slate-400 focus:border-[#01458e] focus:outline-none focus:ring-1 focus:ring-[#01458e]"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">Contains at least 8 characters with symbol.</p>
          </div>

          <div>
            <label htmlFor="input-search" className="field-label mb-1 block w-full text-[13px] font-medium leading-5 text-gray-700">
              Quick Filter / Search
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                id="input-search"
                type="search"
                value={formData.searchQuery}
                onChange={(e) => setFormData({ ...formData, searchQuery: e.target.value })}
                className="input-field !mt-0 h-11 min-h-11 max-h-11 box-border w-full rounded border border-slate-300 bg-white pl-9 pr-3 py-2.5 text-[13px] text-slate-800 placeholder:text-slate-400 focus:border-[#01458e] focus:outline-none focus:ring-1 focus:ring-[#01458e]"
                placeholder="Search ledger or asset..."
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">Filters live data across active records.</p>
          </div>

          <IndianAmountField
            id="input-amount"
            name="budgetAmount"
            label="Sanctioned Amount (₹)"
            required
            value={formData.budgetAmount}
            onChange={(e) => setFormData({ ...formData, budgetAmount: e.target.value })}
            hint="Auto-formatted according to Indian numbering system (lakhs / crores)."
          />

          <InputField
            id="input-date"
            name="effectiveDate"
            label="Effective Date"
            type="date"
            required
            value={formData.effectiveDate}
            onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
            hint="Standard financial calendar date (YYYY-MM-DD)."
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Multiline Textarea</h2>
          <p className="mt-1 text-xs text-slate-500">
            Textarea field with configurable rows and live character counter tracking.
          </p>
        </div>

        <div className="max-w-2xl">
          <TextAreaField
            id="input-description"
            name="description"
            label="Administrative Justification"
            required
            rows={4}
            maxLength={250}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            hint="Maximum 250 characters permitted for audit log."
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ActionButton variant="primary" onClick={() => alert('Form inputs validated successfully!')}>
          Submit Test
        </ActionButton>
        <ActionButton variant="reset" onClick={handleReset}>
          Reset Fields
        </ActionButton>
      </div>
    </div>
  )
}
