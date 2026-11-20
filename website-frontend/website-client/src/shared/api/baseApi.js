import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'

/**
 * Shared RTK Query API. Domains inject endpoints via `baseApi.injectEndpoints`.
 * Mock workflows use `fakeBaseQuery`.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Auth', 'Account', 'Settings', 'Content', 'Catalog', 'Careers', 'Contact', 'Media', 'Notification'],
  endpoints: () => ({}),
})
