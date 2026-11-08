import { baseApi } from '@/shared/api/baseApi'

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query({
      queryFn: async () => ({
        data: {
          pendingActions: 0,
          recentActivity: [],
        },
      }),
      providesTags: ['Report'],
    }),
  }),
})

export const { useGetDashboardSummaryQuery } = dashboardApi
