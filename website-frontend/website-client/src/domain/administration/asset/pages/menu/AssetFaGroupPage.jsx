import { ActionConfirmProvider } from '@/shared/components/confirm'
import FaGroupScreen from '../FaGroupScreen'

export default function AssetFaGroupPage() {
  return (
    <ActionConfirmProvider>
      <FaGroupScreen />
    </ActionConfirmProvider>
  )
}
