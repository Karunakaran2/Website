import { getSessionId } from '@/domain/auth/utils/session'
import { apiUrl } from '@/shared/api/client'
import {
  buildOpeningFixedAssetTemplateXlsx,
  fetchOpeningAssetTemplateLookup,
} from './openingFixedAssetTemplateBuilder'

function buildJsonAuthHeaders() {
  const headers = { Accept: 'application/json' }
  const sessionId = getSessionId()
  if (sessionId) {
    headers.Authorization = `Bearer ${sessionId}`
  }
  return headers
}

function buildExcelAuthHeaders() {
  const headers = { Accept: 'application/vnd.ms-excel, application/octet-stream' }
  const sessionId = getSessionId()
  if (sessionId) {
    headers.Authorization = `Bearer ${sessionId}`
  }
  return headers
}

function workbookBytesIncludeCostCenterDropdown(buffer) {
  const bytes = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : new Uint8Array(buffer)
  const text = new TextDecoder('latin1').decode(bytes)
  return text.includes('CostCenterDropdown')
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

/** Download opening FA Excel template from asset-service; client fallback if cost-centre list missing. */
export async function downloadOpeningFixedAssetTemplate() {
  const excelHeaders = buildExcelAuthHeaders()
  const jsonHeaders = buildJsonAuthHeaders()

  const response = await fetch(
    apiUrl('/api/v1/opening-fixed-asset/generateOpeningAssetExcelReport'),
    { method: 'GET', headers: excelHeaders },
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      errorText?.trim() ? 'Unable to download template from server.' : 'Unable to download template.',
    )
  }

  const contentType = response.headers.get('content-type') ?? ''
  const serverBuffer = await response.arrayBuffer()
  const headerBytes = new Uint8Array(serverBuffer.slice(0, 4))
  const isOleWorkbook =
    headerBytes[0] === 0xd0
    && headerBytes[1] === 0xcf
    && headerBytes[2] === 0x11
    && headerBytes[3] === 0xe0
  const looksLikeExcel =
    isOleWorkbook
    || contentType.includes('ms-excel')
    || contentType.includes('spreadsheet')
    || contentType.includes('octet-stream')

  const hasServerCostCenterDropdown = workbookBytesIncludeCostCenterDropdown(serverBuffer)
  let usedClientFallback = false
  let outBlob
  let filename = 'Opening_Fixed_Asset_Template.xls'

  let lookupCostCentreCount = 0
  if (!hasServerCostCenterDropdown) {
    const lookup = await fetchOpeningAssetTemplateLookup(jsonHeaders)
    lookupCostCentreCount = lookup.costCentreNames.length
    if (lookup.costCentreNames.length > 0) {
      const xlsxBuffer = await buildOpeningFixedAssetTemplateXlsx(lookup)
      outBlob = new Blob([xlsxBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      filename = 'Opening_Fixed_Asset_Template.xlsx'
      usedClientFallback = true
    }
  }

  if (!outBlob) {
    if (!looksLikeExcel || serverBuffer.byteLength < 100) {
      throw new Error(
        'Server did not return a valid Excel template. Restart asset-service and try Download Excel again.',
      )
    }
    outBlob = new Blob([serverBuffer], {
      type: contentType || 'application/vnd.ms-excel',
    })
  }

  if (!usedClientFallback && !hasServerCostCenterDropdown && lookupCostCentreCount === 0) {
    throw new Error(
      'Cost center list could not be loaded for the Excel template. Sign in again or ensure master-setup cost centres exist.',
    )
  }

  triggerDownload(outBlob, filename)
}
