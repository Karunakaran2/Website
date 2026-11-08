import {
  isAdministrationPrimary,
  isDesignGuidelinesPrimary,
  isSampleModulePrimary,
  isWorkbenchPrimary,
  isWorkforcePrimary,
} from '../constants/dashboard'

/**
 * i18n key for the module name beside the host wordmark (Probity header pattern).
 * Returns null on Home / inbox where no module suffix is shown.
 */
export function resolveHeaderModulePortalLabel(primaryNavId) {
  if (!primaryNavId || primaryNavId === 'inbox') {
    return null
  }
  if (isSampleModulePrimary(primaryNavId)) {
    return 'common.moduleHeaderModule1'
  }
  if (isWorkforcePrimary(primaryNavId)) {
    return 'common.moduleHeaderModule2'
  }
  if (isDesignGuidelinesPrimary(primaryNavId)) {
    return 'common.moduleHeaderDesignGuidelines'
  }
  if (isWorkbenchPrimary(primaryNavId)) {
    return 'common.moduleHeaderWorkbench'
  }
  if (isAdministrationPrimary(primaryNavId)) {
    return 'common.moduleHeaderAdministration'
  }
  return null
}
