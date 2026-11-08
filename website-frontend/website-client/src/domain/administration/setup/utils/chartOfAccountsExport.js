import { activeInactiveLabelFromRow } from '@/shared/components/status/statusLabels'
import { formatSetupLoadError } from './setupApiError'

export const CHART_OF_ACCOUNTS_EXPORT_TITLE = 'Chart of Accounts'
export const CHART_OF_ACCOUNTS_EXPORT_PAGE_SIZE = 100

const EXPORT_PAGE_GUARD = 500

let excelJsModule
async function loadExcelJS() {
  if (!excelJsModule) {
    excelJsModule = (await import('exceljs')).default
  }
  return excelJsModule
}

let pdfStack
async function loadPdfStack() {
  if (!pdfStack) {
    const [{ jsPDF }, autoTableModule] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable'),
    ])
    pdfStack = { jsPDF, autoTable: autoTableModule.default }
  }
  return pdfStack
}

export const CHART_OF_ACCOUNTS_EXPORT_COLUMNS = [
  { key: 'serial', header: 'Sl. No.', excelWidth: 12, pdfWidth: 18, align: 'center' },
  { key: 'hoaName', header: 'Head of Account', excelWidth: 36, pdfWidth: 72, align: 'left', wrap: true },
  { key: 'ledgerCategoryName', header: 'Ledger Category', excelWidth: 28, pdfWidth: 52, align: 'left' },
  { key: 'groupsList', header: 'Group', excelWidth: 48, pdfWidth: 103, align: 'left', wrap: true },
  { key: 'status', header: 'Status', excelWidth: 14, pdfWidth: 28, align: 'center' },
]

const THIN_BORDER = {
  style: 'thin',
  color: { argb: 'FFCBD5E1' },
}

const CELL_BORDER = {
  top: THIN_BORDER,
  bottom: THIN_BORDER,
  left: THIN_BORDER,
  right: THIN_BORDER,
}

