import {
  assetClassItLabel,
  depreciationMethodLabel,
} from '../constants/faGroup'
import {
  formatOpeningFixedAssetAmount,
  formatOpeningFixedAssetDate,
  openingFixedAssetImportStatusLabel,
} from '../utils/openingFixedAssetFormat'
import {
  parseOptionalDouble,
  parseOptionalLong,
  toIsoDate,
} from './assetApiUtils'

const FA_GROUP_SORT_FIELD_MAP = {
  assetType: 'assetType',
  assetClassLabel: 'assetClassSetupIt.description',
  depreciationRateIt: 'depreciationRateIt',
  depreciationMethodLabel: 'depreciationMethod',
}

const ASSET_INFO_SORT_FIELD_MAP = {
  assetId: 'assetId',
  assetDescription: 'assetDescription',
  status: 'status',
}

const OPENING_IMPORT_SORT_FIELD_MAP = {
  fileName: 'fileName',
  totalAsset: 'totalAsset',
  pushedOn: 'pushedOn',
}

export function mapFaGroupSortField(sortBy) {
  return FA_GROUP_SORT_FIELD_MAP[sortBy] ?? sortBy ?? 'assetType'
}

export function mapAssetInformationSortField(sortBy) {
  return ASSET_INFO_SORT_FIELD_MAP[sortBy] ?? sortBy ?? 'assetId'
}

export function mapOpeningImportSortField(sortBy) {
  return OPENING_IMPORT_SORT_FIELD_MAP[sortBy] ?? sortBy ?? 'fileName'
}

export function fixedAssetGroupDtoToRow(dto) {
  if (!dto) {
    return null
  }
  const active = dto.status !== 'D'
  return {
    idMask: dto.idMask ?? '',
    assetType: dto.assetType ?? '',
    assetClassItId: dto.assetClassItId != null ? String(dto.assetClassItId) : '',
    assetClassLabel: dto.assetClassDescription ?? assetClassItLabel(dto.assetClassItId),
    assetNumber: dto.numberingGroupId != null ? String(dto.numberingGroupId) : '',
    numberingGroupId: dto.numberingGroupId,
    numberingGroupName: dto.numberingGroupName ?? '',
    depreciable: dto.depreciable ?? 'Y',
    depreciationRateIt: dto.depreciationRateIt ?? '',
    depreciationMethod: dto.depreciationMethod ?? '',
    depreciationMethodLabel:
      dto.depreciationMethodLabel ?? depreciationMethodLabel(dto.depreciationMethod),
    residualValue: '',
    depreciationBasis: '',
    depreciationBasisLabel: '—',
    usefulLife: '',
    assetAccount: dto.assetAccountName ?? '—',
    depreciationAccount: dto.depreciationAccountName ?? '—',
    cumDepreciationAccount: dto.accumDepreciationAccountName ?? '—',
    cwipAccount: dto.cwipAccountName ?? '—',
    active: active ? 'Y' : 'N',
    isActive: active,
    status: dto.status,
  }
}

export function fixedAssetGroupFormToRequest(formValues) {
  return {
    assetType: String(formValues.assetType ?? '').trim(),
    assetClassItId: parseOptionalLong(formValues.assetClassItId),
    numberingGroupId:
      parseOptionalLong(formValues.numberingGroupId)
      ?? parseOptionalLong(formValues.assetNumber),
    depreciable: formValues.depreciable ?? 'Y',
    depreciationRateIt: parseOptionalDouble(formValues.depreciationRateIt),
    depreciationMethod: formValues.depreciationMethod ?? 'W',
  }
}

export function mapDocumentInfoListToFormLines(documentInfoList) {
  return (documentInfoList ?? []).map((doc, index) => ({
    id: doc.id != null ? String(doc.id) : `doc-${index}`,
    documentType: doc.documentType ?? 'I',
    documentNumber: doc.documentNumber ?? '',
    documentAmount: doc.documentAmount != null ? String(doc.documentAmount) : '',
    openAmount: doc.openAmount != null ? String(doc.openAmount) : '',
    capitalizationAmount:
      doc.capitalizationAmount != null ? String(doc.capitalizationAmount) : '',
  }))
}

