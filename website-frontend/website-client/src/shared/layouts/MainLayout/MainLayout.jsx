import { useEffect } from 'react'
import AppFooter from '@/shared/components/common/Footer/AppFooter'
import {
  MODULE_MAIN_CLASS,
  MODULE_ROOT_CLASS,
} from '@/shared/constants/moduleContentStyles'
import { ModuleChrome } from '@/shared/layouts/ModulePageShell'

/**
 * Logged-in shell — SPFO ModuleLayout: scroll on main, chrome + footer fixed in column.
 */
export default function MainLayout({
  header,
  beforeMain,
  children,
  mainClassName = MODULE_MAIN_CLASS,
  useFullViewport = true,
}) {
  const rootClass = useFullViewport ? MODULE_ROOT_CLASS : 'flex h-full max-h-full min-h-0 flex-col overflow-hidden bg-[#FDFEFF]'

  useEffect(() => {
    const html = document.documentElement
    html.classList.add('probity-shell-lock')
    return () => {
      html.classList.remove('probity-shell-lock')
    }
  }, [])

  return (
    <div className={rootClass}>
      <ModuleChrome header={header} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {beforeMain}
        <main id="main-content" tabIndex={-1} className={mainClassName}>
          <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col">{children}</div>
        </main>
        <AppFooter />
      </div>
    </div>
  )
}
