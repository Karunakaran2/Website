import { useState } from 'react'
import { useProbityForm } from '@/shared/utils/useProbityForm'
import OrgDateField, {
  fromNativeDateInputValue,
  toNativeDateInputValue,
} from '@/shared/components/forms/OrgDateField'
import { InputField } from '@/shared/components/forms'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { formatDisplayDate } from '@/shared/utils/probityFormat'
import {
  WORKBENCH_PREVIEW_ROW_CLASS,
  WORKBENCH_SECTION_CARD_CLASS,
} from '../constants/workbenchPreviewStyles'

export default function DateTimeFormPage() {
  const [standaloneValue, setStandaloneValue] = useState('')
  const [standaloneError, setStandaloneError] = useState('')

  const { control, handleSubmit, watch, reset, formState: { errors } } = useProbityForm({
    defaultValues: {
      effectiveDate: null,
      expiryDate: null,
    },
  })

  const effectiveDate = watch('effectiveDate')
  const expiryDate = watch('expiryDate')

  const onSubmit = () => {
    // Demo only — validation passed; no API
  }

  const minToday = toNativeDateInputValue(new Date())

  return (
    <div className="space-y-6 pb-12 w-full min-w-0">
      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h2 className="text-base font-bold text-slate-900">OrgDateField</h2>
        <p className="mt-1 text-[13px] text-slate-600 leading-relaxed">
          Production date control for vouchers and domain forms. Uses the native HTML{' '}
          <code className="text-[12px]">type="date"</code> picker with form values stored as{' '}
          <code className="text-[12px]">Date</code> objects. Display in lists uses{' '}
          <code className="text-[12px]">formatDisplayDate</code> (dd-mm-yyyy).
        </p>
        <p className="mt-2 text-[12px] text-slate-600">
          <strong className="text-slate-800">Purpose:</strong> Single-date selection with RHF validation,
          min/max constraints, disabled state, and FieldError integration.
        </p>
      </div>

      <form
        className={`${WORKBENCH_SECTION_CARD_CLASS} flex flex-col gap-4`}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3 className="text-[14px] font-bold text-slate-900">React Hook Form integration</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <OrgDateField
            control={control}
            name="effectiveDate"
            label="Effective date"
            required
            rules={{ required: 'Effective date is required' }}
            error={errors.effectiveDate?.message}
          />
          <OrgDateField
            control={control}
            name="expiryDate"
            label="Expiry date (min = today)"
            min={minToday}
            rules={{
              validate: (value) => {
                if (!value || !effectiveDate) return true
                if (value < effectiveDate) return 'Expiry must be on or after effective date'
                return true
              },
            }}
            error={errors.expiryDate?.message}
          />
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-[12px] text-slate-700">
          <p className="font-semibold text-slate-800 mb-1">Selected values (live)</p>
          <p>
            Effective:{' '}
            <strong>{effectiveDate ? formatDisplayDate(effectiveDate) : '—'}</strong>
          </p>
          <p>
            Expiry: <strong>{expiryDate ? formatDisplayDate(expiryDate) : '—'}</strong>
          </p>
        </div>
        <div className={WORKBENCH_PREVIEW_ROW_CLASS}>
          <GigwButton type="submit" variant="primary">
            Validate dates
          </GigwButton>
          <GigwButton type="button" variant="outlineUtility" onClick={() => reset()}>
            Reset
          </GigwButton>
        </div>
      </form>

      <div className={`${WORKBENCH_SECTION_CARD_CLASS} space-y-4`}>
        <h3 className="text-[14px] font-bold text-slate-900">Standalone InputField (type date)</h3>
        <p className="text-[13px] text-slate-600">
          When not using RHF, OrgDateField renders <code className="text-[12px]">InputField</code> with{' '}
          <code className="text-[12px]">type="date"</code> and converts via{' '}
          <code className="text-[12px]">toNativeDateInputValue</code> /{' '}
          <code className="text-[12px]">fromNativeDateInputValue</code>.
        </p>
        <InputField
          label="Document date"
          type="date"
          name="demo-standalone-date"
          id="demo-standalone-date"
          required
          min={minToday}
          value={standaloneValue}
          onChange={(e) => {
            setStandaloneError('')
            setStandaloneValue(e.target.value)
          }}
          error={standaloneError}
        />
        <GigwButton
          type="button"
          variant="outlineUtility"
          onClick={() => {
            if (!standaloneValue) {
              setStandaloneError('Please select a date')
              return
            }
            setStandaloneError('')
          }}
        >
          Show validation state
        </GigwButton>
        <p className="text-[12px] text-slate-600">
          Parsed Date:{' '}
          <strong>
            {standaloneValue
              ? formatDisplayDate(fromNativeDateInputValue(standaloneValue))
              : '—'}
          </strong>
        </p>
      </div>

      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h3 className="text-[14px] font-bold text-slate-900">Not in shared library</h3>
        <ul className="mt-2 list-disc pl-5 text-[13px] text-slate-600 space-y-1">
          <li>Date range picker — use two OrgDateField controls or page toolbar date filters.</li>
          <li>Time picker — no shared component; native time input via InputField if needed.</li>
          <li>Inline month/year-only calendars — not implemented as shared primitives.</li>
        </ul>
      </div>
    </div>
  )
}
