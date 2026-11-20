import { requestJson } from '@/shared/api/client'
import { websiteGet, websiteMutate } from '@/shared/api/websiteApiBuilders'

/**
 * RTK Query admin list + CRUD helpers for website CMS resources.
 * @param {import('@reduxjs/toolkit/query').EndpointBuilder} builder
 * @param {{ tag: string, listPath: string, byId: (id: string|number) => string }} config
 */
export function buildAdminCrudEndpoints(builder, { tag, listPath, byId }) {
  const tagList = [{ type: tag, id: 'LIST' }]
  return {
    [`list`]: builder.query({
      async queryFn() {
        return websiteGet(listPath)
      },
      providesTags: tagList,
    }),
    [`create`]: builder.mutation({
      async queryFn(body) {
        return websiteMutate(listPath, 'POST', body)
      },
      invalidatesTags: tagList,
    }),
    [`update`]: builder.mutation({
      async queryFn({ id, ...body }) {
        return websiteMutate(byId(id), 'PUT', body)
      },
      invalidatesTags: tagList,
    }),
    [`remove`]: builder.mutation({
      async queryFn(id) {
        const result = await requestJson(byId(id), { method: 'DELETE' })
        if (result.error) {
          return result
        }
        return { data: { id } }
      },
      invalidatesTags: tagList,
    }),
  }
}