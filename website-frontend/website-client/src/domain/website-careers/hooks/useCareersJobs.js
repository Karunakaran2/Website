import { useGetJobsQuery } from '../services/careersApi'

export function useCareersJobs(options) {
  return useGetJobsQuery(undefined, options)
}