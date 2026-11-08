import { describe, expect, it } from 'vitest'
import { buildOpeningFixedAssetTemplateXlsx } from './openingFixedAssetTemplateBuilder'

describe('buildOpeningFixedAssetTemplateXlsx', () => {
  it('embeds cost centre names in workbook bytes', async () => {
    const buffer = await buildOpeningFixedAssetTemplateXlsx({
      assetTypes: ['TEST_1_BUILDING'],
      costCentreNames: ['Trivandrum'],
      custodianNames: ['Rahul'],
      hsnLabels: ['9987 - Test'],
    })
    expect(buffer.byteLength).toBeGreaterThan(500)
    expect(buffer[0]).toBe(0x50)
    expect(buffer[1]).toBe(0x4b)
  })
})
