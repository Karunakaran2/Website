import { describe, expect, it } from 'vitest'
import {
  depreciationFormToFilterRequest,
  depreciationFormToProcessRequest,
  formatDepreciationNumberFromSetup,
  mapDepreciationBaseListItem,
  mapDepreciationPreviewResponse,
  mapDepreciationSortField,
} from './assetDepreciationApiMappers'

describe('formatDepreciationNumberFromSetup', () => {
  it('builds DEP/1/26-27 from master-setup row', () => {
    expect(
      formatDepreciationNumberFromSetup({
        prefix: 'DEP',
        suffix: '26-27',
        lastGeneratedNumber: 0,
      }),
    ).toBe('DEP/1/26-27')
  })
})

describe('mapDepreciationSortField', () => {
  it('maps list column ids to backend fields', () => {
    expect(mapDepreciationSortField('depreciationDate')).toBe('processDate')
    expect(mapDepreciationSortField('processUpTo')).toBe('processUpto')
  })
})

describe('depreciationFormToFilterRequest', () => {
  it('uses legacy catgeory field names', () => {
    expect(
      depreciationFormToFilterRequest({
        category: 'T',
        categoryList: 'BUILDING',
        depreciationDateStr: '2026-03-31',
        processUpToStr: '2026-03-31',
      }),
    ).toEqual({
      catgeory: 'T',
      catgeoryList: 'BUILDING',
      depreciationDateStr: '2026-03-31',
      processUpToStr: '2026-03-31',
    })
  })
})

describe('mapDepreciationPreviewResponse', () => {
  it('maps preview lines and totals', () => {
    const mapped = mapDepreciationPreviewResponse({
      lines: [
        {
          idMask: 'a1',
          assetId: 'FA-1',
          assetDescription: 'Desk',
          assetCost: 10000,
          bookValueIt: 9500,
          depreciationMethod: 'W',
          depreciationAmount: 100,
        },
      ],
      totalDepreciation: 100,
      assetCount: 1,
    })
    expect(mapped.lines).toHaveLength(1)
    expect(mapped.lines[0]).toMatchObject({
      assetCost: 10000,
      bookValueIt: 9500,
      depreciationMethodLabel: 'WDV',
    })
    expect(mapped.totalDepreciation).toBe(100)
    expect(mapped.assetCount).toBe(1)
  })
})

describe('depreciationFormToProcessRequest', () => {
  it('includes totals from preview', () => {
    expect(
      depreciationFormToProcessRequest(
        { category: 'A', depreciationDateStr: '2026-03-31', processUpToStr: '2026-03-31' },
        { totalDepreciation: 500, assetCount: 3 },
      ),
    ).toMatchObject({
      totalDepreciation: 500,
      assetCount: 3,
      catgeory: 'A',
    })
  })
})

describe('mapDepreciationBaseListItem', () => {
  it('maps processDate to depreciationDate', () => {
    expect(
      mapDepreciationBaseListItem({
        idMask: 'b1',
        depreciationAmount: 10,
        depreciationNumber: '2',
        processDate: '2026-03-31',
        processUpto: '2026-03-31',
      }),
    ).toEqual({
      idMask: 'b1',
      depreciationAmount: 10,
      depreciationNumber: '2',
      depreciationDate: '2026-03-31',
      processUpTo: '2026-03-31',
    })
  })
})
