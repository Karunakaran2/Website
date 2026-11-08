import { MOCK_OPENING_FIXED_ASSET_IMPORT_ROWS } from '../constants/openingFixedAssetMockData'

let importRows = []

export function listOpeningFixedAssetImports() {
  return [...importRows]
}

export function uploadOpeningFixedAssetExcel({ fileName }) {
  if (!fileName) {
    throw new Error('Please attach an Excel file.')
  }
  const lower = fileName.toLowerCase()
  if (!lower.endsWith('.xls') && !lower.endsWith('.xlsx')) {
    throw new Error('Only .xls or .xlsx files are allowed.')
  }
  importRows = [...MOCK_OPENING_FIXED_ASSET_IMPORT_ROWS]
  return {
    fileName,
    rowCount: importRows.length,
    rows: importRows,
  }
}

export function resetOpeningFixedAssetImports() {
  importRows = []
}
