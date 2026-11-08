import { ActionConfirmProvider } from '@/shared/components/confirm'
import AssetInformationScreen from '../AssetInformationScreen'

export default function AssetInformationPage() {
  return (
    <ActionConfirmProvider>
      <AssetInformationScreen />
    </ActionConfirmProvider>
  )
}
