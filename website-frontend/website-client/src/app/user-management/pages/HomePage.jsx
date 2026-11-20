import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import AccountSelectionLayout from '@/app/user-management/layouts/AccountSelectionLayout'
import { syncSetupReturnRouteForPathname } from '@/app/shell/utils/setupReturnNav'
import { HomeContentSkeleton } from '@/shared/components'
import { ROUTES } from '@/shared/constants'
import { WEBSITE_AUTH_ENABLED } from '@/shared/config/websiteAuth'
import { getWebsiteCmsHomePath } from '@/domain/website-cms/utils/cmsHome'
import KranDesignSystemLanding from '../components/KranDesignSystemLanding'
import { useHomePage } from '../hooks/useHomePage'

export default function HomePage() {
  const { isLoading } = useHomePage()

  useEffect(() => {
    syncSetupReturnRouteForPathname(ROUTES.HOME)
  }, [])

  if (WEBSITE_AUTH_ENABLED) {
    return <Navigate to={getWebsiteCmsHomePath()} replace />
  }

  return (
    <AccountSelectionLayout>
      {isLoading ? <HomeContentSkeleton /> : <KranDesignSystemLanding />}
    </AccountSelectionLayout>
  )
}