/** @vitest-environment happy-dom */
import { cleanup, render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { afterEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/shared/i18/i18n'
const ON_MATURITY = [{ value: 'M', label: 'Do Not Renew' }]
import OrgSelectField from './OrgSelectField'

vi.mock('@/shared/lib/tailwreck', () => ({
  FeaturedBasicSelect: ({ options }) => (
    <ul>
      {options.map((option) => (
        <li key={String(option.value)} data-testid={`option-${option.value || 'empty'}`}>
          {option.label}
        </li>
      ))}
    </ul>
  ),
}))

function FieldHarness({ translateOptions }) {
  const { control } = useForm({ defaultValues: { onMaturity: '' } })
  return (
    <I18nextProvider i18n={i18n}>
      <OrgSelectField
        control={control}
        name="onMaturity"
        label="Maturity Action"
        options={ON_MATURITY}
        translateOptions={translateOptions}
      />
    </I18nextProvider>
  )
}

describe('OrgSelectField translateOptions', () => {
  afterEach(() => {
    cleanup()
  })

  it('keeps Do Not Renew when translation is disabled', () => {
    render(<FieldHarness translateOptions={false} />)
    expect(screen.getByTestId('option-M')).toHaveTextContent('Do Not Renew')
  })

  it('uses shared Manual Type translation by default', () => {
    render(<FieldHarness />)
    expect(screen.getByTestId('option-M')).toHaveTextContent('Manual Type')
  })
})
