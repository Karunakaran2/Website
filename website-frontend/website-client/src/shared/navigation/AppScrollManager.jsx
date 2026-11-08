import { useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import {
  loadScrollPositionForLocation,
  readAppScrollTop,
  restoreAppScrollTop,
  saveScrollPositionForLocation,
  scrollAppContainerToTop,
} from './appScrollContainer'

function routeScrollSignature(location) {
  return `${location.pathname}${location.search}`
}

/**
 * Resets the module main scroll container on route changes (not on hash-only updates).
 * Browser back/forward (POP) restores the previous scroll position when available.
 */
export default function AppScrollManager() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const previousKeyRef = useRef(location.key)
  const previousSignatureRef = useRef(routeScrollSignature(location))

  useLayoutEffect(() => {
    const signature = routeScrollSignature(location)
    const signatureChanged = signature !== previousSignatureRef.current
    const locationKeyChanged = location.key !== previousKeyRef.current

    if (!signatureChanged && !locationKeyChanged) {
      return
    }

    if (navigationType === 'POP') {
      const saved = loadScrollPositionForLocation(location.key)
      if (saved != null) {
        restoreAppScrollTop(saved, { behavior: 'auto' })
      } else {
        scrollAppContainerToTop({ behavior: 'auto' })
      }
    } else {
      scrollAppContainerToTop({ behavior: 'auto' })
    }

    previousKeyRef.current = location.key
    previousSignatureRef.current = signature
  }, [location, navigationType])

  useLayoutEffect(() => {
    const leavingKey = previousKeyRef.current
    return () => {
      if (leavingKey) {
        saveScrollPositionForLocation(leavingKey, readAppScrollTop())
      }
    }
  }, [location.key])

  return null
}
