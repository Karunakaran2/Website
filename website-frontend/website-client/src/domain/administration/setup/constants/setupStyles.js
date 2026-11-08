import {
  FORM_FOOTER_CANCEL_CLASS,
  FORM_FOOTER_PRIMARY_CLASS,
} from '@/shared/components/buttons/actionButtonStyles'
import {
  FORM_SECTION_TITLE_CLASS,
  inputFieldClass,
  labelClass,
  tailwreckFormShellClass,
} from '@/shared/components/forms'

export {
  FORM_FOOTER_CANCEL_CLASS,
  FORM_FOOTER_PRIMARY_CLASS,
  inputFieldClass,
  labelClass as formFieldLabelClass,
  FORM_SECTION_TITLE_CLASS as setupSectionTitleClass,
}

/** Tailwreck fields inside setup forms — SPFO Complex Input Form */
export const setupFormFieldClass = tailwreckFormShellClass

export const fieldClass = setupFormFieldClass

/** @deprecated Use FORM_SECTION_TITLE_CLASS */
export const legacySetupSectionTitleClass = 'text-sm font-semibold text-slate-800'

/** @deprecated Use FORM_FOOTER_PRIMARY_CLASS */
export const setupFormPrimaryActionClass = FORM_FOOTER_PRIMARY_CLASS
