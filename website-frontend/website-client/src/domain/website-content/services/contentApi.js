import { baseApi } from '@/shared/api/baseApi'
import { requestJson } from '@/shared/api/client'
import { websiteGet, websiteMutate } from '@/shared/api/websiteApiBuilders'
import { CONTENT_ENDPOINTS } from '../constants/endpoints'

const contentTags = {
  publicNews: { type: 'Content', id: 'public-news' },
  adminNews: { type: 'Content', id: 'admin-news' },
}

export const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicNews: builder.query({
      async queryFn() {
        return websiteGet(CONTENT_ENDPOINTS.publicNews)
      },
      providesTags: [contentTags.publicNews],
    }),
    getPublicBanners: builder.query({
      async queryFn() {
        return websiteGet(CONTENT_ENDPOINTS.publicBanners)
      },
      providesTags: [{ type: 'Content', id: 'public-banners' }],
    }),
    getAdminNews: builder.query({
      async queryFn() {
        return websiteGet(CONTENT_ENDPOINTS.adminNews)
      },
      providesTags: [contentTags.adminNews],
    }),
    createNews: builder.mutation({
      async queryFn(body) {
        return websiteMutate(CONTENT_ENDPOINTS.adminNews, 'POST', body)
      },
      invalidatesTags: [contentTags.adminNews, contentTags.publicNews],
    }),
    updateNews: builder.mutation({
      async queryFn({ id, ...body }) {
        return websiteMutate(CONTENT_ENDPOINTS.adminNewsById(id), 'PUT', body)
      },
      invalidatesTags: [contentTags.adminNews, contentTags.publicNews],
    }),
    deleteNews: builder.mutation({
      async queryFn(id) {
        const result = await requestJson(CONTENT_ENDPOINTS.adminNewsById(id), {
          method: 'DELETE',
        })
        if (result.error) {
          return result
        }
        return { data: { id } }
      },
      invalidatesTags: [contentTags.adminNews, contentTags.publicNews],
    }),
    getAdminBanners: builder.query({
      async queryFn() {
        return websiteGet(CONTENT_ENDPOINTS.adminBanners)
      },
      providesTags: [{ type: 'Content', id: 'admin-banners' }],
    }),
    createBanner: builder.mutation({
      async queryFn(body) {
        return websiteMutate(CONTENT_ENDPOINTS.adminBanners, 'POST', body)
      },
      invalidatesTags: [{ type: 'Content', id: 'admin-banners' }],
    }),
    updateBanner: builder.mutation({
      async queryFn({ id, ...body }) {
        return websiteMutate(CONTENT_ENDPOINTS.adminBannersById(id), 'PUT', body)
      },
      invalidatesTags: [{ type: 'Content', id: 'admin-banners' }],
    }),
    deleteBanner: builder.mutation({
      async queryFn(id) {
        const result = await requestJson(CONTENT_ENDPOINTS.adminBannersById(id), {
          method: 'DELETE',
        })
        if (result.error) {
          return result
        }
        return { data: { id } }
      },
      invalidatesTags: [{ type: 'Content', id: 'admin-banners' }],
    }),
  }),
})

export const {
  useGetPublicNewsQuery,
  useGetPublicBannersQuery,
  useLazyGetPublicNewsQuery,
  useGetAdminNewsQuery,
  useLazyGetAdminNewsQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
  useGetAdminBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = contentApi