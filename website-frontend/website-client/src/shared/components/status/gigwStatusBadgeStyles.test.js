import { describe, expect, it } from 'vitest'
import { gigwStatusBadgeVariant } from './gigwStatusBadgeStyles'

describe('gigwStatusBadgeVariant', () => {
  it('maps affirmative labels to success', () => {
    expect(gigwStatusBadgeVariant('Yes')).toBe('success')
    expect(gigwStatusBadgeVariant('Active')).toBe('success')
    expect(gigwStatusBadgeVariant('Approved')).toBe('success')
    expect(gigwStatusBadgeVariant('added')).toBe('success')
    expect(gigwStatusBadgeVariant('Added to entries')).toBe('success')
  })

  it('maps No to danger and Inactive to neutral', () => {
    expect(gigwStatusBadgeVariant('No')).toBe('danger')
    expect(gigwStatusBadgeVariant('n')).toBe('danger')
    expect(gigwStatusBadgeVariant('Inactive')).toBe('neutral')
    expect(gigwStatusBadgeVariant('Deactivated')).toBe('neutral')
  })

  it('maps workflow labels', () => {
    expect(gigwStatusBadgeVariant('Pending')).toBe('warning')
    expect(gigwStatusBadgeVariant('Rejected')).toBe('danger')
    expect(gigwStatusBadgeVariant('Processing')).toBe('info')
  })
})
