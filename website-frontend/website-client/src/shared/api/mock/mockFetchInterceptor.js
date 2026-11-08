/**
 * Global window.fetch Interceptor for Mock Mode
 * Intercepts any fetch calls to /api/ and responds with mock data.
 */
import { isMockEnabled } from './mockConfig'
import { handleMockRequest } from './mockRouter'

let isInterceptorInstalled = false

export function installMockFetchInterceptor() {
  if (isInterceptorInstalled || typeof window === 'undefined') {
    return
  }

  const originalFetch = window.fetch

  window.fetch = async function (input, init = {}) {
    const url = typeof input === 'string' ? input : input instanceof Request ? input.url : String(input)

    // Check if this is an API call
    if (isMockEnabled() && (url.includes('/api/') || url.startsWith('/api/'))) {
      try {
        let body = init?.body
        if (body instanceof FormData) {
          const formObj = {}
          body.forEach((val, key) => {
            formObj[key] = val
          })
          body = formObj
        }

        const mockRes = await handleMockRequest(url, { ...init, body })

        if (mockRes.blob) {
          return new Response(mockRes.blob, {
            status: mockRes.status || 200,
            headers: new Headers({
              'Content-Type': 'application/octet-stream',
              'Content-Disposition': 'attachment; filename="mock-download"',
            }),
          })
        }

        const jsonString = typeof mockRes.data === 'string' ? mockRes.data : JSON.stringify(mockRes.data ?? {})

        return new Response(jsonString, {
          status: mockRes.status || 200,
          statusText: mockRes.status === 200 ? 'OK' : 'Error',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
        })
      } catch (err) {
        console.error('[Mock API Error]:', err)
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: new Headers({ 'Content-Type': 'application/json' }),
        })
      }
    }

    return originalFetch.apply(this, arguments)
  }

  isInterceptorInstalled = true
  console.info('[Mock API] Interceptor successfully installed (no backend required).')
}
