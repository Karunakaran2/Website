import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { InputField } from '@/shared/components/forms'
import { SubmitButton } from '@/shared/components/buttons'
import BackButton from '@/shared/components/buttons/BackButton'
import { GigwButton } from '@/shared/components/buttons/gigw'
import AuthPageShell from '@/shared/layouts/AuthPageShell'
import AuthPageCard from '@/domain/auth/components/AuthPageCard'
import AuthOtpField from '@/domain/auth/components/AuthOtpField'
import AuthSecondaryContent from '@/domain/auth/components/AuthSecondaryContent'
import RegistrationStepper from '@/domain/auth/components/RegistrationStepper'
import {
  OTR_REGISTRATION_CARDS_GRID_CLASS,
  otrRegistrationCardClass,
  PORTAL_REGISTRATION_OPTION,
} from '@/domain/auth/constants/authRegistration'
import {
  authDemoBannerClass,
  authPrimarySubmitClass,
  authFieldClass,
} from '@/domain/auth/constants/authFormStyles'
import { useOneTimeRegistrationForm } from '@/domain/auth/hooks/useOneTimeRegistrationForm'
import { ROUTES } from '@/shared/constants'
import { mergeProbityFieldRules } from '@/shared/utils/fieldValidationRules'

export default function OneTimeRegistrationPage() {
  const { t } = useTranslation()
  const [flowStarted, setFlowStarted] = useState(false)
  const [registrationType, setRegistrationType] = useState(PORTAL_REGISTRATION_OPTION.id)

  const form = useOneTimeRegistrationForm()

  return (
    <AuthPageShell variant="page">
      <AuthSecondaryContent width="wide">
        <AuthPageCard
          title={t('oneTimeRegistration.title')}
          subtitle={t('oneTimeRegistration.subtitle')}
          actions={
            <BackButton to={ROUTES.LOGIN} className="shrink-0 py-2">
              {t('authCommon.backToLogin')}
            </BackButton>
          }
        >
          {!flowStarted ? (
            <>
              <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend className="sr-only">{t('oneTimeRegistration.selectTypeLegend')}</legend>
                <div className={OTR_REGISTRATION_CARDS_GRID_CLASS}>
                  <label
                    className={otrRegistrationCardClass(registrationType === PORTAL_REGISTRATION_OPTION.id)}
                  >
                    <input
                      type="radio"
                      name="otrRegistrationType"
                      value={PORTAL_REGISTRATION_OPTION.id}
                      checked={registrationType === PORTAL_REGISTRATION_OPTION.id}
                      onChange={() => setRegistrationType(PORTAL_REGISTRATION_OPTION.id)}
                      className="sr-only"
                    />
                    <span
                      className={`absolute right-4 top-4 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                        registrationType === PORTAL_REGISTRATION_OPTION.id
                          ? 'border-[#01458e] bg-white shadow-[inset_0_0_0_1px_#01458e]'
                          : 'border-slate-400 bg-white shadow-sm'
                      }`}
                      aria-hidden
                    >
                      {registrationType === PORTAL_REGISTRATION_OPTION.id ? (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#01458e]" />
                      ) : (
                        <span className="h-2 w-2 rounded-full border border-slate-300 bg-slate-100" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1 pr-8">
                      <h2 className="m-0 break-words text-[16px] font-semibold leading-6 text-[#01458e]">
                        {t('oneTimeRegistration.portalUserLabel')}
                      </h2>
                      <p className="m-0 mt-2 whitespace-normal break-words text-[14px] font-normal leading-[22px] text-slate-600">
                        {t('oneTimeRegistration.portalUserSummary')}
                      </p>
                    </div>
                  </label>
                </div>
              </fieldset>
              <div className="mt-5 flex justify-end">
                <GigwButton variant="primary" type="button" onClick={() => setFlowStarted(true)}>
                  {t('oneTimeRegistration.continue')}
                  <ArrowRight size={14} aria-hidden />
                </GigwButton>
              </div>
            </>
          ) : (
            <>
              <div className={authDemoBannerClass} role="note">
                {t('oneTimeRegistration.demoNotice')}
              </div>
              <RegistrationStepper
                steps={form.steps}
                activeStep={form.activeStep}
                maxReachableStep={form.maxReachableStep}
                onStepClick={form.goToStep}
              />
              <OneTimeRegistrationSteps form={form} />
            </>
          )}
        </AuthPageCard>
      </AuthSecondaryContent>
    </AuthPageShell>
  )
}

function OneTimeRegistrationSteps({ form }) {
  const { t } = useTranslation()
  const {
    activeStep,
    register,
    errors,
    isSubmitting,
    submitError,
    otpValue,
    setOtpValue,
    onContinueFromDetails,
    onVerifyOtp,
  } = form

  if (activeStep === 3) {
    return (
      <div>
        <h2 className="font-noto text-xl font-bold text-[#01458E]">{t('oneTimeRegistration.completeTitle')}</h2>
        <p className="mt-3 font-noto text-sm text-slate-700" role="status">
          {t('oneTimeRegistration.completeBody')}
        </p>
        <Link
          to={ROUTES.LOGIN}
          className={`inline-flex min-h-[48px] items-center justify-center ${authPrimarySubmitClass} !mt-6 max-w-xs no-underline`}
        >
          {t('authCommon.backToLogin')}
        </Link>
      </div>
    )
  }

  if (activeStep === 2) {
    return (
      <div>
        <h2 className="mb-2 font-noto text-lg font-bold text-probity-ink-strong">
          {t('oneTimeRegistration.otpTitle')}
        </h2>
        <p className="mb-4 font-noto text-sm text-slate-700">{t('oneTimeRegistration.otpSubtitle')}</p>
        <AuthOtpField
          id="otr-otp"
          label={t('oneTimeRegistration.otpLabel')}
          value={otpValue}
          onChange={(event) => setOtpValue(event.target.value)}
          error={submitError}
        />
        <SubmitButton
          type="button"
          hideIcon
          disabled={isSubmitting}
          onClick={onVerifyOtp}
          className={authPrimarySubmitClass}
        >
          {isSubmitting ? t('oneTimeRegistration.verifying') : t('oneTimeRegistration.verifyContinue')}
        </SubmitButton>
      </div>
    )
  }

  return (
    <form
      className="flex flex-col gap-0"
      onSubmit={(event) => {
        event.preventDefault()
        onContinueFromDetails()
      }}
      noValidate
    >
      <div className={`grid gap-0 sm:grid-cols-2 ${authFieldClass}`}>
        <div className="sm:col-span-2">
          <InputField
            type="text"
            label={t('oneTimeRegistration.fullName')}
            placeholder={t('oneTimeRegistration.fullNamePlaceholder')}
            error={errors.fullName?.message}
            required
            autoComplete="name"
            {...register('fullName', { required: t('oneTimeRegistration.fullNameRequired') })}
          />
        </div>
        <InputField
          type="email"
          label={t('oneTimeRegistration.email')}
          placeholder={t('oneTimeRegistration.emailPlaceholder')}
          error={errors.email?.message}
          required
          autoComplete="email"
          {...register(
            'email',
            mergeProbityFieldRules('email', {
              required: t('oneTimeRegistration.emailRequired'),
            }),
          )}
        />
        <InputField
          type="tel"
          label={t('oneTimeRegistration.mobile')}
          placeholder={t('oneTimeRegistration.mobilePlaceholder')}
          error={errors.mobile?.message}
          required
          autoComplete="tel"
          {...register(
            'mobile',
            mergeProbityFieldRules('mobile', {
              required: t('oneTimeRegistration.mobileRequired'),
            }),
          )}
        />
        <div className="sm:col-span-2">
          <InputField
            type="text"
            label={t('login.username')}
            placeholder={t('login.usernamePlaceholder')}
            error={errors.username?.message}
            required
            autoComplete="username"
            {...register('username', {
              required: t('login.usernameRequired'),
              validate: (value) => value.trim().length > 0 || t('login.usernameRequired'),
            })}
          />
        </div>
        <InputField
          type="password"
          label={t('oneTimeRegistration.password')}
          placeholder={t('oneTimeRegistration.passwordPlaceholder')}
          error={errors.password?.message}
          required
          autoComplete="new-password"
          {...register('password', {
            required: t('oneTimeRegistration.passwordRequired'),
            minLength: { value: 8, message: t('oneTimeRegistration.passwordMinLength') },
          })}
        />
        <InputField
          type="password"
          label={t('oneTimeRegistration.confirmPassword')}
          placeholder={t('oneTimeRegistration.confirmPasswordPlaceholder')}
          error={errors.confirmPassword?.message}
          required
          autoComplete="new-password"
          {...register('confirmPassword', {
            required: t('oneTimeRegistration.confirmPasswordRequired'),
          })}
        />
      </div>
      {submitError && activeStep === 1 ? (
        <p className="mb-4 text-sm font-medium text-red-600" role="alert">
          {submitError}
        </p>
      ) : null}
      <SubmitButton type="submit" hideIcon disabled={isSubmitting} className={authPrimarySubmitClass}>
        {isSubmitting ? t('oneTimeRegistration.continuing') : t('oneTimeRegistration.continue')}
      </SubmitButton>
    </form>
  )
}
