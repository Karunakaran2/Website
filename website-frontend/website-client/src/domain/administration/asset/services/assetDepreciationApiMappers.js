import { DEPRECIATION_CATEGORY_OPTIONS } from '../constants/assetDepreciation'
import { depreciationMethodLabel } from '../constants/faGroup'
import { pathId } from './assetApiUtils'

const DEPRECIATION_SORT_FIELD_MAP = {
  depreciationAmount: 'depreciationAmount',
  depreciationNumber: 'depreciationNumber',
  depreciationDate: 'processDate',
  processUpTo: 'processUpto',
}

export function mapDepreciationSortField(sortBy) {
  return DEPRECIATION_SORT_FIELD_MAP[sortBy] ?? sortBy ?? 'processDate'
}

export function depreciationCategoryLabel(code) {
  return DEPRECIATION_CATEGORY_OPTIONS.find((opt) => opt.value === code)?.label ?? code
}

/** Client-side defaults (legacy page sets process upto to FY end on load). */
export function buildDepreciationProcessDefaults() {
  const processUpToStr = endOfFinancialYearIso()
  const year = new Date().getFullYear()
  return {
    depreciationNo: `DEP-${year}`,
    processUpToStr,
  }
}

function parseLastGeneratedNumber(value) {
  const parsed = Number.parseInt(String(value ?? '0'), 10)
  return Number.isFinite(parsed) ? parsed : 0
}

export function formatDepreciationNumberFromSetup(setup) {
  if (!setup) {
    return ''
  }
  const next = parseLastGeneratedNumber(setup.lastGeneratedNumber) + 1
  const prefix = setup.prefix ?? ''
  const suffix = setup.suffix ?? setup.sufix ?? ''
  return `${prefix}/${next}/${suffix}`
}

export function pickDepreciationNumberingSetup(setups) {
  if (!Array.isArray(setups) || setups.length === 0) {
    return null
  }
  const byName = setups.find(
    (row) => String(row.setupName ?? '').trim().toUpperCase() === 'DEPRECIATION',
  )
  if (byName) {
    return byName
  }
  const byDefault = setups.find((row) => row.isDefault === true || row.default === true)
  return byDefault ?? setups[0]
}

/** Master-setup fallback when asset-service defaults endpoint is unavailable. */
export async function fetchDepreciationProcessDefaultsFromMaster(requestJson) {
  const voucherTypes = ['Depreciation', 'DEPRECIATION', 'depreciation']
  for (const voucherType of voucherTypes) {
    const result = await requestJson(
      `/api/v1/numbering-setup/getNumberingSetupListByVoucherType/${encodeURIComponent(voucherType)}`,
    )
    if (result.error || !Array.isArray(result.data) || result.data.length === 0) {
      continue
    }
    const setup = pickDepreciationNumberingSetup(result.data)
    return {
      depreciationNo: formatDepreciationNumberFromSetup(setup),
      processUpToStr: endOfFinancialYearIso(),
      source: 'master-setup',
      voucherType,
    }
  }
  return null
}

function endOfFinancialYearIso() {
  const today = new Date()
  const month = today.getMonth() + 1
  const year = today.getFullYear()
  const fyEndYear = month >= 4 ? year + 1 : year
  return `${fyEndYear}-03-31`
}

export function depreciationFormToFilterRequest(formValues) {
  return {
    catgeory: formValues.category ?? 'A',
    catgeoryList: formValues.categoryList ?? '',
    depreciationDateStr: formValues.depreciationDateStr ?? '',
    processUpToStr: formValues.processUpToStr ?? '',
  }
}

export function depreciationFormToProcessRequest(formValues, preview) {
  return {
    ...depreciationFormToFilterRequest(formValues),
    depreciationNo: formValues.depreciationNo ?? '',
    totalDepreciation: preview?.totalDepreciation ?? 0,
    assetCount: preview?.assetCount ?? 0,
  }
}

export function mapDepreciationPreviewResponse(response) {
  const lines = (response?.lines ?? []).map((line) => ({
    idMask: line.idMask,
    assetId: line.assetId ?? '',
    description: line.assetDescription ?? '',
    assetType: line.assetType ?? '',
    assetClass: line.assetClassDescription ?? '',
    assetCost: line.assetCost,
    bookValueIt: line.bookValueIt,
    depreciationMethod: line.depreciationMethod ?? '',
    depreciationMethodLabel: depreciationMethodLabel(line.depreciationMethod),
    amount: line.depreciationAmount,
    depreciationAmount: line.depreciationAmount,
    putToUseDate: line.putToUseDate ?? '',
    assetAge: line.assetAge ?? '',
  }))
  return {
    lines,
    totalDepreciation: response?.totalDepreciation ?? 0,
    assetCount: response?.assetCount ?? lines.length,
  }
}

