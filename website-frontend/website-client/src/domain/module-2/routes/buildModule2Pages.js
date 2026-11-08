import { lazyPage as page } from '@/app/routes/lazyPage'
import { MODULE_2_SECONDARY_NAV_BY_PRIMARY, LEGACY_MODULE_2_PRIMARY_IDS } from '../constants/module2Nav'

const module2Router = page(() => import('../pages/Module2RouterPage'))

function buildModule2PrimaryPages() {
  const pages = {}
  for (const [primaryId, tabs] of Object.entries(MODULE_2_SECONDARY_NAV_BY_PRIMARY)) {
    for (const tab of tabs) {
      pages[`${primaryId}:${tab.id}`] = module2Router
    }
  }
  return pages
}

function buildLegacyModule2Pages() {
  const pages = {}
  const loader = page(() => import('../pages/Module2RouterPage'))
  for (const primaryId of LEGACY_MODULE_2_PRIMARY_IDS) {
    pages[`${primaryId}:overview`] = loader
  }
  return pages
}

export function buildModule2Pages() {
  return {
    ...buildModule2PrimaryPages(),
    ...buildLegacyModule2Pages(),
  }
}
