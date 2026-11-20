/** Microservice ownership for KRAN Admin categories (matches website-backend Eureka ids). */
export const KRAN_ADMIN_SERVICE = {
  DASHBOARD: 'website-cms',
  AUTH: 'auth-service',
  CONTENT: 'content-service',
  CATALOG: 'catalog-service',
  MEDIA: 'media-service',
  CAREERS: 'careers-service',
  ENGAGEMENT: 'engagement-service',
  NOTIFICATION: 'notification-service',
}

/** Category ↔ service (documentation / future service cards). */
export const KRAN_ADMIN_CATEGORY_SERVICE = {
  'website-dashboard': KRAN_ADMIN_SERVICE.DASHBOARD,
  'website-engagement': KRAN_ADMIN_SERVICE.ENGAGEMENT,
  'website-content': KRAN_ADMIN_SERVICE.CONTENT,
  'website-catalog': KRAN_ADMIN_SERVICE.CATALOG,
  'website-media': KRAN_ADMIN_SERVICE.MEDIA,
  'website-careers': KRAN_ADMIN_SERVICE.CAREERS,
  'website-notification': KRAN_ADMIN_SERVICE.NOTIFICATION,
}