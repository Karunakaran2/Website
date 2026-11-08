/** View All Assets — allocation filter (probity-client only). */
export const ASSET_VIEW_ALL_ALLOCATION_FILTER = {
  ALL: 'ALL',
  ALLOCATED: 'ALLOCATED',
  NOT_ALLOCATED: 'NOT_ALLOCATED',
}

export const ASSET_VIEW_ALL_ALLOCATION_FILTER_OPTIONS = [
  { value: ASSET_VIEW_ALL_ALLOCATION_FILTER.ALL, label: 'All assets' },
  { value: ASSET_VIEW_ALL_ALLOCATION_FILTER.ALLOCATED, label: 'Allocation' },
  { value: ASSET_VIEW_ALL_ALLOCATION_FILTER.NOT_ALLOCATED, label: 'Not allocation' },
]

/** Matches server filter: custodian_id unset on asset_information. */
export function isViewAllAssetNotAllocated(row) {
  return String(row?.custodianId ?? '').trim() === ''
}
