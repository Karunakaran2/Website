import { allocationCustodianLabel } from '../constants/assetAllocation'
import {
  getAssetInformationByIdMask,
  searchAssetInformation,
} from './assetInformationMockStore'

/** @type {Record<string, Array<{ allocationDate: string, action: string, location: string, custodianName: string, comments: string }>>} */
const allocationHistoryByAsset = {}

export function listAssetsForAllocation() {
  const { rows } = searchAssetInformation({
    search: '',
    page: 1,
    pageSize: 500,
    sortBy: 'assetId',
    sortDir: 'asc',
  })
  return rows
    .filter((row) => row.isActive !== false && row.active !== 'N')
    .map((row) => ({
      idMask: row.idMask,
      assetId: row.assetId,
      label: `${row.assetId} — ${row.assetDescription}`,
    }))
}

export function getAssetAllocationDetail(assetInformationIdMask) {
  const asset = getAssetInformationByIdMask(assetInformationIdMask)
  if (!asset) {
    return null
  }
  return {
    idMask: asset.idMask,
    assetId: asset.assetId,
    assetDescription: asset.assetDescription,
    assetTypeLabel: asset.assetTypeLabel,
    location: asset.location,
    custodianId: asset.custodianId,
    costCenterId: asset.costCenterId,
    serialNumber: asset.serialNumber,
    assetCost: asset.assetCost,
  }
}

function appendHistory(assetInformationIdMask, entry) {
  const list = allocationHistoryByAsset[assetInformationIdMask] ?? []
  allocationHistoryByAsset[assetInformationIdMask] = [entry, ...list]
}

export function allocateAssetToUser(payload) {
  const asset = getAssetInformationByIdMask(payload.assetInformationIdMask)
  if (!asset) {
    throw new Error('Asset not found.')
  }

  const location = String(payload.newLocation ?? '').trim() || asset.location
  const custodianName = allocationCustodianLabel(payload.custodianIdMask)

  appendHistory(payload.assetInformationIdMask, {
    allocationDate: payload.allocationDateStr,
    action: 'Allocate',
    location,
    custodianName,
    comments: payload.comments ?? '',
  })

  return {
    assetId: asset.assetId,
    location,
    custodianName,
  }
}

export function returnAssetToStore(payload) {
  const asset = getAssetInformationByIdMask(payload.assetInformationIdMask)
  if (!asset) {
    throw new Error('Asset not found.')
  }

  appendHistory(payload.assetInformationIdMask, {
    allocationDate: payload.allocationDateStr,
    action: 'Return to Store',
    location: 'Store',
    custodianName: '—',
    comments: payload.comments ?? '',
  })

  return {
    assetId: asset.assetId,
    location: 'Store',
  }
}

export function getAssetAllocationHistory(assetInformationIdMask) {
  return allocationHistoryByAsset[assetInformationIdMask] ?? []
}
