/** @vitest-environment happy-dom */
import { cleanup, render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { afterEach, describe, expect, it } from 'vitest'
import i18n from '@/shared/i18/i18n'
import OrgSelectField from './OrgSelectField'

const ON_MATURITY = [{ value: 'M', label: 'Do Not Renew' }]

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
    expect(screen.getByRole('option', { name: 'Do Not Renew' })).toBeInTheDocument()
  })

  it('uses shared Manual Type translation by default', () => {
    render(<FieldHarness />)
    expect(screen.getByRole('option', { name: 'Manual Type' })).toBeInTheDocument()
  })
})
