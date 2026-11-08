import { describe, expect, it } from 'vitest'
import {
  countUnreadInboxMessages,
  filterInboxMessages,
  markInboxMessageRead,
  paginateInboxRows,
} from './portalInboxUtils'

const SAMPLE = [
  { id: '1', subject: 'Alpha', receivedFrom: 'Team A', status: 'Unread' },
  { id: '2', subject: 'Beta', receivedFrom: 'Team B', status: 'Read' },
  { id: '3', subject: 'Gamma', receivedFrom: 'Team A', status: 'Unread' },
]

describe('portalInboxUtils', () => {
  it('counts unread messages', () => {
    expect(countUnreadInboxMessages(SAMPLE)).toBe(2)
  })

  it('filters by unread tab and search', () => {
    const unreadOnly = filterInboxMessages(SAMPLE, { activeTab: 'unread' })
    expect(unreadOnly).toHaveLength(2)

    const searched = filterInboxMessages(SAMPLE, { search: 'gamma' })
    expect(searched).toHaveLength(1)
    expect(searched[0].id).toBe('3')
  })

  it('paginates with serial numbers', () => {
    const page = paginateInboxRows(SAMPLE, 1, 2)
    expect(page).toHaveLength(2)
    expect(page[0]._serial).toBe(1)
    expect(page[1]._serial).toBe(2)
  })

  it('marks a message read without affecting others', () => {
    const next = markInboxMessageRead(SAMPLE, '1')
    expect(next.find((m) => m.id === '1').status).toBe('Read')
    expect(countUnreadInboxMessages(next)).toBe(1)
  })
})
