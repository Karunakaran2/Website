import { CONTENT_ENDPOINTS } from './endpoints'

export const CONTENT_API_OPERATIONS = [
  { hook: 'useGetPublicNewsQuery', method: 'GET', path: CONTENT_ENDPOINTS.publicNews, auth: false },
  {
    hook: 'useGetPublicBannersQuery',
    method: 'GET',
    path: CONTENT_ENDPOINTS.publicBanners,
    auth: false,
  },
  { hook: 'useGetAdminNewsQuery', method: 'GET', path: CONTENT_ENDPOINTS.adminNews, auth: true },
  { hook: 'useCreateNewsMutation', method: 'POST', path: CONTENT_ENDPOINTS.adminNews, auth: true },
  {
    hook: 'useUpdateNewsMutation',
    method: 'PUT',
    path: `${CONTENT_ENDPOINTS.adminNews}/:id`,
    auth: true,
  },
  {
    hook: 'useDeleteNewsMutation',
    method: 'DELETE',
    path: `${CONTENT_ENDPOINTS.adminNews}/:id`,
    auth: true,
  },
  { hook: 'useGetAdminBannersQuery', method: 'GET', path: CONTENT_ENDPOINTS.adminBanners, auth: true },
  {
    hook: 'useCreateBannerMutation',
    method: 'POST',
    path: CONTENT_ENDPOINTS.adminBanners,
    auth: true,
  },
  {
    hook: 'useUpdateBannerMutation',
    method: 'PUT',
    path: `${CONTENT_ENDPOINTS.adminBanners}/:id`,
    auth: true,
  },
  {
    hook: 'useDeleteBannerMutation',
    method: 'DELETE',
    path: `${CONTENT_ENDPOINTS.adminBanners}/:id`,
    auth: true,
  },
]