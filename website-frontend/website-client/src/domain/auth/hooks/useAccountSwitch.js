import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useStore } from 'react-redux'
import { apiErrorMessage } from '@/shared/api/apiError'
import { confirmBeforeAction } from '@/shared/components/confirm'
import { showAppToast } from '@/shared/components'
import { useActionConfirm } from '@/shared/components/confirm/ActionConfirmProvider'
import { ROUTES } from '@/shared/constants'
import { getSeatSelected } from '../utils/session'
import { useUpdateSeatUserAllotedMutation } from '../services/authApi'
import { applyAccountSwitch } from '../utils/applyAccountSwitch'
import { resolveActiveSeatIdMask } from '../utils/activeSeat'
import { useAuthUser } from './useAuthUser'
import { useAuthorizedSeats } from './useAuthorizedSeats'

export function useAccountSwitch({ enabled = true, onSwitched } = {}) {
  const { t } = useTranslation()
  const store = useStore()
  const navigate = useNavigate()
  const requestConfirm = useActionConfirm()
  const user = useAuthUser()
  const { seats, isLoading, listError, refetch } = useAuthorizedSeats({ skip: !enabled })
  const [updateSeat] = useUpdateSeatUserAllotedMutation()
  const [switchingIdMask, setSwitchingIdMask] = useState('')
  const switchLock = useRef(false)

  const activeSeatIdMask = resolveActiveSeatIdMask(user, seats)

  const switchToSeat = useCallback(
    async (seatUserAllotedIdMask, { seatLabel } = {}) => {
      const targetId = String(seatUserAllotedIdMask || '').trim()
      if (!targetId || switchLock.current) {
        return false
      }

      if (targetId === activeSeatIdMask) {
        showAppToast(
          t('accountSwitch.alreadyActive', 'This is already your active account.'),
          'info',
        )
        return false
      }

      const allowed = seats.some((seat) => seat.idMask === targetId)
      if (!allowed) {
        showAppToast(
          t('accountSwitch.unauthorized', 'You are not authorized to use this account.'),
          'error',
        )
        return false
      }

      const label = seatLabel || targetId

      confirmBeforeAction(requestConfirm, {
        action: 'switchAccount',
        recordLabel: label,
        stack: 'nested',
        showSuccessToast: false,
        runAction: async () => {
          switchLock.current = true
          setSwitchingIdMask(targetId)
          try {
            const result = await updateSeat({
              seatUserAllotedIdMask: targetId,
            }).unwrap()
            applyAccountSwitch(store, result.user)
            showAppToast(
              t('accountSwitch.success', 'Active account updated.'),
              'success',
              { action: 'update' },
            )
            navigate(ROUTES.HOME, { replace: true })
            onSwitched?.()
            return true
          } catch (caught) {
            showAppToast(
              apiErrorMessage(caught, t('accountSwitch.failed', 'Unable to switch account.')),
              'error',
            )
            return false
          } finally {
            switchLock.current = false
            setSwitchingIdMask('')
          }
        },
      })

      return true
    },
    [activeSeatIdMask, navigate, onSwitched, requestConfirm, seats, store, t, updateSeat],
  )

  return {
    user,
    seats,
    activeSeatIdMask,
    switchingIdMask,
    isLoading,
    listError,
    refetch,
    switchToSeat,
    canSwitch: Boolean(user?.seatSelected) || getSeatSelected(),
  }
}
