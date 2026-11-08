import { describe, expect, it } from 'vitest'
import { seatUserToCustodianOption } from './assetDtoMappers'

describe('seatUserToCustodianOption', () => {
  it('uses numeric id when idMask is absent (master-setup list)', () => {
    const option = seatUserToCustodianOption({
      id: 612,
      userName: 'Rahul',
      hierarchyName: 'Finance',
    })
    expect(option).toEqual({
      idMask: '612',
      label: 'Rahul (Finance)',
    })
  })

  it('returns null when no selectable id', () => {
    expect(seatUserToCustodianOption({ userName: 'No Id' })).toBeNull()
  })
})
