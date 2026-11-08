import { useDashboardNav } from '@/app/shell/hooks/useDashboardNav'
import { resolveModule1PageComponent } from '../utils/module1PageResolver'

export default function Module1RouterPage() {
  const { activePrimaryId, activeSecondaryId } = useDashboardNav()
  const Page = resolveModule1PageComponent(activePrimaryId, activeSecondaryId)
  return <Page />
}
