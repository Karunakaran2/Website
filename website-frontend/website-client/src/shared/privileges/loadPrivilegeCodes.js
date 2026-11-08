import { requestJson } from '@/shared/api/client'
import {
  clearSessionPrivileges,
  saveSessionPrivileges,
} from '@/shared/privileges/privilegeSession'
import {
  resetPrivilages,
  setPrivilages,
} from '@/shared/redux/slices/privilages/privilagesSlice'

/**
 * Unmapped screens stay open. Gating runs after a privilegeCodes array is returned,
 * including an empty list (that seat has no grants).
 * A missing field or a failed lookup leaves the current UI unchanged.
 * PAY_AUTH (Authorize Payment) has no matching control in this client.
 */
export function privilegeCodesFromPayload(payload) {
  if (Array.isArray(payload?.privilegeCodes)) return payload.privilegeCodes
  if (Array.isArray(payload?.privileges)) return payload.privileges
  if (Array.isArray(payload?.user?.privilegeCodes)) return payload.user.privilegeCodes
  if (Array.isArray(payload?.user?.privileges)) return payload.user.privileges
  return null
}

export function clearPrivilegeGrants(dispatch) {
  clearSessionPrivileges()
  dispatch(resetPrivilages())
}

export function applyPrivilegeCodesFromPayload(dispatch, payload) {
  const codes = privilegeCodesFromPayload(payload)
  if (!Array.isArray(codes)) return false
  dispatch(setPrivilages(saveSessionPrivileges(codes)))
  return true
}

export async function refreshConnectedModulePrivileges(dispatch) {
  const result = await requestJson('/api/v1/seat-context/getConnectedModuleLogin', {
    expireSession: false,
  })
  if (result.error) return false
  return applyPrivilegeCodesFromPayload(dispatch, result.data)
}
