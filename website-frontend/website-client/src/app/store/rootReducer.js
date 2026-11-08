import { combineReducers } from '@reduxjs/toolkit'
import { authReducer } from '@/domain/auth/redux/slice'
import { dashboardReducer } from '@/app/shell/redux/slice'
import { settingsReducer } from '@/app/settings/redux/slice'
import { userManagementReducer } from '@/app/user-management/redux/slice'
import { setupReducer } from '@/domain/administration/setup/redux/slice'
import { assetReducer } from '@/domain/administration/asset/redux/slice'
import { baseApi } from '@/shared/api/baseApi'
import languageReducer from '@/shared/redux/slices/language/languageSlice'

// Ensure core application API endpoints are injected before the store is created.
import '@/domain/auth/services/authApi'
import '@/app/user-management/services/accountsApi'
import '@/app/shell/services/dashboardApi'
import '@/domain/dashboard/services/dashboardApi'
import '@/app/settings/services/settingsApi'
import '@/domain/administration/setup/services/setupApi'
import '@/domain/administration/asset/services/assetApi'

export const rootReducer = combineReducers({
  language: languageReducer,
  auth: authReducer,
  dashboard: dashboardReducer,
  userManagement: userManagementReducer,
  settings: settingsReducer,
  setup: setupReducer,
  asset: assetReducer,
  [baseApi.reducerPath]: baseApi.reducer,
})

