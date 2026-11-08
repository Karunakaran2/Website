import { WORKBENCH_PREVIEW_ROW_CLASS, WORKBENCH_SECTION_CARD_CLASS } from '../constants/workbenchPreviewStyles'
import {
  ActionButton,
  BackButton,
  PrimaryButton,
  SubmitButton,
  CancelButton,
  LinkButton,
} from '@/shared/components/buttons'

export default function LegacyButtonsShowcasePage() {
  return (
    <div className="space-y-6 pb-12 w-full min-w-0">
      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h2 className="text-base font-bold text-slate-900">Legacy action buttons</h2>
        <p className="mt-1 text-[13px] text-slate-600 leading-relaxed">
          Pre-GIGW button components still used in some feedback demos and older domains. New list and
          form screens should use <code className="text-[12px]">GigwButton</code> — see Actions → Buttons.
        </p>
        <div className={`${WORKBENCH_PREVIEW_ROW_CLASS} mt-4 flex-wrap`}>
          <ActionButton variant="add" type="button">Add</ActionButton>
          <ActionButton variant="save" type="button">Save</ActionButton>
          <ActionButton variant="delete" type="button">Delete</ActionButton>
          <ActionButton variant="primary" type="button">Primary</ActionButton>
        </div>
        <div className={`${WORKBENCH_PREVIEW_ROW_CLASS} mt-3 flex-wrap`}>
          <BackButton type="button">Back</BackButton>
          <PrimaryButton type="button">PrimaryButton</PrimaryButton>
          <SubmitButton type="button">SubmitButton</SubmitButton>
          <CancelButton type="button">CancelButton</CancelButton>
          <LinkButton type="button">LinkButton</LinkButton>
        </div>
      </div>
    </div>
  )
}
