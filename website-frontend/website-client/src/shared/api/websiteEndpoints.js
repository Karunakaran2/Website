import { AUTH_ENDPOINTS, CAPTCHA_ENDPOINTS } from '@/domain/auth/constants/endpoints'
import { CONTENT_ENDPOINTS } from '@/domain/website-content/constants/endpoints'
import { CATALOG_ENDPOINTS } from '@/domain/website-catalog/constants/endpoints'
import { CAREERS_ENDPOINTS } from '@/domain/website-careers/constants/endpoints'
import { ENGAGEMENT_ENDPOINTS } from '@/domain/website-engagement/constants/endpoints'
import { MEDIA_ENDPOINTS } from '@/domain/website-media/constants/endpoints'
import { NOTIFICATION_ENDPOINTS } from '@/domain/website-notification/constants/endpoints'

/** Aggregated gateway paths — prefer per-service `constants/endpoints.js`. */
export const WEBSITE_API = {
  auth: AUTH_ENDPOINTS,
  captcha: CAPTCHA_ENDPOINTS,
  content: CONTENT_ENDPOINTS,
  catalog: CATALOG_ENDPOINTS,
  careers: CAREERS_ENDPOINTS,
  engagement: ENGAGEMENT_ENDPOINTS,
  media: MEDIA_ENDPOINTS,
  notifications: NOTIFICATION_ENDPOINTS,
}

export { ALL_WEBSITE_API_OPERATIONS } from '@/domain/website/constants/allApiOperations'