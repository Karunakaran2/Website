import { CAREERS_ENDPOINTS } from './endpoints'

export const CAREERS_API_OPERATIONS = [
  { hook: 'useGetJobsQuery', method: 'GET', path: CAREERS_ENDPOINTS.jobs, auth: false },
  { hook: 'useGetCareersListQuery', method: 'GET', path: CAREERS_ENDPOINTS.careers, auth: false },
]