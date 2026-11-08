import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { parseModulePath } from '@/shared/constants/moduleRoutes'
import { resolveDashboardNavIds } from '../constants/dashboard'

/** Active module tab ids derived from the URL (source of truth per browser tab). */
export function useDashboardRouteIds() {
  const { pathname } = useLocation()

  return useMemo(() => {
    const parsed = parseModulePath(pathname)
    if (!parsed?.primaryTab) {
      return null
    }
    return resolveDashboardNavIds(parsed.primaryTab, parsed.secondaryTab)
  }, [pathname])
}
