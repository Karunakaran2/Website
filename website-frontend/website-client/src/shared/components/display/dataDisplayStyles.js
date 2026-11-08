/** Shared Org UI read-only data display — GIGW typography tokens */

import {
  dataPanelBandTitleClass,
  dataSummaryLabelClass,
  dataSummaryValueClass,
  tableBodyCellClass,
  tableColumnLabelClass,
} from '@/shared/components/typography/typographyStyles'

export const dataDisplayShellClass =
  'overflow-auto rounded-lg border border-slate-200 shadow-none dark:border-slate-700'

export const dataDisplaySectionTitleClass = dataPanelBandTitleClass

export const dataDisplayGridLabelClass = dataSummaryLabelClass

export const dataDisplayGridValueClass = dataSummaryValueClass

export const dataDisplayGridCellClass =
  'min-h-[4.25rem] border-b border-r border-slate-100 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900'

export const dataDisplayTableClass = 'min-w-full border-collapse text-left text-sm font-sans'

export const dataDisplayTableHeadClass =
  `${tableColumnLabelClass} bg-[#F4FAFF] capitalize tracking-wide dark:bg-slate-900`

export const dataDisplayTableThClass =
  `${tableColumnLabelClass} bg-[#F4FAFF] px-3 py-3.5 capitalize align-middle min-h-[3rem] border-b border-slate-200 dark:border-slate-700 dark:bg-slate-900`

export const dataDisplayTableLabelCellClass =
  `${dataSummaryLabelClass} w-[32%] min-w-[8.5rem] text-center align-middle border-b border-slate-100 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900/50`

export const dataDisplayTableValueCellClass =
  `${tableBodyCellClass} border-b border-slate-100 px-3 py-2.5 text-center align-middle font-medium dark:border-slate-800`

export function dataDisplayGridColumnsClass(columns) {
  if (columns === 2) {
    return 'grid-cols-1 sm:grid-cols-2'
  }
  if (columns >= 3) {
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  }
  return 'grid-cols-1'
}

export function dataDisplayGridSpanClass(columns, span) {
  if (span === 'full' || span === columns) {
    return 'col-span-full'
  }
  if (span === 2 && columns >= 2) {
    return 'sm:col-span-2'
  }
  return ''
}
