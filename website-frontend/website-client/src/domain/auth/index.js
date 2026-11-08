export { default as LoginPage } from './pages/LoginPage'
export { default as ForgotPasswordPage } from './pages/ForgotPasswordPage'
export { default as OneTimeRegistrationPage } from './pages/OneTimeRegistrationPage'
export { default as SeatSelectionPage } from './pages/SeatSelectionPage'
export { default as MyProfilePage } from './pages/MyProfilePage'
export { default as LoginForm } from './pages/LoginForm'
export { default as AuthPageShell } from '@/shared/layouts/AuthPageShell'
/** @deprecated Use AuthPageShell — kept for existing imports. */
export { default as AuthLayout } from '@/shared/layouts/AuthPageShell'
export { default as BrandPanel } from './components/BrandPanel'
export { default as CaptchaField } from './components/CaptchaField'
export { useLoginForm } from './hooks/useLoginForm'
export { useAuthUser } from './hooks/useAuthUser'
export { useLogout } from './hooks/useLogout'
export { loginSuccess, restoreAuthState, logout, authReducer } from './redux/slice'
export { login } from './redux/thunk'
export { selectAuthState, selectIsAuthenticated, selectAuthUser } from './redux/selectors'
export {
  authApi,
  useGetCaptchaQuery,
  useLazyGetCaptchaQuery,
  useLoginMutation,
  useGetLoginUserQuery,
  useGetHierarchySetupByUserIdQuery,
  useUpdateSeatUserAllotedMutation,
  useLogoutUserMutation,
} from './services/authApi'
