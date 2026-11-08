import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import CaptchaField from '@/domain/auth/components/CaptchaField'
import { ROUTES } from '@/shared/constants'
import {
  loginLabelClass,
  loginLinkClass,
  loginOutlineBtnClass,
  loginPillInputClass,
  loginPrimaryBtnClass,
  loginFooterLinkClass,
} from '@/domain/auth/constants/loginFormStyles'

export default function LoginPasswordForm({
  login,
  identifierLabel,
  identifierPlaceholder,
  showOtpOption = false,
  onSwitchToOtp,
  onOpenForgotPassword,
  showNewUserFooter = false,
  disabled = false,
  onFieldInteraction,
}) {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    submitError,
    captchaImage,
    captchaLoading,
    captchaError,
    refreshCaptcha,
  } = login

  const fieldValidation = useMemo(
    () => ({
      username: {
        required: t('login.usernameRequired'),
        validate: (value) => value.trim().length > 0 || t('login.usernameRequired'),
      },
      password: {
        required: t('login.passwordRequired'),
        validate: (value) => value.trim().length > 0 || t('login.passwordRequired'),
      },
    }),
    [t],
  )

  const usernameError = errors.username?.message
  const passwordError = errors.password?.message

  return (
    <form
      className="w-full space-y-5"
      onSubmit={handleSubmit}
      noValidate
      aria-label={t('login.formAria')}
    >
      <div>
        <label className={loginLabelClass} htmlFor="login-identifier">
          {t(identifierLabel, identifierLabel)}
        </label>
        <input
          id="login-identifier"
          type="text"
          autoComplete="username"
          disabled={disabled}
          placeholder={t(identifierPlaceholder, identifierPlaceholder)}
          className={`${loginPillInputClass} ${
            usernameError ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''
          }`}
          {...register('username', fieldValidation.username)}
          onFocus={() => onFieldInteraction?.()}
          onClick={() => onFieldInteraction?.()}
        />
        {usernameError ? (
          <p className="mt-1 text-xs font-medium text-red-600" role="alert">
            {usernameError}
          </p>
        ) : null}
      </div>

      <div>
        <label className={loginLabelClass} htmlFor="login-password">
          {t('login.password')}
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            disabled={disabled}
            placeholder={t('login.passwordPlaceholder')}
            className={`${loginPillInputClass} pr-12 ${
              passwordError ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''
            }`}
            {...register('password', fieldValidation.password)}
            onFocus={() => onFieldInteraction?.()}
            onClick={() => onFieldInteraction?.()}
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-4 top-1/2 z-[1] -translate-y-1/2 cursor-pointer border-0 bg-transparent p-0 text-slate-400 hover:text-slate-600"
            aria-label={
              showPassword
                ? t('login.hidePassword', 'Hide password')
                : t('login.showPassword', 'Show password')
            }
          >
            {showPassword ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
          </button>
        </div>
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            className={loginLinkClass}
            onClick={() => {
              onFieldInteraction?.()
              onOpenForgotPassword?.()
            }}
          >
            {t('login.forgotPassword')}
          </button>
        </div>
        {passwordError ? (
          <p className="mt-1 text-xs font-medium text-red-600" role="alert">
            {passwordError}
          </p>
        ) : null}
      </div>

      <CaptchaField
        variant="spfoLogin"
        register={register}
        error={errors.captcha}
        captchaImage={captchaImage}
        captchaLoading={captchaLoading}
        captchaError={captchaError}
        onRefresh={refreshCaptcha}
        disabled={isSubmitting || disabled}
      />

      {submitError ? (
        <div
          className="flex items-center gap-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
          role="alert"
        >
          <AlertCircle size={14} className="shrink-0" aria-hidden />
          {submitError}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={disabled || isSubmitting || captchaLoading || !captchaImage}
        className={loginPrimaryBtnClass}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? t('login.submitting') : t('login.signInTitle', 'Sign in')}
      </button>

      {showOtpOption ? (
        <button
          type="button"
          onClick={onSwitchToOtp}
          disabled={disabled}
          className={loginOutlineBtnClass}
        >
          {t('login.signInWithOtp', 'Sign in with OTP')}
        </button>
      ) : null}

      {showNewUserFooter ? (
        <p className="mb-0 pt-2 text-center font-noto text-sm text-[#263AB5]">
          {t('login.newUserQuestion', 'New User?')}{' '}
          <Link to={ROUTES.ONE_TIME_REGISTRATION} className={loginFooterLinkClass}>
            {t('login.oneTimeRegistrationShort', 'One Time Registration')}
          </Link>
        </p>
      ) : null}
    </form>
  )
}
