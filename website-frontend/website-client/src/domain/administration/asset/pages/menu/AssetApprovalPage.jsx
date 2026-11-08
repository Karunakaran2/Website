import { ActionConfirmProvider } from '@/shared/components/confirm'
import AssetApprovalScreen from '../AssetApprovalScreen'

export default function AssetApprovalPage() {
  return (
    <ActionConfirmProvider>
      <AssetApprovalScreen />
    </ActionConfirmProvider>
  )
}
