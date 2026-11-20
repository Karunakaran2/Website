import { baseApi } from '@/shared/api/baseApi'
import { websiteGet } from '@/shared/api/websiteApiBuilders'
import { CAREERS_ENDPOINTS } from '../constants/endpoints'

export const careersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query({
      async queryFn() {
        return websiteGet(CAREERS_ENDPOINTS.jobs)
      },
      providesTags: [{ type: 'Careers', id: 'jobs' }],
    }),
    getCareersList: builder.query({
      async queryFn() {
        return websiteGet(CAREERS_ENDPOINTS.careers)
      },
      providesTags: [{ type: 'Careers', id: 'careers' }],
    }),
  }),
})

export const {
  useGetJobsQuery,
  useLazyGetJobsQuery,
  useGetCareersListQuery,
} = careersApi