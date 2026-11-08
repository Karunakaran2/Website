import { useState } from 'react'
import { confirmBeforeAction, useActionConfirm } from '@/shared/components/confirm'
import { Plus, CheckCircle2, RotateCcw, FileText, Wallet, ShieldCheck } from 'lucide-react'
import SampleSectionHeader from '../components/SampleSectionHeader'
import SampleModuleLayout from '../layouts/SampleModuleLayout'
import {
  InputField,
  SelectField,
  IndianAmountField,
  OrgDateField,
  TextAreaField,
  formCheckboxControlClass,
  formOptionLabelClass,
} from '@/shared/components/forms'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { showAppToast } from '@/shared/components'
import { WorkflowNotesQueryPanel } from '@/shared/components/workflow'
import { scheduleFocusFirstFormError } from '@/shared/utils/formValidationFocus'

const DEPARTMENT_OPTIONS = [
  { value: 'Public Works & Roads', label: 'Public Works & Roads' },
  { value: 'Information Technology', label: 'Information Technology' },
  { value: 'Water Resources & Irrigation', label: 'Water Resources & Irrigation' },
  { value: 'Health & Family Welfare', label: 'Health & Family Welfare' },
  { value: 'Energy & Power Infrastructure', label: 'Energy & Power Infrastructure' },
]

const CATEGORY_OPTIONS = [
  { value: 'Infrastructure Upgrade', label: 'Infrastructure Upgrade' },
  { value: 'IT Modernization', label: 'IT Modernization' },
  { value: 'Civil Construction', label: 'Civil Construction' },
  { value: 'Plant & Equipment', label: 'Plant & Equipment' },
]

const PRIORITY_OPTIONS = [
  { value: 'Urgent', label: 'Urgent (Within 30 Days)' },
  { value: 'High', label: 'High Priority (Current Quarter)' },
  { value: 'Medium', label: 'Medium Priority (Fiscal Year)' },
  { value: 'Routine', label: 'Routine Maintenance' },
]

