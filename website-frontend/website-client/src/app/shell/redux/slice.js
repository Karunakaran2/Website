import { createSlice } from '@reduxjs/toolkit'
import {
  DEFAULT_PRIMARY_NAV_ID,
  getDefaultSecondaryTabId,
  isPrimaryNavValid,
  isSecondaryTabValid,
} from '../constants/dashboard'

const initialState = {
  activePrimaryId: DEFAULT_PRIMARY_NAV_ID,
  activeSecondaryId: getDefaultSecondaryTabId(DEFAULT_PRIMARY_NAV_ID),
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setPrimaryNav(state, action) {
      const primaryId = action.payload
      state.activePrimaryId = primaryId
      state.activeSecondaryId = getDefaultSecondaryTabId(primaryId)
    },
    setSecondaryNav(state, action) {
      const secondaryId = action.payload
      if (isSecondaryTabValid(state.activePrimaryId, secondaryId)) {
        state.activeSecondaryId = secondaryId
      }
    },
    setDashboardNav(state, action) {
      const { primaryId, secondaryId } = action.payload
      if (!isPrimaryNavValid(primaryId)) {
        return
      }
      state.activePrimaryId = primaryId
      state.activeSecondaryId = isSecondaryTabValid(primaryId, secondaryId)
        ? secondaryId
        : getDefaultSecondaryTabId(primaryId)
    },
    resetDashboardNav() {
      return initialState
    },
  },
})

export const { setPrimaryNav, setSecondaryNav, setDashboardNav, resetDashboardNav } =
  dashboardSlice.actions
export const dashboardReducer = dashboardSlice.reducer
