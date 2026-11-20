import {
  clearSessionPrivileges,
  saveSessionPrivileges,
} from '@/shared/privileges/privilegeSession'
import {
  resetPrivilages,
  setPrivilages,
} from '@/shared/redux/slices/privilages/privilagesSlice'

/**
 * CMS website-backend does not expose seat-context privilege APIs.
 * Unmapped screens stay open until a privilege list is applied client-side.
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

export async function refreshConnectedModulePrivileges() {
  return false
}