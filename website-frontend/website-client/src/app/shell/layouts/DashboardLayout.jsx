import PrimaryNav from '@/app/shell/components/PrimaryNav'
import SecondaryNav from '@/app/shell/components/SecondaryNav'
import DashboardHeader from '@/shared/components/common/Header/DashboardHeader'
import MainLayout from '@/shared/layouts/MainLayout/MainLayout'
import { useDashboardRouteSync } from '../hooks/useDashboardRouteSync'
import DashboardModuleContentShell from './DashboardModuleContentShell'

export default function DashboardLayout({ children }) {
  useDashboardRouteSync()

  return (
    <MainLayout
      header={<DashboardHeader />}
      beforeMain={
        <div className="flex w-full shrink-0 flex-col transition-all duration-300">
          <PrimaryNav />
          <SecondaryNav />
        </div>
      }
    >
      <DashboardModuleContentShell>{children}</DashboardModuleContentShell>
    </MainLayout>
  )
}
