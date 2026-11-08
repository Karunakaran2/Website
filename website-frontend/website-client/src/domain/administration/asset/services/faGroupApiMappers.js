/** Maps FA Group UI state ↔ asset-service fixed-asset-group API. */

const FA_GROUP_SORT_FIELD_MAP = {
  assetType: 'assetType',
  assetClassLabel: 'assetClassSetupIt.description',
  depreciationRateIt: 'depreciationRateIt',
  depreciationMethodLabel: 'depreciationMethod',
  depreciationMethod: 'depreciationMethod',
}

export function pathId(value) {
  if (value == null || value === '') {
    return ''
  }
  return encodeURIComponent(String(value))
}

export function toFaGroupPagingRequest({ search, page, pageSize, sortBy, sortDir }) {
  const safePage = Math.max(1, page ?? 1)
  const length = Math.max(1, pageSize ?? 10)
  const start = (safePage - 1) * length
  const sortField = FA_GROUP_SORT_FIELD_MAP[sortBy] || FA_GROUP_SORT_FIELD_MAP.assetType

  return {
    draw: safePage,
    start,
    length,
    search: {
      value: search || '',
      regex: false,
    },
    order: [{ column: 0, dir: sortDir === 'desc' ? 'desc' : 'asc' }],
    columns: [{ data: sortField }],
  }
}

export function fixedAssetGroupDtoToListRow(dto) {
  if (!dto) {
    return null
  }
  return {
    idMask: dto.idMask ?? '',
    assetType: dto.assetType ?? '',
    assetClassItId: dto.assetClassItId != null ? String(dto.assetClassItId) : '',
    assetClassLabel: dto.assetClassDescription ?? '',
    assetNumber: dto.numberingGroupId != null ? String(dto.numberingGroupId) : '',
    numberingGroupId: dto.numberingGroupId ?? null,
    numberingGroupName: dto.numberingGroupName ?? '',
    depreciable: dto.depreciable ?? 'Y',
    depreciationRateIt:
      dto.depreciationRateIt != null && dto.depreciationRateIt !== ''
        ? String(dto.depreciationRateIt)
        : '',
    depreciationMethod: dto.depreciationMethod ?? '',
    depreciationMethodLabel: dto.depreciationMethodLabel ?? '',
    residualValue: '',
    depreciationBasis: '',
    depreciationBasisLabel: '',
    usefulLife: '',
    assetAccount: dto.assetAccountName ?? '—',
    depreciationAccount: dto.depreciationAccountName ?? '—',
    cumDepreciationAccount: dto.accumDepreciationAccountName ?? '—',
    cwipAccount: dto.cwipAccountName ?? '—',
    active: 'Y',
    isActive: true,
  }
}

function parseNumberingGroupId(assetNumber) {
  if (assetNumber == null || assetNumber === '') {
    return null
  }
  const trimmed = String(assetNumber).trim()
  if (!/^\d+$/.test(trimmed)) {
    return null
  }
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

function parseAssetClassItId(assetClassItId) {
  if (assetClassItId == null || assetClassItId === '') {
    return null
  }
  const parsed = Number(String(assetClassItId).trim())
  return Number.isFinite(parsed) ? parsed : null
}

export function faGroupPayloadToFixedAssetGroupRequest(rowOrForm) {
  const depreciable = rowOrForm.depreciable ?? 'Y'
  let depreciationRateIt = rowOrForm.depreciationRateIt
  let depreciationMethod = rowOrForm.depreciationMethod

  if (depreciable === 'N') {
    depreciationRateIt = 0
    depreciationMethod = ''
  } else if (depreciationRateIt != null && depreciationRateIt !== '') {
    depreciationRateIt = Number(depreciationRateIt)
  } else {
    depreciationRateIt = null
  }

  return {
    assetType: String(rowOrForm.assetType ?? '').trim(),
    assetClassItId: parseAssetClassItId(rowOrForm.assetClassItId),
    numberingGroupId: parseNumberingGroupId(rowOrForm.assetNumber),
    depreciable,
    depreciationRateIt,
    depreciationMethod:
      depreciable === 'N' ? '' : depreciationMethod ? depreciationMethod : null,
  }
}

export function pageArrayToFaGroupSearchResult(pageArray, page, pageSize) {
  const rows = Array.isArray(pageArray?.data)
    ? pageArray.data.map(fixedAssetGroupDtoToListRow).filter(Boolean)
    : []
  return {
    rows,
    total: pageArray?.recordsFiltered ?? rows.length,
    page: Math.max(1, page ?? 1),
    pageSize: pageSize ?? 10,
  }
}

export function numberingSetupOptionDtoToOption(dto) {
  if (!dto || (dto.id == null && !dto.idMask)) {
    return null
  }
  const value = dto.idMask ? String(dto.idMask) : String(dto.id)
  return {
    value,
    label: dto.setupName ?? value,
    idMask: dto.idMask ?? '',
  }
}

export function assetClassItDtoToOption(dto) {
  if (!dto) {
    return null
  }
  const value = dto.id != null ? String(dto.id) : dto.idMask ?? ''
  const description = dto.description ?? ''
  return {
    value,
    label: description || value,
    /** Voucher setup key (probity: asset class IT description). */
    voucherType: description.trim(),
    idMask: dto.idMask ?? '',
  }
}

export function apiErrorToRtkError(result) {
  if (!result?.error) {
    return result
  }
  const payload = result.error.payload
  const message =
    (typeof payload === 'object' && payload?.message) ||
    (typeof result.error.data === 'string' ? result.error.data : 'Request failed')
  return {
    error: {
      status: result.error.status,
      data: {
        message,
        fieldErrors:
          typeof payload === 'object' && payload?.fieldErrors ? payload.fieldErrors : null,
      },
      payload,
    },
  }
}
