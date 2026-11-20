import { baseApi } from '@/shared/api/baseApi'
import { requestJson } from '@/shared/api/client'
import { websiteGet, websiteMutate } from '@/shared/api/websiteApiBuilders'
import { ACCESS_ENDPOINTS } from '../constants/endpoints'

export const accessApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAdminUsers: builder.query({
      async queryFn() {
        return websiteGet(ACCESS_ENDPOINTS.adminUsers)
      },
      providesTags: [{ type: 'Access', id: 'users' }],
    }),
    listAdminRoles: builder.query({
      async queryFn() {
        return websiteGet(ACCESS_ENDPOINTS.adminRoles)
      },
      providesTags: [{ type: 'Access', id: 'roles' }],
    }),
    listPrivilegeCatalog: builder.query({
      async queryFn() {
        return websiteGet(ACCESS_ENDPOINTS.privilegeCatalog)
      },
      providesTags: [{ type: 'Access', id: 'privileges' }],
    }),
    createAdminUser: builder.mutation({
      async queryFn(body) {
        return websiteMutate(ACCESS_ENDPOINTS.adminUsers, 'POST', body)
      },
      invalidatesTags: [{ type: 'Access', id: 'users' }],
    }),
    updateAdminUser: builder.mutation({
      async queryFn({ id, ...body }) {
        return websiteMutate(ACCESS_ENDPOINTS.adminUserById(id), 'PUT', body)
      },
      invalidatesTags: [{ type: 'Access', id: 'users' }],
    }),
    deleteAdminUser: builder.mutation({
      async queryFn(id) {
        const result = await requestJson(ACCESS_ENDPOINTS.adminUserById(id), { method: 'DELETE' })
        if (result.error) {
          return result
        }
        return { data: { id } }
      },
      invalidatesTags: [{ type: 'Access', id: 'users' }],
    }),
    createAdminRole: builder.mutation({
      async queryFn(body) {
        return websiteMutate(ACCESS_ENDPOINTS.adminRoles, 'POST', body)
      },
      invalidatesTags: [{ type: 'Access', id: 'roles' }],
    }),
    updateAdminRole: builder.mutation({
      async queryFn({ id, ...body }) {
        return websiteMutate(ACCESS_ENDPOINTS.adminRoleById(id), 'PUT', body)
      },
      invalidatesTags: [{ type: 'Access', id: 'roles' }],
    }),
  }),
})

export const {
  useListAdminUsersQuery,
  useListAdminRolesQuery,
  useListPrivilegeCatalogQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
  useCreateAdminRoleMutation,
  useUpdateAdminRoleMutation,
} = accessApi