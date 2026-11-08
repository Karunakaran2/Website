import {
  customerLabelFromPartyId,
  retirementCategoryLabel,
  retirementGroupLabel,
  RETIREMENT_CATEGORY_SUGGESTIONS,
} from '../constants/assetRetirement'
import { INITIAL_RETIREMENT_ROWS } from '../constants/assetRetirementMockData'

let retirementRows = [...INITIAL_RETIREMENT_ROWS]

const PROCESS_TEMPLATE_LINES = [
  {
    assetId: 'FA-000301',
    assetDescription: 'Split AC — 2 Ton (Conference Hall)',
    bookValue: 28500,
    retirementType: 'Sale',
    saleValue: 0,
    customerPartyId: '',
  },
  {
    assetId: 'FA-000318',
    assetDescription: 'Desktop Workstation',
    bookValue: 42000,
    retirementType: 'Sale',
    saleValue: 0,
    customerPartyId: '',
  },
]

function filterRows(rows, search) {
  const q = (search || '').trim().toLowerCase()
  if (!q) {
    return rows
  }
  return rows.filter((row) =>
    [
      row.retirementDate,
      row.assetId,
      row.assetDescription,
      row.retirementType,
      row.customerName,
      row.retirementGroupLabel,
      String(row.bookValue),
      String(row.saleValue),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(q),
  )
}

function sortRows(rows, sortBy, sortDir) {
  if (!sortBy) {
    return rows
  }
  const dir = sortDir === 'asc' ? 1 : -1
  return [...rows].sort((left, right) => {
    const a = left[sortBy] ?? ''
    const b = right[sortBy] ?? ''
    if (a < b) {
      return -1 * dir
    }
    if (a > b) {
      return 1 * dir
    }
    return 0
  })
}

export function getRetirementProcessDefaults() {
  return {
    retirementGroupOptions: [],
  }
}

export function searchAssetRetirement({ search, page = 1, pageSize = 10, sortBy, sortDir } = {}) {
  const filtered = sortRows(filterRows(retirementRows, search), sortBy, sortDir)
  const total = filtered.length
  const start = Math.max(0, (page - 1) * pageSize)
  const rows = filtered.slice(start, start + pageSize)
  return { rows, total }
}

export function processAssetRetirement(payload) {
  const groupLabel = retirementGroupLabel(payload.retirementGroupId)
  const catLabel = retirementCategoryLabel(payload.category)
  const created = PROCESS_TEMPLATE_LINES.map((line, index) => ({
    idMask: `ret-mask-${Date.now()}-${index}`,
    retirementDate: payload.retirementDateStr,
    assetId: line.assetId,
    assetDescription: line.assetDescription,
    bookValue: line.bookValue,
    retirementType: line.retirementType,
    saleValue: line.saleValue,
    customerName: customerLabelFromPartyId(line.customerPartyId),
    retirementGroupLabel: groupLabel,
    category: payload.category,
    categoryLabel: catLabel,
    categoryList: payload.categoryList || '',
  }))
  retirementRows = [...created, ...retirementRows]
  return { rowCount: created.length, rows: created }
}

export function getAssetRetirementByIdMask(idMask) {
  return retirementRows.find((row) => row.idMask === idMask) ?? null
}

export function saveAssetRetirement(idMask, payload) {
  const index = retirementRows.findIndex((row) => row.idMask === idMask)
  if (index < 0) {
    throw new Error('Retirement record not found.')
  }
  const previous = retirementRows[index]
  const saleValue =
    payload.saleValue === '' || payload.saleValue == null
      ? previous.saleValue
      : Number(payload.saleValue)
  const updated = {
    ...previous,
    retirementType: payload.retirementType ?? previous.retirementType,
    saleValue: Number.isNaN(saleValue) ? previous.saleValue : saleValue,
    customerName: customerLabelFromPartyId(payload.customerPartyId),
  }
  retirementRows = [
    ...retirementRows.slice(0, index),
    updated,
    ...retirementRows.slice(index + 1),
  ]
  return updated
}

export function listRetirementCategorySuggestions(category, query) {
  const base = RETIREMENT_CATEGORY_SUGGESTIONS[category] ?? []
  const q = (query || '').trim().toLowerCase()
  if (!q) {
    return base.slice(0, 8)
  }
  return base.filter((item) => item.toLowerCase().includes(q)).slice(0, 8)
}

export function resetAssetRetirementMockStore() {
  retirementRows = [...INITIAL_RETIREMENT_ROWS]
}
