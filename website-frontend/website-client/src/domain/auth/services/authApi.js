import { baseApi } from '@/shared/api/baseApi'
import { websiteRaw } from '@/shared/api/websiteApiBuilders'
import { AUTH_ENDPOINTS } from '../constants/endpoints'
import { preferAccessToken } from '../session/sessionPolicy'
import { getRefreshToken, getSessionId, setRefreshToken, setSessionId } from '../utils/session'

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) {
    return ''
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function mapAuthResponse(response) {
  const username = response?.username ?? ''
  const displayName = response?.displayName || username

  return {
    user: {
      name: displayName,
      username,
      role: response?.roleName || response?.role || 'CMS Admin',
      roleCode: response?.role || 'UNASSIGNED',
      privilegeCodes: Array.isArray(response?.privilegeCodes) ? response.privilegeCodes : [],
      systemAdmin: Boolean(response?.systemAdmin),
      initials: getInitials(displayName),
      accessToken: response?.accessToken,
      tokenType: response?.tokenType,
      refreshToken: response?.refreshToken,
      expiresInSeconds: response?.expiresInSeconds,
      sessionId: response?.sessionId,
      seatSelected: true,
    },
    tokens: {
      accessToken: response?.accessToken,
      refreshToken: response?.refreshToken,
      tokenType: response?.tokenType,
      expiresInSeconds: response?.expiresInSeconds,
    },
  }
}

export function mapCurrentUser(response, currentUser = {}) {
  const existingUser = currentUser && typeof currentUser === 'object' ? currentUser : {}
  const displayName = response?.displayName || response?.username || existingUser.name || ''

  return {
    user: {
      ...existingUser,
      name: displayName,
      username: response?.username || existingUser.username || '',
      role: response?.roleName || response?.role || existingUser.role || 'CMS Admin',
      roleCode: response?.role || existingUser.roleCode || 'UNASSIGNED',
      privilegeCodes: Array.isArray(response?.privilegeCodes)
        ? response.privilegeCodes
        : existingUser.privilegeCodes || [],
      systemAdmin: Boolean(response?.systemAdmin ?? existingUser.systemAdmin),
      initials: getInitials(displayName),
      accessToken: preferAccessToken(existingUser.accessToken || '', getSessionId()),
      seatSelected: true,
    },
  }
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      async queryFn({ username, password, captchaId, captcha }) {
        const result = await websiteRaw(AUTH_ENDPOINTS.login, {
          method: 'POST',
          body: JSON.stringify({
            username: username.trim(),
            password,
            captchaId,
            captcha: captcha.trim(),
          }),
        })

        if (result.error) {
          return result
        }

        const mapped = mapAuthResponse(result.data)
        const sessionToken = mapped.user.accessToken || mapped.user.sessionId
        if (sessionToken) {
          setSessionId(sessionToken)
        }
        if (result.data?.refreshToken) {
          setRefreshToken(result.data.refreshToken)
        }
        return { data: mapped }
      },
      invalidatesTags: ['Auth'],
    }),
    refreshSession: builder.mutation({
      async queryFn({ refreshToken: bodyRefresh } = {}) {
        const refreshToken = bodyRefresh || getRefreshToken()
        if (!refreshToken) {
          return { error: { status: 400, data: 'Refresh token is required' } }
        }

        const result = await websiteRaw(AUTH_ENDPOINTS.refresh, {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        })

        if (result.error) {
          return result
        }

        if (result.data?.accessToken) {
          setSessionId(result.data.accessToken)
        }
        if (result.data?.refreshToken) {
          setRefreshToken(result.data.refreshToken)
        }

        return { data: mapAuthResponse(result.data) }
      },
      invalidatesTags: ['Auth'],
    }),
    getLoginUser: builder.query({
      async queryFn(_arg, { getState }) {
        const result = await websiteRaw(AUTH_ENDPOINTS.me)

        if (result.error) {
          return result
        }

        return { data: mapCurrentUser(result.data, getState().auth?.user || {}) }
      },
      providesTags: ['Auth'],
    }),
    getJwks: builder.query({
      async queryFn() {
        return websiteRaw(AUTH_ENDPOINTS.jwks, { expireSession: false })
      },
    }),
    changePassword: builder.mutation({
      async queryFn({ currentPassword, newPassword }) {
        return websiteRaw(AUTH_ENDPOINTS.changePassword, {
          method: 'POST',
          body: JSON.stringify({ currentPassword, newPassword }),
        })
      },
    }),
    logoutUser: builder.mutation({
      async queryFn() {
        const result = await websiteRaw(AUTH_ENDPOINTS.logout, { method: 'POST' })

        if (result.error && result.error.status !== 401) {
          return result
        }

        return { data: { success: true } }
      },
      invalidatesTags: ['Auth'],
    }),
  }),
})

export const {
  useLoginMutation,
  useRefreshSessionMutation,
  useGetLoginUserQuery,
  useGetJwksQuery,
  useLogoutUserMutation,
  useChangePasswordMutation,
} = authApi