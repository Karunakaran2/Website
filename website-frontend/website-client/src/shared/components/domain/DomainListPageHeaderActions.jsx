import DashboardPageHeaderActions from '@/app/shell/components/DashboardPageHeaderActions'
import { GIGW_ADD_ICON, GigwButton } from '@/shared/components/buttons/gigw'

/** List page header — GIGW primary Add (same as setup domain). */
export default function DomainListPageHeaderActions({ onAdd, label = 'Add' }) {
  if (!onAdd) {
    return null
  }

  return (
    <DashboardPageHeaderActions>
      <GigwButton type="button" variant="primary" icon={GIGW_ADD_ICON} onClick={onAdd}>
        {label}
      </GigwButton>
    </DashboardPageHeaderActions>
  )
}
