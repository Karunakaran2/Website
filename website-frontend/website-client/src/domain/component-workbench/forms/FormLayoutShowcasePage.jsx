import { useState } from 'react'
import FormProfileSection from '@/shared/components/forms/FormProfileSection'
import FormProfileSectionHeader from '@/shared/components/forms/FormProfileSectionHeader'
import FormSectionHeading from '@/shared/components/forms/FormSectionHeading'
import { ReadOnlyField } from '@/shared/components/forms'
import OtpDigitInputs from '@/shared/components/forms/OtpDigitInputs'
import IndianAmountField from '@/shared/components/forms/IndianAmountField'
import GigwFormIconRowActions from '@/shared/components/buttons/gigw/GigwFormIconRowActions'
import { InputField } from '@/shared/components/forms'
import {
  WORKBENCH_PREVIEW_ROW_CLASS,
  WORKBENCH_SECTION_CARD_CLASS,
} from '../constants/workbenchPreviewStyles'

function useOtpState(length = 6) {
  const [digits, setDigits] = useState(() => Array.from({ length }, () => ''))

  const onDigitChange = (index, value) => {
    const next = value.replace(/\D/g, '').slice(-1)
    setDigits((prev) => {
      const copy = [...prev]
      copy[index] = next
      return copy
    })
  }

  const onKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      document.getElementById(`demo-otp-${index - 1}`)?.focus()
    }
  }

  return { digits, onDigitChange, onKeyDown }
}

export default function FormLayoutShowcasePage() {
  const [rows, setRows] = useState([{ id: 1, label: 'Line 1' }])
  const [amount, setAmount] = useState('')
  const otp = useOtpState(6)

  return (
    <div className="space-y-6 pb-12 w-full min-w-0">
      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h2 className="text-base font-bold text-slate-900">Form layout &amp; specialized fields</h2>
        <p className="mt-1 text-[13px] text-slate-600 leading-relaxed">
          Section cards, read-only display, OTP entry, Indian amount formatting, and form grid row
          add/remove actions from the shared forms and GIGW libraries.
        </p>
      </div>

      <FormProfileSection title="Identity">
        <p className="text-[13px] text-slate-600 mb-4">
          FormProfileSection groups related fields when a page or modal has multiple named blocks.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Code" name="demo-code" defaultValue="CC-001" />
          <ReadOnlyField label="Created by" value="System administrator" />
        </div>
      </FormProfileSection>

      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <FormProfileSectionHeader title="Inline section header" />
        <FormSectionHeading>FormSectionHeading — sub-block title inside a section</FormSectionHeading>
        <p className="text-[13px] text-slate-600 mt-2">
          Use section headings only when the modal title does not already name the screen.
        </p>
      </div>

      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h3 className="text-[14px] font-bold text-slate-900 mb-3">IndianAmountField</h3>
        <IndianAmountField
          label="Sanction amount (INR)"
          name="demo-amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h3 className="text-[14px] font-bold text-slate-900 mb-2">OtpDigitInputs</h3>
        <p className="text-[13px] text-slate-600 mb-3">Shared by login and OTR flows — six single-digit inputs.</p>
        <OtpDigitInputs
          otpDigits={otp.digits}
          onDigitChange={otp.onDigitChange}
          onKeyDown={otp.onKeyDown}
          idPrefix="demo-otp"
          inputClassName="h-11 w-9 sm:w-10 rounded-md border border-slate-300 text-center text-lg font-semibold tabular-nums focus:border-[#01458e] focus:outline-none focus:ring-2 focus:ring-[#01458e]/30"
        />
        <p className="mt-2 text-[12px] text-slate-500 font-mono">{otp.digits.join('') || '—'}</p>
      </div>

      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h3 className="text-[14px] font-bold text-slate-900 mb-3">GigwFormIconRowActions</h3>
        <ul className="space-y-2">
          {rows.map((row, index) => (
            <li key={row.id} className={`${WORKBENCH_PREVIEW_ROW_CLASS} items-end`}>
              <InputField label={`Row ${index + 1}`} name={`row-${row.id}`} defaultValue={row.label} className="flex-1 min-w-0" />
              <GigwFormIconRowActions
                showAdd={index === rows.length - 1}
                onAdd={() => setRows((prev) => [...prev, { id: Date.now(), label: '' }])}
                onRemove={rows.length > 1 ? () => setRows((prev) => prev.filter((r) => r.id !== row.id)) : undefined}
                showRemove={rows.length > 1}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
