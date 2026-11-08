import { Component } from 'react'
import { useLocation } from 'react-router-dom'
import { retryLazyPages } from '@/app/routes/lazyPage'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { BodyText, PageTitle } from '@/shared/components/typography'
import { PAGE_SECTION_SHELL_CLASS } from '@/shared/components/page/pageHeaderStyles'

function ErrorFallback({ variant = 'page', onRetry }) {
  const isPage = variant === 'page'

  return (
    <div
      className={
        isPage
          ? 'flex min-h-svh items-center justify-center bg-[#FDFEFF] p-4'
          : 'w-full min-w-0'
      }
      role="alert"
    >
      <div className={`${PAGE_SECTION_SHELL_CLASS} w-full max-w-xl p-6`}>
        <PageTitle as="h2">Something went wrong</PageTitle>
        <BodyText className="mt-2 text-slate-600">
          This screen could not be shown. Try again, or open another menu item. The header,
          navigation, and other modules stay available.
        </BodyText>
        <div className="mt-4">
          <GigwButton variant="primary" type="button" onClick={onRetry}>
            Try again
          </GigwButton>
        </div>
      </div>
    </div>
  )
}

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false })
    }
  }

  handleRetry = () => {
    retryLazyPages()
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback variant={this.props.variant} onRetry={this.handleRetry} />
    }
    return this.props.children
  }
}

/** Resets the fallback when the route changes so the next screen can mount. */
export function RouteErrorBoundary({ children, variant = 'page' }) {
  const { pathname, search } = useLocation()
  return (
    <ErrorBoundary resetKey={`${pathname}${search}`} variant={variant}>
      {children}
    </ErrorBoundary>
  )
}
