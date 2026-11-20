/** content-service (8082) via gateway */
export const CONTENT_ENDPOINTS = {
  publicNews: '/api/v1/content/news',
  publicBanners: '/api/v1/content/banners',
  adminNews: '/api/v1/admin/news',
  adminNewsById: (id) => `/api/v1/admin/news/${encodeURIComponent(id)}`,
  adminBanners: '/api/v1/admin/banners',
  adminBannersById: (id) => `/api/v1/admin/banners/${encodeURIComponent(id)}`,
}