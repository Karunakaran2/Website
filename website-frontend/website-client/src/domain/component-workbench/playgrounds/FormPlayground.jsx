import { useState } from 'react'
import {
  InputField,
  SelectField,
  IndianAmountField,
  OrgDateField,
  TextAreaField,
  FORM_FIELD_HINTS_ENABLED,
} from '@/shared/components/forms'
import { ActionButton } from '@/shared/components/buttons'
import { CheckCircle2, RotateCcw } from 'lucide-react'
import { appToast } from '@/shared/components/toast/appToast'

const DEPARTMENT_OPTIONS = [
  { value: 'finance', label: 'Finance & Accounts' },
  { value: 'engineering', label: 'Software Engineering' },
  { value: 'hr', label: 'Human Resources & Administration' },
  { value: 'operations', label: 'Systems & Operations' },
]

export default function FormPlayground() {
  const [hasError, setHasError] = useState(false)
  const [isRequired, setIsRequired] = useState(true)
  const [isDisabled, setIsDisabled] = useState(false)
  const [isReadOnly, setIsReadOnly] = useState(false)
  const [showHelper, setShowHelper] = useState(true)

  const [formData, setFormData] = useState({
    fullName: 'Arun Kumar',
    department: 'finance',
    budgetAmount: '750000',
    effectiveDate: '2026-11-01',
    employmentType: 'fulltime',
    notifications: true,
    bio: 'Senior Frontend Engineer working on KRAN enterprise systems.',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    appToast.success('Form submitted successfully! State updated.')
    setTimeout(() => setSubmitted(false), 3000)
  }

  const handleReset = () => {
    setFormData({
      fullName: '',
      department: 'finance',
      budgetAmount: '',
      effectiveDate: '',
      employmentType: 'fulltime',
      notifications: true,
      bio: '',
    })
    setSubmitted(false)
    appToast.info('Form cleared to empty defaults.')
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Controls Panel */}
        <div className="lg:col-span-5 space-y-4 rounded-xl bg-white p-5 border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">
            Form Playground Controls
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={hasError}
                onChange={(e) => setHasError(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
              <span className={hasError ? 'font-bold text-red-600' : ''}>
                Simulate Validation Error State (<code>error</code>)
              </span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#01458e] focus:ring-[#01458e]"
              />
              <span>Required Mark (*) (<code>required</code>)</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isDisabled}
                onChange={(e) => {
                  setIsDisabled(e.target.checked)
                  if (e.target.checked) setIsReadOnly(false)
                }}
                className="h-4 w-4 rounded border-slate-300 text-[#01458e] focus:ring-[#01458e]"
              />
              <span>Disabled State (<code>disabled</code>)</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isReadOnly}
                onChange={(e) => {
                  setIsReadOnly(e.target.checked)
                  if (e.target.checked) setIsDisabled(false)
                }}
                className="h-4 w-4 rounded border-slate-300 text-[#01458e] focus:ring-[#01458e]"
              />
              <span>Read-Only State (<code>readOnly</code>)</span>
            </label>

            {FORM_FIELD_HINTS_ENABLED ? (
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showHelper}
                  onChange={(e) => setShowHelper(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#01458e] focus:ring-[#01458e]"
                />
                <span>Show Helper Text (<code>hint</code>)</span>
              </label>
            ) : null}
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1">
            <p><strong>Shared Components in use:</strong></p>
            <ul className="list-disc pl-4 space-y-1">
              <li><code>InputField</code> — Text input with fixed 44px height and error slot</li>
              <li><code>SelectField</code> — Standard accessible select with chevron adornment</li>
              <li><code>IndianAmountField</code> — Formatted INR currency input</li>
              <li><code>OrgDateField</code> — Standard native date input</li>
              <li><code>TextAreaField</code> — Multiline auto-expanding textarea</li>
            </ul>
          </div>
        </div>

        {/* Live Form Preview */}
        <div className="lg:col-span-7 rounded-xl bg-white p-6 border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-4">
            Interactive Form Preview (Shared Components)
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. InputField */}
              <InputField
                id="pg-fullname"
                name="fullName"
                label="Full Name"
                required={isRequired}
                disabled={isDisabled}
                readOnly={isReadOnly}
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                error={hasError ? 'Please enter a valid official name' : undefined}
                hint={FORM_FIELD_HINTS_ENABLED && showHelper ? 'Enter employee name as per official records.' : undefined}
              />

              {/* 2. SelectField */}
              <SelectField
                id="pg-department"
                name="department"
                label="Department"
                required={isRequired}
                disabled={isDisabled}
                options={DEPARTMENT_OPTIONS}
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                error={hasError ? 'Please select a valid department' : undefined}
                hint={FORM_FIELD_HINTS_ENABLED && showHelper ? 'Primary administrative division' : undefined}
              />

              {/* 3. IndianAmountField */}
              <IndianAmountField
                id="pg-budget"
                name="budgetAmount"
                label="Approved Budget Allotment (₹)"
                required={isRequired}
                disabled={isDisabled}
                readOnly={isReadOnly}
                value={formData.budgetAmount}
                onChange={(e) => handleChange('budgetAmount', e.target.value)}
                error={hasError ? 'Enter a valid amount greater than 0' : undefined}
                hint={FORM_FIELD_HINTS_ENABLED && showHelper ? 'Indian numbering format (₹)' : undefined}
              />

              {/* 4. OrgDateField */}
              <OrgDateField
                id="pg-effective-date"
                name="effectiveDate"
                label="Effective Sanction Date"
                required={isRequired}
                disabled={isDisabled}
                value={formData.effectiveDate}
                onChange={(e) => handleChange('effectiveDate', e.target.value)}
                error={hasError ? 'Valid effective date is required' : undefined}
                hint={FORM_FIELD_HINTS_ENABLED && showHelper ? 'Order sanction date' : undefined}
              />
            </div>

            {/* 5. TextAreaField */}
            <TextAreaField
              id="pg-bio"
              name="bio"
              label="Technical Remarks / Scope"
              required={isRequired}
              disabled={isDisabled}
              readOnly={isReadOnly}
              rows={3}
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              error={hasError ? 'Scope description is mandatory' : undefined}
              hint={FORM_FIELD_HINTS_ENABLED && showHelper ? 'Detail project objectives and scope.' : undefined}
            />

            {/* Form Actions Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <ActionButton
                type="button"
                variant="reset"
                onClick={handleReset}
                disabled={isDisabled}
              >
                Reset Form
              </ActionButton>

              <div className="flex items-center gap-2">
                <ActionButton
                  type="submit"
                  variant="submit"
                  disabled={isDisabled}
                >
                  Submit Form
                </ActionButton>
              </div>
            </div>

            {submitted ? (
              <div className="rounded-md bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Form submitted successfully! Local state recorded.</span>
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  )
}
