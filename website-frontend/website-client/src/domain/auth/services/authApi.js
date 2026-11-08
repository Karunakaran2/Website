import { baseApi } from '@/shared/api/baseApi'
import { apiPayloadMessage } from '@/shared/api/apiError'
import { apiUrl, requestJson } from '@/shared/api/client'
import { WEBSITE_AUTH_ENABLED } from '@/shared/config/websiteAuth'
import { preferAccessToken } from '../session/sessionPolicy'
import { getSeatSelected, getSessionId, markSpfoOrigin, setRefreshToken, setSessionId } from '../utils/session'

const LOGIN_TYPE = 'D'

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

function mapRole(response) {
  if (response?.designation) {
    return response.designation
  }

  if (response?.postingName) {
    return response.postingName
  }

  if (response?.domain === 'D') {
    return 'Department User'
  }

  return response?.domain || ''
}

function mapSeatRow(row, index) {
  const hierarchyCode = row?.hierarchyCode || '—'
  const postingName = row?.postingName || row?.postingDetails?.postingName || '—'
  return {
    id: row?.idMask || String(index + 1),
    idMask: row?.idMask || '',
    serial: index + 1,
    name: row?.hierarchyName || '—',
    hierarchyCode,
    postingName,
    code: hierarchyCode,
    office: row?.officeName || '—',
    officeType: row?.officeType || '—',
    category: row?.category || '—',
    designation: postingName,
  }
}

export function mapAuthResponse(response) {
  const username = response?.username ?? ''
  const displayName = response?.displayName || username

  return {
    user: {
      name: displayName,
      username,
      role: response?.role || mapRole(response) || 'CMS Admin',
      initials: getInitials(displayName),
      accessToken: response?.accessToken,
      tokenType: response?.tokenType,
      sessionId: response?.sessionId,
      domain: response?.domain,
      userIdMask: response?.userIdMask,
      userSetupIdMask: response?.userIdMask,
      seatSelected: Boolean(response?.seatSelected),
    },
  }
}

