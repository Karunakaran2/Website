import { useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  canonicalizeModulePathname,
  getModuleRoute,
  parseModulePath,
} from '@/shared/constants/moduleRoutes'
import { resolveDashboardNavIds } from '../constants/dashboard'
import { ensureSetupReturnRouteForSetupEntry } from '../utils/setupReturnNav'
import { setDashboardNav } from '../redux/slice'

/**
 * Hydrate Redux from the URL before paint (refresh) and when the URL actually changes
 * (back/forward). Canonicalizes to module routes without /dashboard or accountId.
 */
export function useDashboardRouteSync() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  useLayoutEffect(() => {
    ensureSetupReturnRouteForSetupEntry(location.pathname)

    const legacyCanonical = canonicalizeModulePathname(location.pathname)
    if (legacyCanonical && legacyCanonical !== location.pathname) {
      navigate(
        `${legacyCanonical}${location.search || ''}${location.hash || ''}`,
        { replace: true, flushSync: true },
      )
      return
    }

    const parsed = parseModulePath(location.pathname)
    if (!parsed?.primaryTab) {
      return
    }

    const { primaryId, secondaryId } = resolveDashboardNavIds(parsed.primaryTab, parsed.secondaryTab)
    dispatch(setDashboardNav({ primaryId, secondaryId }))

    const target = getModuleRoute(primaryId, secondaryId)
    const targetWithSearch = `${target}${location.search || ''}${location.hash || ''}`
    if (location.pathname !== target) {
      navigate(targetWithSearch, { replace: true, flushSync: true })
    }
  }, [location.pathname, location.search, location.hash, dispatch, navigate])
}
