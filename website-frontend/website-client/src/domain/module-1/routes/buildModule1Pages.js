import { lazyPage as page } from '@/app/routes/lazyPage'
import { MODULE_1_SECONDARY_NAV_BY_PRIMARY, LEGACY_MODULE_1_PRIMARY_IDS } from '../constants/module1Nav'

const module1Router = page(() => import('../pages/Module1RouterPage'))

function buildModule1PrimaryPages() {
  const pages = {}
  for (const [primaryId, tabs] of Object.entries(MODULE_1_SECONDARY_NAV_BY_PRIMARY)) {
    for (const tab of tabs) {
      pages[`${primaryId}:${tab.id}`] = module1Router
    }
  }
  return pages
}

/** Legacy registry keys (single overview tab) for bookmarks. */
function buildLegacyModule1Pages() {
  const legacy = {}
  const legacyLoader = page(() => import('../pages/Module1RouterPage'))
  for (const primaryId of LEGACY_MODULE_1_PRIMARY_IDS) {
    legacy[`${primaryId}:overview`] = legacyLoader
  }
  return legacy
}

export function buildModule1Pages() {
  return {
    ...buildModule1PrimaryPages(),
    ...buildLegacyModule1Pages(),
  }
}
