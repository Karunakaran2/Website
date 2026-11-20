import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/app/App'
import AppProviders from '@/app/providers/AppProviders'
import './index.css'
import '@/shared/i18/i18n'
import { syncHostPortalFavicon } from '@/app/config/syncHostPortalFavicon'
import { isMockEnabled } from '@/shared/api/mock/mockConfig'

const container = document.getElementById('root')

function renderApp() {
  const tree = (
    <StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </StrictMode>
  )

  if (!container._kranRoot) {
    container._kranRoot = createRoot(container)
  }
  container._kranRoot.render(tree)
}

async function bootstrap() {
  if (isMockEnabled()) {
    const { installMockFetchInterceptor } = await import('@/shared/api/mock/mockFetchInterceptor')
    installMockFetchInterceptor()
  }
  syncHostPortalFavicon()
  renderApp()
}

bootstrap()

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    renderApp()
  })
}
