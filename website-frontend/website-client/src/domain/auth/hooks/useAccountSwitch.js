import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { confirmBeforeAction } from '@/shared/components/confirm'
import { showAppToast } from '@/shared/components'
import { useActionConfirm } from '@/shared/components/confirm/ActionConfirmProvider'
import { ROUTES } from '@/shared/constants'
import { resolveActiveSeatIdMask } from '../utils/activeSeat'
import { useAuthUser } from './useAuthUser'
import { useAuthorizedSeats } from './useAuthorizedSeats'

export function useAccountSwitch({ enabled = true, onSwitched } = {}) {
  const { t } = useTranslation()
  const requestConfirm = useActionConfirm()
  const user = useAuthUser()
  const { seats, isLoading, listError, refetch } = useAuthorizedSeats({ skip: !enabled })
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

      if (!seats.length) {
        showAppToast(
          t('accountSwitch.unavailable', 'Account switching is not available in the CMS portal.'),
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
        runAction: async () => false,
      })

      return true
    },
    [activeSeatIdMask, requestConfirm, seats, t],
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
    canSwitch: false,
  }
}
