import { baseApi } from '@/shared/api/baseApi'
import { websiteGet } from '@/shared/api/websiteApiBuilders'
import { MEDIA_ENDPOINTS } from '../constants/endpoints'

export const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMedia: builder.query({
      async queryFn() {
        return websiteGet(MEDIA_ENDPOINTS.base)
      },
      providesTags: [{ type: 'Media', id: 'list' }],
    }),
    getMediaById: builder.query({
      async queryFn(id) {
        return websiteGet(MEDIA_ENDPOINTS.byId(id))
      },
      providesTags: (_r, _e, id) => [{ type: 'Media', id }],
    }),
  }),
})

export const {
  useListMediaQuery,
  useLazyListMediaQuery,
  useGetMediaByIdQuery,
  useLazyGetMediaByIdQuery,
} = mediaApi