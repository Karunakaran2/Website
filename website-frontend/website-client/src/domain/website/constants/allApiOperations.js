import { AUTH_API_OPERATIONS } from '@/domain/auth/constants/apiOperations'
import { CONTENT_API_OPERATIONS } from '@/domain/website-content/constants/apiOperations'
import { CATALOG_API_OPERATIONS } from '@/domain/website-catalog/constants/apiOperations'
import { CAREERS_API_OPERATIONS } from '@/domain/website-careers/constants/apiOperations'
import { ENGAGEMENT_API_OPERATIONS } from '@/domain/website-engagement/constants/apiOperations'
import { MEDIA_API_OPERATIONS } from '@/domain/website-media/constants/apiOperations'
import { NOTIFICATION_API_OPERATIONS } from '@/domain/website-notification/constants/apiOperations'

/** Full frontend RTK surface aligned to website-backend microservices. */
export const ALL_WEBSITE_API_OPERATIONS = [
  ...AUTH_API_OPERATIONS,
  ...CONTENT_API_OPERATIONS,
  ...CATALOG_API_OPERATIONS,
  ...CAREERS_API_OPERATIONS,
  ...ENGAGEMENT_API_OPERATIONS,
  ...MEDIA_API_OPERATIONS,
  ...NOTIFICATION_API_OPERATIONS,
]