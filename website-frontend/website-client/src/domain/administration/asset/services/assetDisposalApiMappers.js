import {
  RETIREMENT_CATEGORY_OPTIONS,
  RETIREMENT_STATUS_PENDING,
  createEmptyRetirementEditForm,
} from '../constants/assetRetirement'
import { formatDepreciationNumberFromSetup } from './assetDepreciationApiMappers'
import { parseOptionalDouble, parseOptionalLong, pathId } from './assetApiUtils'
import {
  journalLineDisplayAmount,
  normalizeJournalEntryDisplayType,
} from '../utils/normalizeJournalEntryDisplayType'

const DISPOSAL_VOUCHER_TYPE_CANDIDATES = ['disposal', 'Disposal', 'DISPOSAL']
const COUNT_DISPOSAL_VOUCHER_TYPE_CANDIDATES = ['count_disposal', 'Count_disposal', 'COUNT_DISPOSAL']

const DISPOSAL_SORT_FIELD_MAP = {
  retirementDate: 'disposalDate',
  assetId: 'assetInvoice',
  bookValue: 'bookValue',
  retirementType: 'retirementType',
  saleValue: 'salesValue',
}

export function mapDisposalSortField(sortBy) {
  return DISPOSAL_SORT_FIELD_MAP[sortBy] ?? sortBy ?? 'disposalDate'
}

export function retirementCategoryLabel(code) {
  return RETIREMENT_CATEGORY_OPTIONS.find((opt) => opt.value === code)?.label ?? code
}

export function disposalFormToFilterRequest(formValues) {
  return {
    catgeory: formValues.category ?? 'A',
    catgeoryList: formValues.categoryList ?? '',
    retirementDateStr: formValues.retirementDateStr ?? '',
  }
}

export function disposalFormToProcessRequest(formValues, previewState) {
  const lines = (previewState?.lines ?? [])
    .filter((line) => line.selected)
    .map((line) => {
      const parsed = Number.parseFloat(String(line.saleValue ?? '').trim())
      const salesValue = Number.isFinite(parsed) ? parsed : 0
      return {
        assetInformationIdMask: line.assetInformationIdMask,
        retirementType: uiRetirementTypeToApi(line.retirementType),
        salesValue,
        saleValue: salesValue,
        customerId: line.customerId ? Number(line.customerId) : null,
      }
    })

  return {
    retirementDateStr: formValues.retirementDateStr ?? '',
    retirementNumberingIdMask: formValues.retirementGroupId ?? '',
    salesNumberingIdMask: previewState?.salesNumberingIdMask ?? formValues.salesNumberingIdMask ?? '',
    catgeory: formValues.category ?? 'A',
    catgeoryList: formValues.categoryList ?? '',
    lines,
  }
}

export function uiRetirementTypeToApi(type) {
  if (type === 'Sale' || type === 'S') {
    return 'S'
  }
  if (type === 'Scrap' || type === 'D') {
    return 'D'
  }
  return type ?? 'S'
}

export function apiRetirementTypeToUi(type) {
  if (type === 'S') {
    return 'Sale'
  }
  if (type === 'D') {
    return 'Scrap'
  }
  return type ?? 'Sale'
}

function numberingGroupToOption(group) {
  if (!group) {
    return null
  }
  const value = group.idMask ?? (group.id != null ? String(group.id) : '')
  if (!value) {
    return null
  }
  return {
    value,
    label: group.setupName ?? value,
    previewNextNumber: group.previewNextNumber ?? '',
  }
}

export function buildDisposalProcessDefaults() {
  return {
    retirementDateStr: new Date().toISOString().slice(0, 10),
    previewCountDisposalNumber: '',
    retirementNumberingGroups: [],
  }
}

async function fetchNumberingGroupsFromAssetService(requestJson, voucherTypeCandidates) {
  for (const voucherType of voucherTypeCandidates) {
    const result = await requestJson(
      `/api/v1/fixed-asset-group/getNumberingSetupListByVoucherType/${encodeURIComponent(voucherType)}`,
    )
    if (result.error || !Array.isArray(result.data) || result.data.length === 0) {
      continue
    }
    const options = result.data.map(numberingGroupToOption).filter(Boolean)
    if (options.length > 0) {
      return options
    }
  }
  return []
}

async function fetchCountPreviewFromMaster(requestJson) {
  for (const voucherType of COUNT_DISPOSAL_VOUCHER_TYPE_CANDIDATES) {
    const result = await requestJson(
      `/api/v1/numbering-setup/getNumberingSetupListByVoucherType/${encodeURIComponent(voucherType)}`,
    )
    if (result.error || !Array.isArray(result.data) || result.data.length === 0) {
      continue
    }
    const preview = formatDepreciationNumberFromSetup(result.data[0])
    if (preview) {
      return preview
    }
  }
  return ''
}

/** When asset-disposal defaults endpoint fails (503/404), load groups via fixed-asset-group + master count preview. */
export async function fetchDisposalProcessDefaultsFallback(requestJson) {
  const retirementNumberingGroups = await fetchNumberingGroupsFromAssetService(
    requestJson,
    DISPOSAL_VOUCHER_TYPE_CANDIDATES,
  )
  const previewCountDisposalNumber = await fetchCountPreviewFromMaster(requestJson)
  if (retirementNumberingGroups.length === 0 && !previewCountDisposalNumber) {
    return null
  }
  return {
    ...buildDisposalProcessDefaults(),
    previewCountDisposalNumber,
    retirementNumberingGroups,
    source: 'fallback',
  }
}

