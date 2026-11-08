import { useTranslation } from 'react-i18next'
import { RefreshCw } from 'lucide-react'
import { Button, Input } from '@/shared/lib/tailwreck'
import { ResetIcon } from '@/shared/components/icons/AppIcons'
import Shimmer from '@/shared/components/ui/Shimmer'
import {
  loginLabelClass,
  loginCaptchaImageShellClass,
  loginCaptchaImageViewportClass,
  loginCaptchaImgClass,
  loginCaptchaInputClass,
  loginCaptchaRowClass,
} from '@/domain/auth/constants/loginFormStyles'

const legacyCaptchaInputClass =
  '[&_input]:!min-h-[44px] [&_input]:!h-11 [&_input]:!w-full [&_input]:!min-w-0 [&_input]:!rounded-md [&_input]:!border [&_input]:!border-slate-300 [&_input]:!bg-white [&_input]:!px-4 [&_input]:!text-base [&_input]:!font-normal [&_input]:!text-probity-ink [&_input]:!shadow-none [&_input]:placeholder:!font-normal [&_input]:placeholder:!text-slate-400 [&_input]:focus:!border-probity-brand [&_input]:focus:!outline-none [&_input]:focus:!ring-0 [&_label]:!hidden sm:[&_input]:!min-h-[52px] sm:[&_input]:!h-[52px]'

function CaptchaRefreshButton({ disabled, loading, onRefresh, className = '' }) {
  const { t } = useTranslation()
  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault()
        onRefresh()
      }}
      disabled={disabled || loading}
      title={t('login.captchaRefresh')}
      className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-[#263AB5] transition hover:bg-slate-100 disabled:opacity-50 ${className}`.trim()}
    >
      <RefreshCw size={16} className={loading ? 'animate-spin' : ''} aria-hidden />
      <span className="sr-only">{t('login.captchaRefresh')}</span>
    </button>
  )
}

function CaptchaImageViewport({ captchaLoading, imageSrc, shimmerClassName, imgClassName }) {
  const { t } = useTranslation()
  return (
    <div className={loginCaptchaImageViewportClass}>
      {captchaLoading ? (
        <Shimmer className={shimmerClassName} />
      ) : imageSrc ? (
        <img src={imageSrc} alt={t('login.captchaAlt')} className={imgClassName} />
      ) : (
        <span className="px-1 text-center text-xs font-semibold text-red-600">
          {t('login.captchaUnavailable')}
        </span>
      )}
    </div>
  )
}

export default function CaptchaField({
  register,
  error,
  captchaImage,
  captchaLoading,
  captchaError,
  onRefresh,
  disabled = false,
  /** @type {'legacy' | 'spfoLogin'} */
  variant = 'legacy',
}) {
  const { t } = useTranslation()
  const imageSrc = captchaImage
    ? captchaImage.startsWith('data:')
      ? captchaImage
      : `data:image/png;base64,${captchaImage}`
    : ''

  if (variant === 'spfoLogin') {
    const captchaReady = Boolean(imageSrc)
    const fieldError = error?.message || error

    return (
      <div className="w-full min-w-0">
        <span className="sr-only">{t('login.captcha')}</span>
        <div className={loginCaptchaRowClass}>
          <div className={loginCaptchaImageShellClass}>
            <CaptchaImageViewport
              captchaLoading={captchaLoading}
              imageSrc={imageSrc}
              shimmerClassName="h-9 w-full max-w-[10rem] rounded sm:h-10"
              imgClassName={loginCaptchaImgClass}
            />
            <CaptchaRefreshButton
              disabled={disabled}
              loading={captchaLoading}
              onRefresh={onRefresh}
            />
          </div>

          <input
            type="text"
            id="captcha"
            placeholder={t('login.captchaPlaceholder')}
            disabled={disabled || (!captchaReady && !captchaLoading)}
            autoComplete="off"
            aria-label={t('login.captchaPlaceholder')}
            aria-invalid={fieldError ? true : undefined}
            className={`${loginCaptchaInputClass} ${
              fieldError ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''
            }`}
            {...register('captcha', {
              required: t('login.captchaRequired'),
              validate: (value) =>
                String(value || '').trim().length > 0 || t('login.captchaRequired'),
            })}
          />
        </div>
        {fieldError ? (
          <p className="mt-1 font-noto text-xs font-medium text-red-600" role="alert">
            {fieldError}
          </p>
        ) : null}
        {!fieldError && captchaError ? (
          <p className="mt-1 font-noto text-[11px] font-semibold text-red-600" role="alert">
            {captchaError}
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <div className="mb-6 w-full min-w-0">
      <label
        htmlFor="captcha-legacy"
        className="mb-2 block font-noto text-[18px] font-medium leading-[18px] tracking-normal text-probity-ink-strong sm:text-base"
      >
        {t('login.captcha')}
      </label>

      <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto sm:shrink-0">
          <div className="flex h-11 min-h-11 w-full min-w-0 items-center justify-center overflow-hidden rounded-md border border-slate-300 bg-slate-50 sm:h-[52px] sm:w-[10rem] sm:max-w-[10rem] sm:flex-none">
            <CaptchaImageViewport
              captchaLoading={captchaLoading}
              imageSrc={imageSrc}
              shimmerClassName="h-full w-full rounded-md"
              imgClassName="max-h-9 max-w-full object-contain sm:max-h-10"
            />
          </div>
          <CaptchaRefreshButton
            disabled={disabled}
            loading={captchaLoading}
            onRefresh={onRefresh}
            className="sm:hidden"
          />
        </div>

        <div className="flex min-w-0 flex-1 items-stretch gap-2">
          <div className={`${legacyCaptchaInputClass} min-w-0 flex-1`}>
            <Input
              type="text"
              name="captcha"
              id="captcha-legacy"
              label={t('login.captcha')}
              placeholder={t('login.captchaPlaceholder')}
              register={register}
              validation={{
                required: t('login.captchaRequired'),
                validate: (value) =>
                  value.trim().length > 0 || t('login.captchaRequired'),
              }}
              error={error}
              size="lg"
              theme="primary"
              autoComplete="off"
              required
            />
          </div>

          <Button
            type="button"
            variant="ghost"
            aria-label={t('login.captchaRefresh')}
            disabled={disabled || captchaLoading}
            onClick={(event) => {
              event.preventDefault()
              onRefresh()
            }}
            icon={ResetIcon}
            iconProps={{
              className: 'text-[22px] text-probity-captcha',
            }}
            className="focus-ring !hidden !h-11 !min-h-11 !w-[50px] !min-w-[50px] shrink-0 !items-center !justify-center !rounded-md !border !border-slate-300 !bg-white !p-0 !text-probity-captcha !shadow-none hover:!bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:!inline-flex sm:!h-[52px] sm:!min-h-[52px]"
          >
            <span className="sr-only">{t('login.captchaRefresh')}</span>
          </Button>
        </div>
      </div>

      {captchaError ? (
        <p className="mt-2 font-noto text-sm font-medium text-red-600" role="alert">
          {captchaError}
        </p>
      ) : null}
    </div>
  )
}
