import { apiErrorMessage, apiFieldErrors } from '@/shared/api/apiError'

/** User-facing message for failed setup API calls (list/search). */
export function formatSetupLoadError(error) {
  if (!error) {
    return ''
  }

  const status = error.status
  const data = error.data

  if (status === 404) {
    return 'This setup API is not available on the server yet. Ensure api-gateway (8080) and master-setup-service are running and the endpoint is implemented.'
  }

  if (status === 401 || status === 403) {
    return 'Your session may have expired. Sign in again and retry.'
  }

  if (status === 502 || status === 503) {
    return 'The API gateway cannot reach master-setup-service. Check Eureka/service-registry and that the service is registered.'
  }

  if (status === 500) {
    return typeof data === 'string' && data.trim()
      ? data
      : 'Server error while loading setup data. Check master-setup-service logs and database connectivity.'
  }

  if (status === 0) {
    return 'Unable to reach the API. Start service-registry, api-gateway (8080), and master-setup-service (or set VITE_DEV_API_TARGET for direct access).'
  }

  return typeof data === 'string' && data.trim() ? data : 'Unable to load setup data.'
}

/** Field errors map from master-setup `ApiResponse` (400 validation / business rules). */
export function extractSetupFieldErrors(error) {
  return apiFieldErrors(error)
}

/** User-facing message for save/update/remove mutations (validation + generic API envelope). */
export function formatSetupMutationError(error, fallback = 'Unable to save details.') {
  if (!error) {
    return fallback
  }

  const message = apiErrorMessage(error, '')
  if (message) {
    return message
  }

  return formatSetupLoadError(error) || fallback
}
