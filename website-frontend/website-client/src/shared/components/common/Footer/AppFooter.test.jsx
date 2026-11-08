/** @vitest-environment happy-dom */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { MemoryRouter } from 'react-router-dom'
import AppFooter from './AppFooter'

describe('AppFooter layout', () => {
  it('renders version on the left and developer links before the KRAN logo on the right', () => {
    const { container } = render(
      <MemoryRouter>
        <AppFooter />
      </MemoryRouter>,
    )

    const row = container.querySelector('footer > div')
    expect(row).toHaveClass('justify-between')

    expect(screen.getByText(/version 1.0/i)).toBeInTheDocument()

    const workbench = screen.getByRole('link', { name: 'Component Workbench' })
    const guidelines = screen.getByRole('link', { name: 'Design Guidelines' })
    expect(workbench).toHaveAttribute('href', '/component-workbench/overview/module-overview')
    expect(guidelines).toHaveAttribute('href', '/design-guidelines/guide-principles/overview')

    expect(screen.getByRole('button', { name: 'Download Source ZIP' })).toBeInTheDocument()

    const logo = screen.getByRole('link', { name: 'KRAN' })
    expect(logo).toHaveAttribute('href', 'https://kran.co.in/')

    const rightCluster = guidelines.closest('div')
    expect(rightCluster?.contains(workbench)).toBe(true)
    expect(rightCluster?.contains(guidelines)).toBe(true)
    expect(rightCluster?.contains(logo)).toBe(true)
  })
})
