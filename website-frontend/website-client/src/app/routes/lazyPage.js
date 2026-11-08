import { createElement, lazy, useEffect, useState } from 'react'

const refreshers = new Set()
const retryListeners = new Set()

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function loadWithRetry(loader) {
  return loader().catch((error) =>
    wait(300).then(() => loader()).catch(() => {
      throw error
    }),
  )
}

/** Replace every cached page loader, then ask mounted pages to render the new one. */
export function retryLazyPages() {
  refreshers.forEach((refresh) => refresh())
  retryListeners.forEach((listener) => listener())
}

export function lazyPage(loader) {
  let Page = lazy(() => loadWithRetry(loader))

  refreshers.add(() => {
    Page = lazy(() => loadWithRetry(loader))
  })

  function RetryableLazyPage(props) {
    const [, setTick] = useState(0)

    useEffect(() => {
      const listener = () => setTick((tick) => tick + 1)
      retryListeners.add(listener)
      return () => retryListeners.delete(listener)
    }, [])

    return createElement(Page, props)
  }

  return RetryableLazyPage
}
