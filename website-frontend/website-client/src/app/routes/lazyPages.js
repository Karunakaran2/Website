import { lazyPage } from '@/app/routes/lazyPage'

export const LoginPage = lazyPage(() =>
  import('@/domain/auth').then((module) => ({ default: module.LoginPage })),
)

export const DepartmentLoginPage = lazyPage(() =>
  import('@/domain/auth/pages/DepartmentLoginPage'),
)

export const ModuleLoginPage = lazyPage(() =>
  import('@/domain/auth/pages/ModuleLoginPage'),
)

export const ForgotPasswordPage = lazyPage(() =>
  import('@/domain/auth/pages/ForgotPasswordPage'),
)

export const OneTimeRegistrationPage = lazyPage(() =>
  import('@/domain/auth/pages/OneTimeRegistrationPage'),
)

export const ApplicationTrackingPage = lazyPage(() =>
  import('@/domain/auth/pages/ApplicationTrackingPage'),
)

export const SeatSelectionPage = lazyPage(() =>
  import('@/domain/auth').then((module) => ({
    default: module.SeatSelectionPage,
  })),
)

export const MyProfilePage = lazyPage(() =>
  import('@/domain/auth').then((module) => ({
    default: module.MyProfilePage,
  })),
)

export const HomePage = lazyPage(() => import('@/app/user-management/pages/HomePage'))

export const DashboardPage = lazyPage(() => import('@/app/shell/pages/DashboardPage'))
