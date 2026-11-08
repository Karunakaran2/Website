import { apiUrl } from '@/shared/api/client'

async function loadExcelJS() {
  return (await import('exceljs')).default
}

/** Matches asset-service {@code OpeningAssetExcelService} headers (probity 2.0). */
export const OPENING_ASSET_EXCEL_HEADERS = [
  'Asset ID',
  'Asset Type',
  'Asset Description',
  'Asset Cost',
  'Asset Qty',
  'Accumulated Depreciation(IT)',
  'Book Value(IT)',
  'Capitalisation Date',
  'Put to Use Date',
  'Cost Center',
  'Location',
  'Serial Number',
  'Custodian',
  'Comments',
  'HSN Code',
]

const LIST_ROW_END = 10000

export async function fetchOpeningAssetTemplateLookup(authHeaders) {
  const getJson = async (path) => {
    const response = await fetch(apiUrl(path), { method: 'GET', headers: authHeaders })
    if (!response.ok) {
      return []
    }
    const data = await response.json()
    return Array.isArray(data) ? data : []
  }

  const faGroups = await getJson('/api/v1/fixed-asset-group/getFixedAssetGroupList')
  const assetTypes = faGroups
    .map((row) => row.assetType)
    .filter((value) => typeof value === 'string' && value.trim())

  let costCentres = await getJson('/api/v1/cost-centre/getCostCentreList')
  if (costCentres.length === 0) {
    costCentres = await getJson('/api/v1/asset-information/getCostCentreList')
  }
  const costCentreNames = costCentres
    .map((row) => row.costCentreName)
    .filter((value) => typeof value === 'string' && value.trim())

  const custodians = await getJson('/api/v1/asset-allocation/getActiveSeatUserAllotedList')
  const custodianNames = custodians
    .map((row) => row.userName ?? row.displayName ?? row.seatName)
    .filter((value) => typeof value === 'string' && value.trim())

  let hsnRows = await getJson('/api/v1/asset-information/getHsnCodeList')
  if (hsnRows.length === 0) {
    hsnRows = await getJson('/api/v1/hsn-code/getHsnCodeList')
  }
  const hsnLabels = hsnRows
    .map((row) => {
      const code = row.hsnCode ?? row.code ?? ''
      const description = row.hsnDescription ?? row.description ?? ''
      if (!code) {
        return ''
      }
      return description ? `${code} - ${description}` : String(code)
    })
    .filter(Boolean)

  return { assetTypes, costCentreNames, custodianNames, hsnLabels }
}

function addHiddenListColumn(hiddenSheet, columnIndex, values) {
  values.forEach((value, index) => {
    hiddenSheet.getCell(index + 1, columnIndex).value = value
  })
  return values.length
}

function addColumnListValidation(sheet, columnIndex, hiddenColumnLetter, itemCount) {
  if (itemCount <= 0) {
    return
  }
  const columnLetter = sheet.getColumn(columnIndex).letter
  const range = `${columnLetter}2:${columnLetter}${LIST_ROW_END}`
  const formula = `HiddenSheet!$${hiddenColumnLetter}$1:$${hiddenColumnLetter}$${itemCount}`
  sheet.dataValidations.add(range, {
    type: 'list',
    allowBlank: true,
    formulae: [formula],
    showErrorMessage: true,
  })
}

/** Build .xlsx template with dropdowns when asset-service template omits cost centres. */
export async function buildOpeningFixedAssetTemplateXlsx(lookup) {
  const ExcelJS = await loadExcelJS()
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('sheet 1')
  const hiddenSheet = workbook.addWorksheet('HiddenSheet')
  hiddenSheet.state = 'veryHidden'

  const headerRow = sheet.addRow(OPENING_ASSET_EXCEL_HEADERS)
  headerRow.height = 20
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    }
    cell.font = { bold: true, size: 10 }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.border = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
    }
  })

  const assetTypeCount = addHiddenListColumn(hiddenSheet, 1, lookup.assetTypes)
  const costCentreCount = addHiddenListColumn(hiddenSheet, 2, lookup.costCentreNames)
  const custodianCount = addHiddenListColumn(hiddenSheet, 15, lookup.custodianNames)
  const hsnCount = addHiddenListColumn(hiddenSheet, 16, lookup.hsnLabels)

  addColumnListValidation(sheet, 2, 'A', assetTypeCount)
  addColumnListValidation(sheet, 10, 'B', costCentreCount)
  addColumnListValidation(sheet, 13, 'O', custodianCount)
  addColumnListValidation(sheet, 15, 'P', hsnCount)

  OPENING_ASSET_EXCEL_HEADERS.forEach((_header, index) => {
    sheet.getColumn(index + 1).width = 18
  })

  return workbook.xlsx.writeBuffer()
}
