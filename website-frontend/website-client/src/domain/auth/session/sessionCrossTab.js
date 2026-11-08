/**
 * Cross-tab session signals — event names only (no tokens or credentials in messages).
 * Token continuity uses {@link ../utils/sessionMirror} localStorage mirror + storage events.
 */

export const SESSION_SIGNAL_STORAGE_KEY = 'probity.sessionSignal'
export const SESSION_BROADCAST_CHANNEL = 'kran-design-system-session-v1'

/** @typedef {'LOGIN' | 'LOGOUT' | 'SESSION_EXPIRED' | 'TOKEN_REFRESHED' | 'ACCOUNT_SWITCHED'} SessionSignalType */

const listeners = new Set()
let channel = null
const tabInstanceId =
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now())

function parseSignal(raw) {
  if (!raw) {
    return null
  }
  try {
    const value = JSON.parse(raw)
    if (!value || typeof value.type !== 'string') {
      return null
    }
    return value
  } catch {
    return null
  }
}

function deliver(signal) {
  listeners.forEach((listener) => {
    listener(signal)
  })
}

function writeStorageSignal(signal) {
  if (typeof window === 'undefined') {
    return
  }
  try {
    window.localStorage.setItem(SESSION_SIGNAL_STORAGE_KEY, JSON.stringify(signal))
  } catch {
    // ignore
  }
}

function postBroadcast(signal) {
  if (typeof window === 'undefined') {
    return
  }
  try {
    if (!channel && typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel(SESSION_BROADCAST_CHANNEL)
      channel.onmessage = (event) => {
        const data = event?.data
        if (!data || typeof data.type !== 'string') {
          return
        }
        if (data.origin === tabInstanceId) {
          return
        }
        deliver(data)
      }
    }
    channel?.postMessage({ ...signal, origin: tabInstanceId })
  } catch {
    // BroadcastChannel unavailable
  }
}

/**
 * @param {SessionSignalType} type
 * @param {Record<string, unknown>} [meta]
 */
export function publishSessionSignal(type, meta = {}) {
  const signal = {
    type,
    at: Date.now(),
    ...meta,
  }
  writeStorageSignal(signal)
  postBroadcast(signal)
}

export function subscribeSessionSignals(listener) {
  listeners.add(listener)

  if (typeof window !== 'undefined') {
    const onStorage = (event) => {
      if (event.key !== SESSION_SIGNAL_STORAGE_KEY) {
        return
      }
      const signal = parseSignal(event.newValue)
      if (signal) {
        deliver(signal)
      }
    }
    window.addEventListener('storage', onStorage)

    return () => {
      listeners.delete(listener)
      window.removeEventListener('storage', onStorage)
    }
  }

  return () => {
    listeners.delete(listener)
  }
}

export function closeSessionBroadcastChannel() {
  if (channel) {
    channel.close()
    channel = null
  }
}
