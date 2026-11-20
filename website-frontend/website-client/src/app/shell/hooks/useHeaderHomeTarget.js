import { ROUTES } from '@/shared/constants'
import { WEBSITE_AUTH_ENABLED } from '@/shared/config/websiteAuth'
import { getWebsiteCmsHomePath } from '@/domain/website-cms/utils/cmsHome'

/** Home icon target — CMS dashboard in module shell when website mode is on. */
export function useHeaderHomeTarget() {
  return WEBSITE_AUTH_ENABLED ? getWebsiteCmsHomePath() : ROUTES.HOME
}