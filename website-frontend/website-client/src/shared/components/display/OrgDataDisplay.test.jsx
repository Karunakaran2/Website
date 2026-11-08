/** @vitest-environment happy-dom */
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import OrgDataDisplay from './OrgDataDisplay'

describe('OrgDataDisplay', () => {
  afterEach(() => cleanup())

  it('title-cases field labels by default', () => {
    render(
      <OrgDataDisplay
        items={[
          { label: 'submitted date', value: '2026-04-01' },
          { label: 'GSTIN', value: '29ABCDE1234F1Z5', labelTitleCase: false },
        ]}
      />,
    )

    expect(screen.getByText('Submitted Date')).toBeInTheDocument()
    expect(screen.getByText('GSTIN')).toBeInTheDocument()
  })
})
