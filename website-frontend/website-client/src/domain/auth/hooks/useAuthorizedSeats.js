import { apiErrorMessage } from '@/shared/api/apiError'
import { useGetHierarchySetupByUserIdQuery } from '../services/authApi'
import { getSessionId } from '../utils/session'

function toListError(error, fallback) {
  return apiErrorMessage(error, error ? fallback : '')
}

export function useAuthorizedSeats({ skip = false } = {}) {
  const hasSession = Boolean(getSessionId())
  const {
    data: seats = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetHierarchySetupByUserIdQuery(undefined, {
    skip: skip || !hasSession,
  })

  return {
    seats,
    isLoading: hasSession && !skip && (isLoading || isFetching),
    listError: toListError(error, 'Unable to load authorized accounts'),
    refetch,
  }
}
