import { parseModulePath } from '@/shared/constants/moduleRoutes'

/** Dashboard module → Overview uses widget skeletons, not list/table placeholders. */
export function isDashboardOverviewRoute(primaryId, secondaryId) {
  return primaryId === 'dashboard' && secondaryId === 'overview'
}

export function isDashboardOverviewPathname(pathname) {
  const parsed = parseModulePath(pathname)
  return parsed?.primaryTab === 'dashboard' && parsed?.secondaryTab === 'overview'
}