function documentLineHasContent(doc) {
  if (!doc) {
    return false
  }
  return Boolean(
    String(doc.documentNumber ?? '').trim()
      || String(doc.documentAmount ?? '').trim()
      || String(doc.openAmount ?? '').trim()
      || String(doc.capitalizationAmount ?? '').trim(),
  )
}

/** Document lines for view/edit from API row or list row. */
export function assetInformationDocumentsFromRow(row) {
  if (!row) {
    return []
  }
  const fromDocuments = (row.documents ?? []).filter(documentLineHasContent)
  if (fromDocuments.length > 0) {
    return fromDocuments
  }
  return mapDocumentInfoListToFormLines(row.documentInfoList).filter(documentLineHasContent)
}

/** `search-approved` — JSON item (preferred) or legacy string[] row. */
export function approvedAssetSearchRowToTableRow(row) {
  if (row && typeof row === 'object' && !Array.isArray(row)) {
    return {
      idMask: row.idMask ?? '',
      assetId: row.assetId ?? '',
      assetDescription: row.assetDescription ?? '',
      assetTypeLabel: row.assetTypeLabel ?? '',
      capitalisationDate: row.capitalisationDate ?? '',
      putToUseDate: row.putToUseDate ?? '',
      assetQty: row.assetQty != null ? String(row.assetQty) : '',
      custodianId: row.custodianId != null ? String(row.custodianId) : '',
      status: 'A',
      active: 'Y',
      isActive: true,
    }
  }
  return approvedAssetListArrayToRow(row)
}

/** Legacy probity `search-approved` string[] rows. */
export function approvedAssetListArrayToRow(cells) {
  if (!Array.isArray(cells) || cells.length < 8) {
    return null
  }
  return {
    idMask: cells[7] ?? '',
    assetId: cells[0] ?? '',
    assetDescription: cells[1] ?? '',
    assetTypeLabel: cells[2] ?? '',
    capitalisationDate: cells[3] ?? '',
    putToUseDate: cells[4] ?? '',
    assetQty: cells[5] ?? '',
    custodianId: cells[8] != null && cells[8] !== '' ? String(cells[8]) : '',
    status: 'A',
    active: 'Y',
    isActive: true,
  }
}

export function assetInformationDtoToRow(dto) {
  if (!dto) {
    return null
  }
  const approved = dto.status === 'A' || dto.status === 'B'
  return {
    idMask: dto.idMask ?? '',
    assetId: dto.assetId ?? '',
    assetDescription: dto.assetDescription ?? '',
    faGroupIdMask: dto.fixedAssetGroupIdMask ?? '',
    fixedAssetGroupIdMask: dto.fixedAssetGroupIdMask ?? '',
    assetTypeLabel: dto.assetType ?? dto.assetTypeLabel ?? '',
    capitalisationDate: toIsoDate(dto.capitalisationDate) ?? '',
    putToUseDate: toIsoDate(dto.putToUseDate) ?? '',
    costCenterId: dto.costCenterId != null ? String(dto.costCenterId) : '',
    costCentreName: dto.costCentreName ?? '',
    assetQty: dto.assetQty != null ? String(dto.assetQty) : '',
    assetCost: dto.assetCost != null ? String(dto.assetCost) : '',
    bookValueIt: dto.bookValueIt,
    accmDepreciationIt: dto.accmDepreciationIt,
    serialNumber: dto.serialNumber ?? '',
    custodianId: dto.custodianId != null ? String(dto.custodianId) : '',
    custodianName: dto.custodianName ?? '',
    barcode: dto.barcode ?? '',
    location: dto.location ?? '',
    attachmentFileName: dto.assetImage ?? '',
    hsnCodeId: dto.hsnCodeId != null ? String(dto.hsnCodeId) : '',
    hsnCodeLabel:
      dto.hsnCode && dto.hsnDescription
        ? `${dto.hsnCode} (${dto.hsnDescription})`
        : dto.hsnCode ?? '',
    status: dto.status ?? '',
    active: approved ? 'Y' : 'N',
    isActive: approved,
    documents: mapDocumentInfoListToFormLines(dto.documentInfoList),
    documentInfoList: dto.documentInfoList ?? [],
    faGroupSnapshot:
      dto.assetClassDescription || dto.depreciationMethodLabel
        ? {
            assetClassLabel: dto.assetClassDescription ?? '',
            depreciationRateIt: '',
            depreciationMethodLabel: dto.depreciationMethodLabel ?? '',
            usefulLife: '',
          }
        : null,
    canSubmit: dto.canSubmit,
    canForward: dto.canForward,
    canVerify: dto.canVerify,
    canApprove: dto.canApprove,
    workflowRecipientName: dto.workflowRecipientName ?? '',
  }
}

