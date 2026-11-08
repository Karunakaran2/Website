import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getModuleRoute } from '@/shared/constants'
import {
  getDefaultSecondaryTabId,
  getSecondaryNavItems,
  isSecondaryTabValid,
} from '../constants/dashboard'
import { selectActivePrimaryId, selectActiveSecondaryId } from '../redux/selectors'
import { setDashboardNav } from '../redux/slice'

/**
 * Redux is the live selection (instant menu active style).
 * URL hydration happens in useDashboardRouteSync before paint.
 */
export function useDashboardNav() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const activePrimaryId = useSelector(selectActivePrimaryId)
  const activeSecondaryId = useSelector(selectActiveSecondaryId)
  const secondaryNavItems = getSecondaryNavItems(activePrimaryId)

  const activatePrimary = (primaryId) => {
    dispatch(
      setDashboardNav({
        primaryId,
        secondaryId: getDefaultSecondaryTabId(primaryId),
      }),
    )
  }

  const activateSecondary = (secondaryId) => {
    if (!isSecondaryTabValid(activePrimaryId, secondaryId)) {
      return
    }
    dispatch(setDashboardNav({ primaryId: activePrimaryId, secondaryId }))
  }

  const setPrimaryNavWithUrl = (primaryId) => {
    const secondaryId = getDefaultSecondaryTabId(primaryId)
    dispatch(setDashboardNav({ primaryId, secondaryId }))
    navigate(getModuleRoute(primaryId, secondaryId), { flushSync: true })
  }

  const setSecondaryNavWithUrl = (secondaryId) => {
    if (!isSecondaryTabValid(activePrimaryId, secondaryId)) {
      return
    }
    dispatch(setDashboardNav({ primaryId: activePrimaryId, secondaryId }))
    navigate(getModuleRoute(activePrimaryId, secondaryId), { flushSync: true })
  }

  return {
    activePrimaryId,
    activeSecondaryId,
    secondaryNavItems,
    activatePrimary,
    activateSecondary,
    setPrimaryNav: setPrimaryNavWithUrl,
    setSecondaryNav: setSecondaryNavWithUrl,
  }
}
