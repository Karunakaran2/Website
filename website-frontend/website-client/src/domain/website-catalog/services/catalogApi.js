import { baseApi } from '@/shared/api/baseApi'
import { websiteGet } from '@/shared/api/websiteApiBuilders'
import { CATALOG_ENDPOINTS } from '../constants/endpoints'

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCatalogProducts: builder.query({
      async queryFn() {
        return websiteGet(CATALOG_ENDPOINTS.products)
      },
      providesTags: [{ type: 'Catalog', id: 'products' }],
    }),
    getServices: builder.query({
      async queryFn() {
        return websiteGet(CATALOG_ENDPOINTS.services)
      },
      providesTags: [{ type: 'Catalog', id: 'services' }],
    }),
    getSolutions: builder.query({
      async queryFn() {
        return websiteGet(CATALOG_ENDPOINTS.solutions)
      },
      providesTags: [{ type: 'Catalog', id: 'solutions' }],
    }),
  }),
})

export const {
  useGetCatalogProductsQuery,
  useLazyGetCatalogProductsQuery,
  useGetServicesQuery,
  useGetSolutionsQuery,
} = catalogApi