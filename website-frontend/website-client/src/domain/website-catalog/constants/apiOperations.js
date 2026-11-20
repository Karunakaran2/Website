import { CATALOG_ENDPOINTS } from './endpoints'

export const CATALOG_API_OPERATIONS = [
  { hook: 'useGetCatalogProductsQuery', method: 'GET', path: CATALOG_ENDPOINTS.products, auth: false },
  { hook: 'useGetServicesQuery', method: 'GET', path: CATALOG_ENDPOINTS.services, auth: false },
  { hook: 'useGetSolutionsQuery', method: 'GET', path: CATALOG_ENDPOINTS.solutions, auth: false },
]