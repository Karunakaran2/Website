import { baseApi } from '@/shared/api/baseApi'
import { websiteGet, websiteMutate } from '@/shared/api/websiteApiBuilders'
import { ENGAGEMENT_ENDPOINTS } from '../constants/endpoints'

export const engagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEngagementIndex: builder.query({
      async queryFn() {
        return websiteGet(ENGAGEMENT_ENDPOINTS.base)
      },
      providesTags: [{ type: 'Contact', id: 'engagement-root' }],
    }),
    getAdminContacts: builder.query({
      async queryFn(scope) {
        const path =
          scope === 'request' || scope === 'solution'
            ? `${ENGAGEMENT_ENDPOINTS.adminContacts}?scope=${encodeURIComponent(scope)}`
            : ENGAGEMENT_ENDPOINTS.adminContacts
        return websiteGet(path)
      },
      providesTags: (_r, _e, scope) => [{ type: 'Contact', id: `admin-list-${scope ?? 'all'}` }],
    }),
    submitContact: builder.mutation({
      async queryFn(body) {
        return websiteMutate(
          ENGAGEMENT_ENDPOINTS.contact,
          'POST',
          body,
          'Unable to submit contact request',
        )
      },
      invalidatesTags: [{ type: 'Contact', id: 'submit' }],
    }),
  }),
})

export const {
  useGetEngagementIndexQuery,
  useGetAdminContactsQuery,
  useSubmitContactMutation,
} = engagementApi