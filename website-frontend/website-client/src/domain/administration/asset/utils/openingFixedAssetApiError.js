/** Validation / API errors from opening fixed asset upload. */
export function formatOpeningFixedAssetError(error) {
  const fieldErrors = error?.data?.fieldErrors ?? error?.payload?.fieldErrors
  if (fieldErrors && typeof fieldErrors === 'object') {
    const messages = Object.values(fieldErrors).filter(
      (value) => typeof value === 'string' && value.trim(),
    )
    if (messages.length > 0) {
      return messages.join(' ')
    }
  }

  if (typeof error?.data === 'string' && error.data.trim()) {
    return error.data
  }

  return error?.data?.message || error?.message || 'Upload failed.'
}
