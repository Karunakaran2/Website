import { ActionConfirmProvider } from '@/shared/components/confirm'
import AssetDepreciationScreen from '../AssetDepreciationScreen'

export default function AssetDepreciationPage() {
  return (
    <ActionConfirmProvider>
      <AssetDepreciationScreen />
    </ActionConfirmProvider>
  )
}
