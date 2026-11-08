import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Clock } from 'lucide-react'
import FormModal from '@/shared/components/modals/FormModal'
import { InputField } from '@/shared/components/forms'
import { SubmitButton } from '@/shared/components/buttons'
import ApplicationTrackStatusModal from './ApplicationTrackStatusModal'
import { fetchApplicationTrackingStatus } from '@/domain/auth/hooks/useApplicationTracking'

export default function TrackApplicationModal({ isOpen, onClose, initialTrackingId = '' }) {
  const { t } = useTranslation()
  const [trackingInput, setTrackingInput] = useState('')
  const [viewTrackingId, setViewTrackingId] = useState('')
  const [showStatus, setShowStatus] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [statusPayload, setStatusPayload] = useState(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }
    const trimmed = (initialTrackingId || '').trim()
    setTrackingInput(trimmed)
    setFetchError('')
    if (trimmed) {
      void runFetch(trimmed)
    } else {
      setViewTrackingId('')
      setShowStatus(false)
      setStatusPayload(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialTrackingId])

  const runFetch = async (id) => {
    const trimmed = id.trim()
    if (!trimmed) {
      return
    }
    setLoading(true)
    setFetchError('')
    const result = await fetchApplicationTrackingStatus(trimmed)
    setLoading(false)
    if (!result.ok) {
      setFetchError(result.message || t('trackApplication.fetchFailed', 'Unable to fetch status.'))
      setShowStatus(false)
      setStatusPayload(null)
      return
    }
    setViewTrackingId(trimmed)
    setStatusPayload(result.data)
    setShowStatus(true)
  }

  const handleFetch = (event) => {
    event?.preventDefault()
    void runFetch(trackingInput)
  }

  const handleClose = () => {
    if (loading) {
      return
    }
    onClose?.()
  }

  if (!showStatus || !statusPayload) {
    return (
      <FormModal
        open={isOpen}
        onClose={handleClose}
        title={t('trackApplication.title', 'Application Tracker')}
        icon={<Clock size={16} aria-hidden />}
        size="md"
        showFooter={false}
        cancelDisabled={loading}
      >
        <form onSubmit={handleFetch} className="flex min-w-0 flex-col gap-4 text-left font-noto">
          <div>
            <p className="m-0 text-sm font-semibold text-slate-800">
              {t('trackApplication.heading', 'Track Your Request')}
            </p>
            <p className="mb-0 mt-1 text-xs text-slate-500">
              {t('trackApplication.desc', 'Enter your ID to check registration progress.')}
            </p>
          </div>

          <InputField
            id="track-application-id"
            name="track-application-id"
            label={t('trackApplication.trackingId', 'Tracking ID')}
            type="text"
            value={trackingInput}
            onChange={(event) => setTrackingInput(event.target.value)}
            placeholder={t('trackApplication.placeholder', 'Enter Tracking ID')}
            autoFocus
          />

          {fetchError ? (
            <p className="m-0 text-sm font-medium text-rose-600" role="alert">
              {fetchError}
            </p>
          ) : null}

          <SubmitButton
            type="submit"
            disabled={!trackingInput.trim() || loading}
            className="w-full justify-center"
            hideIcon
            aria-busy={loading}
          >
            {loading
              ? t('trackApplication.fetching', 'Fetching…')
              : t('trackApplication.fetchStatus', 'Fetch Status')}
          </SubmitButton>

          {String(import.meta.env.VITE_MOCK_API ?? 'true').toLowerCase() === 'true' ? (
            <p className="m-0 text-[11px] text-slate-500" role="note">
              {t(
                'trackApplication.mockHint',
                'Demo: use tracking ID KRAN-DEMO-001 to see a sample timeline.',
              )}
            </p>
          ) : null}
        </form>
      </FormModal>
    )
  }

  return (
    <ApplicationTrackStatusModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('trackApplication.statusTitle', 'Track Application')}
      trackingId={viewTrackingId}
      submittedDate={statusPayload.submittedDate}
      applicantName={statusPayload.applicantName}
      status={statusPayload.status}
      statusBadgeClass={statusPayload.statusBadgeClass}
      remark={statusPayload.remark}
      timeline={statusPayload.timeline}
    />
  )
}
