import { createSelector } from '@reduxjs/toolkit'
import { getSecondaryNavItems } from '../constants/dashboard'

export const selectDashboardState = (state) => state.dashboard
export const selectActivePrimaryId = (state) => state.dashboard.activePrimaryId
export const selectActiveSecondaryId = (state) => state.dashboard.activeSecondaryId

export const selectSecondaryNavItems = createSelector(
  [selectActivePrimaryId],
  (activePrimaryId) => getSecondaryNavItems(activePrimaryId),
)
