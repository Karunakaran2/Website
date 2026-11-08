import { useState } from 'react'
import { apiErrorMessage } from '@/shared/api/apiError'
import { useDispatch, useStore } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSelectedAccountId } from '@/app/user-management/redux/slice'
import { DEFAULT_ACCOUNT_ID } from '@/app/user-management/constants/accounts'
import { ROUTES } from '@/shared/constants'
import { consumeHandoffInbox, getSessionId } from '../utils/session'
import { getInboxOverviewPath } from '../utils/inboxHome'
import { applyAccountSwitch } from '../utils/applyAccountSwitch'
import {
  useGetHierarchySetupByUserIdQuery,
  useGetLoginUserQuery,
  useUpdateSeatUserAllotedMutation,
} from '../services/authApi'
import { useAuthUser } from './useAuthUser'

function toErrorMessage(error, fallback) {
  return apiErrorMessage(error, error ? fallback : '')
}

export function useSeatSelection() {
  const user = useAuthUser()
  const dispatch = useDispatch()
  const store = useStore()
  const navigate = useNavigate()
  const hasSession = Boolean(getSessionId())
  const {
    isLoading: isUserLoading,
    isSuccess: isUserLoaded,
    error: userError,
  } = useGetLoginUserQuery(undefined, {
    skip: !hasSession,
  })
  const {
    data: seats = [],
    isLoading: isSeatsLoading,
    error: seatsError,
  } = useGetHierarchySetupByUserIdQuery(undefined, {
    skip: !hasSession || !isUserLoaded,
  })
  const [updateSeat] = useUpdateSeatUserAllotedMutation()
  const [selectingId, setSelectingId] = useState('')
  const [selectError, setSelectError] = useState('')

  const selectSeat = async (idMask) => {
    if (!idMask) {
      return
    }

    setSelectingId(idMask)
    setSelectError('')

    try {
      const result = await updateSeat({ seatUserAllotedIdMask: idMask }).unwrap()
      applyAccountSwitch(store, result.user)
      consumeHandoffInbox()
      dispatch(setSelectedAccountId(DEFAULT_ACCOUNT_ID))
      navigate(ROUTES.HOME, { replace: true })
    } catch (caught) {
      setSelectError(toErrorMessage(caught, 'Unable to select seat'))
      setSelectingId('')
    }
  }

  return {
    user,
    seats,
    isLoading:
      hasSession &&
      !userError &&
      (isUserLoading || isSeatsLoading),
    listError:
      toErrorMessage(userError, 'Unable to load user') ||
      toErrorMessage(seatsError, 'Unable to load allotted seats'),
    selectError,
    selectingId,
    selectSeat,
  }
}
