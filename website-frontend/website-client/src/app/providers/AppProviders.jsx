import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from '@/app/store'
import SessionGuard from '@/domain/auth/components/SessionGuard'
import SessionManager from '@/domain/auth/components/SessionManager'
import SessionSync from '@/domain/auth/components/SessionSync'
import AppScrollManager from '@/shared/navigation/AppScrollManager'
import { registerSessionLogoutStore } from '@/domain/auth/utils/completeSessionLogout'
import { ensureSharedSessionHydrated } from '@/domain/auth/utils/sessionBootstrap'
import { ActionConfirmProvider } from '@/shared/components/confirm'
import { FontSizeProvider } from '@/shared/components/context/FontSizeContext'
import { getPublicBase } from '@/shared/utils/publicBase'

registerSessionLogoutStore(store)
ensureSharedSessionHydrated(store)

function routerBasename() {
  const base = getPublicBase()
  return base || undefined
}

function SpfoThemeBootstrap() {
  useEffect(() => {
    const root = document.documentElement
    if (!root.getAttribute('data-theme')) {
      root.setAttribute('data-theme', 'light')
    }
    if (!root.getAttribute('data-mode')) {
      root.setAttribute('data-mode', 'light')
    }
  }, [])
  return null
}

/** Same provider stack pattern as spfo_frontend App.jsx (FontSizeProvider wraps the router). */
export default function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <FontSizeProvider>
        <SpfoThemeBootstrap />
        <BrowserRouter basename={routerBasename()}>
          <ActionConfirmProvider>
            <SessionSync />
            <SessionGuard />
            <SessionManager />
            <AppScrollManager />
            {children}
          </ActionConfirmProvider>
        </BrowserRouter>
      </FontSizeProvider>
    </Provider>
  )
}
