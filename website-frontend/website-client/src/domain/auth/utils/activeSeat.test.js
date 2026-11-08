import { describe, expect, it } from 'vitest'
import {
  filterAuthorizedSeats,
  resolveActiveSeatIdMask,
} from './activeSeat'

const seats = [
  {
    idMask: 'seat-a',
    name: 'Alpha Hub',
    hierarchyCode: 'A-01',
    postingName: 'Lead',
    office: 'HQ',
  },
  {
    idMask: 'seat-b',
    name: 'Beta Wing',
    hierarchyCode: 'B-02',
    postingName: 'Engineer',
    office: 'Lab',
  },
]

describe('resolveActiveSeatIdMask', () => {
  it('prefers seatUserAllotId on the user', () => {
    expect(resolveActiveSeatIdMask({ seatUserAllotId: 'seat-b' }, seats)).toBe('seat-b')
  })

  it('falls back to hierarchy code match', () => {
    expect(resolveActiveSeatIdMask({ hierarchyCode: 'A-01' }, seats)).toBe('seat-a')
  })

  it('falls back to hierarchy name match', () => {
    expect(resolveActiveSeatIdMask({ hierarchyName: 'Beta Wing' }, seats)).toBe('seat-b')
  })
})

describe('filterAuthorizedSeats', () => {
  it('filters by office and role text', () => {
    expect(filterAuthorizedSeats(seats, 'lab engineer')).toEqual([seats[1]])
  })

  it('returns all seats when query is empty', () => {
    expect(filterAuthorizedSeats(seats, '  ')).toEqual(seats)
  })
})