export default function SampleFormsPage() {
  const requestConfirm = useActionConfirm()
  const [notesDraft, setNotesDraft] = useState('')
  const [savedNotes, setSavedNotes] = useState([
    {
      id: 'n1',
      text: 'Finance cell requested clarification on BOQ line 14 — pending site inspection report.',
      author: 'Review Desk',
      savedOn: '22-10-2026',
    },
  ])
  const [queryDraft, setQueryDraft] = useState('')
  const [queryHistory, setQueryHistory] = useState([
    {
      id: 'q1',
      text: 'Please confirm whether environmental clearance covers auxiliary power backup.',
      status: 'Replied',
      raisedOn: '20-10-2026',
      response: 'Clearance certificate CC-2026-881 covers auxiliary genset capacity up to 500 KVA.',
    },
  ])
  const [queryFileName, setQueryFileName] = useState('')
  const [notesSaving, setNotesSaving] = useState(false)
  const [querySending, setQuerySending] = useState(false)

  const [formData, setFormData] = useState({
    title: 'State Data Center High-Density Server Expansion',
    code: 'CW-2026-9042',
    department: 'Information Technology',
    category: 'IT Modernization',
    estimatedAmount: '14500000',
    headOfAccount: '4059-80-051-99 (Capital Outlay on State IT Infrastructure)',
    ddoCode: 'DDO-KL-TVM-8821',
    targetDate: '2026-12-31',
    priority: 'High',
    technicalSanctionRef: 'TS-SEC-2026-0418',
    environmentalClearance: true,
    fundAvailable: true,
    justification:
      'Procurement and installation of 12 enterprise blade servers with redundant power supplies to support citizen service integration for state e-governance portals.',
  })

  const [errors, setErrors] = useState({})
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Project Title is mandatory'
    if (!formData.code.trim()) newErrors.code = 'Project Code is required'
    if (!formData.department) newErrors.department = 'Please select an administrative department'
    if (!formData.estimatedAmount || Number(formData.estimatedAmount) <= 0) {
      newErrors.estimatedAmount = 'Enter a valid estimated expenditure amount'
    }
    if (!formData.targetDate) newErrors.targetDate = 'Target completion date is required'
    if (!formData.justification.trim() || formData.justification.length < 20) {
      newErrors.justification = 'Provide a comprehensive justification (min 20 characters)'
    }
    return newErrors
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      const rhfShape = Object.fromEntries(
        Object.entries(validationErrors).map(([key, message]) => [key, { message }]),
      )
      scheduleFocusFirstFormError(rhfShape)
      return
    }
    confirmBeforeAction(requestConfirm, {
      action: 'submit',
      stack: 'base',
      title: 'Submit Sanction Proposal',
      message: `Confirm submission of Proposal #${formData.code}?`,
      description:
        'This will lock the estimated expenditure and transmit the file to the Finance Cell for statutory review.',
      confirmLabel: 'Yes, Submit Sanction',
      cancelLabel: 'Review Form',
      successMessage: `Sanction Proposal #${formData.code} submitted successfully.`,
      runAction: async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 1200)
        })
        setSubmitSuccess(true)
        return true
      },
    })
  }

  const handleReset = () => {
    setFormData({
      title: '',
      code: `CW-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      department: 'Information Technology',
      category: 'IT Modernization',
      estimatedAmount: '',
      headOfAccount: '4059-80-051-99 (Capital Outlay on State IT Infrastructure)',
      ddoCode: 'DDO-KL-TVM-8821',
      targetDate: '',
      priority: 'High',
      technicalSanctionRef: '',
      environmentalClearance: false,
      fundAvailable: true,
      justification: '',
    })
    setErrors({})
    setSubmitSuccess(false)
    showAppToast('Form cleared to initial defaults.', 'info')
  }

  return (
    <SampleModuleLayout activeTab="forms">
      <div className="space-y-6 w-full">
        {/* Success Banner */}
        {submitSuccess && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-xl border border-emerald-300 bg-emerald-50/90 p-4 text-emerald-950 flex items-start justify-between gap-3 animate-fadeIn"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-xs">Sanction Proposal Forwarded for Financial Scrutiny</h3>
                <p className="mt-0.5 text-xs text-emerald-800 leading-relaxed">
                  Proposal #{formData.code} for <strong>{formData.title}</strong> has been assigned token #FS-2026-9041 and queued in the Finance Secretary desk.
                </p>
              </div>
            </div>
            <GigwButton
              type="button"
              variant="outlineUtility"
              size="sm"
              className="shrink-0 text-xs"
              onClick={() => setSubmitSuccess(false)}
            >
              Dismiss
            </GigwButton>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <SampleSectionHeader
            title="1. Administrative Identification"
            icon={FileText}
            description="Basic metadata, department classification, and unique project code."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <InputField
                id="prop-title"
                name="title"
                label="Project Title"
                required
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                error={errors.title}
                hint="Formal title as approved in the budget book."
                className="lg:col-span-2"
              />

              <InputField
                id="prop-code"
                name="code"
                label="Sanction Work Code"
                required
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                error={errors.code}
                hint="Format: CW-YYYY-XXXX"
              />

              <SelectField
                id="prop-department"
                name="department"
                label="Administrative Department"
                required
                options={DEPARTMENT_OPTIONS}
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                error={errors.department}
              />

              <SelectField
                id="prop-category"
                name="category"
                label="Project Category"
                required
                options={CATEGORY_OPTIONS}
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
              />

              <InputField
                id="prop-ddo"
                name="ddoCode"
                label="Disbursing Officer (DDO) Code"
                disabled
                value={formData.ddoCode}
                hint="Assigned based on logged-in seat authority."
              />
            </div>
          </SampleSectionHeader>

          <SampleSectionHeader
            title="2. Financial Allocation & Head of Account"
            icon={Wallet}
            description="Estimated expenditure, treasury account head, and technical sanction references."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <IndianAmountField
                id="prop-amount"
                name="estimatedAmount"
                label="Estimated Expenditure (₹)"
                required
                value={formData.estimatedAmount}
                onChange={(e) => handleChange('estimatedAmount', e.target.value)}
                error={errors.estimatedAmount}
                hint="Enter full rupee amount without commas."
              />

              <InputField
                id="prop-head"
                name="headOfAccount"
                label="Major / Minor Head of Account"
                required
                value={formData.headOfAccount}
                onChange={(e) => handleChange('headOfAccount', e.target.value)}
                hint="Treasury budget classification code."
                className="lg:col-span-2"
              />

              <OrgDateField
                id="prop-target-date"
                name="targetDate"
                label="Target Commissioning Date"
                required
                value={formData.targetDate}
                onChange={(e) => handleChange('targetDate', e.target.value)}
                error={errors.targetDate}
              />

              <SelectField
                id="prop-priority"
                name="priority"
                label="Implementation Priority"
                options={PRIORITY_OPTIONS}
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
              />

              <InputField
                id="prop-ts"
                name="technicalSanctionRef"
                label="Technical Sanction Order Ref"
                value={formData.technicalSanctionRef}
                onChange={(e) => handleChange('technicalSanctionRef', e.target.value)}
                placeholder="e.g. TS-KL-2026-9021"
                hint="Issued by Superintending Engineer."
              />
            </div>
          </SampleSectionHeader>

          <SampleSectionHeader
            title="3. Technical Justification & Statutory Clearances"
            icon={ShieldCheck}
            description="Narrative justification and confirmation of statutory prerequisites."
          >
            <div className="space-y-5">
              <TextAreaField
                id="prop-justification"
                name="justification"
                label="Executive Scope & Justification"
                required
                rows={4}
                value={formData.justification}
                onChange={(e) => handleChange('justification', e.target.value)}
                error={errors.justification}
                hint="Detail the public utility, expected outcomes, and urgency of this capital investment."
              />

              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Mandatory Statutory Declarations
                </span>

                <label className={`flex items-start gap-3 cursor-pointer ${formOptionLabelClass}`}>
                  <input
                    type="checkbox"
                    checked={formData.environmentalClearance}
                    onChange={(e) => handleChange('environmentalClearance', e.target.checked)}
                    className={`mt-0.5 shrink-0 ${formCheckboxControlClass}`}
                  />
                  <div className="text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">Environmental & Site Clearance Obtained</span>
                    <p className="text-slate-500 mt-0.5">Physical land possession, NOCs, and municipal approvals have been verified on record.</p>
                  </div>
                </label>

                <label className={`flex items-start gap-3 cursor-pointer ${formOptionLabelClass}`}>
                  <input
                    type="checkbox"
                    checked={formData.fundAvailable}
                    onChange={(e) => handleChange('fundAvailable', e.target.checked)}
                    className={`mt-0.5 shrink-0 ${formCheckboxControlClass}`}
                  />
                  <div className="text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">Budget Provision Certificate</span>
                    <p className="text-slate-500 mt-0.5">Sufficient budgetary allotment exists under the assigned Head of Account for FY 2026-27.</p>
                  </div>
                </label>
              </div>
            </div>
          </SampleSectionHeader>

          <WorkflowNotesQueryPanel
            notes={notesDraft}
            onNotesChange={setNotesDraft}
            savedNotes={savedNotes}
            saveNotesLoading={notesSaving}
            onSaveNotes={() => {
              if (!notesDraft.trim()) return
              setNotesSaving(true)
              window.setTimeout(() => {
                setSavedNotes((prev) => [
                  ...prev,
                  {
                    id: `n-${Date.now()}`,
                    text: notesDraft.trim(),
                    author: 'Current User',
                    savedOn: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
                  },
                ])
                setNotesDraft('')
                setNotesSaving(false)
                showAppToast('Note saved to the proposal record.', 'success', { action: 'save' })
              }, 400)
            }}
            queryDraft={queryDraft}
            onQueryDraftChange={setQueryDraft}
            queryFileName={queryFileName}
            onQueryFileChange={(file) => setQueryFileName(file?.name || '')}
            raiseQueryLoading={querySending}
            onRaiseQuery={() => {
              if (!queryDraft.trim()) return
              setQuerySending(true)
              window.setTimeout(() => {
                setQueryHistory((prev) => [
                  {
                    id: `q-${Date.now()}`,
                    text: queryDraft.trim(),
                    status: 'Open',
                    raisedOn: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
                  },
                  ...prev,
                ])
                setQueryDraft('')
                setQueryFileName('')
                setQuerySending(false)
                showAppToast('Query raised successfully.', 'success', { action: 'submit' })
              }, 500)
            }}
            queryHistory={queryHistory}
          />

          {/* Form Actions Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <GigwButton
              type="button"
              variant="outlineUtility"
              size="sm"
              icon={RotateCcw}
              iconSize={13}
              onClick={handleReset}
              className="text-xs"
            >
              Reset Proposal
            </GigwButton>

            <div className="flex items-center gap-3">
              <GigwButton
                type="button"
                variant="outlinePrimary"
                size="sm"
                className="text-xs"
                onClick={() => {
                  showAppToast('Draft saved locally in session.', 'info')
                }}
              >
                Save as Draft
              </GigwButton>

              <GigwButton type="submit" variant="success" size="sm" className="text-xs">
                Submit Sanction Proposal
              </GigwButton>
            </div>
          </div>
        </form>
      </div>

    </SampleModuleLayout>
  )
}
