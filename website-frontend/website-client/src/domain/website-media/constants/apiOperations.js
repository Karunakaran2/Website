import { MEDIA_ENDPOINTS } from './endpoints'

export const MEDIA_API_OPERATIONS = [
  { hook: 'useListMediaQuery', method: 'GET', path: MEDIA_ENDPOINTS.base, auth: true },
  { hook: 'useGetMediaByIdQuery', method: 'GET', path: `${MEDIA_ENDPOINTS.base}/:id`, auth: true },
]