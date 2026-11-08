import { describe, expect, it } from 'vitest'
import {
  journalLineDisplayAmount,
  normalizeJournalEntryDisplayType,
} from './normalizeJournalEntryDisplayType'

describe('normalizeJournalEntryDisplayType', () => {
  it('maps canonical and accounting UI tokens', () => {
    expect(normalizeJournalEntryDisplayType('D', null, null)).toBe('DR')
    expect(normalizeJournalEntryDisplayType('C', null, null)).toBe('CR')
    expect(normalizeJournalEntryDisplayType('Dr', null, null)).toBe('DR')
    expect(normalizeJournalEntryDisplayType('Cr', null, null)).toBe('CR')
    expect(normalizeJournalEntryDisplayType('0', null, null)).toBe('DR')
    expect(normalizeJournalEntryDisplayType('1', null, null)).toBe('CR')
  })

  it('falls back to debit and credit amounts', () => {
    expect(normalizeJournalEntryDisplayType(null, 100, 0)).toBe('DR')
    expect(normalizeJournalEntryDisplayType(null, 0, 100)).toBe('CR')
  })

  it('picks display amount by resolved type', () => {
    expect(journalLineDisplayAmount('Dr', 1000, null)).toBe(1000)
    expect(journalLineDisplayAmount('Cr', null, 1000)).toBe(1000)
  })
})
