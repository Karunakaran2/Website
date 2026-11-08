import AccountHeader from '@/shared/components/common/Header/AccountHeader'
import { HOME_LANDING_MAIN_CLASS } from '@/app/shell/constants/homeDashboard'
import MainLayout from '@/shared/layouts/MainLayout/MainLayout'
import ModulePageContent from '@/shared/layouts/ModulePageContent'

/** Home landing — full-height Inbox + Modules panels (no outer page card). */
export default function AccountSelectionLayout({ children }) {
  return (
    <MainLayout header={<AccountHeader />} beforeMain={null} mainClassName={HOME_LANDING_MAIN_CLASS}>
      <ModulePageContent className="min-h-0 flex-1 gap-0">{children}</ModulePageContent>
    </MainLayout>
  )
}
