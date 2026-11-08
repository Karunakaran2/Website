/** @vitest-environment happy-dom */
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import ComponentDocPageShell from './ComponentDocPageShell'

describe('ComponentDocPageShell', () => {
  it('does not render a page-level h1 when showPageHeading is false (default)', () => {
    render(
      <ComponentDocPageShell title="Buttons" lead="Primary actions.">
        <p>Body</p>
      </ComponentDocPageShell>,
    )
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
    expect(screen.getByText('Buttons')).toBeInTheDocument()
  })

  it('renders h1 when showPageHeading is true', () => {
    render(
      <ComponentDocPageShell title="Buttons" showPageHeading lead="Lead copy.">
        <p>Body</p>
      </ComponentDocPageShell>,
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Buttons' })).toBeInTheDocument()
  })
})
