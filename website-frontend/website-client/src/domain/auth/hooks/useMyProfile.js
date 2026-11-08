import { useAuthUser } from './useAuthUser'
import { useGetLoginUserQuery } from '../services/authApi'
import { getSessionId } from '../utils/session'

export function useMyProfile() {
  const cachedUser = useAuthUser()
  const sessionToken = cachedUser?.accessToken || getSessionId()
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetLoginUserQuery(undefined, {
    skip: !sessionToken,
  })

  const profile = data?.user ?? cachedUser ?? {}

  return {
    profile,
    isLoading: Boolean(sessionToken) && (isLoading || isFetching),
    loadError:
      typeof error?.data === 'string'
        ? error.data
        : error
          ? 'Unable to load profile'
          : '',
    refetch,
  }
}
