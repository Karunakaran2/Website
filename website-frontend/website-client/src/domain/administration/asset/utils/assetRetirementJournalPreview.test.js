import { describe, expect, it } from 'vitest'
import { buildDisposalJournalPreviewLines } from './assetRetirementJournalPreview'

describe('assetRetirementJournalPreview', () => {
  it('builds four lines for scrap disposal', () => {
    const lines = buildDisposalJournalPreviewLines({
      assetCost: 1000,
      bookValue: 950,
      saleValue: 500,
      retirementType: 'Scrap',
      journalLines: [
        { hoaName: 'CUM DEP' },
        { hoaName: 'G/L' },
        { hoaName: 'ASSET' },
        { hoaName: 'SCRAP' },
      ],
    })
    expect(lines).toHaveLength(4)
    expect(lines[0]).toMatchObject({ entryType: 'DR', amount: 50, hoaName: 'CUM DEP' })
    expect(lines[3]).toMatchObject({ entryType: 'DR', amount: 500, hoaName: 'SCRAP' })
  })

  it('maps HOA names by account label when API returns fewer than four lines', () => {
    const lines = buildDisposalJournalPreviewLines({
      assetCost: 1000,
      bookValue: 8000,
      saleValue: 500,
      retirementType: 'Scrap',
      journalLines: [
        { hoaName: 'TEST1_BUILDING-Gain/Loss Account' },
        { hoaName: 'TEST1_BUILDING-Asset Account' },
      ],
    })
    expect(lines[0].hoaName).toBe('TEST1_BUILDING-ACC DEP ACCOUNT')
    expect(lines[1].hoaName).toBe('TEST1_BUILDING-Gain/Loss Account')
    expect(lines[2].hoaName).toBe('TEST1_BUILDING-Asset Account')
    expect(lines[3].hoaName).toBe('TEST1_BUILDING-Scrap Account')
  })

  it('infers cum dep account name from asset account when accum line is missing', () => {
    const lines = buildDisposalJournalPreviewLines({
      assetCost: 5000,
      bookValue: 5000,
      saleValue: 100,
      journalLines: [
        { hoaName: '—' },
        { hoaName: 'TEST1_BUILDING-Gain/Loss Account' },
        { hoaName: 'TEST1_BUILDING-Asset Account' },
        { hoaName: 'TEST1_BUILDING-Fixed Asset Sale Account' },
      ],
    })
    expect(lines[0]).toMatchObject({
      entryType: 'DR',
      amount: 0,
      hoaName: 'TEST1_BUILDING-ACC DEP ACCOUNT',
    })
  })

  it('infers scrap account name when fourth journal line has no HOA label', () => {
    const lines = buildDisposalJournalPreviewLines({
      assetCost: 425,
      bookValue: 212.5,
      saleValue: 0,
      retirementType: 'Scrap',
      journalLines: [
        { hoaName: 'TEST2-Cum Dep Account' },
        { hoaName: 'TEST2-Gain/Loss Account' },
        { hoaName: 'TEST2-Asset Account' },
        { hoaName: '—' },
      ],
    })
    expect(lines[3]).toMatchObject({
      entryType: 'DR',
      amount: 0,
      hoaName: 'TEST2-Scrap Account',
    })
  })
})
