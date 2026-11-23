import { combineReducers } from '@reduxjs/toolkit'
import { authReducer } from '@/domain/auth/redux/slice'
import { dashboardReducer } from '@/app/shell/redux/slice'
import { settingsReducer } from '@/app/settings/redux/slice'
import { userManagementReducer } from '@/app/user-management/redux/slice'
import { baseApi } from '@/shared/api/baseApi'
import languageReducer from '@/shared/redux/slices/language/languageSlice'
import { privilagesReducer } from '@/shared/redux/slices/privilages/privilagesSlice'

// Website-backend RTK endpoints (one import per microservice domain).
import '@/domain/auth/services/authApi'
import '@/domain/auth/services/captchaApi'
import '@/domain/website-content/services/contentApi'
import '@/domain/website-catalog/services/catalogApi'
import '@/domain/website-careers/services/careersApi'
import '@/domain/website-engagement/services/engagementApi'
import '@/domain/website-media/services/mediaApi'
import '@/domain/website-notification/services/notificationApi'
import '@/domain/website-access/services/accessApi'
import '@/domain/website-cms/services/kranAdminApi'
import '@/app/user-management/services/accountsApi'
import '@/app/settings/services/settingsApi'

export const rootReducer = combineReducers({
  language: languageReducer,
  auth: authReducer,
  dashboard: dashboardReducer,
  userManagement: userManagementReducer,
  settings: settingsReducer,
  privilages: privilagesReducer,
  [baseApi.reducerPath]: baseApi.reducer,
})

