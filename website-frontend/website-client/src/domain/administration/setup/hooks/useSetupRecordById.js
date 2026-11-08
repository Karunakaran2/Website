import { useGetSetupByIdQuery } from '../services/setupApi'

/** Fetch one setup record by master resource + entityName + public id (e.g. idMask). */
export function useSetupRecordById(master, id) {
  const resource = master?.resource
  const entityName = master?.entityName
  const skip = !id || !resource || !entityName

  return useGetSetupByIdQuery(
    { resource, entityName, id },
    { skip },
  )
}
