import { useCallback, useMemo, useState } from 'react'
import { useProbityForm } from '@/shared/utils/useProbityForm'

const DEMO_OTP_LENGTH = 6

function isDemoMode() {
  return String(import.meta.env.VITE_MOCK_API ?? 'true').toLowerCase() === 'true'
}

/**
 * Forgot password flow for modal and legacy page.
 * Demo-only OTP when VITE_MOCK_API=true; wire authApi reset endpoints when available.
 */
export function useForgotPasswordForm() {
  const [step, setStep] = useState('identify')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [otpValue, setOtpValue] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    trigger,
    reset,
    watch,
  } = useProbityForm({
    defaultValues: { identifier: '' },
  })

  const identifier = watch('identifier') ?? ''

  const setIdentifier = useCallback(
    (value) => {
      setValue('identifier', value, { shouldValidate: true, shouldDirty: true })
      setSubmitError('')
    },
    [setValue],
  )

  const maskedIdentifier = useMemo(() => {
    const raw = String(identifier || '').trim()
    if (!raw) {
      return ''
    }
    if (raw.includes('@')) {
      const [user, domain] = raw.split('@')
      const maskedUser = user.length <= 2 ? `${user[0] ?? ''}*` : `${user.slice(0, 2)}***`
      return `${maskedUser}@${domain}`
    }
    if (raw.length <= 4) {
      return '****'
    }
    return `${raw.slice(0, 2)}***${raw.slice(-2)}`
  }, [identifier])

  const onIdentify = useCallback(async () => {
    setIsSubmitting(true)
    setSubmitError('')
    await new Promise((resolve) => window.setTimeout(resolve, 400))
    setIsSubmitting(false)
    if (isDemoMode()) {
      setStep('otp')
      setOtpValue('')
      return
    }
    setSubmitError('Password reset is not available until the reset API is configured.')
  }, [])

  const onVerifyOtp = useCallback(async () => {
    const trimmed = otpValue.replace(/\D/g, '')
    if (trimmed.length !== DEMO_OTP_LENGTH) {
      setSubmitError('Enter the 6-digit verification code.')
      return
    }
    setIsSubmitting(true)
    setSubmitError('')
    await new Promise((resolve) => window.setTimeout(resolve, 400))
    setIsSubmitting(false)
    if (isDemoMode()) {
      setStep('success')
      return
    }
    setSubmitError('Verification failed. Check the code and try again.')
  }, [otpValue])

  const resetFlow = useCallback(() => {
    setStep('identify')
    setSubmitError('')
    setOtpValue('')
    reset({ identifier: '' })
  }, [reset])

  const updateOtpValue = useCallback((valueOrEvent) => {
    const value =
      typeof valueOrEvent === 'string' ? valueOrEvent : (valueOrEvent?.target?.value ?? '')
    setOtpValue(value)
    setSubmitError('')
  }, [])

  const validateIdentify = useCallback(async () => {
    const valid = await trigger('identifier')
    return valid
  }, [trigger])

  return {
    step,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    submitError,
    setSubmitError,
    otpValue,
    setOtpValue: updateOtpValue,
    onIdentify,
    onVerifyOtp,
    resetFlow,
    identifier,
    setIdentifier,
    maskedIdentifier,
    isDemoMode: isDemoMode(),
    validateIdentify,
  }
}
