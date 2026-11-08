import { ActionConfirmProvider } from '@/shared/components/confirm'
import OpeningFixedAssetScreen from '../OpeningFixedAssetScreen'

export default function AssetOpeningFixedAssetsPage() {
  return (
    <ActionConfirmProvider>
      <OpeningFixedAssetScreen />
    </ActionConfirmProvider>
  )
}
