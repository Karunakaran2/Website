import { createSlice } from '@reduxjs/toolkit'

function resolveLanguage(value) {
  return String(value || 'en').toLowerCase().startsWith('hi') ? 'hi' : 'en'
}

const initialState = {
  preferences: {
    language: resolveLanguage(
      typeof localStorage !== 'undefined' ? localStorage.getItem('preferredLanguage') : 'en',
    ),
  },
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage(state, action) {
      state.preferences.language = resolveLanguage(action.payload)
    },
  },
})

export const { setLanguage } = settingsSlice.actions
export const settingsReducer = settingsSlice.reducer
