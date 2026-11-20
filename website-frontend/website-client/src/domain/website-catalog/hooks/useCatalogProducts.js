import {
  useGetCatalogProductsQuery,
  useGetServicesQuery,
  useGetSolutionsQuery,
} from '../services/catalogApi'

export function useCatalogProducts(options) {
  return useGetCatalogProductsQuery(undefined, options)
}

export function useCatalogServices(options) {
  return useGetServicesQuery(undefined, options)
}

export function useCatalogSolutions(options) {
  return useGetSolutionsQuery(undefined, options)
}