export function mapDepreciationBaseListItem(dto) {
  if (!dto) {
    return null
  }
  return {
    idMask: dto.idMask,
    depreciationAmount: dto.depreciationAmount,
    depreciationNumber: dto.depreciationNumber,
    depreciationDate: dto.processDate ?? dto.depreciationDate,
    processUpTo: dto.processUpto ?? dto.processUpTo,
  }
}

export function mapDepreciationBaseViewToHistory(view) {
  if (!view) {
    return []
  }
  return (view.lines ?? []).map((line) => ({
    idMask: line.idMask ?? '',
    assetId: line.assetId ?? '',
    description: line.description ?? '',
    depreciationNumber: line.depreciationNumber ?? '',
    amount: line.amount,
    assetCost: line.assetCost,
    bookValueIt: line.bookValueIt,
    accmDepreciationIt: line.accmDepreciationIt,
    financialYear: line.financialYear ?? '',
    depreciationMethod: line.depreciationMethod ?? '',
    depreciationMethodLabel: line.depreciationMethodLabel ?? '',
    depreciationRateIt: line.depreciationRateIt,
    depreciationStartDate: line.depreciationStartDate ?? '',
    depreciationDate: line.depreciationDate ?? '',
    processUpto: line.processUpto ?? '',
    approvedOn: line.approvedOn ?? '',
    approvedByName: line.approvedByName ?? '',
    putToUseDate: line.putToUseDate ?? '',
    assetAge: line.assetAge ?? '',
  }))
}

export function mapDepreciationLineDetail(dto) {
  if (!dto) {
    return null
  }
  return {
    idMask: dto.idMask ?? '',
    depreciationNumber: dto.depreciationNumber ?? '',
    assetId: dto.assetId ?? '',
    description: dto.description ?? '',
    assetCost: dto.assetCost,
    bookValueIt: dto.bookValueIt,
    accmDepreciationIt: dto.accmDepreciationIt,
    depreciatedValue: dto.depreciatedValue,
    financialYear: dto.financialYear ?? '',
    depreciationMethod: dto.depreciationMethod ?? '',
    depreciationMethodLabel: dto.depreciationMethodLabel ?? '',
    depreciationRateIt: dto.depreciationRateIt,
    depreciationStartDate: dto.depreciationStartDate ?? '',
    depreciationDate: dto.depreciationDate ?? '',
    processUpto: dto.processUpto ?? '',
    processedByName: dto.processedByName ?? '',
    processedOn: dto.processedOn ?? '',
    approvedByName: dto.approvedByName ?? '',
    approvedOn: dto.approvedOn ?? '',
    putToUseDate: dto.putToUseDate ?? '',
    assetAge: dto.assetAge ?? '',
    journalLines: dto.journalLines ?? [],
  }
}

export function depreciationLineDetailPath(lineIdMask) {
  return `/api/v1/asset-depreciation/getAssetDepreciationLineDetail/${pathId(lineIdMask)}`
}

export function approvedDepreciationLinesByAssetPath(assetInformationIdMask) {
  return `/api/v1/asset-depreciation/getApprovedDepreciationLinesByAssetInformation/${pathId(assetInformationIdMask)}`
}

export function mapApprovedDepreciationLinesByAsset(lines) {
  if (!Array.isArray(lines)) {
    return []
  }
  return mapDepreciationBaseViewToHistory({ lines })
}

export function mapDepreciationBaseViewPayload(view) {
  if (!view) {
    return { lines: [], summary: null }
  }
  return {
    lines: mapDepreciationBaseViewToHistory(view),
    summary: {
      depreciationNumber: view.depreciationNumber ?? '',
      depreciationDate: view.processDate ?? '',
      processUpTo: view.processUpto ?? view.processUpTo ?? '',
      depreciationAmount: view.depreciationAmount,
    },
  }
}

export function mapDepreciationBaseViewSummary(view, listRow) {
  if (!view) {
    return listRow
  }
  return {
    ...listRow,
    depreciationNumber: view.depreciationNumber ?? listRow?.depreciationNumber,
    depreciationDate: view.processDate ?? listRow?.depreciationDate,
    processUpTo: view.processUpto ?? listRow?.processUpTo,
    depreciationAmount: view.depreciationAmount ?? listRow?.depreciationAmount,
  }
}

export function depreciationBaseViewPath(idMask) {
  return `/api/v1/asset-depreciation/getAssetDepreciationBaseView/${pathId(idMask)}`
}

export function filterCategorySuggestions(items, query) {
  const q = (query || '').trim().toLowerCase()
  if (!q) {
    return items.slice(0, 20)
  }
  return items.filter((item) => String(item).toLowerCase().includes(q)).slice(0, 20)
}
