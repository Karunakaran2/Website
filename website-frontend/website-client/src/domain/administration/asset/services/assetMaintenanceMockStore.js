import {
  maintenanceStatusLabel,
  maintenanceTypeLabel,
  maintenanceVendorLabel,
} from '../constants/assetMaintenance'
import {
  INITIAL_MAINTENANCE_ROWS,
  MOCK_PURCHASE_INVOICES_BY_ASSET,
} from '../constants/assetMaintenanceMockData'
import { getAssetInformationByIdMask } from './assetInformationMockStore'
import { listAssetsForAllocation } from './assetAllocationMockStore'

let maintenanceRows = [...INITIAL_MAINTENANCE_ROWS]

function invoiceLabel(assetInformationIdMask, purchaseInvoiceIdMask) {
  if (!purchaseInvoiceIdMask) {
    return ''
  }
  const list = MOCK_PURCHASE_INVOICES_BY_ASSET[assetInformationIdMask] ?? []
  return list.find((item) => item.idMask === purchaseInvoiceIdMask)?.label ?? ''
}

function filterRows(rows, search, statusFilter) {
  let filtered = rows
  if (statusFilter) {
    filtered = filtered.filter((row) => row.status === statusFilter)
  }
  const q = (search || '').trim().toLowerCase()
  if (!q) {
    return filtered
  }
  return filtered.filter((row) =>
    [
      row.assetId,
      row.description,
      row.maintenanceDate,
      row.vendorName,
      maintenanceStatusLabel(row.status),
      maintenanceTypeLabel(row.maintenanceType),
      String(row.cost ?? ''),
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

export function listAssetsForMaintenance() {
  return listAssetsForAllocation()
}

export function listMaintenancePurchaseInvoices(assetInformationIdMask) {
  if (!assetInformationIdMask) {
    return []
  }
  return MOCK_PURCHASE_INVOICES_BY_ASSET[assetInformationIdMask] ?? []
}

export function searchAssetMaintenance({
  search,
  statusFilter,
  page = 1,
  pageSize = 10,
  sortBy,
  sortDir,
} = {}) {
  const filtered = sortRows(
    filterRows(maintenanceRows, search, statusFilter),
    sortBy,
    sortDir,
  )
  const total = filtered.length
  const start = Math.max(0, (page - 1) * pageSize)
  const rows = filtered.slice(start, start + pageSize)
  return { rows, total }
}

export function getAssetMaintenanceByIdMask(idMask) {
  return maintenanceRows.find((row) => row.idMask === idMask) ?? null
}

export function saveAssetMaintenance(payload) {
  const asset = getAssetInformationByIdMask(payload.assetInformationIdMask)
  if (!asset) {
    throw new Error('Asset not found.')
  }

  const costRaw = String(payload.cost ?? '').trim()
  const cost = costRaw ? Number(costRaw) : null
  const vendorName = maintenanceVendorLabel(payload.vendorIdMask)
  const purchaseInvoiceLabel = invoiceLabel(
    payload.assetInformationIdMask,
    payload.purchaseInvoiceIdMask,
  )

  const row = {
    idMask: payload.idMask || `maint-mask-${Date.now()}`,
    assetInformationIdMask: payload.assetInformationIdMask,
    assetId: asset.assetId,
    description: payload.description,
    maintenanceDate: payload.maintenanceDateStr,
    maintenanceType: payload.maintenanceType,
    vendorIdMask: payload.vendorIdMask,
    vendorName,
    cost: Number.isNaN(cost) ? null : cost,
    underWarranty: Boolean(payload.underWarranty),
    status: payload.status,
    nextDueDate: payload.nextDueDateStr || '',
    purchaseInvoiceIdMask: payload.underWarranty ? '' : payload.purchaseInvoiceIdMask || '',
    purchaseInvoiceLabel: payload.underWarranty ? '' : purchaseInvoiceLabel,
  }

  const index = maintenanceRows.findIndex((item) => item.idMask === row.idMask)
  if (index >= 0) {
    maintenanceRows = [
      ...maintenanceRows.slice(0, index),
      row,
      ...maintenanceRows.slice(index + 1),
    ]
  } else {
    maintenanceRows = [row, ...maintenanceRows]
  }
  return row
}

export function resetAssetMaintenanceMockStore() {
  maintenanceRows = [...INITIAL_MAINTENANCE_ROWS]
}
