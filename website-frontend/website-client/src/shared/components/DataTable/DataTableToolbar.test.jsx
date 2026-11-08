/** @vitest-environment happy-dom */
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import DataTableToolbar from './DataTableToolbar'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key, opts) => opts?.defaultValue ?? _key,
  }),
}))

describe('DataTableToolbar', () => {
  it('uses page-size wrapper wide enough for three-digit values', () => {
    const { container } = render(
      <DataTableToolbar pageSize={100} onPageSizeChange={() => {}} hideSearch />,
    )
    expect(screen.getByText('Show')).toBeTruthy()
    expect(screen.getByText('entries per page')).toBeTruthy()
    expect(container.innerHTML).toContain('min-w-[5.5rem]')
    expect(container.innerHTML).toContain('w-[5.5rem]')
  })
})
