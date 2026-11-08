import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyRound, Shield } from 'lucide-react'
import FormModal from '@/shared/components/modals/FormModal'
import {
  PortalModalCancelButton,
  PortalModalPrimaryButton,
} from '@/shared/components/modals/PortalModalButtons'
import { InputField } from '@/shared/components/forms'
import AuthOtpField from '@/domain/auth/components/AuthOtpField'
import { useForgotPasswordForm } from '@/domain/auth/hooks/useForgotPasswordForm'
import { scheduleFocusFirstFormError } from '@/shared/utils/formValidationFocus'

/**
 * SPFO-style forgot password dialog on the login page (identify → OTP → success).
 * Demonstration flow when no reset API is configured.
 */
export default function ForgotPasswordModal({ open, onClose }) {
  const { t } = useTranslation()
  const flow = useForgotPasswordForm()

  useEffect(() => {
    if (!open) {
      flow.resetFlow()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const closeModal = () => {
    if (flow.isSubmitting) {
      return
    }
    flow.resetFlow()
    onClose?.()
  }

  const renderFooter = () => {
    if (flow.step === 'identify') {
      return (
        <>
          <PortalModalCancelButton type="button" onClick={closeModal} disabled={flow.isSubmitting} />
          <PortalModalPrimaryButton
            type="button"
            onClick={async () => {
              const valid = await flow.validateIdentify()
              if (!valid) {
                scheduleFocusFirstFormError()
                return
              }
              await flow.onIdentify()
            }}
            disabled={flow.isSubmitting}
          >
            {flow.isSubmitting
              ? t('forgotPassword.sending', 'Sending…')
              : t('forgotPassword.verify', 'Verify')}
          </PortalModalPrimaryButton>
        </>
      )
    }

    if (flow.step === 'otp') {
      return (
        <>
          <PortalModalCancelButton type="button" onClick={closeModal} disabled={flow.isSubmitting} />
          <PortalModalPrimaryButton
            type="button"
            onClick={flow.onVerifyOtp}
            disabled={flow.isSubmitting}
          >
            {flow.isSubmitting
              ? t('forgotPassword.verifying', 'Verifying…')
              : t('forgotPassword.verifyContinue', 'Verify & Continue')}
          </PortalModalPrimaryButton>
        </>
      )
    }

    return (
      <PortalModalPrimaryButton type="button" onClick={closeModal} className="ml-auto">
        {t('forgotPassword.continueToLogin', 'Continue to Login')}
      </PortalModalPrimaryButton>
    )
  }

  return (
    <FormModal
      open={open}
      onClose={closeModal}
      title={t('forgotPassword.title', 'Forgot Password')}
      icon={<KeyRound size={16} aria-hidden />}
      size="md"
      footer={renderFooter()}
      cancelDisabled={flow.isSubmitting}
      primaryLoading={flow.isSubmitting}
    >
      {flow.submitError ? (
        <div
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 font-noto text-xs font-medium text-red-700"
          role="alert"
        >
          {flow.submitError}
        </div>
      ) : null}

      {flow.step === 'identify' ? (
        <>
          <p className="mb-4 font-noto text-xs text-slate-600">
            {t(
              'forgotPassword.modalIdentifyLead',
              'Enter your registered email address or mobile number. We will send a verification code if the account exists.',
            )}
          </p>
          <InputField
            label={t(
              'forgotPassword.identifierLabel',
              'Email Address / Mobile Number',
            )}
            type="text"
            name="identifier"
            register={flow.register}
            rules={{
              required: t('forgotPassword.identifierRequired', 'Enter email or mobile number.'),
              validate: (value) =>
                String(value || '').trim().length > 0 ||
                t('forgotPassword.identifierRequired', 'Enter email or mobile number.'),
            }}
            placeholder={t(
              'forgotPassword.identifierPlaceholder',
              'Enter your email address or mobile number',
            )}
            required
            error={flow.errors.identifier?.message}
          />
          {flow.isDemoMode ? (
            <p className="mt-2 font-noto text-[11px] text-slate-500" role="note">
              {t('forgotPassword.demoNotice')}
            </p>
          ) : null}
        </>
      ) : null}

      {flow.step === 'otp' ? (
        <div className="space-y-4 text-center font-noto">
          <div>
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-sky-100 bg-sky-50 text-[#01458e]">
              <Shield size={24} aria-hidden />
            </div>
            <h4 className="m-0 text-sm font-extrabold uppercase tracking-wide text-slate-800">
              {t('forgotPassword.otpTitle', 'Verify OTP')}
            </h4>
            <p className="m-0 mt-1 text-xs font-medium text-slate-500">
              {t('forgotPassword.otpSubtitle', {
                username: flow.maskedIdentifier,
                defaultValue: 'Enter the code sent for {{username}}.',
              })}
            </p>
          </div>
          {flow.isDemoMode ? (
            <p className="text-[11px] text-slate-500" role="note">
              {t('forgotPassword.demoOtpNotice')}
            </p>
          ) : null}
          <AuthOtpField
            id="forgot-password-otp"
            label={t('forgotPassword.otpLabel')}
            value={flow.otpValue}
            onChange={(event) => flow.setOtpValue(event.target.value)}
            error={flow.submitError}
          />
        </div>
      ) : null}

      {flow.step === 'success' ? (
        <div className="space-y-3 font-noto text-sm text-slate-700" role="status">
          <p className="m-0 font-semibold text-slate-900">{t('forgotPassword.successTitle')}</p>
          <p className="m-0">{t('forgotPassword.demoSuccessBody')}</p>
        </div>
      ) : null}
    </FormModal>
  )
}
