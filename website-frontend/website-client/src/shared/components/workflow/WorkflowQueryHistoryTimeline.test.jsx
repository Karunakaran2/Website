/** @vitest-environment happy-dom */
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import WorkflowQueryHistoryTimeline from './WorkflowQueryHistoryTimeline'

describe('WorkflowQueryHistoryTimeline', () => {
  it('shows empty state when no queries', () => {
    render(<WorkflowQueryHistoryTimeline queries={[]} />)
    expect(screen.getByText(/No queries raised yet/i)).toBeInTheDocument()
  })

  it('lists saved query text in chronological order', () => {
    render(
      <WorkflowQueryHistoryTimeline
        queries={[
          { id: '2', text: 'Second', raisedOn: '2026-10-02' },
          { id: '1', text: 'First', raisedOn: '2026-10-01' },
        ]}
      />,
    )
    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('First')
    expect(items[1]).toHaveTextContent('Second')
  })
})
