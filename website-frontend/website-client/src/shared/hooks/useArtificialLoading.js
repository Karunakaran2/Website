import { useEffect, useState } from 'react'

const DEFAULT_LOADING_MS = 700

/**
 * Shared artificial loading delay used by page shells until real data fetching lands.
 */
export function useArtificialLoading(durationMs = DEFAULT_LOADING_MS) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), durationMs)
    return () => window.clearTimeout(timer)
  }, [durationMs])

  return { isLoading }
}
