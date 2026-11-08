import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { refreshAccessToken } from '@/shared/api/client'
import { endAuthenticatedSession } from '../utils/completeSessionLogout'
import { getSessionId, subscribeAccessTokenChanged } from '../utils/session'
import { sessionDebug } from '../session/sessionDebug'
import { createSessionClock } from '../session/sessionClock'
import { resolveSessionWindows } from '../session/sessionPolicy'
import { bindSessionClock, publishSessionRemaining } from '../session/sessionRuntime'
import { isPublicPath } from './SessionGuard'
import SessionTimeoutDialog from './SessionTimeoutDialog'

export default function SessionManager() {
  const { pathname } = useLocation()
  const publicPath = isPublicPath(pathname)
  const publicRef = useRef(publicPath)
  const [warning, setWarning] = useState({ open: false, remainingMs: 0 })
  const [continuing, setContinuing] = useState(false)
  const clockRef = useRef(null)

  publicRef.current = publicPath

  useEffect(() => {
    const { idleLimitMs, warningLeadMs } = resolveSessionWindows()
    sessionDebug('session-manager-mounted', {
      hasSessionId: Boolean(getSessionId()),
      publicPath,
      idleLimitMs,
      warningLeadMs,
    })
    const clock = createSessionClock({
      getAccessToken: getSessionId,
      refreshAccessToken,
      endSession: () => endAuthenticatedSession(undefined, { redirect: true }),
      onWarning: setWarning,
      onRemaining: publishSessionRemaining,
      onDebug: sessionDebug,
      idleLimitMs,
      warningLeadMs,
    })
    clockRef.current = clock
    bindSessionClock(clock)

    const unsubscribe = subscribeAccessTokenChanged((event) => {
      if (publicRef.current || !getSessionId()) {
        clock.stop()
        setWarning({ open: false, remainingMs: 0 })
        return
      }
      if (!clock.isRunning()) {
        clock.start()
        return
      }
      clock.noteTokenUpdate(event)
    })

    if (!publicPath && getSessionId()) {
      clock.start()
    } else {
      sessionDebug('idle-clock-not-started', {
        publicPath,
        hasSessionId: Boolean(getSessionId()),
      })
    }

    return () => {
      unsubscribe()
      clock.stop()
      clockRef.current = null
      bindSessionClock(null)
    }
  }, [publicPath])

  useEffect(() => {
    if (publicPath) {
      return
    }
    clockRef.current?.noteActivity('route')
  }, [pathname, publicPath])

  useEffect(() => {
    if (publicPath || !getSessionId()) {
      return undefined
    }

    const onPointer = () => {
      clockRef.current?.noteActivity('pointer')
    }
    const onKey = () => {
      clockRef.current?.noteActivity('keyboard')
    }

    window.addEventListener('pointerdown', onPointer)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('keydown', onKey)
    }
  }, [publicPath])

  const onContinue = async () => {
    if (continuing) {
      return
    }
    setContinuing(true)
    try {
      await clockRef.current?.continueSession()
    } finally {
      setContinuing(false)
    }
  }

  const onLogout = () => {
    void endAuthenticatedSession(undefined, { redirect: true })
  }

  return (
    <SessionTimeoutDialog
      open={warning.open}
      remainingMs={warning.remainingMs}
      onContinue={onContinue}
      onLogout={onLogout}
      continuing={continuing}
    />
  )
}
