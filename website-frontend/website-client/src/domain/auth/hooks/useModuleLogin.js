import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSelectedAccountId } from '@/app/user-management/redux/slice'
import { DEFAULT_ACCOUNT_ID } from '@/app/user-management/constants/accounts'
import { requestJson } from '@/shared/api/client'
import { ROUTES } from '@/shared/constants'
import { loginSuccess } from '../redux/slice'
import {
  useExchangeSpfoAccessTokenMutation,
  useUpdateSeatUserAllotedMutation,
} from '../services/authApi'
import { getInboxOverviewPath } from '../utils/inboxHome'
import { consumeHandoffInbox, markHandoffInbox, markSpfoOrigin } from '../utils/session'

const HANDOFF_TOKEN_KEY = 'probity.spfoHandoffToken'

let handoffPromise = null

function readHandoffToken() {
  const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : ''
  const fromHash = new URLSearchParams(hash).get('accessToken') || ''
  if (fromHash) {
    window.sessionStorage.setItem(HANDOFF_TOKEN_KEY, fromHash)
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
  }
  const accessToken = window.sessionStorage.getItem(HANDOFF_TOKEN_KEY) || ''
  window.sessionStorage.removeItem(HANDOFF_TOKEN_KEY)
  return accessToken
}

function errorMessage(error) {
  if (typeof error?.data === 'string' && error.data) {
    return error.data
  }
  if (typeof error?.data?.message === 'string' && error.data.message) {
    return error.data.message
  }
  return 'Unable to open Financial Accounting.'
}

export function useModuleLogin() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [exchangeSpfoAccessToken] = useExchangeSpfoAccessTokenMutation()
  const [updateSeat] = useUpdateSeatUserAllotedMutation()
  const [error, setError] = useState('')

  useEffect(() => {
    if (!handoffPromise) {
      const accessToken = readHandoffToken()
      handoffPromise = openFinancialAccounting({
        accessToken,
        exchangeSpfoAccessToken,
        updateSeat,
        dispatch,
        navigate,
      }).then(
        (message) => message || '',
        (caught) => errorMessage(caught),
      )
    }

    let active = true
    handoffPromise.then((message) => {
      if (active && message) {
        setError(message)
      }
    })

    return () => {
      active = false
    }
  }, [dispatch, exchangeSpfoAccessToken, navigate, updateSeat])

  return { error }
}

async function openFinancialAccounting({
  accessToken,
  exchangeSpfoAccessToken,
  updateSeat,
  dispatch,
  navigate,
}) {
  if (!accessToken) {
    return 'Sign in from Seamen\'s Provident Fund and open Financial Accounting again.'
  }

  const result = await exchangeSpfoAccessToken({ accessToken }).unwrap()
  dispatch(loginSuccess(result.user))
  markSpfoOrigin()
  markHandoffInbox()

  const seatsResult = await requestJson('/api/v1/seat-context/getHierarchySetupByUserId')
  const seats = Array.isArray(seatsResult.data) ? seatsResult.data : []
  const onlySeat = seats.length === 1 ? seats[0] : null
  if (onlySeat?.idMask) {
    const seated = await updateSeat({ seatUserAllotedIdMask: onlySeat.idMask }).unwrap()
    dispatch(loginSuccess({ ...seated.user, seatSelected: true }))
    consumeHandoffInbox()
    dispatch(setSelectedAccountId(DEFAULT_ACCOUNT_ID))
    navigate(ROUTES.HOME, { replace: true })
    return ''
  }

  navigate(ROUTES.SEATS, { replace: true })
  return ''
}
