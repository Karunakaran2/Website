import { useMemo } from 'react'

/**
 * Probity privileges hook for Design System.
 * In standalone/mock mode, all features and actions are fully permitted.
 */
export function usePrivileges() {
  return useMemo(
    () => ({
      privileges: [],
      enforced: false,
      grants: null,
      hasPrivilege: () => true,
      canAccess: () => true,
    }),
    [],
  )
}

export default usePrivileges
