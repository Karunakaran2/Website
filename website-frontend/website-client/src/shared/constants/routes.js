import {
  getDashboardRoute,
  getModuleRoute,
  getSetupModuleRoute,
  MODULE_ROUTE_PREFIX,
} from './moduleRoutes'

export { getDashboardRoute, getModuleRoute, getSetupModuleRoute, MODULE_ROUTE_PREFIX }

export const ROUTES = {
  LOGIN: '/',
  DEPARTMENT_LOGIN: '/auth/department-login',
  MODULE_LOGIN: '/auth/module-login',
  FORGOT_PASSWORD: '/auth/forgot-password',
  ONE_TIME_REGISTRATION: '/auth/one-time-registration',
  APPLICATION_TRACKING: '/auth/application-tracking',
  SEATS: '/seats',
  MY_PROFILE: '/profile',
  HOME: '/home',
  SETUP_ROOT: MODULE_ROUTE_PREFIX.ADMINISTRATION_SETUP,
  ACCESSIBILITY_STATEMENT: '/accessibility-statement',
  SCREEN_READER_ACCESS: '/screen-reader-access',
  /** Legacy — only registered to redirect into module routes */
  LEGACY_DASHBOARD: '/dashboard/*',
}
