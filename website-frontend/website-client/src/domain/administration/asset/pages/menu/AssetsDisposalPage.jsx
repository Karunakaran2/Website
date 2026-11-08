import { ActionConfirmProvider } from '@/shared/components/confirm'
import AssetRetirementScreen from '../AssetRetirementScreen'

export default function AssetsDisposalPage() {
  return (
    <ActionConfirmProvider>
      <AssetRetirementScreen />
    </ActionConfirmProvider>
  )
}
