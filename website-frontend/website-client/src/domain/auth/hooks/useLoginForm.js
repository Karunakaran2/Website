import { useCallback, useEffect, useState } from 'react'
import { useProbityForm } from '@/shared/utils/useProbityForm'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { apiPayloadMessage } from '@/shared/api/apiError'
import { useLoginMutation } from '../services/authApi'
import { useGetCaptchaQuery } from '../services/captchaApi'
import { loginSuccess } from '../redux/slice'
import { ROUTES } from '@/shared/constants'
import { WEBSITE_AUTH_ENABLED } from '@/shared/config/websiteAuth'
import { getWebsiteCmsHomePath } from '@/domain/website-cms/utils/cmsHome'
import { applyPrivilegeCodesFromPayload } from '@/shared/privileges/loadPrivilegeCodes'

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
  } = useGetCaptchaQuery()
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
    if (!captcha?.captchaId) {
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
      applyPrivilegeCodesFromPayload(dispatch, { privilegeCodes: result.user?.privilegeCodes })
      setIsSubmitting(false)
      navigate(WEBSITE_AUTH_ENABLED ? getWebsiteCmsHomePath() : ROUTES.HOME, { replace: true })
    } catch (error) {
      const message =
        typeof error?.data === 'string'
          ? error.data
          : apiPayloadMessage(error?.payload, 'Login failed. Check username, password, and CAPTCHA.')
      setSubmitError(message)
      await refreshCaptcha()
      setIsSubmitting(false)
    }
  }

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    submitError,
    captchaImage: captcha?.imageBase64 ?? '',
    captchaLoading,
    captchaError:
      typeof captchaQueryError?.data === 'string'
        ? captchaQueryError.data
        : captchaQueryError
          ? 'Unable to load CAPTCHA'
          : '',
    refreshCaptcha,
  }
}