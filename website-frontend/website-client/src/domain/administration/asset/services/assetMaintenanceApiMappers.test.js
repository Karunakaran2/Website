import { describe, expect, it } from 'vitest'
import {
  maintenanceFormToSaveRequest,
  mapMaintenanceInvoiceOption,
  mapMaintenanceJournalLine,
  mapMaintenanceListItem,
  filterMaintenanceAssetOptions,
  mapMaintenanceSearchResponse,
} from './assetMaintenanceApiMappers'

describe('assetMaintenanceApiMappers', () => {
  it('maps list item from API dto', () => {
    const row = mapMaintenanceListItem({
      idMask: 'm1',
      assetId: 'A-1',
      assetDescription: 'Asset text',
      underWarranty: false,
      cost: 50,
      approve: 'N',
    })
    expect(row.idMask).toBe('m1')
    expect(row.assetDescription).toBe('Asset text')
    expect(row.approve).toBe('N')
  })

  it('maps search response', () => {
    const result = mapMaintenanceSearchResponse({
      total: 1,
      rows: [{ idMask: 'm1', assetId: 'X' }],
    })
    expect(result.total).toBe(1)
    expect(result.rows).toHaveLength(1)
  })

  it('filters asset picker options for assets with draft maintenance', () => {
    const options = [
      { idMask: 'a1', label: 'build/5/' },
      { idMask: 'a2', label: 'build/22/' },
    ]
    const filtered = filterMaintenanceAssetOptions(options, new Set(['a2']))
    expect(filtered).toHaveLength(1)
    expect(filtered[0].idMask).toBe('a1')
    const editKeep = filterMaintenanceAssetOptions(options, new Set(['a2']), 'a2')
    expect(editKeep).toHaveLength(2)
  })

  it('dedupes draft rows to one row per asset', () => {
    const result = mapMaintenanceSearchResponse(
      {
        total: 4,
        rows: [
          { idMask: 'm4', assetInformationIdMask: 'a1', assetId: 'build/5/' },
          { idMask: 'm3', assetInformationIdMask: 'a1', assetId: 'build/5/' },
          { idMask: 'm2', assetInformationIdMask: 'a2', assetId: 'build/17/' },
          { idMask: 'm1', assetInformationIdMask: 'a1', assetId: 'build/5/' },
        ],
      },
      'draft',
    )
    expect(result.rows).toHaveLength(2)
    expect(result.rows.map((r) => r.idMask)).toEqual(['m4', 'm2'])
    expect(result.total).toBe(2)
  })

  it('maps journal line to DR/CR display row', () => {
    const debit = mapMaintenanceJournalLine({
      entryType: 'D',
      hoaName: 'Fixed Asset',
      debitAmount: 1000,
      creditAmount: null,
    })
    expect(debit.entryType).toBe('DR')
    expect(debit.amount).toBe(1000)

    const credit = mapMaintenanceJournalLine({
      entryType: 'C',
      hoaName: 'Vendor Payable',
      debitAmount: null,
      creditAmount: 1000,
    })
    expect(credit.entryType).toBe('CR')
    expect(credit.amount).toBe(1000)
  })

  it('maps journal line Dr/Cr and UI codes to DR/CR', () => {
    expect(
      mapMaintenanceJournalLine({
        entryType: 'Dr',
        hoaName: 'Laptop',
        debitAmount: 100000,
        creditAmount: null,
      }).entryType,
    ).toBe('DR')
    expect(
      mapMaintenanceJournalLine({
        entryType: 'Cr',
        hoaName: 'DELL-PL',
        debitAmount: null,
        creditAmount: 100000,
      }).entryType,
    ).toBe('CR')
    expect(
      mapMaintenanceJournalLine({
        entryType: '0',
        hoaName: 'Asset',
        debitAmount: 500,
        creditAmount: null,
      }).entryType,
    ).toBe('DR')
    expect(
      mapMaintenanceJournalLine({
        entryType: '1',
        hoaName: 'Payable',
        debitAmount: null,
        creditAmount: 500,
      }).entryType,
    ).toBe('CR')
  })

  it('maps journal line from amounts when entry type missing', () => {
    const debit = mapMaintenanceJournalLine({
      entryType: '',
      hoaName: 'Laptop',
      debitAmount: 100000,
      creditAmount: null,
    })
    expect(debit.entryType).toBe('DR')
    expect(debit.amount).toBe(100000)
  })

  it('maps invoice option with vendor', () => {
    const opt = mapMaintenanceInvoiceOption({
      idMask: 'j1',
      label: 'INV-1',
      vendorIdMask: 'v8',
      vendorName: 'DELL',
    })
    expect(opt.vendorIdMask).toBe('v8')
    expect(opt.vendorName).toBe('DELL')
  })

  it('builds save request from simplified form', () => {
    const body = maintenanceFormToSaveRequest({
      assetInformationIdMask: 'a1',
      maintenanceDateStr: '2026-03-01',
      vendorIdMask: 'v1',
      purchaseInvoiceIdMask: 'j1',
      cost: '10',
      maintenanceDescription: 'Oil change',
    })
    expect(body.assetInformationIdMask).toBe('a1')
    expect(body.description).toBe('Oil change')
    expect(body.maintenanceType).toBe('C')
    expect(body.status).toBe('C')
    expect(body.underWarranty).toBe(false)
  })

  it('strips grouping commas from cost in save request', () => {
    const body = maintenanceFormToSaveRequest({
      assetInformationIdMask: 'a1',
      maintenanceDateStr: '2026-03-01',
      vendorIdMask: 'v1',
      purchaseInvoiceIdMask: 'j1',
      cost: '1,000.00',
      maintenanceDescription: 'Work',
    })
    expect(body.cost).toBe('1000')
  })
})
