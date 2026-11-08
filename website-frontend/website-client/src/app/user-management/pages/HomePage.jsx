import { useEffect } from 'react'
import AccountSelectionLayout from '@/app/user-management/layouts/AccountSelectionLayout'
import { syncSetupReturnRouteForPathname } from '@/app/shell/utils/setupReturnNav'
import { HomeContentSkeleton } from '@/shared/components'
import { ROUTES } from '@/shared/constants'
import KranDesignSystemLanding from '../components/KranDesignSystemLanding'
import { useHomePage } from '../hooks/useHomePage'

export default function HomePage() {
  const { isLoading } = useHomePage()

  useEffect(() => {
    syncSetupReturnRouteForPathname(ROUTES.HOME)
  }, [])

  return (
    <AccountSelectionLayout>
      {isLoading ? <HomeContentSkeleton /> : <KranDesignSystemLanding />}
    </AccountSelectionLayout>
  )
}
