export const ASSET_APPROVAL_TYPE_INFORMATION = 'information'
export const ASSET_APPROVAL_TYPE_MAINTENANCE = 'maintenance'
export const ASSET_APPROVAL_TYPE_DISPOSAL = 'disposal'

export const DEFAULT_ASSET_APPROVAL_TYPE = ASSET_APPROVAL_TYPE_INFORMATION

export const ASSET_APPROVAL_TYPE_OPTIONS = [
  { value: ASSET_APPROVAL_TYPE_INFORMATION, label: 'Asset Information' },
  { value: ASSET_APPROVAL_TYPE_MAINTENANCE, label: 'Asset Maintenance' },
  { value: ASSET_APPROVAL_TYPE_DISPOSAL, label: 'Asset Disposal' },
]
