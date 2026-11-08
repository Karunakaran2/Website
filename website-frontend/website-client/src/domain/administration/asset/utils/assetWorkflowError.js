export function extractAssetWorkflowError(error) {
  const fieldErrors =
    error?.data?.fieldErrors
    ?? error?.payload?.fieldErrors
    ?? (error?.payload && typeof error.payload === 'object' ? error.payload.fieldErrors : null)
  if (fieldErrors && typeof fieldErrors === 'object') {
    const values = Object.values(fieldErrors).filter(Boolean)
    if (values.length > 0) {
      return String(values[0])
    }
  }
  if (typeof error?.data === 'string' && error.data.trim()) {
    return error.data.trim()
  }
  const payload = error?.data
  if (payload && typeof payload === 'object' && typeof payload.message === 'string') {
    return payload.message
  }
  return error?.message ?? null
}