export function assetInformationFormToRequest(formValues) {
  const documents = (formValues.documents ?? [])
    .filter(
      (line) =>
        line.documentNumber
        || line.documentAmount
        || line.openAmount
        || line.capitalizationAmount,
    )
    .map((line) => ({
      documentType: line.documentType ?? 'I',
      documentNumber: line.documentNumber ?? '',
      documentAmount: parseOptionalDouble(line.documentAmount),
      openAmount: parseOptionalDouble(line.openAmount),
      capitalizationAmount: parseOptionalDouble(line.capitalizationAmount),
    }))

  return {
    assetDescription: String(formValues.assetDescription ?? '').trim(),
    fixedAssetGroupIdMask: formValues.faGroupIdMask || null,
    hsnCodeId: parseOptionalLong(formValues.hsnCodeId),
    capitalisationDate: toIsoDate(formValues.capitalisationDate),
    putToUseDate: toIsoDate(formValues.putToUseDate),
    costCenterId: parseOptionalLong(formValues.costCenterId),
    assetQty: parseOptionalLong(formValues.assetQty),
    assetCost: parseOptionalDouble(formValues.assetCost),
    serialNumber: formValues.serialNumber?.trim() ?? '',
    custodianId: (() => {
      const parsed = parseOptionalLong(formValues.custodianId)
      return parsed != null && parsed > 0 ? parsed : null
    })(),
    barcode: formValues.barcode?.trim() ?? '',
    location: formValues.location?.trim() ?? '',
    assetImage: formValues.attachmentFileName ?? '',
    documentInfoList: documents,
  }
}

export function openingAssetBaseDtoToImportRow(dto) {
  if (!dto) {
    return null
  }
  const status = dto.status ?? ''
  return {
    idMask: dto.idMask ?? '',
    fileName: dto.fileName ?? '',
    totalAsset: dto.totalAsset ?? 0,
    pushedOn: formatOpeningFixedAssetDate(dto.pushedOn),
    pushedOnRaw: toIsoDate(dto.pushedOn) ?? '',
    savedOn: toIsoDate(dto.savedOn) ?? '',
    status,
    statusLabel: openingFixedAssetImportStatusLabel(status),
  }
}

export function openingAssetDetailDtoToTableRow(dto) {
  if (!dto) {
    return null
  }
  return {
    idMask: dto.idMask ?? '',
    assetId: dto.assetId ?? '—',
    legacyAssetId: dto.legacyAssetId ?? '—',
    assetDescription: dto.assetDescription ?? '—',
    assetType: dto.assetType ?? '—',
    assetClassDescription: dto.assetClassDescription ?? '—',
    assetCost: formatOpeningFixedAssetAmount(dto.assetCost),
    accmDepreciationIt: formatOpeningFixedAssetAmount(dto.accmDepreciationIt),
    bookValueIt: formatOpeningFixedAssetAmount(dto.bookValueIt),
    capitalisationDate: formatOpeningFixedAssetDate(dto.capitalisationDate),
    putToUseDate: formatOpeningFixedAssetDate(dto.putToUseDate),
    location: dto.location ?? '—',
    costCentreName: dto.costCentreName ?? '—',
    serialNumber: dto.serialNumber ?? '—',
    custodianDisplay: dto.custodianDisplay ?? '—',
    hsnCode: dto.hsnCode ?? '—',
    comments: dto.comments ?? '—',
  }
}

