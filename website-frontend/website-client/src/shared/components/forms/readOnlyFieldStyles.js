import { formFieldLabelClass } from './formFieldLabelStyles'

/** Gray read-only field styling — signals non-editable summary content. */
export const readOnlyLabelClass = formFieldLabelClass

export const readOnlyValueClass =
  'mt-1 flex h-11 min-h-11 max-h-11 w-full items-center rounded-md border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm font-medium leading-normal text-slate-600 select-none cursor-not-allowed box-border dark:bg-slate-800/60 dark:border-slate-600 dark:text-slate-300'

/** Gray read-only `<input>` — matches locked summary fields */
export const readOnlyInputClass =
  'input-field !mt-0 h-11 min-h-11 max-h-11 box-border w-full rounded-md border border-slate-200 bg-slate-100 px-3 py-2.5 text-[13px] font-medium leading-normal text-slate-600 cursor-not-allowed focus:border-slate-200 focus:outline-none focus:ring-0 read-only:bg-slate-100 read-only:text-slate-600 dark:bg-slate-800/60 dark:border-slate-600 dark:text-slate-300 dark:read-only:bg-slate-800/60 dark:read-only:text-slate-300'

/** Gray read-only `<textarea>` — same initial height as read-only inputs; resize / grow for long text */
export const readOnlyTextareaClass =
  'input-field !mt-0 min-h-[3.5rem] box-border w-full max-h-[24rem] resize-y overflow-y-auto rounded-md border border-slate-200 bg-slate-100 px-3 py-2.5 text-[13px] font-medium leading-normal text-slate-600 cursor-not-allowed focus:border-slate-200 focus:outline-none focus:ring-0 read-only:bg-slate-100 read-only:text-slate-600 dark:bg-slate-800/60 dark:border-slate-600 dark:text-slate-300 dark:read-only:bg-slate-800/60 dark:read-only:text-slate-300'

export const readOnlySectionClass =
  'rounded-lg border border-slate-200 bg-slate-50/80 p-3 sm:p-4'
