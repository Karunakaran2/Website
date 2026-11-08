import { createAsyncThunk } from '@reduxjs/toolkit'
import { loginSuccess } from './slice'
import { validateLoginCredentials } from '../utils/authService'
import { CURRENT_USER } from '@/shared/constants'

/**
 * Async login flow. Uses local validation today; swap for authApi.login when backend is ready.
 */
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { dispatch, rejectWithValue }) => {
    if (!validateLoginCredentials({ username, password })) {
      return rejectWithValue('Invalid credentials')
    }

    const user = { ...CURRENT_USER, username: username.trim() }
    dispatch(loginSuccess(user))
    return user
  },
)
