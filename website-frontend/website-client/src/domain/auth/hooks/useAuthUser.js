import { useEffect } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { loginSuccess } from '../redux/slice'
import { selectAuthUser } from '../redux/selectors'
import { useGetLoginUserQuery } from '../services/authApi'
import { completeSessionLogout } from '../utils/completeSessionLogout'
import { getSessionId } from '../utils/session'

export function useAuthUser() {
  const dispatch = useDispatch()
  const store = useStore()
  const storedUser = useSelector(selectAuthUser)
  const accessToken = storedUser?.accessToken || getSessionId()
  const { data, error } = useGetLoginUserQuery(undefined, {
    skip: !accessToken,
  })

  useEffect(() => {
    if (!data?.user) {
      return
    }
    if (storedUser?.seatSelected === true && data.user.seatSelected !== true) {
      return
    }
    dispatch(loginSuccess(data.user))
  }, [data, dispatch, storedUser?.seatSelected])

  useEffect(() => {
    if (error?.status === 401 && accessToken) {
      completeSessionLogout(store, { redirect: true, broadcastCrossTab: true })
    }
  }, [accessToken, error, store])

  return storedUser ?? data?.user ?? {}
}
