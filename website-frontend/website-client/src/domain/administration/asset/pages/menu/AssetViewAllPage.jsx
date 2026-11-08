import { ActionConfirmProvider } from '@/shared/components/confirm'
import AssetViewAllScreen from '../AssetViewAllScreen'

export default function AssetViewAllPage() {
  return (
    <ActionConfirmProvider>
      <AssetViewAllScreen />
    </ActionConfirmProvider>
  )
}
