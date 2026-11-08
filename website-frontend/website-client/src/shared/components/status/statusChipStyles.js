import { gigwStatusBadgeClass } from './gigwStatusBadgeStyles'

/** Status chips — GIGW .seepz-btn-status styling. */
export function statusChipClass(status, extraClass = '') {
  return gigwStatusBadgeClass(status, extraClass)
}
