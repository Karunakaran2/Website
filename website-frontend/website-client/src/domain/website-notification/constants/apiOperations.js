import { NOTIFICATION_ENDPOINTS } from './endpoints'

export const NOTIFICATION_API_OPERATIONS = [
  {
    hook: 'useListNotificationsQuery',
    method: 'GET',
    path: NOTIFICATION_ENDPOINTS.base,
    auth: true,
  },
]