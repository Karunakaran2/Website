import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { resolveDashboardNavIds } from '@/app/shell/constants/dashboard'
import { resolveDashboardPageHeading } from '@/app/shell/hooks/useDashboardPageHeader'
import { parseModulePath, isModuleShellPathname } from '@/shared/constants'
import { ROUTES } from '@/shared/constants'
import { formatDocumentTitle } from '@/shared/utils/documentTitle'
import { WEBSITE_AUTH_ENABLED } from '@/shared/config/websiteAuth'

const STATIC_TITLE_KEYS = {
  [ROUTES.PUBLIC_HOME]: 'documentTitle.publicHome',
  [ROUTES.LOGIN]: 'documentTitle.login',
  [ROUTES.FORGOT_PASSWORD]: 'documentTitle.forgotPassword',
  [ROUTES.ONE_TIME_REGISTRATION]: 'documentTitle.oneTimeRegistration',
  [ROUTES.APPLICATION_TRACKING]: 'documentTitle.applicationTracking',
  [ROUTES.SEATS]: 'documentTitle.seats',
  [ROUTES.HOME]: 'accounts.title',
  [ROUTES.MY_PROFILE]: 'profile.title',
  [ROUTES.ACCESSIBILITY_STATEMENT]: 'header.accessibilityStatement',
  [ROUTES.SCREEN_READER_ACCESS]: 'header.screenReaderAccess',
}

function moduleScreenTitle(pathname, t) {
  const parsed = parseModulePath(pathname)
  const { primaryId, secondaryId } = resolveDashboardNavIds(parsed?.primaryTab, parsed?.secondaryTab)
  const heading = resolveDashboardPageHeading(t, primaryId, secondaryId)
  const moduleName = t(`nav.primary.${primaryId}`, { defaultValue: primaryId })
  return formatDocumentTitle(heading.title, moduleName)
}

export function resolveRouteDocumentTitle(pathname, t) {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === ROUTES.HOME && WEBSITE_AUTH_ENABLED) {
    return formatDocumentTitle(t('accounts.websiteHomeTitle'))
  }
  const staticKey = STATIC_TITLE_KEYS[path]
  if (staticKey) {
    return formatDocumentTitle(t(staticKey))
  }
  if (isModuleShellPathname(path)) {
    return moduleScreenTitle(path, t)
  }
  return formatDocumentTitle(t('documentTitle.login'))
}

/** Sets document.title from the route. The visible page heading stays the H1. */
export default function DocumentTitleSync() {
  const { pathname } = useLocation()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    document.title = resolveRouteDocumentTitle(pathname, t)
  }, [pathname, t, i18n.language])

  return null
}