export function allocatableAssetToOption(dto) {
  const assetId = dto.assetId ?? ''
  return {
    idMask: dto.idMask,
    assetId,
    label: assetId || dto.idMask,
  }
}

export function allocationContextToDetail(dto) {
  if (!dto) {
    return null
  }
  return {
    idMask: dto.assetInformationIdMask ?? dto.idMask ?? '',
    assetId: dto.assetId ?? '',
    assetDescription: dto.assetDescription ?? '',
    assetTypeLabel: dto.assetType ?? dto.assetTypeLabel ?? '',
    location: dto.location ?? '',
    custodianId: dto.custodianIdMask ?? (dto.custodianId != null ? String(dto.custodianId) : ''),
    custodianName: dto.custodianName ?? '',
    costCenterId: dto.costCenterId != null ? String(dto.costCenterId) : '',
    serialNumber: dto.serialNumber ?? '',
    assetCost: dto.assetCost != null ? String(dto.assetCost) : '',
  }
}

/**
 * Asset allocation custodian dropdown (probity 2.0: seat user id / idEnc as value).
 * Master-setup often returns numeric {@code id} only; asset-service accepts that as idMask.
 */
export function seatUserToCustodianOption(dto) {
  if (!dto) {
    return null
  }
  const seatUserAllotedId = dto.id ?? dto.seatUserAllotedId
  const idMask =
    dto.idMask
    ?? dto.userIdMask
    ?? dto.seatUserAllotedIdMask
    ?? (seatUserAllotedId != null ? String(seatUserAllotedId) : '')
  if (!String(idMask).trim()) {
    return null
  }
  let label =
    dto.userName
    ?? dto.displayName
    ?? [dto.firstName, dto.lastName].filter(Boolean).join(' ')
  if (label && dto.hierarchyName?.trim()) {
    label = `${label} (${dto.hierarchyName.trim()})`
  } else if (!label && dto.seatName?.trim()) {
    label = dto.seatName.trim()
  }
  if (!label) {
    label = String(idMask)
  }
  return { idMask: String(idMask), label: String(label) }
}

/** Custodian dropdown for asset information save (backend expects numeric custodianId). */
export function assetInformationCustodianToOption(dto) {
  if (!dto || dto.id == null) {
    return null
  }
  let label =
    dto.userName
    ?? dto.seatName
    ?? [dto.firstName, dto.lastName].filter(Boolean).join(' ')
  if (label && dto.hierarchyName?.trim()) {
    label = `${label} (${dto.hierarchyName.trim()})`
  }
  if (!label) {
    label = String(dto.id)
  }
  return {
    value: String(dto.id),
    label: String(label),
    idMask: dto.idMask ?? '',
  }
}

export function costCentreToOption(dto) {
  const costId = dto?.costId ?? dto?.id
  if (costId == null) {
    return null
  }
  return {
    value: String(costId),
    label: dto.costCentreName ?? String(costId),
  }
}

export function hsnCodeToOption(dto) {
  if (!dto || dto.id == null) {
    return null
  }
  const code = String(dto.hsnCode ?? '').trim()
  const description = String(dto.hsnDescription ?? '').trim()
  const label =
    code && description ? `${code} - ${description}` : code || description || String(dto.id)
  return {
    value: String(dto.id),
    label,
  }
}

export function allocationFormToRequest(formValues) {
  return {
    assetInformationIdMask: formValues.assetInformationIdMask,
    newLocation: formValues.newLocation ?? '',
    custodianIdMask: formValues.custodianIdMask,
    allocationDate: toIsoDate(formValues.allocationDateStr),
    comments: formValues.comments ?? '',
  }
}

export function returnToStoreFormToRequest(formValues) {
  return {
    assetInformationIdMask: formValues.assetInformationIdMask,
    allocationDate: toIsoDate(formValues.allocationDateStr),
    comments: formValues.comments ?? '',
  }
}
