import { useCallback, useEffect, useState } from 'react'
import { useProbityForm } from '@/shared/utils/useProbityForm'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { WEBSITE_AUTH_ENABLED } from '@/shared/config/websiteAuth'
import { useGetCaptchaQuery, useLoginMutation } from '../services/authApi'
import { loginSuccess } from '../redux/slice'
import { ROUTES } from '@/shared/constants'

const CAPTCHA_TTL_MS = 5 * 60 * 1000

export function useLoginForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loginMutation] = useLoginMutation()
  const {
    data: captcha,
    isFetching: captchaLoading,
    error: captchaQueryError,
    refetch: refetchCaptcha,
  } = useGetCaptchaQuery(undefined, { skip: WEBSITE_AUTH_ENABLED })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useProbityForm({
    defaultValues: {
      username: '',
      password: '',
      captcha: '',
    },
  })

  const refreshCaptcha = useCallback(async () => {
    setValue('captcha', '')
    await refetchCaptcha()
  }, [refetchCaptcha, setValue])

  useEffect(() => {
    if (!captcha?.captchaId) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      refreshCaptcha()
    }, CAPTCHA_TTL_MS)

    return () => window.clearTimeout(timer)
  }, [captcha?.captchaId, refreshCaptcha])

  const onSubmit = async (data) => {
    if (!WEBSITE_AUTH_ENABLED && !captcha?.captchaId) {
      setSubmitError('CAPTCHA is required')
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const result = await loginMutation({
        username: data.username,
        password: data.password,
        captchaId: captcha?.captchaId,
        captcha: data.captcha,
      }).unwrap()

      dispatch(loginSuccess(result.user))
      setIsSubmitting(false)
      navigate(WEBSITE_AUTH_ENABLED || result.user?.seatSelected ? ROUTES.HOME : ROUTES.SEATS, {
        replace: true,
      })
    } catch (error) {
      const message =
        typeof error?.data === 'string'
          ? error.data
          : typeof error?.data?.message === 'string'
            ? error.data.message
            : WEBSITE_AUTH_ENABLED
              ? 'Login failed. Check username and password.'
              : 'Login failed. Check username, password, and CAPTCHA.'
      setSubmitError(message)
      if (!WEBSITE_AUTH_ENABLED) {
        await refreshCaptcha()
      }
      setIsSubmitting(false)
    }
  }

  const applyMockCredential = useCallback(
    (username = 'admin', password = WEBSITE_AUTH_ENABLED ? 'Admin@123' : 'password') => {
      setValue('username', username, { shouldValidate: true })
      setValue('password', password, { shouldValidate: true })
      if (captcha?.code) {
        setValue('captcha', captcha.code, { shouldValidate: true })
      } else {
        setValue('captcha', '8X4K2', { shouldValidate: true })
      }
    },
    [captcha?.code, setValue],
  )

  const fillDemoCredentials = useCallback(
    () => applyMockCredential('admin', 'password'),
    [applyMockCredential],
  )

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    submitError,
    captchaImage: captcha?.imageBase64 ?? '',
    captchaCode: captcha?.code ?? '',
    captchaLoading,
    captchaError:
      typeof captchaQueryError?.data === 'string'
        ? captchaQueryError.data
        : captchaQueryError
          ? 'Unable to load CAPTCHA'
          : '',
    refreshCaptcha,
    applyMockCredential,
    fillDemoCredentials,
  }
}
