import { createSlice } from '@reduxjs/toolkit'
import { preferAccessToken } from '../session/sessionPolicy'
import {
  clearSessionId,
  getSessionId,
  setSeatSelected,
  setSessionId,
  syncSessionMirrorAuthUser,
} from '../utils/session'
import { publishSessionSignal } from '../session/sessionCrossTab'

const initialState = {
  isAuthenticated: false,
  user: null,
}

function applyAuthenticatedUser(state, user, { crossTabSignal = true } = {}) {
  state.isAuthenticated = true
  state.user = user ?? null
  const token = preferAccessToken(state.user?.accessToken, getSessionId()) || state.user?.sessionId
  if (state.user && token && state.user.accessToken !== token) {
    state.user.accessToken = token
  }
  if (token) {
    setSessionId(token, { crossTabSignal })
  }
  if (typeof state.user?.seatSelected === 'boolean') {
    setSeatSelected(state.user.seatSelected)
  }
  syncSessionMirrorAuthUser(state.user)
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Real login / seat completion — notifies other tabs. */
    loginSuccess(state, action) {
      applyAuthenticatedUser(state, action.payload ?? null)
      publishSessionSignal('LOGIN')
    },
    /** Mirror / cross-tab restore — no broadcast (avoids logout loops on new tabs). */
    restoreAuthState(state, action) {
      applyAuthenticatedUser(state, action.payload ?? null, { crossTabSignal: false })
    },
    logout(state) {
      state.isAuthenticated = false
      state.user = null
      clearSessionId()
    },
  },
})

export const { loginSuccess, restoreAuthState, logout } = authSlice.actions
export const authReducer = authSlice.reducer