export function mapDisposalDefaultsResponse(response) {
  const groups = (response?.retirementNumberingGroups ?? [])
    .map(numberingGroupToOption)
    .filter(Boolean)
  return {
    retirementDateStr: response?.retirementDateStr ?? new Date().toISOString().slice(0, 10),
    previewCountDisposalNumber: response?.previewCountDisposalNumber ?? '',
    retirementNumberingGroups: groups,
  }
}

export function mapDisposalPreviewResponse(response) {
  const salesNumberingGroups = (response?.salesNumberingGroups ?? []).map((group) => ({
    value: group.idMask,
    label: group.setupName ?? group.idMask,
  }))
  const lines = (response?.lines ?? []).map((line) => ({
    assetInformationIdMask: line.assetInformationIdMask,
    assetId: line.assetId ?? '',
    assetDescription: line.assetDescription ?? '',
    bookValue: line.bookValue,
    assetCost: line.assetCost,
    assetQty: line.assetQty,
    accountsConfigured: line.accountsConfigured !== false,
    retirementType: 'Sale',
    saleValue: '',
    customerId: '',
    selected: false,
  }))
  return {
    lines,
    assetCount: response?.assetCount ?? lines.length,
    salesNumberingGroups,
    salesNumberingIdMask: salesNumberingGroups[0]?.value ?? '',
  }
}

export function mapDisposalListItem(dto) {
  if (!dto) {
    return null
  }
  return {
    idMask: dto.idMask,
    retirementDate: dto.retirementDate,
    assetId: dto.assetId,
    assetDescription: dto.assetDescription,
    bookValue: dto.bookValue,
    retirementType: apiRetirementTypeToUi(dto.retirementType),
    saleValue: dto.saleValue ?? dto.salesValue,
    customerName: dto.customerName?.trim() || '—',
    retirementInvoice: dto.retirementInvoice,
    salesInvoice: dto.salesInvoice,
    status: dto.status ?? RETIREMENT_STATUS_PENDING,
    workflowStatus: dto.workflowStatus ?? 'I',
    canSubmit: dto.canSubmit,
    canForward: dto.canForward,
    canVerify: dto.canVerify,
    canApprove: dto.canApprove,
  }
}

export function mapDisposalWorkflowRow(dto) {
  if (!dto) {
    return null
  }
  return {
    idMask: dto.idMask ?? '',
    workflowStatus: dto.workflowStatus ?? '',
    assetId: dto.assetId ?? '',
    assetDescription: dto.assetDescription ?? '',
    disposalDate: dto.disposalDate ?? dto.retirementDate ?? '',
    retirementDate: dto.disposalDate ?? dto.retirementDate ?? '',
    retirementType: apiRetirementTypeToUi(dto.retirementType),
    receivedFrom: dto.receivedFrom ?? '',
    receivedOn: dto.receivedOn,
    forwardedTo: dto.forwardedTo ?? '',
    forwardedOn: dto.forwardedOn,
    approvedBy: dto.approvedBy ?? '',
    approvedOn: dto.approvedOn,
    isRead: dto.isRead,
    canForward: dto.canForward,
    canVerify: dto.canVerify,
    canApprove: dto.canApprove,
  }
}

export function mapDisposalEditResponse(response) {
  if (!response) {
    return null
  }
  return createEmptyRetirementEditForm(mapDisposalViewToRow(response))
}

export function retirementEditFormToUpdateRequest(values) {
  const salesValue = parseOptionalDouble(values.saleValue) ?? 0
  const customerId = parseOptionalLong(values.customerId)
  return {
    idMask: values.idMask,
    retirementType: uiRetirementTypeToApi(values.retirementType),
    salesValue,
    saleValue: salesValue,
    customerId,
  }
}

export function mapDisposalViewToRow(view) {
  if (!view) {
    return null
  }
  return {
    idMask: view.idMask,
    retirementDate: view.retirementDate,
    assetId: view.assetId,
    assetDescription: view.assetDescription,
    bookValue: view.bookValue,
    assetCost: view.assetCost,
    assetQty: view.assetQty,
    retirementType: apiRetirementTypeToUi(view.retirementType),
    saleValue: view.saleValue ?? view.salesValue,
    customerName: view.customerName?.trim() || '—',
    customerId: view.customerId != null ? String(view.customerId) : '',
    retirementInvoice: view.retirementInvoice,
    salesInvoice: view.salesInvoice,
    gainOrLoss: view.gainOrLoss,
    countDisposalNumber: view.countDisposalNumber,
    status: view.status,
    workflowStatus: view.workflowStatus ?? 'I',
    canSubmit: view.canSubmit,
    canForward: view.canForward,
    canVerify: view.canVerify,
    canApprove: view.canApprove,
    editable: view.editable,
    approvable: view.approvable,
    journalLines: (view.journalLines ?? []).map((line) => ({
      entryType: normalizeJournalEntryDisplayType(
        line.entryType,
        line.debitAmount,
        line.creditAmount,
      ),
      hoaName: line.hoaName ?? '—',
      amount: journalLineDisplayAmount(line.entryType, line.debitAmount, line.creditAmount),
    })),
  }
}

export function disposalViewPath(idMask) {
  return `/api/v1/asset-disposal/getAssetDisposalView/${pathId(idMask)}`
}

export function disposalEditPath(idMask) {
  return `/api/v1/asset-disposal/getAssetDisposalForEdit/${pathId(idMask)}`
}
