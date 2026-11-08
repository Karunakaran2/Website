/** @vitest-environment happy-dom */
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import SkeletonBlock from './SkeletonBlock'

describe('SkeletonBlock', () => {
  it('applies reduced-motion safe pulse classes', () => {
    const { container } = render(<SkeletonBlock className="h-4 w-8" />)
    const el = container.firstChild
    expect(el.className).toMatch(/motion-safe:animate-pulse/)
    expect(el.className).toMatch(/motion-reduce:animate-none/)
  })

  it('can disable animation', () => {
    const { container } = render(<SkeletonBlock animate={false} />)
    expect(container.firstChild.className).not.toMatch(/motion-safe:animate-pulse/)
  })
})
