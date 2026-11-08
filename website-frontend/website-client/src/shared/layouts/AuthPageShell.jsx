import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import AccessibilityBar from '@/shared/components/AccessibilityBar'
import kranLogo from '@/assets/kran-mark.png'
import AuthPublicNavLinks from '@/domain/auth/components/AuthPublicNavLinks'
import { ROUTES } from '@/shared/constants'

function LoginNavBar() {
  return (
    <header className="shadow-header shrink-0 bg-[#01458e] text-white">
      <div className="page-shell flex items-center justify-between gap-2 py-2 sm:gap-4 sm:py-3">
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex min-w-0 items-center rounded no-underline font-sans text-2xl font-semibold text-white sm:text-3xl"
          aria-label="KRAN Consulting Design System"
        >
          KRAN Design System
        </Link>
        <AuthPublicNavLinks />
      </div>
    </header>
  )
}

function LoginFooterBar() {
  return (
    <footer className="mt-auto shrink-0 bg-[#01458e] text-white">
      <div className="page-shell flex flex-col items-center justify-between gap-1.5 py-1.5 sm:flex-row sm:gap-4">
        <p className="m-0 text-center text-xs text-white/90 sm:text-left">
          KRAN Consulting Design System
        </p>
        <a
          href="https://kran.co.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <img src={kranLogo} alt="KRAN" className="h-auto w-[60px] max-w-[60px] shrink-0" />
        </a>
      </div>
    </footer>
  )
}

/**
 * Shared auth chrome. Login variant: accessibility bar only; other auth pages include navy header, yellow strip, and footer.
 */
export default function AuthPageShell({ children, variant = 'page', mainClassName = '' }) {
  useEffect(() => {
    const root = document.documentElement
    const prevTheme = root.getAttribute('data-theme')
    const prevMode = root.getAttribute('data-mode')
    root.setAttribute('data-theme', 'light')
    root.setAttribute('data-mode', 'light')
    root.classList.remove('dark')
    return () => {
      if (prevTheme) root.setAttribute('data-theme', prevTheme)
      else root.removeAttribute('data-theme')
      if (prevMode) root.setAttribute('data-mode', prevMode)
      else root.removeAttribute('data-mode')
    }
  }, [])

  const isLogin = variant === 'login'

  return (
    <div
      className={[
        'force-light flex min-h-screen flex-col bg-white text-slate-800',
        isLogin ? 'min-h-[100dvh] lg:h-screen lg:overflow-hidden' : '',
      ].join(' ')}
    >
      {!isLogin ? (
        <div className="sticky top-0 z-[100] shrink-0 overflow-visible bg-white shadow-sm">
          <AccessibilityBar dense optionsPortal />
          <LoginNavBar />
          <div className="h-1 w-full bg-[#f5c518]" aria-hidden />
        </div>
      ) : null}

      <main
        id="main-content"
        tabIndex={-1}
        className={[
          'flex min-h-0 flex-1 flex-col outline-none',
          isLogin
            ? 'min-h-0 overflow-x-hidden overflow-y-auto lg:overflow-hidden'
            : 'overflow-auto py-5',
          mainClassName,
        ].join(' ')}
      >
        {children}
      </main>

      {!isLogin ? <LoginFooterBar /> : null}
    </div>
  )
}
