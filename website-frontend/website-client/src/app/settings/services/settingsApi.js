import { baseApi } from '@/shared/api/baseApi'

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      queryFn: async () => ({
        data: {
          language: 'en',
        },
      }),
      providesTags: ['Settings'],
    }),
  }),
})

export const { useGetSettingsQuery } = settingsApi
