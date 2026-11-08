import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeSection: 'principles',
}

export const designGuidelinesSlice = createSlice({
  name: 'designGuidelines',
  initialState,
  reducers: {
    setActiveSection: (state, action) => {
      state.activeSection = action.payload
    },
  },
})

export const { setActiveSection } = designGuidelinesSlice.actions
export default designGuidelinesSlice.reducer
