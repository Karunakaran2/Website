import { useCallback, useMemo, useState } from 'react'
import { useProbityForm } from '@/shared/utils/useProbityForm'
import { scheduleFocusFirstFormError } from '@/shared/utils/formValidationFocus'

const DEMO_OTP_LENGTH = 6

function passwordsMatch(password, confirmPassword) {
  return password === confirmPassword
}

/**
 * Demonstration-only one-time registration (no backend; does not create a session).
 */
export function useOneTimeRegistrationForm() {
  const [activeStep, setActiveStep] = useState(1)
  const [maxReachableStep, setMaxReachableStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [otpValue, setOtpValueState] = useState('')
  const setOtpValue = useCallback((valueOrEvent) => {
    const value =
      typeof valueOrEvent === 'string' ? valueOrEvent : (valueOrEvent?.target?.value ?? '')
    setOtpValueState(value)
    setSubmitError('')
  }, [])

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useProbityForm({
    defaultValues: {
      fullName: '',
      email: '',
      mobile: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  })

  const steps = useMemo(
    () => [
      { step: 1, title: 'Account details' },
      { step: 2, title: 'Verify contact' },
      { step: 3, title: 'Complete' },
    ],
    []
  )

  const validateStepOne = useCallback(async () => {
    const valid = await trigger(['fullName', 'email', 'mobile', 'username', 'password', 'confirmPassword'])
    if (!valid) {
      scheduleFocusFirstFormError()
      return false
    }
    const { password, confirmPassword } = getValues()
    if (!passwordsMatch(password, confirmPassword)) {
      setSubmitError('Password and confirmation must match.')
      return false
    }
    setSubmitError('')
    return true
  }, [getValues, trigger])

  const goToStep = useCallback(
    (step) => {
      if (step <= maxReachableStep) {
        setActiveStep(step)
        setSubmitError('')
      }
    },
    [maxReachableStep]
  )

  const onContinueFromDetails = useCallback(async () => {
    const ok = await validateStepOne()
    if (!ok) {
      return
    }
    setIsSubmitting(true)
    await new Promise((resolve) => window.setTimeout(resolve, 350))
    setIsSubmitting(false)
    setActiveStep(2)
    setMaxReachableStep(2)
    setOtpValueState('')
  }, [validateStepOne])

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
    setActiveStep(3)
    setMaxReachableStep(3)
  }, [otpValue])

  return {
    steps,
    activeStep,
    maxReachableStep,
    goToStep,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    submitError,
    setSubmitError,
    otpValue,
    setOtpValue,
    onContinueFromDetails,
    onVerifyOtp,
  }
}
