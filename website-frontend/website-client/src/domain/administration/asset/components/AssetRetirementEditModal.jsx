import { useEffect, useMemo, useState } from 'react'
import { FormModal } from '@/shared/components'
import ProbityDataTable from '@/shared/components/listing/ProbityDataTable'
import { FieldGrid, IndianAmountField, InputField, SelectField } from '@/shared/components/forms'
import { formProfileSectionTitleClass } from '@/shared/components/forms/formProfileSectionStyles'
import {
  RETIREMENT_STATUS_APPROVED,
  RETIREMENT_TYPE_OPTIONS,
  createEmptyRetirementEditForm,
  formatRetirementMoney,
  retirementSalesValueLabel,
} from '../constants/assetRetirement'
import {
  isDisposalFinallyApproved,
  resolveAssetDisposalFormFooterActions,
} from '../utils/assetDisposalFormFooterActions'
import AssetMaintenanceFormFooter from './AssetMaintenanceFormFooter'
import { parseAmount } from '@/shared/utils/probityFormat'
import { validateRetirementEditForm } from '../utils/assetRetirementValidation'
import { buildDisposalJournalPreviewLines } from '../utils/assetRetirementJournalPreview'
import AssetEditFormSkeleton from './AssetModalSkeleton'
import AssetRetirementCustomerSearch from './AssetRetirementCustomerSearch'

function gainOrLossFromBookAndSale(bookValue, saleValue) {
  const book = parseAmount(bookValue)
  const sale = parseAmount(saleValue)
  if (!Number.isFinite(book) || !Number.isFinite(sale)) {
    return null
  }
  return book - sale
}

export default function AssetRetirementEditModal({
  open,
  row,
  customers = [],
  loading = false,
  saving,
  approving,
  verifying = false,
  workflowLoading = false,
  onClose,
  onUpdate,
  onForward,
  onVerify,
  onApprove,
}) {
  const [values, setValues] = useState(createEmptyRetirementEditForm())
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    if (!open) {
      return
    }
    setValues(createEmptyRetirementEditForm(row))
    setFieldErrors({})
  }, [open, row])

  const isFinallyApproved =
    isDisposalFinallyApproved(values) || values.status === RETIREMENT_STATUS_APPROVED
  const footerActions = resolveAssetDisposalFormFooterActions({
    workflowStatus: values.workflowStatus,
    hasId: Boolean(values.idMask),
    canSubmit: values.canSubmit,
    canForward: values.canForward,
    canVerify: values.canVerify,
    canApprove: values.canApprove,
    isFinallyApproved,
  })
  const readOnlyForm = footerActions.readOnlyForm || values.editable === false
  const canEditFields = !readOnlyForm && footerActions.showUpdate

  const displayJournalLines = useMemo(() => {
    if (!values.journalLines?.length) {
      return []
    }
    return buildDisposalJournalPreviewLines({
      assetCost: values.assetCost,
      bookValue: values.bookValue,
      saleValue: values.saleValue,
      retirementType: values.retirementType,
      journalLines: values.journalLines,
    })
  }, [values])

  const handleField =
    (field) =>
    (event) => {
      const nextValue = event?.target?.value ?? event
      setValues((previous) => {
        const next = { ...previous, [field]: nextValue }
        if (field === 'saleValue' || field === 'retirementType') {
          const saleForGain = field === 'saleValue' ? nextValue : next.saleValue
          const recomputed = gainOrLossFromBookAndSale(next.bookValue, saleForGain)
          if (recomputed != null) {
            next.gainOrLoss = recomputed
          }
        }
        return next
      })
      setFieldErrors((previous) => {
        if (!previous[field]) {
          return previous
        }
        const next = { ...previous }
        delete next[field]
        return next
      })
    }

  const submitUpdate = (event) => {
    event.preventDefault()
    const errors = validateRetirementEditForm(values)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    onUpdate?.(values)
  }

  const title = row?.assetId ? `Edit Retirement — ${row.assetId}` : 'Edit Retirement'

  const journalColumns = [
    { header: 'Type', key: 'entryType' },
    { header: 'Head Of Accounts', key: 'hoaName' },
    {
      header: 'Amount',
      key: 'amount',
      align: 'right',
      render: (line) => formatRetirementMoney(line.amount),
    },
  ]

  return (
    <FormModal open={open} onClose={onClose} title={title} size="3xl" showFooter={false}>
      {open && loading && !row ? (
        <AssetEditFormSkeleton
          sections={[{ fields: 9, cols: 3 }]}
          loadingMessage="Loading retirement details…"
        />
      ) : null}
      {open && row ? (
        <form className="flex min-w-0 flex-col gap-4" onSubmit={submitUpdate} noValidate>
          <FieldGrid cols={3}>
            <InputField label="Asset Id" name="assetId" value={values.assetId} readOnly />
            <InputField
              label="Description"
              name="assetDescription"
              value={values.assetDescription}
              readOnly
            />
            <InputField
              label="Book Value"
              name="bookValue"
              value={formatRetirementMoney(values.bookValue)}
              readOnly
            />
            <InputField
              label="Asset Cost"
              name="assetCost"
              value={formatRetirementMoney(values.assetCost)}
              readOnly
            />
            <InputField label="Quantity" name="assetQty" value={values.assetQty ?? '—'} readOnly />
            <InputField
              label="Gain / Loss"
              name="gainOrLoss"
              value={formatRetirementMoney(values.gainOrLoss)}
              readOnly
            />
          </FieldGrid>

          <FieldGrid cols={3}>
            <SelectField
              label="Retirement Type"
              name="retirementType"
              value={values.retirementType}
              onChange={handleField('retirementType')}
              required
              disabled={!canEditFields}
              error={fieldErrors.retirementType}
            >
              {RETIREMENT_TYPE_OPTIONS.filter(
                (opt) => opt.value === 'Sale' || opt.value === 'Scrap',
              ).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </SelectField>
            <IndianAmountField
              label={retirementSalesValueLabel(values.retirementType)}
              name="saleValue"
              value={values.saleValue}
              onChange={handleField('saleValue')}
              readOnly={!canEditFields}
              error={fieldErrors.saleValue}
            />
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-sm font-medium text-slate-700">Customer</span>
              <AssetRetirementCustomerSearch
                value={values.customerId ?? ''}
                customers={customers}
                disabled={!canEditFields}
                onChange={(customerId) => handleField('customerId')(customerId)}
              />
              {fieldErrors.customerId ? (
                <p className="m-0 text-xs text-rose-600">{fieldErrors.customerId}</p>
              ) : null}
            </div>
          </FieldGrid>

          {displayJournalLines.length > 0 ? (
            <div className="flex min-w-0 flex-col gap-2">
              <p className={formProfileSectionTitleClass}>Disposal journal entries</p>
              <ProbityDataTable
                columns={journalColumns}
                data={displayJournalLines}
                keyExtractor={(line, index) => `${line.hoaName}-${index}`}
                emptyMessage="No journal lines"
              />
            </div>
          ) : null}

          <AssetMaintenanceFormFooter
            onCancel={onClose}
            onForward={onForward}
            onVerify={onVerify}
            onApprove={() => onApprove?.(values)}
            showForward={footerActions.showForward}
            showVerify={footerActions.showVerify}
            showApprove={footerActions.showApprove}
            showUpdate={footerActions.showUpdate && values.editable !== false}
            submitLabel="Update"
            submitLoading={saving}
            workflowLoading={workflowLoading || verifying}
            approveLoading={approving}
            footerCentered={false}
          />
        </form>
      ) : null}
    </FormModal>
  )
}
