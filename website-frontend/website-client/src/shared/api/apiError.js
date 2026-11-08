/** Field map from gateway / RTK error envelopes. */
export function apiFieldErrors(error) {
  if (!error || typeof error !== 'object') {
    return {}
  }
  const payload = error.payload && typeof error.payload === 'object' ? error.payload : null
  if (payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    return payload.data
  }
  if (error.data && typeof error.data === 'object' && !Array.isArray(error.data)) {
    return error.data
  }
  return {}
}

/** Message from a raw HTTP JSON body (before RTK wraps it). */
export function apiPayloadMessage(payload, fallback = 'Request failed') {
  if (payload && typeof payload === 'object' && typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message
  }
  if (typeof payload === 'string' && payload.trim()) {
    return payload
  }
  return fallback
}

/**
 * User-facing message from an RTK / fetch error.
 * Prefer field messages, then envelope `data` / `payload.message`.
 */
export function apiErrorMessage(error, fallback = 'Request failed') {
  if (!error) {
    return ''
  }

  const fieldMessages = Object.values(apiFieldErrors(error)).filter(
    (value) => typeof value === 'string' && value.trim(),
  )
  if (fieldMessages.length) {
    return fieldMessages.join(' ')
  }

  if (typeof error.data === 'string' && error.data.trim()) {
    return error.data
  }
  if (error.data && typeof error.data.message === 'string' && error.data.message.trim()) {
    return error.data.message
  }
  if (error.payload && typeof error.payload.message === 'string' && error.payload.message.trim()) {
    return error.payload.message
  }
  if (typeof error.message === 'string' && error.message.trim() && error.message !== 'Rejected') {
    return error.message
  }

  return fallback
}
