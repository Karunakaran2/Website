import { PageSectionHeaderBar } from '@/shared/components/page'
import ModuleContentShell from '@/shared/layouts/ModuleContentShell'
import ModulePageContent from '@/shared/layouts/ModulePageContent'
import {
  DashboardPageHeaderActionsProvider,
  useDashboardPageHeaderActionsState,
} from '../context/DashboardPageHeaderActionsContext'
import { useDashboardPageHeader } from '../hooks/useDashboardPageHeader'

function DashboardModuleContentShellInner({ children, hidePageHeader = false }) {
  const { title, subtitle } = useDashboardPageHeader()
  const { actions } = useDashboardPageHeaderActionsState()
  const suppressHeader = hidePageHeader || !title

  return (
    <ModuleContentShell
      header={
        suppressHeader ? null : (
          <PageSectionHeaderBar title={title} subtitle={subtitle} actions={actions} />
        )
      }
    >
      <ModulePageContent>{children}</ModulePageContent>
    </ModuleContentShell>
  )
}

export default function DashboardModuleContentShell({ children, hidePageHeader = false }) {
  return (
    <DashboardPageHeaderActionsProvider>
      <DashboardModuleContentShellInner hidePageHeader={hidePageHeader}>
        {children}
      </DashboardModuleContentShellInner>
    </DashboardPageHeaderActionsProvider>
  )
}
