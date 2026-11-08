import { describe, expect, it } from 'vitest'
import { stringsToSelectOptions } from './selectOptionUtils'

describe('stringsToSelectOptions', () => {
  it('maps strings to value/label pairs', () => {
    expect(stringsToSelectOptions(['All', 'Active'])).toEqual([
      { value: 'All', label: 'All' },
      { value: 'Active', label: 'Active' },
    ])
  })

  it('excludes listed values', () => {
    expect(stringsToSelectOptions(['All', 'Active'], { exclude: ['All'] })).toEqual([
      { value: 'Active', label: 'Active' },
    ])
  })
})
