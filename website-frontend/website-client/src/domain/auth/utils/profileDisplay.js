export function formatProfileDomain(domain) {
  if (domain === 'D') {
    return 'Department'
  }
  if (domain === 'P') {
    return 'Public'
  }
  return domain?.trim() || ''
}

export function profileLoginId(user) {
  return user?.username || user?.email || user?.mobile || ''
}

export function profileDesignation(user) {
  return user?.designation || user?.postingName || user?.role || ''
}

export function profileDisplayName(user) {
  return user?.name || user?.displayName || profileLoginId(user) || ''
}

export function profileInitials(user) {
  const fromApi = user?.initials?.trim?.()
  if (fromApi) {
    return fromApi
  }
  const name = profileDisplayName(user)
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) {
    return '?'
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}
