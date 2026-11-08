import { useLayoutEffect, useRef, useState } from 'react'

/** Matches spfo_frontend ModuleNavBar overflow measurement. */
export function useNavbarOverflow(menus) {
  const [visibleCount, setVisibleCount] = useState(menus.length)
  const containerRef = useRef(null)
  const measureRef = useRef(null)

  useLayoutEffect(() => {
    if (!containerRef.current || !measureRef.current) return

    const handleResize = () => {
      if (!containerRef.current || !measureRef.current) return

      if (menus.length === 0) {
        setVisibleCount(0)
        return
      }

      const containerWidth = containerRef.current.getBoundingClientRect().width
      const children = measureRef.current.children
      if (!children?.length) return

      const moreBtnWidth = 90
      let currentWidth = 0
      let fitCount = 0

      for (let i = 0; i < children.length; i++) {
        const itemWidth = children[i].getBoundingClientRect().width + 8
        if (currentWidth + itemWidth > containerWidth) break
        currentWidth += itemWidth
        fitCount++
      }

      if (fitCount < menus.length) {
        currentWidth = 0
        fitCount = 0
        for (let i = 0; i < children.length; i++) {
          const itemWidth = children[i].getBoundingClientRect().width + 8
          if (currentWidth + itemWidth + moreBtnWidth > containerWidth) break
          currentWidth += itemWidth
          fitCount++
        }
      }

      if (fitCount === 0 && menus.length > 0) fitCount = 1
      setVisibleCount(fitCount)
    }

    handleResize()

    const timeoutId = setTimeout(handleResize, 50)
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(containerRef.current)
    resizeObserver.observe(measureRef.current)

    const html = document.documentElement
    const mutationObserver = new MutationObserver(handleResize)
    mutationObserver.observe(html, {
      attributes: true,
      attributeFilter: ['data-font-size', 'class', 'style', 'lang'],
    })

    const fontsReady = document.fonts?.ready
    if (fontsReady) {
      fontsReady.then(handleResize).catch(() => {})
    }

    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timeoutId)
      resizeObserver.disconnect()
      mutationObserver.disconnect()
      window.removeEventListener('resize', handleResize)
    }
  }, [menus])

  return { visibleCount, containerRef, measureRef }
}
