import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  /** Client UI state for Dashboard (extend when features land). */
  ready: true,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    resetDashboardUiState() {
      return initialState
    },
  },
})

export const { resetDashboardUiState } = dashboardSlice.actions
export const dashboardReducer = dashboardSlice.reducer
