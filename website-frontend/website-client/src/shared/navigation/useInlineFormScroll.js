import { useLayoutEffect, useRef } from 'react'
import {
  getAppScrollContainer,
  readAppScrollTop,
  restoreAppScrollTop,
  scrollAppContainerToTop,
} from './appScrollContainer'

/**
 * When an inline add/edit form opens, scroll the main container so the form is visible.
 * When it closes, restore the list scroll position from before the form opened.
 */
export default function useInlineFormScroll(formOpen, sectionRef) {
  const savedScrollRef = useRef(null)

  useLayoutEffect(() => {
    if (formOpen) {
      savedScrollRef.current = readAppScrollTop()
      scrollAppContainerToTop({ behavior: 'auto' })
      const section = sectionRef?.current
      if (section) {
        const main = getAppScrollContainer()
        if (main) {
          const mainTop = main.getBoundingClientRect().top
          const sectionTop = section.getBoundingClientRect().top
          const delta = sectionTop - mainTop
          if (delta > 4) {
            main.scrollTo({ top: main.scrollTop + delta, behavior: 'auto' })
          }
        } else {
          section.scrollIntoView({ block: 'start', behavior: 'auto' })
        }
      }
      return undefined
    }

    if (savedScrollRef.current != null) {
      restoreAppScrollTop(savedScrollRef.current, { behavior: 'auto' })
      savedScrollRef.current = null
    }
    return undefined
  }, [formOpen, sectionRef])
}
