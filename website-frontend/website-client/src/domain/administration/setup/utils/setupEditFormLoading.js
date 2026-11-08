/** True while edit modal waits for get-by-id (show skeleton, not empty form). */
export function isSetupEditFormLoading({ editingId, isFetching, data, error }) {
  if (!editingId) {
    return false
  }
  if (error) {
    return false
  }
  return Boolean(isFetching) || !data
}

/** True while a details modal waits for get-by-id (e.g. GST details link). */
export function isSetupDetailsLoading({ openId, isFetching, data, error }) {
  if (!openId) {
    return false
  }
  if (error) {
    return false
  }
  return Boolean(isFetching) || !data
}
