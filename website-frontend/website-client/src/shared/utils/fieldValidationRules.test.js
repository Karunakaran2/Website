import { describe, expect, it } from 'vitest'
import { FIELD_FORMAT, getFieldFormatKey, probityFieldRules } from './fieldValidationRules'

describe('fieldValidationRules', () => {
  it('maps common field names to format keys', () => {
    expect(getFieldFormatKey('panNumber')).toBe('pan')
    expect(getFieldFormatKey('addressEntries.0.mailId')).toBe('email')
    expect(getFieldFormatKey('ifscNo')).toBe('ifsc')
  })

  it('validates PAN when optional field has a value', () => {
    const rules = probityFieldRules('panNo')
    expect(rules.validate('ABCDE1234F')).toBe(true)
    expect(rules.validate('bad')).toBe(FIELD_FORMAT.pan.message)
    expect(rules.validate('')).toBe(true)
  })

  it('applies pattern directly when required', () => {
    const rules = probityFieldRules('pincode', { required: true, label: 'Pincode' })
    expect(rules.required).toBe('Please enter Pincode.')
    expect(rules.pattern).toEqual(FIELD_FORMAT.pincode)
  })
})
