import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  codes: null,
}

const privilagesSlice = createSlice({
  name: 'privilages',
  initialState,
  reducers: {
    setPrivilages(state, action) {
      state.codes = Array.isArray(action.payload) ? action.payload : []
    },
    resetPrivilages(state) {
      state.codes = null
    },
  },
})

export const { setPrivilages, resetPrivilages } = privilagesSlice.actions
export const privilagesReducer = privilagesSlice.reducer