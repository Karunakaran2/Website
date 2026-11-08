import { formatSetupLoadError } from '../utils/setupApiError'

export default function SetupLoadErrorAlert({ error, className = '' }) {
  const message = typeof error === 'string' ? error : formatSetupLoadError(error)
  if (!message) {
    return null
  }

  return (
    <p
      className={`mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 ${className}`.trim()}
      role="alert"
    >
      {message}
    </p>
  )
}
