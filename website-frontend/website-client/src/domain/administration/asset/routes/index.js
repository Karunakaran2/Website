import { lazyPage as page } from '@/app/routes/lazyPage'

export const assetPages = {
  'asset:fa-group': page(() => import('../pages/menu/AssetFaGroupPage')),
  'asset:asset-information': page(() => import('../pages/menu/AssetInformationPage')),
  'asset:asset-approval': page(() => import('../pages/menu/AssetApprovalPage')),
  'asset:opening-fixed-assets': page(() => import('../pages/menu/AssetOpeningFixedAssetsPage')),
  'asset:asset-depreciation': page(() => import('../pages/menu/AssetDepreciationPage')),
  'asset:view-all-asset': page(() => import('../pages/menu/AssetViewAllPage')),
  'asset:assets-disposal': page(() => import('../pages/menu/AssetsDisposalPage')),
  'asset:assets-allocation': page(() => import('../pages/menu/AssetsAllocationPage')),
  'asset:asset-maintenance': page(() => import('../pages/menu/AssetMaintenancePage')),
  'asset-dashboard:overview': page(() => import('../pages/AssetDashboardPage')),
  'asset-register:overview': page(() => import('../pages/AssetRegisterPage')),
  'asset:overview': page(() => import('../pages/menu/AssetFaGroupPage')),
}

