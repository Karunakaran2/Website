import { useLocation } from 'react-router-dom'
import { useDashboardNav } from '@/app/shell/hooks/useDashboardNav'
import { parseModulePath } from '@/shared/constants/moduleRoutes'

/**
 * Resolves the active secondary tab for module shell pages.
 * React Router does not expose primary/secondary segments on `/component-workbench/*` splat routes.
 */
export function useModuleSecondaryTab(fallback = 'overview') {
  const { activeSecondaryId } = useDashboardNav()
  const { pathname } = useLocation()
  const parsed = parseModulePath(pathname)
  return parsed?.secondaryTab || activeSecondaryId || fallback
}
