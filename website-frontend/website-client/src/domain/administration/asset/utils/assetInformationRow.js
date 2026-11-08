import { formatIndianAmountForInput } from '@/shared/utils/probityFormat'
import { createEmptyDocumentLine } from '../constants/assetInformation'

function formatMoneyField(value) {
  return formatIndianAmountForInput(value)
}

function mapDocuments(documents = []) {
  if (!documents?.length) {
    return [createEmptyDocumentLine()]
  }
  return documents.map((doc, index) => ({
    localKey: doc.localKey ?? doc.id ?? `doc-${index}`,
    id: doc.id ?? '',
    documentType: doc.documentType ?? 'I',
    documentNumber: doc.documentNumber ?? '',
    documentAmount: formatMoneyField(doc.documentAmount),
    openAmount: formatMoneyField(doc.openAmount),
    capitalizationAmount: formatMoneyField(doc.capitalizationAmount),
  }))
}

export function assetInformationRowToForm(row) {
  if (!row?.idMask) {
    return null
  }
  return {
    idMask: row.idMask,
    assetId: row.assetId ?? '',
    assetDescription: row.assetDescription ?? '',
    faGroupIdMask: row.faGroupIdMask ?? row.fixedAssetGroupIdMask ?? '',
    assetTypeLabel: row.assetTypeLabel ?? '',
    faGroupSnapshot: row.faGroupSnapshot ?? null,
    capitalisationDate: row.capitalisationDate ?? '',
    putToUseDate: row.putToUseDate ?? '',
    hsnCodeId: row.hsnCodeId ?? '',
    costCenterId: row.costCenterId ?? '',
    assetQty: row.assetQty ?? '1',
    assetCost: formatMoneyField(row.assetCost),
    serialNumber: row.serialNumber ?? '',
    custodianId: row.custodianId ?? '',
    barcode: row.barcode ?? '',
    location: row.location ?? '',
    attachmentFileName: row.attachmentFileName ?? '',
    status: row.status ?? '',
    active: row.active ?? 'Y',
    documents: mapDocuments(row.documents),
    canSubmit: row.canSubmit,
    canForward: row.canForward,
    canVerify: row.canVerify,
    canApprove: row.canApprove,
    workflowRecipientName: row.workflowRecipientName ?? '',
  }
}

export function assetInformationFormToRow(formValues) {
  const documents = (formValues.documents ?? [])
    .filter(
      (line) =>
        line.documentNumber
        || line.documentAmount
        || line.openAmount
        || line.capitalizationAmount,
    )
    .map((line, index) => ({
      id: line.id || `doc-${index + 1}`,
      documentType: line.documentType,
      documentNumber: line.documentNumber,
      documentAmount: line.documentAmount,
      openAmount: line.openAmount,
      capitalizationAmount: line.capitalizationAmount,
    }))

  return {
    idMask: formValues.idMask || '',
    assetId: formValues.assetId || '',
    assetDescription: formValues.assetDescription?.trim() ?? '',
    faGroupIdMask: formValues.faGroupIdMask,
    assetTypeLabel: formValues.assetTypeLabel ?? '—',
    capitalisationDate: formValues.capitalisationDate,
    putToUseDate: formValues.putToUseDate,
    costCenterId: formValues.costCenterId,
    assetQty: formValues.assetQty,
    assetCost: formValues.assetCost,
    serialNumber: formValues.serialNumber?.trim() ?? '',
    custodianId: formValues.custodianId,
    barcode: formValues.barcode?.trim() ?? '',
    location: formValues.location?.trim() ?? '',
    attachmentFileName: formValues.attachmentFileName ?? '',
    active: formValues.active ?? 'Y',
    isActive: (formValues.active ?? 'Y') === 'Y',
    documents,
    faGroupSnapshot: formValues.faGroupSnapshot ?? null,
  }
}
