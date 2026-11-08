import { Link } from 'react-router-dom'
import AuthPageShell from '@/shared/layouts/AuthPageShell'
import { ROUTES } from '@/shared/constants'
import { useModuleLogin } from '../hooks/useModuleLogin'

export default function ModuleLoginPage() {
  const { error } = useModuleLogin()

  return (
    <AuthPageShell>
      <section
        className="flex min-h-[240px] flex-1 items-center justify-center px-6 py-10"
        aria-live="polite"
        aria-label="Financial Accounting sign-in"
      >
        {error ? (
          <div className="max-w-md text-center">
            <p className="text-[14px] text-slate-800">{error}</p>
            <Link
              to={ROUTES.LOGIN}
              className="mt-4 inline-block text-[14px] font-semibold text-[#01458e]"
            >
              Go to login
            </Link>
          </div>
        ) : (
          <p className="text-[14px] text-slate-700">Opening Financial Accounting…</p>
        )}
      </section>
    </AuthPageShell>
  )
}
