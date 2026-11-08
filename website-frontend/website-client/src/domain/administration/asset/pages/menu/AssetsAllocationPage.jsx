import { ActionConfirmProvider } from '@/shared/components/confirm'
import AssetAllocationScreen from '../AssetAllocationScreen'

export default function AssetsAllocationPage() {
  return (
    <ActionConfirmProvider>
      <AssetAllocationScreen />
    </ActionConfirmProvider>
  )
}
