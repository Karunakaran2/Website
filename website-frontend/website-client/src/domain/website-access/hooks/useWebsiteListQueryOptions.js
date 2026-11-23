import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { WEBSITE_AUTH_ENABLED } from '@/shared/config/websiteAuth'
import { getSessionId } from '@/domain/auth/utils/session'

/**
 * RTK Query options for CMS admin list endpoints: refetch when the screen opens
 * or filters/page change, and wait until a session token exists (real backend).
 */
export function useWebsiteListQueryOptions(canRun) {
  const accessToken = useSelector((state) => state.auth?.user?.accessToken) || getSessionId()

  return useMemo(
    () => ({
      skip: Boolean(WEBSITE_AUTH_ENABLED && (!accessToken || !canRun)),
      refetchOnMountOrArgChange: true,
    }),
    [accessToken, canRun],
  )
}