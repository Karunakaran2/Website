import { isRowActive } from '@/shared/components/status/statusLabels'
import { MOCK_ASSET_INFORMATION_ROWS } from '../constants/assetInformationMockData'
import { assetInformationFormToRow } from '../utils/assetInformationRow'

let assetInformationRows = [...MOCK_ASSET_INFORMATION_ROWS]
let nextAssetSequence = assetInformationRows.length + 1

function rowSearchText(row) {
  return [
    row.assetId,
    row.assetDescription,
    row.assetTypeLabel,
    row.capitalisationDate,
    row.putToUseDate,
    row.location,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function compareValues(a, b, sortDir) {
  const left = a ?? ''
  const right = b ?? ''
  if (left < right) {
    return sortDir === 'desc' ? 1 : -1
  }
  if (left > right) {
    return sortDir === 'desc' ? -1 : 1
  }
  return 0
}

function createIdMask() {
  return `mock-asset-info-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function searchAssetInformation({
  search = '',
  page = 1,
  pageSize = 10,
  sortBy = 'assetId',
  sortDir = 'asc',
}) {
  const query = String(search).trim().toLowerCase()
  let filtered = assetInformationRows
  if (query) {
    filtered = assetInformationRows.filter((row) => rowSearchText(row).includes(query))
  }

  const sorted = [...filtered].sort((left, right) => {
    const a = left[sortBy]
    const b = right[sortBy]
    return compareValues(a, b, sortDir)
  })

  const total = sorted.length
  const safePage = Math.max(1, page)
  const start = (safePage - 1) * pageSize
  const rows = sorted.slice(start, start + pageSize)

  return { rows, total, page: safePage, pageSize }
}

export function saveAssetInformation(payload) {
  const row = assetInformationFormToRow(payload)
  let idMask = row.idMask
  let assetId = row.assetId

  if (!idMask) {
    idMask = createIdMask()
    assetId = `FA-${String(nextAssetSequence).padStart(5, '0')}`
    nextAssetSequence += 1
  }

  const index = assetInformationRows.findIndex((item) => item.idMask === idMask)
  const existing = index >= 0 ? assetInformationRows[index] : null
  const active = existing?.active ?? row.active ?? 'Y'
  const saved = {
    ...row,
    idMask,
    assetId,
    active,
    isActive: active === 'Y',
  }
  if (index >= 0) {
    assetInformationRows = assetInformationRows.map((item, i) => (i === index ? saved : item))
    return saved
  }
  assetInformationRows = [saved, ...assetInformationRows]
  return saved
}

export function toggleAssetInformationActive(idMask) {
  const index = assetInformationRows.findIndex((row) => row.idMask === idMask)
  if (index < 0) {
    throw new Error('Asset record not found.')
  }
  const row = assetInformationRows[index]
  const nextActive = isRowActive(row) ? 'N' : 'Y'
  const updated = {
    ...row,
    active: nextActive,
    isActive: nextActive === 'Y',
  }
  assetInformationRows = assetInformationRows.map((item, i) => (i === index ? updated : item))
  return updated
}

export function removeAssetInformationByIdMask(idMask) {
  const before = assetInformationRows.length
  assetInformationRows = assetInformationRows.filter((row) => row.idMask !== idMask)
  if (assetInformationRows.length === before) {
    throw new Error('Asset record not found.')
  }
  return { idMask }
}

export function getAssetInformationByIdMask(idMask) {
  return assetInformationRows.find((row) => row.idMask === idMask) ?? null
}
