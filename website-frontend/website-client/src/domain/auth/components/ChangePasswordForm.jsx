import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { showAppToast } from '@/shared/components'
import { useChangePasswordMutation } from '../services/authApi'
import { apiErrorMessage } from '@/shared/api/apiError'

export default function ChangePasswordForm() {
  const { t } = useTranslation()
  const [changePassword, { isLoading }] = useChangePasswordMutation()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (newPassword.trim().length < 8) {
      showAppToast({ variant: 'error', message: t('profile.changePassword.minLength') })
      return
    }
    if (newPassword !== confirmPassword) {
      showAppToast({ variant: 'error', message: t('profile.changePassword.mismatch') })
      return
    }
    try {
      await changePassword({
        currentPassword,
        newPassword: newPassword.trim(),
      }).unwrap()
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      showAppToast({ variant: 'success', message: t('profile.changePassword.success') })
    } catch (err) {
      showAppToast({
        variant: 'error',
        message: apiErrorMessage(err, t('profile.changePassword.failed')),
      })
    }
  }

  return (
    <form className="max-w-md space-y-4" onSubmit={handleSubmit}>
      <p className="m-0 text-sm text-slate-600">{t('profile.changePassword.lead')}</p>
      <label className="block text-sm">
        {t('profile.changePassword.current')}
        <input
          type="password"
          autoComplete="current-password"
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </label>
      <label className="block text-sm">
        {t('profile.changePassword.new')}
        <input
          type="password"
          autoComplete="new-password"
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
        />
      </label>
      <label className="block text-sm">
        {t('profile.changePassword.confirm')}
        <input
          type="password"
          autoComplete="new-password"
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
        />
      </label>
      <GigwButton type="submit" variant="primary" disabled={isLoading}>
        {isLoading ? t('profile.changePassword.saving') : t('profile.changePassword.submit')}
      </GigwButton>
    </form>
  )
}