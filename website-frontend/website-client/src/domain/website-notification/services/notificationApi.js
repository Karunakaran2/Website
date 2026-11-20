import { baseApi } from '@/shared/api/baseApi'
import { websiteGet } from '@/shared/api/websiteApiBuilders'
import { NOTIFICATION_ENDPOINTS } from '../constants/endpoints'

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listNotifications: builder.query({
      async queryFn() {
        return websiteGet(NOTIFICATION_ENDPOINTS.base)
      },
      providesTags: [{ type: 'Notification', id: 'list' }],
    }),
  }),
})

export const { useListNotificationsQuery, useLazyListNotificationsQuery } = notificationApi