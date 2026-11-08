/**
 * Maps tailwreck Input / Select / DatePicker wrappers to Org UI Complex Form.
 * Scope label utilities to `.field-label` only — not radio/checkbox option labels inside fieldsets.
 */

/** Fixed control height — Org complex-form row (~44px, slightly above default `h-10`). */
export const orgProbityControlHeightClass =
  '!h-11 !min-h-11 !max-h-11 !box-border !py-2.5 !leading-normal'

/**
 * Flatten tailwreck FeaturedBasicSelect chrome inside {@link orgProbityControlSlotClass}.
 * Only hide the empty error footer (`div.mt-1`) — not the open listbox (also uses `mt-1`).
 */
export const orgProbityControlSlotShellClass = [
  '[&_.org-probity-control-slot]:overflow-visible',
  '[&_.org-probity-control-slot_.relative.w-full]:!mb-0',
  '[&_.org-probity-control-slot_.group]:!mb-0',
  '[&_.org-probity-control-slot_.relative.w-full.group]:!mb-0',
  '[&_.org-probity-control-slot_.group]:!overflow-visible',
  '[&_.org-probity-control-slot_.relative.w-full>div.mt-1:empty]:!hidden',
  '[&_.org-probity-control-slot_.relative.w-full>div.mt-1:empty]:!m-0',
  '[&_.org-probity-control-slot_.relative.w-full>div.mt-1:empty]:!h-0',
  '[&_.org-probity-control-slot_.relative.w-full>div.mt-1:empty]:!min-h-0',
  /* Tailwreck `error` text — use Probity FieldError below the control instead */
  '[&_.org-probity-control-slot_.relative.w-full>div.mt-1:has([role=alert])]:!hidden',
  '[&_.org-probity-control-slot_.group>div.absolute.max-h-60]:!z-[300]',
  '[&_.group:has([aria-expanded=true])]:!z-[100]',
  '[&_.group>div.absolute.max-h-60]:!z-[300]',
  '[&_[role=button][aria-haspopup="listbox"]]:!mt-0',
  '[&_[role=button][aria-haspopup="listbox"]]:!mb-0',
  '[&_[role=button][aria-haspopup="listbox"]]:!h-11',
  '[&_[role=button][aria-haspopup="listbox"]]:!min-h-11',
  '[&_[role=button][aria-haspopup="listbox"]]:!max-h-11',
  '[&_[role=button][aria-haspopup="listbox"]]:!box-border',
  '[&_[role=button][aria-haspopup="listbox"]]:!py-2.5',
  '[&_[role=button][aria-haspopup="listbox"]]:!leading-normal',
].join(' ')

/** Overrides tailwreck `size="md"` combobox height inside a field cell. */
export const tailwreckComboboxHeightShellClass = [
  '[&_.group]:!mb-0',
  '[&_.relative.w-full>div.mt-1:empty]:!hidden',
  '[&_.relative.w-full>_.relative.group_[role=combobox]]:!mt-0',
  '[&_[role=combobox]]:!h-11',
  '[&_[role=combobox]]:!min-h-11',
  '[&_[role=combobox]]:!max-h-11',
  '[&_[role=combobox]]:!py-2.5',
  '[&_[role=combobox]]:!leading-normal',
  '[&_[role=combobox]]:!box-border',
].join(' ')

