/** Outcome of an async action run inside {@link ActionConfirmProvider}. */
export function interpretActionResult(result) {
  if (result === false) {
    return { success: false, errorMessage: null }
  }
  if (result && typeof result === 'object' && result.ok === false) {
    return {
      success: false,
      errorMessage: typeof result.errorMessage === 'string' ? result.errorMessage : null,
    }
  }
  return { success: true }
}

export function confirmedActionFailure(errorMessage) {
  return { ok: false, errorMessage: errorMessage || null }
}

/**
 * Client-side validation failed — inline field errors are already set.
 * Return from `runAction` (or resolve submit handlers with this) to cancel without an error toast.
 */
export function clientValidationCancelled() {
  return false
}
