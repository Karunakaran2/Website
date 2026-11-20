import { ENGAGEMENT_ENDPOINTS } from './endpoints'

export const ENGAGEMENT_API_OPERATIONS = [
  { hook: 'useSubmitContactMutation', method: 'POST', path: ENGAGEMENT_ENDPOINTS.contact, auth: false },
  { hook: 'useGetEngagementIndexQuery', method: 'GET', path: ENGAGEMENT_ENDPOINTS.base, auth: false },
  {
    hook: 'useGetAdminContactsQuery',
    method: 'GET',
    path: ENGAGEMENT_ENDPOINTS.adminContacts,
    auth: true,
  },
]