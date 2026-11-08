import { useEffect, useRef, useState } from 'react'

/**
 * Observe DataTable container width (ResizeObserver) with small threshold to limit re-renders.
 */
export function useDataTableContainerWidth(active = true) {
  const containerRef = useRef(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!active) return undefined
    const element = containerRef.current
    if (!element || typeof ResizeObserver === 'undefined') return undefined

    const measure = () => {
      const rect = element.getBoundingClientRect()
      const styles = typeof getComputedStyle === 'function' ? getComputedStyle(element) : null
      const padX = styles
        ? (parseFloat(styles.paddingLeft) || 0) + (parseFloat(styles.paddingRight) || 0)
        : 0
      return Math.max(0, Math.round(rect.width - padX))
    }

    let frame = 0
    const observer = new ResizeObserver(() => {
      const next = measure()
      if (frame) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        setWidth((prev) => (Math.abs(prev - next) >= 2 ? next : prev))
      })
    })

    observer.observe(element)
    setWidth(measure())

    return () => {
      if (frame) cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [active])

  return { containerRef, containerWidth: width }
}
