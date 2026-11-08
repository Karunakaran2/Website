import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import BackButton from '@/shared/components/buttons/BackButton'
import { SubmitButton } from '@/shared/components/buttons'
import { InputField } from '@/shared/components/forms'
import AuthPageShell from '@/shared/layouts/AuthPageShell'
import AuthPageCard from '@/domain/auth/components/AuthPageCard'
import AuthSecondaryContent from '@/domain/auth/components/AuthSecondaryContent'
import ApplicationTrackStatusPanel from '@/domain/auth/components/ApplicationTrackStatusPanel'
import { fetchApplicationTrackingStatus } from '@/domain/auth/hooks/useApplicationTracking'
import { ROUTES } from '@/shared/constants'
import { authPrimarySubmitClass } from '@/domain/auth/constants/authFormStyles'

export default function ApplicationTrackingPage() {
  const { t } = useTranslation()
  const [trackingId, setTrackingId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const handleSearch = async (event) => {
    event.preventDefault()
    const trimmed = trackingId.trim()
    if (!trimmed) {
      setError(t('trackApplication.required', 'Enter a tracking ID.'))
      setResult(null)
      return
    }
    setLoading(true)
    setError('')
    const response = await fetchApplicationTrackingStatus(trimmed)
    setLoading(false)
    if (!response.ok) {
      setError(response.message || t('trackApplication.fetchFailed', 'Unable to fetch status.'))
      setResult(null)
      return
    }
    setResult(response.data)
  }

  return (
    <AuthPageShell variant="page">
      <AuthSecondaryContent width="wide">
        <AuthPageCard
          title={t('trackApplication.pageTitle', 'Application / Request Tracking')}
          subtitle={t(
            'trackApplication.pageSubtitle',
            'Search by tracking ID to view the current status of your portal request.',
          )}
          actions={
            <BackButton to={ROUTES.LOGIN} className="shrink-0 py-2">
              {t('authCommon.backToLogin')}
            </BackButton>
          }
        >
          <form onSubmit={handleSearch} className="flex min-w-0 flex-col gap-4 font-noto" noValidate>
            <InputField
              name="trackingId"
              label={t('trackApplication.trackingId', 'Tracking ID')}
              value={trackingId}
              onChange={(event) => {
                setTrackingId(event.target.value)
                setError('')
              }}
              placeholder={t('trackApplication.placeholder', 'Enter Tracking ID')}
              required
              error={error}
            />
            <SubmitButton
              type="submit"
              hideIcon
              disabled={loading}
              className={`${authPrimarySubmitClass} !mt-0 max-w-md`}
              aria-busy={loading}
            >
              {loading
                ? t('trackApplication.fetching', 'Fetching…')
                : t('trackApplication.fetchStatus', 'Fetch Status')}
            </SubmitButton>
            {String(import.meta.env.VITE_MOCK_API ?? 'true').toLowerCase() === 'true' ? (
              <p className="m-0 text-xs text-slate-500" role="note">
                {t(
                  'trackApplication.mockHint',
                  'Demo: use tracking ID KRAN-DEMO-001 to see a sample timeline.',
                )}
              </p>
            ) : null}
          </form>

          {result ? (
            <div className="mt-8 border-t border-slate-200 pt-6">
              <ApplicationTrackStatusPanel {...result} />
            </div>
          ) : null}
        </AuthPageCard>
      </AuthSecondaryContent>
    </AuthPageShell>
  )
}
