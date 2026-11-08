import { useDashboardNav } from '@/app/shell/hooks/useDashboardNav'
import { resolveModule2PageComponent } from '../utils/module2PageResolver'

export default function Module2RouterPage() {
  const { activePrimaryId, activeSecondaryId } = useDashboardNav()
  const Page = resolveModule2PageComponent(activePrimaryId, activeSecondaryId)
  return <Page />
}
