import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import OtpDigitInputs from '@/shared/components/forms/OtpDigitInputs'
import {
  loginLabelClass,
  loginOutlineBtnClass,
  loginPillInputClass,
  loginPrimaryBtnClass,
} from '@/domain/auth/constants/loginFormStyles'

export default function LoginOtpForm({
  identifierLabel,
  identifierPlaceholder,
  identifierName,
  onSwitchToPassword,
  disabled = false,
  onRequireAccountSelection,
  selectedType,
}) {
  const { t } = useTranslation()
  const [identifier, setIdentifier] = useState('')
  const [otpState, setOtpState] = useState('request')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(32)
  const [otpError, setOtpError] = useState('')

  useEffect(() => {
    let interval
    if (otpState === 'verify' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [otpState, timer])

  const handleFieldInteraction = () => {
    if (!selectedType && onRequireAccountSelection) {
      onRequireAccountSelection()
    }
  }

  const handleSendOtp = (event) => {
    event.preventDefault()
    if (onRequireAccountSelection && !selectedType) {
      onRequireAccountSelection()
      return
    }
    if (identifier.trim()) {
      setOtpState('verify')
      setTimer(32)
      setOtpError('')
    }
  }

  const handleVerifyOtp = (event) => {
    event.preventDefault()
    if (onRequireAccountSelection && !selectedType) {
      onRequireAccountSelection()
      return
    }
    setOtpError(
      t(
        'login.otpNotConfigured',
        'OTP sign-in is not configured for this portal demo. Use password sign-in.',
      ),
    )
  }

  const handleOtpChange = (index, value) => {
    let next = value
    if (next.length > 1) {
      next = next.slice(-1)
    }
    const newOtp = [...otp]
    newOtp[index] = next
    setOtp(newOtp)
    if (next && index < 5) {
      document.getElementById(`login-otp-${index + 1}`)?.focus()
    }
  }

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`login-otp-${index - 1}`)?.focus()
    }
  }

  const otpInputClass = `h-10 w-9 min-w-0 flex-1 max-w-[3rem] rounded border border-slate-300 text-center text-base font-semibold outline-none focus:border-[#01458e] focus:ring-1 focus:ring-[#01458e] sm:h-12 sm:text-lg ${
    disabled || otpState === 'request'
      ? 'cursor-not-allowed bg-slate-100 text-slate-400'
      : 'bg-white text-slate-800'
  }`

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const switchLabel = t('login.signInWithIdentifier', {
    defaultValue: `Sign in with ${identifierName}`,
    identifier: identifierName,
  })

  return (
    <form
      onSubmit={otpState === 'request' ? handleSendOtp : handleVerifyOtp}
      className="space-y-5"
      noValidate
    >
      <div>
        <label className={loginLabelClass} htmlFor="login-otp-identifier">
          {t(identifierLabel, identifierLabel)}
        </label>
        <div className="relative">
          <input
            id="login-otp-identifier"
            type="text"
            value={identifier}
            onChange={(event) => {
              setIdentifier(event.target.value)
              handleFieldInteraction()
            }}
            onFocus={handleFieldInteraction}
            onClick={handleFieldInteraction}
            placeholder={t(identifierPlaceholder, identifierPlaceholder)}
            disabled={disabled || otpState === 'verify'}
            className={`${loginPillInputClass} ${otpState === 'verify' ? 'bg-slate-50 pr-10' : ''}`}
          />
          {otpState === 'verify' && !disabled ? (
            <CheckCircle2
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600"
              aria-hidden
            />
          ) : null}
        </div>
        {otpState === 'request' ? (
          <p className="mt-1.5 text-[11px] text-slate-500">
            {t('login.otpSendHintLead', 'We will send a')}{' '}
            <span className="font-semibold text-[#01458e]">
              {t('login.otpSixDigit', '6-digit OTP')}
            </span>{' '}
            {t('login.otpSendHintTail', 'to your mobile number.')}
          </p>
        ) : (
          <div className="mt-1.5 rounded border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-900">
            {t('login.otpSentBanner', "We've sent a")}{' '}
            <span className="font-semibold">{t('login.otpSixDigit', '6-digit OTP')}</span>{' '}
            {t('login.otpSentBannerTail', 'to your mobile number.')}
          </div>
        )}
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between gap-2 text-xs">
          <span className="font-medium text-slate-700">{t('login.verifyOtp', 'Verify OTP')}</span>
          {otpState === 'verify' && !disabled ? (
            <span className="tabular-nums text-slate-500">
              {t('login.resendIn', 'Resend in')} {formatTime(timer)}
            </span>
          ) : null}
        </div>
        <p className="mb-2 text-[11px] text-slate-500">
          {otpState === 'verify'
            ? t(
                'login.otpEnterSent',
                'Enter the 6-digit code sent to your mobile number.',
              )
            : t('login.otpEnterAfterRequest', 'Enter the 6-digit code after requesting OTP.')}
        </p>
        <OtpDigitInputs
          otpDigits={otp}
          onDigitChange={handleOtpChange}
          onKeyDown={handleKeyDown}
          idPrefix="login-otp"
          groupLabel={t('login.otpGroupLabel', 'Enter 6-digit verification code')}
          disabled={disabled || otpState === 'request'}
          inputClassName={otpInputClass}
        />
        {otpState === 'verify' && !disabled ? (
          <div className="mt-2 h-2 overflow-hidden rounded bg-slate-100">
            <div
              className="h-full rounded bg-[#01458e] transition-all"
              style={{ width: `${(timer / 32) * 100}%` }}
            />
          </div>
        ) : null}
      </div>

      {otpError ? (
        <div
          className="flex items-center gap-2 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900"
          role="alert"
        >
          <AlertCircle size={14} className="shrink-0" aria-hidden />
          {otpError}
        </div>
      ) : null}

      <button type="submit" disabled={disabled} className={loginPrimaryBtnClass}>
        {otpState === 'request'
          ? t('login.sendOtp', 'Send OTP')
          : t('login.signInTitle', 'Sign in')}
      </button>

      <button
        type="button"
        onClick={onSwitchToPassword}
        disabled={disabled}
        className={loginOutlineBtnClass}
      >
        {switchLabel}
      </button>
    </form>
  )
}
