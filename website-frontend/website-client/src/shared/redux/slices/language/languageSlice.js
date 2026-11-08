import { createSlice } from '@reduxjs/toolkit'
import i18n from '@/shared/i18/i18n'

const initialState = {
  currentLanguage: localStorage.getItem('preferredLanguage') || 'en',
  languages: [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
  ],
}

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      const code = action.payload === 'hi' ? 'hi' : 'en'
      state.currentLanguage = code
      i18n.changeLanguage(code)
      localStorage.setItem('preferredLanguage', code)
    },
  },
})

export const { setLanguage } = languageSlice.actions
export default languageSlice.reducer
