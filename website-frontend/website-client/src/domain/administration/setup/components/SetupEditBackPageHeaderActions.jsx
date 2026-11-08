import DashboardPageHeaderActions from '@/app/shell/components/DashboardPageHeaderActions'
import { GigwButton } from '@/shared/components/buttons/gigw'

/** Back action on page header (e.g. company setup edit mode). */
export default function SetupEditBackPageHeaderActions({ visible, onBack, label = 'Back' }) {
  if (!visible) {
    return null
  }

  return (
    <DashboardPageHeaderActions>
      <GigwButton type="button" variant="outlineUtility" hideIcon onClick={onBack}>
        {label}
      </GigwButton>
    </DashboardPageHeaderActions>
  )
}