export const tailwreckFormShellClass = [
  '[&_.field-label]:!mb-1',
  '[&_.field-label]:!text-sm',
  '[&_.field-label]:!font-medium',
  '[&_.field-label]:!leading-5',
  '[&_.field-label]:!text-gray-700',
  'dark:[&_.field-label]:!text-slate-300',
  '[html[data-color-scheme=high]_&_.field-label]:!text-white',
  '[html[data-login-contrast=high]_&_.field-label]:!text-white',
  '[html.contrast-high_&_.field-label]:!text-white',
  '[html[data-color-scheme=yellow]_&_.field-label]:!text-[#ff0]',
  '[html[data-login-contrast=yellow]_&_.field-label]:!text-[#ff0]',
  '[html.contrast-yellow_&_.field-label]:!text-[#ff0]',
  '[&_.field-label_.form-required-mark]:!font-semibold',
  '[&_.field-label_.form-required-mark]:!text-rose-600',
  'dark:[&_.field-label_.form-required-mark]:!text-rose-400',
  /* FeaturedBasicSelect built-in label → match FormLabel */
  '[&_.relative.w-full>label]:!mb-1',
  '[&_.relative.w-full>label]:!block',
  '[&_.relative.w-full>label]:!text-sm',
  '[&_.relative.w-full>label]:!font-medium',
  '[&_.relative.w-full>label]:!leading-5',
  '[&_.relative.w-full>label]:!text-gray-700',
  'dark:[&_.relative.w-full>label]:!text-slate-300',
  '[html[data-color-scheme=high]_&_.relative.w-full>label]:!text-white',
  '[html[data-login-contrast=high]_&_.relative.w-full>label]:!text-white',
  '[html.contrast-high_&_.relative.w-full>label]:!text-white',
  '[html[data-color-scheme=yellow]_&_.relative.w-full>label]:!text-[#ff0]',
  '[html[data-login-contrast=yellow]_&_.relative.w-full>label]:!text-[#ff0]',
  '[html.contrast-yellow_&_.relative.w-full>label]:!text-[#ff0]',
  '[&_.relative.w-full>label_.text-red-500]:!font-semibold',
  '[&_.relative.w-full>label_.text-red-500]:!text-rose-600',
  'dark:[&_.relative.w-full>label_.text-red-500]:!text-rose-400',
  '[&_legend.field-label]:!mb-1',
  '[&_legend.field-label]:!text-sm',
  '[&_legend.field-label]:!font-medium',
  '[&_legend.field-label]:!leading-5',
  '[&_legend.field-label]:!text-gray-700',
  'dark:[&_legend.field-label]:!text-slate-300',
  '[html[data-color-scheme=high]_&_legend.field-label]:!text-white',
  '[html[data-login-contrast=high]_&_legend.field-label]:!text-white',
  '[html.contrast-high_&_legend.field-label]:!text-white',
  '[html[data-color-scheme=yellow]_&_legend.field-label]:!text-[#ff0]',
  '[html[data-login-contrast=yellow]_&_legend.field-label]:!text-[#ff0]',
  '[html.contrast-yellow_&_legend.field-label]:!text-[#ff0]',
  '[&_.form-option-label]:!mb-0',
  '[&_.form-option-label]:!inline-flex',
  '[&_.form-option-label]:!items-center',
  '[&_.form-option-label]:!gap-2',
  '[&_.form-option-label]:!font-normal',
  '[&_input:not([type=hidden]):not([type=radio]):not([type=checkbox])]:input-field',
  '[&_input:not([type=hidden]):not([type=radio]):not([type=checkbox])]:!mt-1',
  '[&_input:not([type=hidden]):not([type=radio]):not([type=checkbox])]:!h-11',
  '[&_input:not([type=hidden]):not([type=radio]):not([type=checkbox])]:!min-h-11',
  '[&_input:not([type=hidden]):not([type=radio]):not([type=checkbox])]:!w-full',
  '[&_textarea]:input-field',
  '[&_textarea]:!mt-1',
  '[&_select]:input-field',
  '[&_select]:!mt-1',
  '[&_[role=combobox]]:input-field',
  '[&_[role=combobox]]:!mt-0',
  '[&_[role=combobox]:not(:has(.max-h-60))]:!h-11',
  '[&_[role=combobox]:not(:has(.max-h-60))]:!min-h-11',
  '[&_[role=combobox]:not(:has(.max-h-60))]:!max-h-11',
  '[&_[role=combobox]]:!w-full',
  '[&_.react-datepicker-wrapper]:!mt-1',
  '[&_.react-datepicker-wrapper]:!block',
  '[&_.react-datepicker-wrapper]:!w-full',
  /* tailwreck Input / TextArea wrapper */
  '[&_.flex.flex-col.w-full>label]:!mb-1',
  '[&_.flex.flex-col.w-full>label]:!text-sm',
  '[&_.flex.flex-col.w-full>label]:!font-medium',
  '[&_.flex.flex-col.w-full>label]:!leading-5',
  '[&_.flex.flex-col.w-full>label]:!text-gray-700',
  'dark:[&_.flex.flex-col.w-full>label]:!text-slate-300',
  '[html[data-color-scheme=high]_&_.flex.flex-col.w-full>label]:!text-white',
  '[html[data-login-contrast=high]_&_.flex.flex-col.w-full>label]:!text-white',
  '[html.contrast-high_&_.flex.flex-col.w-full>label]:!text-white',
  '[html[data-color-scheme=yellow]_&_.flex.flex-col.w-full>label]:!text-[#ff0]',
  '[html[data-login-contrast=yellow]_&_.flex.flex-col.w-full>label]:!text-[#ff0]',
  '[html.contrast-yellow_&_.flex.flex-col.w-full>label]:!text-[#ff0]',
  '[&_.form-input]:!mt-1',
  '[&_.form-input]:!h-11',
  '[&_.form-input]:!min-h-11',
  '[&_.form-input]:!max-h-11',
  '[&_.form-input]:!box-border',
  tailwreckComboboxHeightShellClass,
  '[&_.org-probity-control-slot_input:not([type=hidden]):not([type=radio]):not([type=checkbox])]:!mt-0',
].join(' ')

