import { useRegisterDashboardPageHeaderActions } from '../context/DashboardPageHeaderActionsContext'

/** Renders nothing — registers `children` as page header actions (setup Add/Edit, etc.). */
export default function DashboardPageHeaderActions({ children }) {
  useRegisterDashboardPageHeaderActions(children)
  return null
}
