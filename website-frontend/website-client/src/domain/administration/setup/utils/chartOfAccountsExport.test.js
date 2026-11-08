import { describe, expect, it } from 'vitest'
import { useLazySearchSetupQuery } from '../services/setupApi'
import {
  CHART_OF_ACCOUNTS_EXPORT_PAGE_SIZE,
  buildChartOfAccountsPdf,
  buildChartOfAccountsWorkbook,
  fetchAllChartOfAccountsRows,
  mapChartOfAccountsExportRows,
} from './chartOfAccountsExport'

describe('setup search export hook', () => {
  it('exposes the lazy search query used to load every page', () => {
    expect(typeof useLazySearchSetupQuery).toBe('function')
  })
})

function pageResult(data, recordsFiltered) {
  return {
    unwrap: async () => ({ data, recordsFiltered }),
  }
}

describe('mapChartOfAccountsExportRows', () => {
  it('numbers the full set and labels status the same way as the table', () => {
    const mapped = mapChartOfAccountsExportRows([
      { hoaName: 'Cash', ledgerCategoryName: 'Asset', groupsList: 'Assets-->Bank', isActive: true },
      { hoaName: null, ledgerCategoryName: '', groupsList: null, isActive: false },
    ])

    expect(mapped).toEqual([
      {
        serial: 1,
        hoaName: 'Cash',
        ledgerCategoryName: 'Asset',
        groupsList: 'Assets-->Bank',
        status: 'Active',
      },
      {
        serial: 2,
        hoaName: '',
        ledgerCategoryName: '',
        groupsList: '',
        status: 'Inactive',
      },
    ])
  })
})

describe('fetchAllChartOfAccountsRows', () => {
  it('requests every page of the current search and sort', async () => {
    const calls = []
    const firstPage = Array.from({ length: CHART_OF_ACCOUNTS_EXPORT_PAGE_SIZE }, (_, index) => ({
      hoaName: `Head ${index}`,
      isActive: true,
    }))
    const trigger = (args) => {
      calls.push(args)
      if (args.page === 1) {
        return pageResult(firstPage, 101)
      }
      return pageResult([{ hoaName: 'Last head', isActive: 'N' }], 101)
    }

    const rows = await fetchAllChartOfAccountsRows(trigger, {
      search: 'cash',
      sortBy: 'hoaName',
      sortDir: 'desc',
      sortFields: ['hoaName'],
    })

    expect(calls).toEqual([
      {
        resource: 'hoa-setup',
        search: 'cash',
        page: 1,
        pageSize: 100,
        sortBy: 'hoaName',
        sortDir: 'desc',
        sortFields: ['hoaName'],
      },
      {
        resource: 'hoa-setup',
        search: 'cash',
        page: 2,
        pageSize: 100,
        sortBy: 'hoaName',
        sortDir: 'desc',
        sortFields: ['hoaName'],
      },
    ])
    expect(rows).toHaveLength(101)
    expect(rows.at(-1).hoaName).toBe('Last head')
  })

  it('still downloads an empty filtered set', async () => {
    const trigger = () => pageResult([], 0)
    await expect(fetchAllChartOfAccountsRows(trigger, { search: 'missing' })).resolves.toEqual([])
  })
})

describe('chart of accounts documents', () => {
  const generatedAt = new Date(2026, 9, 9)
  const rows = mapChartOfAccountsExportRows(
    Array.from({ length: 40 }, (_, index) => ({
      hoaName: `Head ${index + 1}`,
      ledgerCategoryName: 'Liability',
      groupsList: 'Group-->Sub Group-->Detail',
      isActive: index % 2 === 0,
    })),
  )

  it('builds an excel sheet with title, headers, and every row', async () => {
    const workbook = await buildChartOfAccountsWorkbook({
      rows,
      search: 'head',
      generatedAt,
    })
    const sheet = workbook.getWorksheet('Chart of Accounts')

    expect(sheet.getCell('A1').value).toBe('Chart of Accounts')
    expect(sheet.getCell('A2').value).toContain('Search: head')
    expect(sheet.getCell('A2').value).toContain('Records: 40')
    expect(sheet.getRow(4).values.slice(1)).toEqual([
      'Sl. No.',
      'Head of Account',
      'Ledger Category',
      'Group',
      'Status',
    ])
    expect(sheet.getCell('A5').value).toBe(1)
    expect(sheet.getCell('B5').value).toBe('Head 1')
    expect(sheet.getCell('E5').value).toBe('Active')
    expect(sheet.getCell('A44').value).toBe(40)
    expect(sheet.views[0].state).toBe('frozen')
    expect(sheet.views[0].ySplit).toBe(4)

    const buffer = await workbook.xlsx.writeBuffer()
    expect(buffer.byteLength).toBeGreaterThan(0)
  })

  it('builds a landscape pdf with a repeated table across pages', async () => {
    const doc = await buildChartOfAccountsPdf({
      rows,
      search: '',
      generatedAt,
    })

    expect(doc.getNumberOfPages()).toBeGreaterThan(1)
    const output = doc.output('arraybuffer')
    expect(output.byteLength).toBeGreaterThan(1000)
  })
})
