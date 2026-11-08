import DocumentTitleSync from '@/app/shell/components/DocumentTitleSync'
import AppRoutes from '@/app/routes/AppRoutes'
import { RouteErrorBoundary } from '@/shared/components/ErrorBoundary'
import AppSuccessToastContainer from '@/shared/components/toast/AppSuccessToastContainer'

export default function App() {
  return (
    <>
      <AppSuccessToastContainer />
      <DocumentTitleSync />
      <RouteErrorBoundary variant="page">
        <AppRoutes />
      </RouteErrorBoundary>
    </>
  )
}
