import { lazyPage as page } from '@/app/routes/lazyPage'

export const setupPages = {
  'setup-dashboard:overview': page(() => import('../pages/SetupDashboardPage')),
  'setup-master-data:overview': page(() => import('../pages/MasterDataPage')),
}
