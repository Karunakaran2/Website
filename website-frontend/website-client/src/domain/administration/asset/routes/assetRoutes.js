import { lazyPage as page } from '@/app/routes/lazyPage'

export const assetPages = {
  'asset-dashboard:overview': page(() => import('../pages/AssetDashboardPage')),
  'asset-register:overview': page(() => import('../pages/AssetRegisterPage')),
}
