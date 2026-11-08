import { lazyPage as page } from '@/app/routes/lazyPage'

export const dashboardPages = {
  'dashboard:history': page(() => import('../pages/menu/DashboardHistoryPage')),
  'dashboard:my-requests': page(() => import('../pages/menu/DashboardMyRequestsPage')),
  'dashboard:overview': page(() => import('../pages/menu/DashboardOverviewPage')),
  'dashboard:pending-actions': page(() => import('../pages/menu/DashboardPendingActionsPage')),
}
