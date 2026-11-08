/** Opening fixed asset Excel import — template columns (legacy upload screen). */

export const OPENING_FIXED_ASSET_TEMPLATE_HEADERS = [
  'Asset Id',
  'Asset Description',
  'Asset Type',
  'Capitalisation Date',
  'Asset Cost',
  'Quantity',
]

export const OPENING_FIXED_ASSET_TABLE_COLUMNS = [
  { key: 'fileName', header: 'file name' },
  { key: 'totalAsset', header: 'total assets' },
  { key: 'pushedOn', header: 'uploaded on' },
  { key: 'statusLabel', header: 'status' },
]

/** Uploaded Excel line items (probity 2.0 OpeningAssetAjax.html). */
export const OPENING_FIXED_ASSET_DETAIL_COLUMNS = [
  { key: 'assetId', header: 'Asset ID' },
  { key: 'legacyAssetId', header: 'Legacy Asset ID' },
  { key: 'assetDescription', header: 'Asset Description' },
  { key: 'assetType', header: 'Asset Type' },
  { key: 'assetClassDescription', header: 'Asset Class' },
  { key: 'assetCost', header: 'Asset Cost', align: 'right' },
  { key: 'accmDepreciationIt', header: 'Accumulated Depreciation (IT)', align: 'right' },
  { key: 'bookValueIt', header: 'Book Value (IT)', align: 'right' },
  { key: 'capitalisationDate', header: 'Capitalisation Date', align: 'center' },
  { key: 'putToUseDate', header: 'Put To Use Date', align: 'center' },
  { key: 'location', header: 'Location' },
  { key: 'costCentreName', header: 'Cost Center', align: 'center' },
  { key: 'serialNumber', header: 'Serial Number' },
  { key: 'custodianDisplay', header: 'Custodian' },
  { key: 'hsnCode', header: 'HSN Code' },
  { key: 'comments', header: 'Comments' },
]

export const OPENING_FIXED_ASSET_STATUS_SAVED = 'S'

export const OPENING_FIXED_ASSET_ACCEPT =
  '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

export const OPENING_FIXED_ASSET_TEMPLATE_FILENAME = 'Opening_Fixed_Asset_Template.xlsx'