export function mapLoginUser(response, currentUser = {}) {
  const existingUser = currentUser && typeof currentUser === 'object' ? currentUser : {}
  const displayName =
    response?.displayName ||
    [response?.firstName, response?.lastName].filter(Boolean).join(' ') ||
    existingUser.name ||
    existingUser.username ||
    ''

  return {
    user: {
      ...existingUser,
      name: displayName,
      username: response?.username || existingUser.username || '',
      role: mapRole(response) || existingUser.role || '',
      initials: getInitials(displayName),
      email: response?.email ?? existingUser.email,
      mobile: response?.mobile ?? existingUser.mobile,
      firstName: response?.firstName ?? existingUser.firstName,
      lastName: response?.lastName ?? existingUser.lastName,
      hierarchyName: response?.hierarchyName ?? existingUser.hierarchyName,
      hierarchyCode: response?.hierarchyCode ?? existingUser.hierarchyCode,
      accessToken: preferAccessToken(
        response?.accessToken || existingUser.accessToken || '',
        getSessionId(),
      ),
      refreshToken: response?.refreshToken || existingUser.refreshToken || '',
      sessionId: existingUser.sessionId || response?.sessionId || '',
      domain: response?.domain || existingUser.domain,
      designation: response?.designation || response?.postingName || existingUser.designation,
      postingName: response?.postingName || response?.designation || existingUser.postingName,
      userIdMask: response?.userIdMask || existingUser.userIdMask,
      userSetupIdMask: response?.userSetupIdMask || existingUser.userSetupIdMask,
      seatUserAllotId: response?.seatUserAllotId ?? existingUser.seatUserAllotId,
      seatSelected:
        typeof response?.seatSelected === 'boolean'
          ? response.seatSelected
          : typeof existingUser.seatSelected === 'boolean'
            ? existingUser.seatSelected
            : getSeatSelected(),
    },
  }
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCaptcha: builder.query({
      async queryFn() {
        return requestJson('/api/v1/captcha/getCaptcha')
      },
      keepUnusedDataFor: 0,
    }),
    login: builder.mutation({
      async queryFn({ username, password, captchaId, captcha }) {
        const result = WEBSITE_AUTH_ENABLED
          ? await requestJson('/api/v1/auth/login', {
              method: 'POST',
              body: JSON.stringify({
                username: username.trim(),
                password,
              }),
            })
          : await requestJson('/api/v1/login/loginUser', {
              method: 'POST',
              body: JSON.stringify({
                loginType: LOGIN_TYPE,
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
    exchangeSpfoAccessToken: builder.mutation({
      async queryFn({ accessToken }) {
        try {
          const response = await fetch(apiUrl('/api/v1/login/exchangeSpfoAccessToken'), {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accessToken }),
          })
          const text = await response.text()
          let payload = null
          try {
            payload = text ? JSON.parse(text) : null
          } catch {
            payload = text
          }
          if (!response.ok) {
            return {
              error: {
                status: response.status,
                data: apiPayloadMessage(payload, 'Unable to open Financial Accounting.'),
              },
            }
          }
          const mapped = mapAuthResponse(payload)
          const sessionToken = mapped.user.accessToken || mapped.user.sessionId
          if (sessionToken) {
            setSessionId(sessionToken)
          }
          if (payload?.refreshToken) {
            setRefreshToken(payload.refreshToken)
          }
          markSpfoOrigin()
          return { data: mapped }
        } catch {
          return { error: { status: 0, data: 'Unable to reach the server' } }
        }
      },
      invalidatesTags: ['Auth'],
    }),
    getLoginUser: builder.query({
      async queryFn(_arg, { getState }) {
        const result = WEBSITE_AUTH_ENABLED
          ? await requestJson('/api/v1/auth/me')
          : await requestJson('/api/v1/login/getLoginUser')

        if (result.error) {
          return result
        }

        const profile = WEBSITE_AUTH_ENABLED
          ? {
              username: result.data?.username,
              displayName: result.data?.displayName,
              designation: result.data?.role,
            }
          : result.data

        return { data: mapLoginUser(profile, getState().auth?.user || {}) }
      },
      providesTags: ['Auth'],
    }),
    getHierarchySetupByUserId: builder.query({
      async queryFn() {
        const result = await requestJson(
          '/api/v1/seat-context/getHierarchySetupByUserId',
        )

        if (result.error) {
          return result
        }

        const rows = Array.isArray(result.data) ? result.data : []
        return { data: rows.map(mapSeatRow) }
      },
    }),
    updateSeatUserAlloted: builder.mutation({
      async queryFn({ seatUserAllotedIdMask }, { getState }) {
        const result = await requestJson('/api/v1/seat-context/updateSeatUserAlloted', {
          method: 'POST',
          body: JSON.stringify({ seatUserAllotedIdMask }),
        })

        if (result.error) {
          return result
        }

        if (result.data?.accessToken) {
          setSessionId(result.data.accessToken, { resetActivity: true })
        }
        if (result.data?.refreshToken) {
          setRefreshToken(result.data.refreshToken)
        }

        return {
          data: mapLoginUser(result.data, {
            ...getState().auth?.user,
            seatSelected: true,
          }),
        }
      },
      invalidatesTags: ['Auth'],
    }),
    logoutUser: builder.mutation({
      async queryFn() {
        const result = await requestJson(
          WEBSITE_AUTH_ENABLED ? '/api/v1/auth/logout' : '/api/v1/login/logoutUser',
          { method: 'POST' },
        )

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
  useGetCaptchaQuery,
  useLazyGetCaptchaQuery,
  useLoginMutation,
  useExchangeSpfoAccessTokenMutation,
  useGetLoginUserQuery,
  useGetHierarchySetupByUserIdQuery,
  useUpdateSeatUserAllotedMutation,
  useLogoutUserMutation,
} = authApi
