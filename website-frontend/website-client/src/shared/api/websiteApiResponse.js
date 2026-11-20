import { apiPayloadMessage } from '@/shared/api/apiError'

/** Unwrap website microservice `ApiResponse` envelopes from `requestJson`. */
export function normalizeWebsiteJson(result, fallbackMessage = 'Request failed') {
  if (result.error) {
    const payload = result.error.payload
    if (
      payload &&
      typeof payload === 'object' &&
      payload.data &&
      typeof payload.data === 'object' &&
      !Array.isArray(payload.data)
    ) {
      return {
        error: {
          ...result.error,
          payload,
          data: { ...payload.data, message: apiPayloadMessage(payload, fallbackMessage) },
        },
      }
    }
    return result
  }

  const payload = result.data
  if (payload && typeof payload === 'object' && 'success' in payload) {
    if (payload.success === false) {
      return {
        error: {
          status: 400,
          data: apiPayloadMessage(payload, fallbackMessage),
          payload,
        },
      }
    }
    if ('data' in payload) {
      return { data: payload.data }
    }
  }

  return result
}