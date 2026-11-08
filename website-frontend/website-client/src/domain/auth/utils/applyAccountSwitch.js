import { resetDashboardNav } from '@/app/shell/redux/slice'
import { baseApi } from '@/shared/api/baseApi'
import { restoreAuthState } from '../redux/slice'
import { publishSessionSignal } from '../session/sessionCrossTab'
import { syncSessionMirrorAuthUser } from './session'

/**
 * Apply a successful seat/account switch: refresh auth user, nav context, and clear cached API data
 * so module screens do not show the previous posting's records.
 */
export function applyAccountSwitch(store, user) {
  if (!store || !user) {
    return
  }
  const nextUser = { ...user, seatSelected: true }
  store.dispatch(restoreAuthState(nextUser))
  store.dispatch(resetDashboardNav())
  store.dispatch(baseApi.util.resetApiState())
  syncSessionMirrorAuthUser(nextUser)
  publishSessionSignal('ACCOUNT_SWITCHED', { revision: Date.now() })
}
