import { MOCK_FA_GROUP_ROWS } from '../constants/faGroupMockData'
import { createFaGroupIdMask, faGroupFormToRow } from '../utils/faGroupRow'
import { isRowActive } from '@/shared/components/status/statusLabels'

/** In-memory FA groups until asset-service HTTP is wired. */
let faGroupRows = [...MOCK_FA_GROUP_ROWS]

function rowSearchText(row) {
  return [
    row.assetType,
    row.assetClassLabel,
    row.depreciationRateIt,
    row.depreciationMethodLabel,
    row.residualValue,
    row.depreciationBasisLabel,
    row.usefulLife,
    row.assetAccount,
    row.depreciationAccount,
    row.cumDepreciationAccount,
    row.cwipAccount,
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

export function searchFaGroups({ search = '', page = 1, pageSize = 10, sortBy = 'assetType', sortDir = 'asc' }) {
  const query = String(search).trim().toLowerCase()
  let filtered = faGroupRows
  if (query) {
    filtered = faGroupRows.filter((row) => rowSearchText(row).includes(query))
  }

  const sorted = [...filtered].sort((left, right) => {
    const a = sortBy === 'assetClassLabel' ? left.assetClassLabel : left[sortBy]
    const b = sortBy === 'assetClassLabel' ? right.assetClassLabel : right[sortBy]
    return compareValues(a, b, sortDir)
  })

  const total = sorted.length
  const safePage = Math.max(1, page)
  const start = (safePage - 1) * pageSize
  const rows = sorted.slice(start, start + pageSize)

  return { rows, total, page: safePage, pageSize }
}

export function saveFaGroup(payload) {
  const row = faGroupFormToRow(payload)
  const rowWithId = row.idMask ? row : { ...row, idMask: createFaGroupIdMask() }
  const index = faGroupRows.findIndex((item) => item.idMask === rowWithId.idMask)
  if (index >= 0) {
    faGroupRows = faGroupRows.map((item, i) => (i === index ? rowWithId : item))
    return rowWithId
  }
  faGroupRows = [rowWithId, ...faGroupRows]
  return rowWithId
}

export function toggleFaGroupActive(idMask) {
  const index = faGroupRows.findIndex((row) => row.idMask === idMask)
  if (index < 0) {
    throw new Error('FA group not found.')
  }
  const row = faGroupRows[index]
  const nextActive = isRowActive(row) ? 'N' : 'Y'
  const updated = {
    ...row,
    active: nextActive,
    isActive: nextActive === 'Y',
  }
  faGroupRows = faGroupRows.map((item, i) => (i === index ? updated : item))
  return updated
}

export function getFaGroupByIdMask(idMask) {
  if (!idMask) {
    return null
  }
  return faGroupRows.find((row) => row.idMask === idMask) ?? null
}

export function listFaGroupSelectOptions() {
  return faGroupRows
    .filter((row) => isRowActive(row))
    .map((row) => ({ value: row.idMask, label: row.assetType }))
}

export function removeFaGroupByIdMask(idMask) {
  const before = faGroupRows.length
  faGroupRows = faGroupRows.filter((row) => row.idMask !== idMask)
  if (faGroupRows.length === before) {
    throw new Error('FA group not found.')
  }
  return { idMask }
}
