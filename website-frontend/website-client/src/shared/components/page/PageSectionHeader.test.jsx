/** @vitest-environment happy-dom */
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PageSectionHeader from './PageSectionHeader'
import {
  PAGE_SECTION_HEADER_ACTIONS_CLASS,
  PAGE_SECTION_HEADER_GRID_CLASS,
} from './pageHeaderLayoutStyles'

describe('PageSectionHeader', () => {
  it('renders title and subtitle with responsive grid tokens', () => {
    const { container } = render(
      <PageSectionHeader
        title="Fixed Asset Group"
        subtitle="Manage FA groups and depreciation parameters for the selected office."
        actions={<button type="button">Add</button>}
      />,
    )

    expect(screen.getByRole('heading', { level: 2, name: /Fixed Asset Group/i })).toBeTruthy()
    expect(screen.getByText(/Manage FA groups/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Add' })).toBeTruthy()

    expect(container.firstChild?.className).toContain('grid')
    expect(container.innerHTML).toContain(PAGE_SECTION_HEADER_ACTIONS_CLASS.split(' ')[0])
  })
})
