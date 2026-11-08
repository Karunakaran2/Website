/**
 * GIGW / SEEPZ button tokens (from GIGW_Button_Component_Library + Action_Icon_Component_Library).
 * Lucide icons used in place of Feather in React.
 */

export const GIGW_FOCUS_CLASS =
  'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005a9c]'

export const GIGW_BTN_BASE =
  `inline-flex items-center justify-center gap-2 rounded border font-medium transition-all duration-200 ease-in-out cursor-pointer active:translate-y-px disabled:opacity-[0.45] disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:translate-y-0 ${GIGW_FOCUS_CLASS}`

export const GIGW_BTN_VARIANT_CLASS = {
  primary:
    'border-[#005a9c] bg-[#005a9c] text-white hover:bg-[#004578] hover:border-[#004578]',
  secondary:
    'border-[#005a9c] bg-white text-[#005a9c] hover:bg-[#e6f0f7]',
  tertiary:
    'border-transparent bg-transparent px-3 py-2.5 font-medium text-[#005a9c] hover:bg-[#e6f0f7]',
  success:
    'border-[#157347] bg-[#157347] text-white hover:bg-[#146c43] hover:border-[#146c43]',
  danger:
    'border-[#b42318] bg-[#b42318] text-white hover:bg-[#8f1d14] hover:border-[#8f1d14]',
  outlinePrimary:
    'border-[#005a9c] bg-white text-[#005a9c] hover:bg-[#e6f0f7]',
  outlineUtility:
    'border-[#7c8798] bg-white text-[#344054] hover:bg-[#f2f4f7]',
  outlineDanger:
    'border-[#b42318] bg-white text-[#b42318] hover:bg-[#fdecec] hover:border-[#8f1d14]',
  outlineSuccess:
    'border-[#157347] bg-white text-[#157347] hover:bg-[#eaf7ef]',
  /** Same tones as ActionButton pdf / excel variants */
  pdf: 'border-[#b42318] bg-white text-[#b42318] hover:bg-[#fdecec] hover:border-[#8f1d14]',
  excel: 'border-[#157347] bg-white text-[#157347] hover:bg-[#eaf7ef]',
}

/** Mobile 44px → laptop 40px → large desktop 44px (SEEPZ responsive table). */
export const GIGW_BTN_SIZE_CLASS = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-11 min-h-11 max-h-11 px-4 text-[13px] leading-normal',
  /** Page toolbars — lock h-11 at all breakpoints (matches InputField / SelectField). */
  form: 'h-11 min-h-11 max-h-11 px-4 text-[13px] leading-normal',
  lg: 'h-[50px] px-6 text-lg',
}

export const GIGW_ICON_BTN_BASE =
  `inline-flex shrink-0 items-center justify-center size-9 max-md:size-11 min-[1600px]:size-10 rounded-[6px] border border-[#d1d5db] bg-white p-0 transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-[0.92] max-md:[&_svg]:size-5 min-[1600px]:[&_svg]:size-[18px] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none ${GIGW_FOCUS_CLASS}`

/** DataTable row icons — stay 36px so tables do not force overflow-x on md viewports. */
export const GIGW_TABLE_ICON_BTN_CLASS =
  '!size-9 min-[1600px]:!size-9 max-md:!size-9 max-md:[&_svg]:!size-4'

/** Icon stroke color + hover background (Feather action library tones). */
export const GIGW_ICON_TONE_CLASS = {
  info: 'text-[#344054] hover:bg-[#e6f0f7]',
  system: 'text-[#344054] hover:bg-[#e4e7ec]',
  destructive: 'text-[#b42318] hover:bg-[#fdecec]',
  positive: 'text-[#157347] hover:bg-[#e8f5e9]',
  primary: 'text-[#005a9c] hover:bg-[#004578] hover:text-white',
  pdf: 'text-[#344054] hover:bg-[#fdecec]',
  excel: 'text-[#344054] hover:bg-[#e8f5e9]',
}

/** Default row actions (edit, delete, view, …). */
export const GIGW_ICON_SIZE = 16

/** Activate / deactivate — slightly larger so they match edit visually (Lucide stroke). */
export const GIGW_TOGGLE_ICON_SIZE = 18

export const GIGW_ICON_BOX_CLASS =
  'pointer-events-none inline-flex shrink-0 items-center justify-center'
