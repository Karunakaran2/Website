/** media-service (8084) — gateway `/api/v1/media/**` */
export const MEDIA_ENDPOINTS = {
  base: '/api/v1/media',
  upload: '/api/v1/media/upload',
  byId: (id) => `/api/v1/media/${encodeURIComponent(id)}`,
}