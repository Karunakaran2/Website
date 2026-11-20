import {
  useCreateNewsMutation,
  useDeleteNewsMutation,
  useGetAdminNewsQuery,
  useGetPublicNewsQuery,
  useUpdateNewsMutation,
} from '../services/contentApi'

export function usePublicNews(options) {
  return useGetPublicNewsQuery(undefined, options)
}

export function useAdminNews(options) {
  return useGetAdminNewsQuery(undefined, options)
}

export function useContentNewsMutations() {
  const [createNews] = useCreateNewsMutation()
  const [updateNews] = useUpdateNewsMutation()
  const [deleteNews] = useDeleteNewsMutation()
  return { createNews, updateNews, deleteNews }
}