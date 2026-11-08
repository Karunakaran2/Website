import DashboardPageHeaderActions from '@/app/shell/components/DashboardPageHeaderActions'
import { GIGW_EDIT_ICON, GigwButton } from '@/shared/components/buttons/gigw'

/** Edit action on page header (e.g. company setup view mode). */
export default function SetupEditPageHeaderActions({ visible, onEdit, label = 'Edit' }) {
  if (!visible) {
    return null
  }

  return (
    <DashboardPageHeaderActions>
      <GigwButton type="button" variant="secondary" icon={GIGW_EDIT_ICON} onClick={onEdit}>
        {label}
      </GigwButton>
    </DashboardPageHeaderActions>
  )
}
