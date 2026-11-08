/**
 * Canonical field control height — same as modal/list forms (e.g. Create New Project Record).
 * Use on compact toolbars so selects match InputField / SelectField / OrgDateField.
 */
export const ORG_FORM_CONTROL_HEIGHT_CLASS =
  'input-field !mt-0 h-11 min-h-11 max-h-11 box-border w-full touch-manipulation !py-2.5 text-[13px] leading-normal'

/** Toolbar / header native select — same height, width from wrapper. */
export const ORG_FORM_CONTROL_HEIGHT_SELECT_CLASS =
  `${ORG_FORM_CONTROL_HEIGHT_CLASS} appearance-none pr-9 cursor-pointer`

/** GigwButton beside form-height selects/inputs in page toolbars. */
export const PAGE_TOOLBAR_GIGW_BUTTON_CLASS = 'shrink-0'
