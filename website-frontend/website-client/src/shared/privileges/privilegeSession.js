const PRIVILEGE_STORAGE_KEY = 'probityPrivilegeCodes'

function normalizeCode(code) {
  return String(code || '').trim().toUpperCase()
}

export function saveSessionPrivileges(privilegeCodes) {
  const normalized = Array.isArray(privilegeCodes)
    ? privilegeCodes.map(normalizeCode).filter(Boolean)
    : []
  try {
    window.sessionStorage.setItem(PRIVILEGE_STORAGE_KEY, JSON.stringify(normalized))
  } catch {
    // sessionStorage may be unavailable
  }
  return normalized
}

export function hasSessionPrivileges() {
  try {
    return window.sessionStorage.getItem(PRIVILEGE_STORAGE_KEY) != null
  } catch {
    return false
  }
}

export function getSessionPrivileges() {
  try {
    const raw = window.sessionStorage.getItem(PRIVILEGE_STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.map(normalizeCode).filter(Boolean)
  } catch {
    return []
  }
}

export function clearSessionPrivileges() {
  try {
    window.sessionStorage.removeItem(PRIVILEGE_STORAGE_KEY)
  } catch {
    // sessionStorage may be unavailable
  }
}
