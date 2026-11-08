const DEFAULT_LOAD_ERROR =
  'Unable to load approval inbox. Check API gateway routing and that asset-service is running.'

export function assetApprovalWorkflowLoadErrorMessage(error) {
  if (!error) {
    return DEFAULT_LOAD_ERROR
  }
  const status = error?.status ?? error?.originalStatus
  if (status === 404) {
    return 'Unable to load approval inbox. The asset-approval API was not found (404). Ensure api-gateway routes /api/v1/asset-approval/** to asset-service and restart the gateway.'
  }
  if (typeof error?.data?.message === 'string' && error.data.message.trim()) {
    return error.data.message
  }
  return DEFAULT_LOAD_ERROR
}
