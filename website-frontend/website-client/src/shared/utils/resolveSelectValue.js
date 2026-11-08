/**
 * FeaturedBasicSelect is inconsistent: keyboard selection passes the raw value,
 * while click selection passes a synthetic { target: { value } } event.
 */
export function resolveSelectValue(valueOrEvent) {
  if (valueOrEvent != null && typeof valueOrEvent === 'object') {
    if ('target' in valueOrEvent) {
      return valueOrEvent.target?.value ?? ''
    }
    if ('value' in valueOrEvent) {
      return valueOrEvent.value ?? ''
    }
  }

  return valueOrEvent ?? ''
}
