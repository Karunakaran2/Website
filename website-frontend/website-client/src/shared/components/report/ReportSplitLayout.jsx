import { FileSpreadsheet, FileText, ListFilter } from 'lucide-react'
import { FormProfileSection } from '@/shared/components/forms'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { Caption } from '@/shared/components/typography'
import { SelectField } from '@/shared/components/forms'
import {
  FORM_FOOTER_CANCEL_CLASS,
  FORM_FOOTER_PRIMARY_CLASS,
} from '@/shared/components/buttons/actionButtonStyles'
import { MODULE_FORM_FOOTER_CLASS } from '@/shared/constants/moduleLayoutStyles'

/** Left/right report shell matching Probity reporting module layout (filter card + results card). */
export default function ReportSplitLayout({ filters, results, filterTitle = 'Filter Criteria', resultsTitle = 'Report Details' }) {
  return (
    <div className="grid w-full min-w-0 items-start gap-4 sm:gap-5 lg:grid-cols-[minmax(16rem,26rem)_minmax(0,1fr)]">
      <FormProfileSection icon={ListFilter} title={filterTitle}>
        <div className="flex flex-col gap-4">{filters}</div>
      </FormProfileSection>
      <FormProfileSection icon={FileText} title={resultsTitle} className="min-h-[28rem]">
        <div className="min-h-[22rem] min-w-0">{results}</div>
      </FormProfileSection>
    </div>
  )
}

export function ReportTypeSelect({ label = 'Report Type', value, onChange, options, required = true }) {
  return (
    <SelectField label={label} required={required} value={value || ''} onChange={(event) => onChange(event.target.value || '')}>
      <option value="">Select report type</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </SelectField>
  )
}

export function ReportFilterFooter({
  onGenerate,
  generateLoading = false,
  generateDisabled = false,
  onPdf,
  onExcel,
  downloadLoading = false,
  generateLabel = 'Generate Report',
  pdfLabel = 'Download PDF',
  excelLabel = 'Download Excel',
}) {
  const hasDownloads = Boolean(onPdf || onExcel)
  return (
    <div className={hasDownloads ? 'flex flex-col gap-4 border-t border-slate-100 pt-4' : MODULE_FORM_FOOTER_CLASS}>
      <div className={hasDownloads ? 'flex flex-wrap justify-end gap-2' : undefined}>
        <GigwButton
          type="button"
          variant="primary"
          className={FORM_FOOTER_PRIMARY_CLASS}
          loading={generateLoading}
          disabled={generateDisabled || generateLoading}
          onClick={onGenerate}
        >
          {generateLabel}
        </GigwButton>
      </div>
      {hasDownloads ? (
        <div className="flex flex-wrap justify-end gap-2">
          {onPdf ? (
            <GigwButton
              type="button"
              variant="outlineDanger"
              className={FORM_FOOTER_CANCEL_CLASS}
              icon={FileText}
              disabled={downloadLoading || generateLoading}
              onClick={onPdf}
            >
              {pdfLabel}
            </GigwButton>
          ) : null}
          {onExcel ? (
            <GigwButton
              type="button"
              variant="outlineSuccess"
              className={FORM_FOOTER_CANCEL_CLASS}
              icon={FileSpreadsheet}
              disabled={downloadLoading || generateLoading}
              onClick={onExcel}
            >
              {excelLabel}
            </GigwButton>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export function ReportEmptyState({ message = 'Select filter criteria and generate the report to view results.' }) {
  return (
    <div className="flex min-h-[22rem] flex-col items-center justify-center px-4 text-center">
      <Caption>{message}</Caption>
    </div>
  )
}
