import { baseApi } from '@/shared/api/baseApi'
import { requestJson } from '@/shared/api/client'

function softEmptyListOn404(result) {
  if (result.error?.status === 404) {
    return { data: [] }
  }
  return result
}

function withAllotId(path, allotId) {
  if (allotId == null || allotId === '') {
    return path
  }
  const sep = path.includes('?') ? '&' : '?'
  return `${path}${sep}allotId=${encodeURIComponent(String(allotId))}`
}

export const dashboardDomainApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardCardList: builder.query({
      async queryFn({ financialYear, allotId } = {}) {
        const params = new URLSearchParams()
        if (financialYear) {
          params.set('financialYear', financialYear)
        }
        if (allotId != null && allotId !== '') {
          params.set('allotId', String(allotId))
        }
        const query = params.toString()
        const path = query
          ? `/api/v1/dashboard/getDashboardCardList?${query}`
          : '/api/v1/dashboard/getDashboardCardList'
        return softEmptyListOn404(await requestJson(path))
      },
      providesTags: [{ type: 'Dashboard', id: 'cards' }],
    }),
    getDashboardChartList: builder.query({
      async queryFn({ financialYear, allotId } = {}) {
        const params = new URLSearchParams()
        if (financialYear) {
          params.set('financialYear', financialYear)
        }
        if (allotId != null && allotId !== '') {
          params.set('allotId', String(allotId))
        }
        const query = params.toString()
        const path = query
          ? `/api/v1/dashboard/getDashboardChartList?${query}`
          : '/api/v1/dashboard/getDashboardChartList'
        return softEmptyListOn404(await requestJson(path))
      },
      providesTags: [{ type: 'Dashboard', id: 'charts' }],
    }),
    getHiddenDashboardWidgetList: builder.query({
      async queryFn({ allotId } = {}) {
        const path = withAllotId('/api/v1/dashboard/getHiddenDashboardWidgetList', allotId)
        return softEmptyListOn404(await requestJson(path))
      },
      providesTags: [{ type: 'Dashboard', id: 'hidden' }],
    }),
    saveDashboardWidgetConfigList: builder.mutation({
      async queryFn({ allotId, widgets } = {}) {
        const path = withAllotId('/api/v1/dashboard/saveDashboardWidgetConfigList', allotId)
        return requestJson(path, {
          method: 'POST',
          body: JSON.stringify(widgets ?? []),
        })
      },
      invalidatesTags: [
        { type: 'Dashboard', id: 'cards' },
        { type: 'Dashboard', id: 'charts' },
        { type: 'Dashboard', id: 'hidden' },
      ],
    }),
    updateDashboardWidgetStatus: builder.mutation({
      async queryFn({ allotId, widgetKey, status } = {}) {
        const path = withAllotId('/api/v1/dashboard/updateDashboardWidgetStatus', allotId)
        return requestJson(path, {
          method: 'POST',
          body: JSON.stringify({ widgetKey, status }),
        })
      },
      invalidatesTags: [
        { type: 'Dashboard', id: 'cards' },
        { type: 'Dashboard', id: 'charts' },
        { type: 'Dashboard', id: 'hidden' },
      ],
    }),
    updateDashboardWidgetColor: builder.mutation({
      async queryFn({ allotId, widgetKey, color } = {}) {
        const path = withAllotId('/api/v1/dashboard/updateDashboardWidgetColor', allotId)
        return requestJson(path, {
          method: 'POST',
          body: JSON.stringify({ widgetKey, color }),
        })
      },
    }),
  }),
})

export const {
  useGetDashboardCardListQuery,
  useGetDashboardChartListQuery,
  useGetHiddenDashboardWidgetListQuery,
  useLazyGetHiddenDashboardWidgetListQuery,
  useSaveDashboardWidgetConfigListMutation,
  useUpdateDashboardWidgetStatusMutation,
  useUpdateDashboardWidgetColorMutation,
} = dashboardDomainApi
