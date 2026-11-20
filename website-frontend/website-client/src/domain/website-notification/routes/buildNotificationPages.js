import { lazyPage as page } from '@/app/routes/lazyPage'
import { NOTIFICATION_SECONDARY_NAV, WEBSITE_NOTIFICATION_PRIMARY_ID } from '../constants/notificationNav'

const overview = page(() => import('../pages/NotificationServiceOverviewPage'))

export function buildNotificationServicePages() {
  const pages = {}
  for (const tab of NOTIFICATION_SECONDARY_NAV) {
    pages[`${WEBSITE_NOTIFICATION_PRIMARY_ID}:${tab.id}`] = overview
  }
  return pages
}