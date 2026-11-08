/** @vitest-environment happy-dom */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import ReportCatalogGrid from './ReportCatalogGrid'

describe('ReportCatalogGrid', () => {
  afterEach(() => cleanup())

  const reports = [
    { id: 'summary', label: 'Department Summary' },
    { id: 'ledger', label: 'Ledger Extract' },
  ]

  it('renders report tiles and filters by search', () => {
    render(<ReportCatalogGrid reports={reports} onSelect={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Department Summary' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ledger Extract' })).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText(/search by report name/i), {
      target: { value: 'ledger' },
    })

    expect(screen.queryByRole('button', { name: 'Department Summary' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ledger Extract' })).toBeInTheDocument()
  })

  it('calls onSelect with report id when a tile is clicked', () => {
    const onSelect = vi.fn()
    render(<ReportCatalogGrid reports={reports} onSelect={onSelect} />)

    fireEvent.click(screen.getByRole('button', { name: 'Ledger Extract' }))

    expect(onSelect).toHaveBeenCalledWith('ledger')
  })
})
