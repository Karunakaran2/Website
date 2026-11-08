import { Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AccountSelectionLayout from '@/app/user-management/layouts/AccountSelectionLayout'
import GuestOnly from '@/app/routes/GuestOnly'
import RequireAuth from '@/app/routes/RequireAuth'
import {
  DashboardPage,
  HomePage,
  LoginPage,
  DepartmentLoginPage,
  ModuleLoginPage,
  ForgotPasswordPage,
  OneTimeRegistrationPage,
  ApplicationTrackingPage,
  MyProfilePage,
  SeatSelectionPage,
} from '@/app/routes/lazyPages'
import DashboardPageSkeleton from '@/shared/components/skeletons/DashboardPageSkeleton'
import HomeContentSkeleton from '@/shared/components/skeletons/HomeContentSkeleton'
import PageCardSkeleton from '@/shared/components/skeleton/PageCardSkeleton'
import LoginPageSkeleton from '@/shared/components/skeletons/LoginPageSkeleton'
import SeatSelectionSkeleton from '@/shared/components/skeletons/SeatSelectionSkeleton'
import AccessibilityStatementPage from '@/shared/pages/AccessibilityStatementPage'
import ScreenReaderAccessPage from '@/shared/pages/ScreenReaderAccessPage'
import {
  ROUTES,
  getModuleRoute,
  legacyDashboardPathToModuleRoute,
  MODULE_ROUTE_PREFIX,
} from '@/shared/constants'
import { canonicalizeModulePathname } from '@/shared/constants/moduleRoutes'

function HomePageFallback() {
  return (
    <AccountSelectionLayout>
      <HomeContentSkeleton />
    </AccountSelectionLayout>
  )
}

function LegacyPathRedirect() {
  const location = useLocation()
  const canonical =
    canonicalizeModulePathname(location.pathname) ||
    legacyDashboardPathToModuleRoute(location.pathname)
  return <Navigate to={`${canonical}${location.search || ''}${location.hash || ''}`} replace />
}

function ModuleRouteRedirect() {
  const location = useLocation()
  const target = legacyDashboardPathToModuleRoute(location.pathname)
  return <Navigate to={`${target}${location.search || ''}${location.hash || ''}`} replace />
}

const moduleShell = (
  <RequireAuth requireSeat>
    <Suspense fallback={<DashboardPageSkeleton />}>
      <DashboardPage />
    </Suspense>
  </RequireAuth>
)

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path={ROUTES.LOGIN}
        element={
          <GuestOnly>
            <Suspense fallback={<LoginPageSkeleton />}>
              <LoginPage />
            </Suspense>
          </GuestOnly>
        }
      />
      <Route path="/login" element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route
        path={ROUTES.DEPARTMENT_LOGIN}
        element={
          <GuestOnly>
            <Suspense fallback={<LoginPageSkeleton />}>
              <DepartmentLoginPage />
            </Suspense>
          </GuestOnly>
        }
      />
      <Route
        path={ROUTES.MODULE_LOGIN}
        element={
          <Suspense fallback={<LoginPageSkeleton />}>
            <ModuleLoginPage />
          </Suspense>
        }
      />
      <Route
        path={ROUTES.FORGOT_PASSWORD}
        element={
          <GuestOnly>
            <Suspense fallback={<LoginPageSkeleton />}>
              <ForgotPasswordPage />
            </Suspense>
          </GuestOnly>
        }
      />
      <Route
        path={ROUTES.ONE_TIME_REGISTRATION}
        element={
          <GuestOnly>
            <Suspense fallback={<LoginPageSkeleton />}>
              <OneTimeRegistrationPage />
            </Suspense>
          </GuestOnly>
        }
      />
      <Route
        path={ROUTES.APPLICATION_TRACKING}
        element={
          <GuestOnly>
            <Suspense fallback={<LoginPageSkeleton />}>
              <ApplicationTrackingPage />
            </Suspense>
          </GuestOnly>
        }
      />
      <Route
        path={ROUTES.SEATS}
        element={
          <RequireAuth>
            <Suspense fallback={<SeatSelectionSkeleton />}>
              <SeatSelectionPage />
            </Suspense>
          </RequireAuth>
        }
      />
      <Route
        path={ROUTES.MY_PROFILE}
        element={
          <RequireAuth>
            <Suspense fallback={<PageCardSkeleton variant="form" message="Loading profile…" />}>
              <MyProfilePage />
            </Suspense>
          </RequireAuth>
        }
      />
      <Route
        path={ROUTES.HOME}
        element={
          <RequireAuth requireSeat>
            <Suspense fallback={<HomePageFallback />}>
              <HomePage />
            </Suspense>
          </RequireAuth>
        }
      />
      <Route path="/dashboard/*" element={<LegacyPathRedirect />} />
      <Route path="/setup/*" element={<LegacyPathRedirect />} />
      <Route path="/setup" element={<LegacyPathRedirect />} />
      <Route path="/asset/*" element={<LegacyPathRedirect />} />
      <Route path="/asset" element={<LegacyPathRedirect />} />
      <Route path="/sample-module/*" element={<LegacyPathRedirect />} />
      <Route path="/sample-module" element={<LegacyPathRedirect />} />
      <Route path="/workforce/*" element={<LegacyPathRedirect />} />
      <Route path="/workforce" element={<LegacyPathRedirect />} />
      <Route path="/workforce-management/*" element={<LegacyPathRedirect />} />
      <Route path="/workforce-management" element={<LegacyPathRedirect />} />
      <Route
        path={ROUTES.SETUP_ROOT}
        element={<Navigate to={getModuleRoute('company-setup', 'overview')} replace />}
      />
      <Route path={`${MODULE_ROUTE_PREFIX.WORKBENCH}/*`} element={moduleShell} />
      <Route path={`${MODULE_ROUTE_PREFIX.SAMPLE}/*`} element={moduleShell} />
      <Route path={`${MODULE_ROUTE_PREFIX.GUIDELINES}/*`} element={moduleShell} />
      <Route path={`${MODULE_ROUTE_PREFIX.WORKFORCE}/*`} element={moduleShell} />
      <Route path={`${MODULE_ROUTE_PREFIX.ADMINISTRATION_SETUP}/*`} element={moduleShell} />
      <Route path={`${MODULE_ROUTE_PREFIX.ADMINISTRATION_ASSET}/*`} element={moduleShell} />
      <Route path={ROUTES.ACCESSIBILITY_STATEMENT} element={<AccessibilityStatementPage />} />
      <Route path={ROUTES.SCREEN_READER_ACCESS} element={<ScreenReaderAccessPage />} />
      <Route path="/:primaryTab/:secondaryTab" element={moduleShell} />
      <Route path="/:primaryTab" element={<ModuleRouteRedirect />} />
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  )
}
