import { ActionConfirmProvider } from '@/shared/components/confirm'
import AssetMaintenanceScreen from '../AssetMaintenanceScreen'

export default function AssetMaintenancePage() {
  return (
    <ActionConfirmProvider>
      <AssetMaintenanceScreen />
    </ActionConfirmProvider>
  )
}
