import { baseApi } from '@/shared/api/baseApi'

export const getDefaultMiddlewareConfig = (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(baseApi.middleware)
