import { describe, expect, it } from 'vitest'
import {
  disposalFormToProcessRequest,
  uiRetirementTypeToApi,
  mapDisposalPreviewResponse,
  retirementEditFormToUpdateRequest,
} from './assetDisposalApiMappers'

describe('assetDisposalApiMappers', () => {
  it('maps UI retirement types to legacy codes', () => {
    expect(uiRetirementTypeToApi('Sale')).toBe('S')
    expect(uiRetirementTypeToApi('Scrap')).toBe('D')
  })

  it('builds process payload with lines', () => {
    const body = disposalFormToProcessRequest(
      {
        retirementDateStr: '2026-03-31',
        retirementGroupId: 'mask-ret',
        category: 'A',
        categoryList: '',
      },
      {
        salesNumberingIdMask: 'mask-sales',
        lines: [
          {
            assetInformationIdMask: 'mask-asset',
            retirementType: 'Sale',
            saleValue: '1000',
            customerId: '42',
            selected: true,
          },
          {
            assetInformationIdMask: 'mask-skip',
            retirementType: 'Sale',
            saleValue: '',
            customerId: '',
            selected: false,
          },
        ],
      },
    )
    expect(body.lines).toHaveLength(1)
    expect(body.lines[0].retirementType).toBe('S')
    expect(body.lines[0].salesValue).toBe(1000)
    expect(body.lines[0].customerId).toBe(42)
    expect(body.salesNumberingIdMask).toBe('mask-sales')
  })

  it('builds process payload with scrap salesValue', () => {
    const body = disposalFormToProcessRequest(
      {
        retirementDateStr: '2026-03-31',
        retirementGroupId: 'mask-ret',
        category: 'A',
        categoryList: '',
      },
      {
        lines: [
          {
            assetInformationIdMask: 'mask-asset',
            retirementType: 'Scrap',
            saleValue: '500',
            customerId: '',
            selected: true,
          },
        ],
      },
    )
    expect(body.lines).toHaveLength(1)
    expect(body.lines[0].retirementType).toBe('D')
    expect(body.lines[0].salesValue).toBe(500)
  })

  it('builds update payload with scrap salesValue and customer', () => {
    const body = retirementEditFormToUpdateRequest({
      idMask: 'disp-mask',
      retirementType: 'Scrap',
      saleValue: '500',
      customerId: '42',
    })
    expect(body.retirementType).toBe('D')
    expect(body.salesValue).toBe(500)
    expect(body.saleValue).toBe(500)
    expect(body.customerId).toBe(42)
  })

  it('maps preview response defaults', () => {
    const mapped = mapDisposalPreviewResponse({
      lines: [
        {
          assetInformationIdMask: 'a1',
          assetId: 'FA-1',
          assetCost: 10000,
          bookValue: 9500,
        },
      ],
      salesNumberingGroups: [{ idMask: 's1', setupName: 'SALES' }],
    })
    expect(mapped.lines).toHaveLength(1)
    expect(mapped.lines[0].selected).toBe(false)
    expect(mapped.lines[0].assetCost).toBe(10000)
    expect(mapped.lines[0].bookValue).toBe(9500)
    expect(mapped.salesNumberingGroups[0].value).toBe('s1')
  })
})
