import { useState } from 'react'
import {
  OrgTextField,
  OrgSelectField,
  TextAreaField,
  IndianAmountField,
  FormCheckboxField,
} from '@/shared/components/forms'
import { ActionButton } from '@/shared/components/buttons'
import { CheckCircle2 } from 'lucide-react'
import { useProbityForm } from '@/shared/utils/useProbityForm'
import { scheduleFocusFirstFormError } from '@/shared/utils/formValidationFocus'

export default function FormValidationPage() {
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useProbityForm({
    defaultValues: {
      accountCode: '',
      officerName: '',
      department: '',
      sanctionAmount: '',
      justification: '',
      agreeTerms: false,
    },
  })

  const onSubmit = (data) => {
    setSubmittedData(data)
    setSubmitSuccess(true)
  }

  const onInvalid = (fieldErrors) => {
    scheduleFocusFirstFormError(fieldErrors)
  }

  const handleResetForm = () => {
    reset()
    setSubmitSuccess(false)
    setSubmittedData(null)
  }

  return (
    <div className="space-y-6 pb-12 w-full">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">
            Enterprise Form Validation & Submission
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            React Hook Form with field-level errors below each control (rose border + inline message).
            No separate error summary — fix fields in place, then submit again.
          </p>
        </div>

        {submitSuccess && submittedData ? (
          <div
            role="status"
            aria-live="polite"
            className="mb-6 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-emerald-900"
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>Sanction Proposal Form submitted and validated successfully!</span>
            </div>
            <p className="mt-1 text-xs text-emerald-800">
              Transaction token: <strong>TXN-{Date.now().toString().slice(-6)}</strong>. Record forwarded to the Accounts Officer.
            </p>
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="space-y-5"
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <OrgTextField
              id="val-account-code"
              name="accountCode"
              label="Account Code"
              required
              control={control}
              rules={{
                required: 'Account code is required.',
                pattern: {
                  value: /^ACC-[0-9]{4}$/i,
                  message: 'Format must match ACC-XXXX (e.g. ACC-2026).',
                },
              }}
              placeholder="e.g. ACC-2026"
            />

            <OrgTextField
              id="val-officer-name"
              name="officerName"
              label="Initiating Officer Full Name"
              required
              control={control}
              rules={{
                required: 'Officer name is required.',
                minLength: {
                  value: 3,
                  message: 'Name must have at least 3 characters.',
                },
              }}
              placeholder="e.g. K. Narayanan Nair"
            />

            <OrgSelectField
              id="val-department"
              name="department"
              label="Administrative Department"
              required
              control={control}
              rules={{ required: 'Please select an administrative department.' }}
              options={[
                { value: '', label: 'Select department...' },
                { value: 'finance', label: 'Finance & Treasury' },
                { value: 'revenue', label: 'Land Revenue & Settlement' },
                { value: 'health', label: 'Health & Family Welfare' },
                { value: 'pwd', label: 'Public Works Department (PWD)' },
              ]}
              externalError={errors.department?.message}
            />

            <IndianAmountField
              id="val-amount"
              label="Expenditure Sanction Amount (₹)"
              required
              {...register('sanctionAmount', {
                required: 'Sanction amount is required.',
                validate: (val) => Number(val) > 0 || 'Amount must be greater than zero.',
              })}
              error={errors.sanctionAmount?.message}
              placeholder="0.00"
            />
          </div>

          <div className="max-w-2xl">
            <TextAreaField
              id="val-justification"
              name="justification"
              label="Audit Justification & Project Scope"
              required
              rows={4}
              maxLength={200}
              {...register('justification', {
                required: 'Audit justification is mandatory.',
                minLength: {
                  value: 10,
                  message: 'Please provide at least 10 characters of detail.',
                },
              })}
              error={errors.justification?.message}
            />
          </div>

          <FormCheckboxField
            id="val-terms"
            name="agreeTerms"
            label="I confirm that all financial amounts match authenticated government sanction orders"
            required
            register={register}
            rules={{
              validate: (value) =>
                value === true || 'You must confirm compliance before submitting.',
            }}
            error={errors.agreeTerms?.message}
          />

          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <ActionButton variant="submit" type="submit">
              Validate & Submit
            </ActionButton>
            <ActionButton variant="reset" type="button" onClick={handleResetForm}>
              Reset Form
            </ActionButton>
          </div>
        </form>
      </div>

      {submittedData ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="mb-4 border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Validated Submission Payload</h2>
            <p className="mt-1 text-xs text-slate-500">
              Verified form state processed by React Hook Form.
            </p>
          </div>
          <pre className="rounded-lg bg-slate-50 p-4 text-xs font-mono text-slate-800 border border-slate-200">
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  )
}
