import { describe, expect, it } from 'vitest'
import { formatAssetDisplayDate } from './assetDateFormat'

describe('formatAssetDisplayDate', () => {
  it('formats ISO dates as DD-MM-YYYY', () => {
    expect(formatAssetDisplayDate('2026-09-25')).toBe('25-09-2026')
  })

  it('leaves dd-mm-yyyy unchanged (no double-format flip)', () => {
    expect(formatAssetDisplayDate('25-09-2026')).toBe('25-09-2026')
  })
})
