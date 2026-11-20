import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { WEBSITE_AUTH_ENABLED } from '@/shared/config/websiteAuth'
import { getSessionPrivileges } from '@/shared/privileges/privilegeSession'
import { grantsAreEnforced, hasPrivilege, isRequirementAllowed } from '@/shared/privileges/probityPrivileges'

export function useWebsiteAccess() {
  const reduxGrants = useSelector((state) => state.privilages?.codes)
  const authUser = useSelector((state) => state.auth?.user)
  const systemAdmin = Boolean(
    authUser?.systemAdmin || authUser?.roleCode === 'SYSTEM_ADMIN',
  )

  const grants = useMemo(() => {
    if (!WEBSITE_AUTH_ENABLED) {
      return null
    }
    if (Array.isArray(reduxGrants)) {
      return reduxGrants
    }
    const sessionCodes = getSessionPrivileges()
    return sessionCodes.length > 0 ? sessionCodes : null
  }, [reduxGrants])

  const enforced = grantsAreEnforced(grants)

  const can = useCallback(
    (code) => {
      if (systemAdmin) {
        return true
      }
      return isRequirementAllowed(grants, code)
    },
    [grants, systemAdmin],
  )

  const canAny = useCallback(
    (codes) => {
      if (systemAdmin) {
        return true
      }
      if (!Array.isArray(codes)) {
        return can(codes)
      }
      return codes.some((code) => hasPrivilege(grants, code))
    },
    [can, grants, systemAdmin],
  )

  return { grants, enforced, systemAdmin: Boolean(systemAdmin), can, canAny }
}