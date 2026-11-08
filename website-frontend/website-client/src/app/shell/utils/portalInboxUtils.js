/**
 * Pure helpers for portal inbox filtering, pagination, and read state.
 * Used by PortalInboxCard and unit tests.
 */

export function countUnreadInboxMessages(messages = []) {
  return messages.filter((m) => m.status === 'Unread').length
}

export function filterInboxMessages(messages, { activeTab = 'all', search = '', sort = null } = {}) {
  let result = messages

  if (activeTab === 'unread') {
    result = result.filter((m) => m.status === 'Unread')
  } else if (activeTab === 'archive') {
    result = result.filter((m) => m.status === 'Archived')
  }

  const q = search.trim().toLowerCase()
  if (q) {
    result = result.filter(
      (m) =>
        m.subject?.toLowerCase().includes(q) ||
        m.receivedFrom?.toLowerCase().includes(q),
    )
  }

  if (sort?.sortBy) {
    result = [...result].sort((a, b) => {
      const valA = a[sort.sortBy] ?? ''
      const valB = b[sort.sortBy] ?? ''
      const cmp = String(valA).localeCompare(String(valB))
      return sort.sortDir === 'desc' ? -cmp : cmp
    })
  }

  return result
}

export function paginateInboxRows(filteredMessages, currentPage, pageSize) {
  const start = (currentPage - 1) * pageSize
  return filteredMessages.slice(start, start + pageSize).map((item, idx) => ({
    ...item,
    _serial: start + idx + 1,
  }))
}

export function markInboxMessageRead(messages, messageId) {
  return messages.map((m) =>
    m.id === messageId && m.status === 'Unread' ? { ...m, status: 'Read' } : m,
  )
}