function saveExportFile(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function cellText(value) {
  if (value == null) {
    return ''
  }
  return String(value)
}

export function chartOfAccountsExportFileDate(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function chartOfAccountsExportDisplayDate(date = new Date()) {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function chartOfAccountsExportFilename(extension, date = new Date()) {
  return `Chart-of-Accounts-${chartOfAccountsExportFileDate(date)}.${extension}`
}

export function chartOfAccountsExportMetaLines({ search, generatedAt = new Date(), recordCount = 0 }) {
  const lines = [
    `Generated: ${chartOfAccountsExportDisplayDate(generatedAt)}`,
    `Records: ${recordCount}`,
  ]
  const term = typeof search === 'string' ? search.trim() : ''
  if (term) {
    lines.push(`Search: ${term}`)
  }
  return lines
}

export function mapChartOfAccountsExportRows(rows) {
  return (rows || []).map((row, index) => ({
    serial: index + 1,
    hoaName: cellText(row?.hoaName),
    ledgerCategoryName: cellText(row?.ledgerCategoryName),
    groupsList: cellText(row?.groupsList),
    status: activeInactiveLabelFromRow(row),
  }))
}

export function chartOfAccountsExportErrorMessage(error) {
  if (error?.status != null || typeof error?.data === 'string') {
    return formatSetupLoadError(error) || 'Unable to export Chart of Accounts.'
  }
  if (error instanceof Error && error.message) {
    return error.message
  }
  return 'Unable to export Chart of Accounts.'
}

/** Walks hoa-setup search at the server page cap until every filtered row is collected. */
export async function fetchAllChartOfAccountsRows(triggerSearch, {
  search = '',
  sortBy,
  sortDir,
  sortFields,
} = {}) {
  const rows = []
  let page = 1
  let recordsFiltered = Number.POSITIVE_INFINITY

  do {
    const pageResult = await triggerSearch({
      resource: 'hoa-setup',
      search: search || '',
      page,
      pageSize: CHART_OF_ACCOUNTS_EXPORT_PAGE_SIZE,
      sortBy,
      sortDir,
      sortFields,
    }).unwrap()

    const batch = Array.isArray(pageResult?.data) ? pageResult.data : []
    const reported = Number(pageResult?.recordsFiltered)
    if (Number.isFinite(reported) && reported >= 0) {
      recordsFiltered = reported
    }
    rows.push(...batch)

    if (batch.length < CHART_OF_ACCOUNTS_EXPORT_PAGE_SIZE) {
      break
    }
    page += 1
    if (page > EXPORT_PAGE_GUARD) {
      throw new Error('Chart of Accounts export exceeded the page limit.')
    }
  } while (rows.length < recordsFiltered)

  if (Number.isFinite(recordsFiltered) && rows.length > recordsFiltered) {
    return rows.slice(0, recordsFiltered)
  }
  return rows
}

function columnStyles() {
  return CHART_OF_ACCOUNTS_EXPORT_COLUMNS.reduce((styles, column, index) => {
    styles[index] = {
      cellWidth: column.pdfWidth,
      halign: column.align,
    }
    return styles
  }, {})
}

export async function buildChartOfAccountsPdf({ rows, search, generatedAt = new Date() }) {
  const { jsPDF, autoTable } = await loadPdfStack()
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const meta = chartOfAccountsExportMetaLines({
    search,
    generatedAt,
    recordCount: rows.length,
  }).join('   |   ')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(1, 69, 142)
  doc.text(CHART_OF_ACCOUNTS_EXPORT_TITLE, 12, 14)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(51, 65, 85)
  doc.text(meta, 12, 21)

  autoTable(doc, {
    startY: 26,
    head: [CHART_OF_ACCOUNTS_EXPORT_COLUMNS.map((column) => column.header)],
    body: rows.map((row) => CHART_OF_ACCOUNTS_EXPORT_COLUMNS.map((column) => cellText(row[column.key]))),
    showHead: 'everyPage',
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: 2,
      overflow: 'linebreak',
      valign: 'middle',
      textColor: [15, 23, 42],
      lineColor: [203, 213, 225],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [1, 69, 142],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: columnStyles(),
    margin: { top: 16, right: 12, bottom: 14, left: 12 },
    rowPageBreak: 'auto',
  })

  const pageCount = doc.getNumberOfPages()
  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    doc.setPage(pageNumber)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(100)
    doc.text(
      `Page ${pageNumber} of ${pageCount}`,
      doc.internal.pageSize.getWidth() - 12,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'right' },
    )
  }

  return doc
}

export async function buildChartOfAccountsWorkbook({ rows, search, generatedAt = new Date() }) {
  const ExcelJS = await loadExcelJS()
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Probity'
  const sheet = workbook.addWorksheet('Chart of Accounts')
  const columnCount = CHART_OF_ACCOUNTS_EXPORT_COLUMNS.length

  sheet.mergeCells(1, 1, 1, columnCount)
  const titleCell = sheet.getCell(1, 1)
  titleCell.value = CHART_OF_ACCOUNTS_EXPORT_TITLE
  titleCell.font = { bold: true, size: 16, color: { argb: 'FF01458E' } }
  titleCell.alignment = { vertical: 'middle' }
  sheet.getRow(1).height = 24

  sheet.mergeCells(2, 1, 2, columnCount)
  const metaCell = sheet.getCell(2, 1)
  metaCell.value = chartOfAccountsExportMetaLines({
    search,
    generatedAt,
    recordCount: rows.length,
  }).join('   |   ')
  metaCell.font = { size: 10, color: { argb: 'FF334155' } }
  sheet.getRow(2).height = 18

  const headerRowIndex = 4
  const headerRow = sheet.getRow(headerRowIndex)
  headerRow.height = 22
  CHART_OF_ACCOUNTS_EXPORT_COLUMNS.forEach((column, index) => {
    const cell = headerRow.getCell(index + 1)
    cell.value = column.header
    cell.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF01458E' },
    }
    cell.alignment = {
      vertical: 'middle',
      horizontal: column.align,
      wrapText: true,
    }
    cell.border = CELL_BORDER
    sheet.getColumn(index + 1).width = column.excelWidth
  })

  rows.forEach((row, rowIndex) => {
    const excelRow = sheet.getRow(headerRowIndex + 1 + rowIndex)
    CHART_OF_ACCOUNTS_EXPORT_COLUMNS.forEach((column, index) => {
      const cell = excelRow.getCell(index + 1)
      cell.value = row[column.key]
      cell.alignment = {
        vertical: 'middle',
        horizontal: column.align,
        wrapText: column.wrap === true,
      }
      cell.border = CELL_BORDER
      if (rowIndex % 2 === 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF8FAFC' },
        }
      }
    })
  })

  const lastRow = Math.max(headerRowIndex, headerRowIndex + rows.length)
  sheet.autoFilter = {
    from: { row: headerRowIndex, column: 1 },
    to: { row: lastRow, column: columnCount },
  }
  sheet.views = [{ state: 'frozen', ySplit: headerRowIndex }]

  return workbook
}

export async function downloadChartOfAccountsPdf(options) {
  const doc = await buildChartOfAccountsPdf(options)
  saveExportFile(doc.output('blob'), chartOfAccountsExportFilename('pdf', options.generatedAt))
}

export async function downloadChartOfAccountsExcel(options) {
  const workbook = await buildChartOfAccountsWorkbook(options)
  const buffer = await workbook.xlsx.writeBuffer()
  saveExportFile(
    new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }),
    chartOfAccountsExportFilename('xlsx', options.generatedAt),
  )
}
