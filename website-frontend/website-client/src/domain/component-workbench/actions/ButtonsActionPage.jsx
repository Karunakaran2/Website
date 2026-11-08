import { useState } from 'react'
import {
  ActionButton,
  PrimaryButton,
  SubmitButton,
  CancelButton,
  BackButton,
  LinkButton,
} from '@/shared/components/buttons'
import {
  WORKBENCH_PREVIEW_ROW_CLASS,
  WORKBENCH_SECTION_CARD_CLASS,
} from '../constants/workbenchPreviewStyles'

export default function ButtonsActionPage() {
  const [lastAction, setLastAction] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const triggerAction = (name) => {
    setLastAction({
      name,
      time: new Date().toLocaleTimeString(),
    })
  }

  const simulateAsyncSave = () => {
    setIsLoading(true)
    setLastAction({ name: 'Saving record...', time: new Date().toLocaleTimeString() })
    setTimeout(() => {
      setIsLoading(false)
      setLastAction({ name: 'Save successful (Record persisted)', time: new Date().toLocaleTimeString() })
    }, 1500)
  }

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* 1. Semantic ActionButton Variants */}
      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Semantic Action Buttons (ActionButton)</h2>
          <p className="mt-1 text-xs text-slate-500">
            Standard enterprise action variants matching form control height (h-11 / 44px for size md), 13px typography, and GIGW color tokens.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Standard Primary & Form Variants
            </h3>
            <div className={WORKBENCH_PREVIEW_ROW_CLASS}>
              <ActionButton
                variant="primary"
                onClick={() => triggerAction('ActionButton (variant="primary")')}
              >
                Primary Action
              </ActionButton>

              <ActionButton
                variant="submit"
                onClick={() => triggerAction('ActionButton (variant="submit")')}
              >
                Submit Form
              </ActionButton>

              <ActionButton
                variant="save"
                onClick={() => triggerAction('ActionButton (variant="save")')}
              >
                Save Draft
              </ActionButton>

              <ActionButton
                variant="add"
                onClick={() => triggerAction('ActionButton (variant="add")')}
              >
                Add New Record
              </ActionButton>

              <ActionButton
                variant="cancel"
                onClick={() => triggerAction('ActionButton (variant="cancel")')}
              >
                Cancel
              </ActionButton>

              <ActionButton
                variant="reset"
                onClick={() => triggerAction('ActionButton (variant="reset")')}
              >
                Reset Fields
              </ActionButton>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Specialized Document & Destructive Actions
            </h3>
            <div className={WORKBENCH_PREVIEW_ROW_CLASS}>
              <ActionButton
                variant="excel"
                onClick={() => triggerAction('ActionButton (variant="excel")')}
              >
                Export Excel
              </ActionButton>

              <ActionButton
                variant="pdf"
                onClick={() => triggerAction('ActionButton (variant="pdf")')}
              >
                Export PDF
              </ActionButton>

              <ActionButton
                variant="delete"
                onClick={() => triggerAction('ActionButton (variant="delete")')}
              >
                Delete Record
              </ActionButton>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Specialized Button Shorthands */}
      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Dedicated Semantic Shorthands</h2>
          <p className="mt-1 text-xs text-slate-500">
            Pre-configured component wrappers with accessibility defaults and standardized type attributes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <PrimaryButton onClick={() => triggerAction('PrimaryButton')}>
            PrimaryButton
          </PrimaryButton>

          <SubmitButton onClick={() => triggerAction('SubmitButton')}>
            SubmitButton
          </SubmitButton>

          <CancelButton onClick={() => triggerAction('CancelButton')}>
            CancelButton
          </CancelButton>

          <BackButton onClick={() => triggerAction('BackButton')}>
            Back
          </BackButton>

          <LinkButton onClick={() => triggerAction('LinkButton')}>
            Secondary Link
          </LinkButton>
        </div>
      </div>

      {/* 3. States & Async Feedback */}
      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Interaction & Disabled States</h2>
          <p className="mt-1 text-xs text-slate-500">
            All buttons support disabled and simulated async loading states while preserving WCAG visible focus indicators.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ActionButton
            variant="primary"
            disabled={isLoading}
            onClick={simulateAsyncSave}
          >
            {isLoading ? 'Processing Save…' : 'Trigger Async Loading'}
          </ActionButton>

          <ActionButton variant="primary" disabled>
            Disabled Primary
          </ActionButton>

          <ActionButton variant="cancel" disabled>
            Disabled Cancel
          </ActionButton>

          <ActionButton variant="delete" disabled>
            Disabled Delete
          </ActionButton>
        </div>

        {/* Action Trigger Telemetry */}
        <div className="mt-6 flex items-center justify-between rounded-lg bg-slate-50 p-4 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500">Last Action Invoked: </span>
            <strong className="text-slate-900">
              {lastAction ? `${lastAction.name} at ${lastAction.time}` : 'None yet (Click any button above)'}
            </strong>
          </div>
          {lastAction && (
            <button
              type="button"
              onClick={() => setLastAction(null)}
              className="text-xs font-semibold text-[#01458e] underline hover:text-[#003366]"
            >
              Clear log
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
