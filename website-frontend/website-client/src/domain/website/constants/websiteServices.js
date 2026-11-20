import { AUTH_SERVICE_META } from '@/domain/auth/constants/authServiceMeta'
import { CONTENT_SERVICE_META } from '@/domain/website-content/constants/contentServiceMeta'
import { CATALOG_SERVICE_META } from '@/domain/website-catalog/constants/catalogServiceMeta'
import { CAREERS_SERVICE_META } from '@/domain/website-careers/constants/careersServiceMeta'
import { ENGAGEMENT_SERVICE_META } from '@/domain/website-engagement/constants/engagementServiceMeta'
import { MEDIA_SERVICE_META } from '@/domain/website-media/constants/mediaServiceMeta'
import { NOTIFICATION_SERVICE_META } from '@/domain/website-notification/constants/notificationServiceMeta'

/** Registry mirroring Eureka service ids (see RUN_WORKSPACE.md). */
export const WEBSITE_SERVICES = [
  AUTH_SERVICE_META,
  CONTENT_SERVICE_META,
  CATALOG_SERVICE_META,
  MEDIA_SERVICE_META,
  CAREERS_SERVICE_META,
  ENGAGEMENT_SERVICE_META,
  NOTIFICATION_SERVICE_META,
]