/** FeaturedBasicSelect / combobox trigger — same height as {@link inputControlClass} */
export const tailwreckSelectTriggerClass = [
  'input-field !mt-1 !w-full touch-manipulation rounded border border-slate-300 bg-white px-3 text-[13px] text-slate-800',
  'focus:border-[#01458e] focus:outline-none focus:ring-1 focus:ring-[#01458e]',
  orgProbityControlHeightClass,
].join(' ')

/**
 * Shared label→control gap for InputField and FeaturedBasicSelect (matches SelectField wrapper).
 * @see orgProbityControlSlotShellClass
 */
export const orgProbityControlSlotClass = [
  'org-probity-control-slot mt-1 min-h-11 w-full min-w-0',
  orgProbityControlSlotShellClass,
].join(' ')

/** Voucher line-item / accounting grid: control row only (mobile label is separate). */
export const voucherGridControlShellClass = [
  'org-probity-control-slot mt-0 min-h-11 w-full min-w-0',
  orgProbityControlSlotShellClass,
].join(' ')

export const voucherGridMobileLabelClass =
  'mb-2 block min-h-0 text-xs font-medium leading-5 text-slate-500 lg:mb-0 lg:hidden'

/** Same as {@link voucherGridMobileLabelClass} but hides from `md` (accounting entry rows). */
export const voucherGridMobileLabelMdClass =
  'mb-2 block min-h-0 text-xs font-medium leading-5 text-slate-500 md:mb-0 md:hidden'

/** Combobox below {@link OrgProbityFieldLabel} inside a `mt-1` wrapper (matches {@link InputField}). */
export const orgProbitySelectTriggerClass = [
  'input-field !mt-0 !w-full touch-manipulation rounded border border-slate-300 bg-white px-3 text-[13px] text-slate-800',
  'focus:border-[#01458e] focus:outline-none focus:ring-1 focus:ring-[#01458e]',
  '!h-[2.75rem]',
  orgProbityControlHeightClass,
].join(' ')

/** Invalid select trigger border when not using tailwreck `error` (avoids duplicate error text). */
export const orgProbitySelectInvalidClass =
  '!border-rose-400 focus:!border-rose-500 focus:!ring-rose-400 dark:!border-rose-400'

/** When invalid class on FeaturedBasicSelect root does not reach the listbox button, target it via shell. */
export const orgProbitySelectInvalidShellClass = [
  '[&_[role=button][aria-haspopup="listbox"]]:!border-rose-400',
  '[&_[role=button][aria-haspopup="listbox"]]:!ring-1',
  '[&_[role=button][aria-haspopup="listbox"]]:focus:!border-rose-500',
  '[&_[role=button][aria-haspopup="listbox"]]:focus:!ring-rose-400',
].join(' ')

/** Shell around tailwreck {@link FeaturedBasicSelect} in Probity voucher/setup rows. */
export const orgProbitySelectShellClass = [
  'relative min-w-0 overflow-visible',
  tailwreckComboboxHeightShellClass,
].join(' ')

/** Alias for setup forms using inline {@link FeaturedBasicSelect}. */
export const tailwreckFeaturedSelectShellClass = orgProbitySelectShellClass

/** Raise an open listbox above the next grid cell or form section. */
export const dropdownStackingClass =
  'relative has-[[aria-expanded=true]]:z-[100] focus-within:z-[100]'

/** Line-item / accounting-entry cell that can host FeaturedBasicSelect. */
export const voucherGridCellClass =
  'relative z-auto flex min-w-0 flex-col has-[[aria-expanded=true]]:z-[100] focus-within:z-[100]'

/** Wrapper around voucher select grids so an open list is not covered by the next section. */
export const voucherGridSectionClass =
  'relative z-auto min-w-0 overflow-visible has-[[aria-expanded=true]]:z-[80] focus-within:z-[80]'

/** Voucher / setup field cell (label + control + popper stacking) */
export const formFieldCellClass = [
  'form-field-cell',
  tailwreckFormShellClass,
  'relative min-w-0 overflow-visible',
  dropdownStackingClass,
].join(' ')

/** Datepicker input inside tailwreck BasicDatePicker */
export const tailwreckDateInputClass =
  'input-field !mt-1 !h-11 !min-h-11 !w-full !rounded !border-slate-300 !px-3 !py-2.5 !pl-10 !text-[13px] !leading-normal'
