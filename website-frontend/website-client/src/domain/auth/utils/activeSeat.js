/**
 * Active posting/seat context — backed by seatUserAllotId + hierarchy fields from getLoginUser.
 */

export function resolveActiveSeatIdMask(user, seats = []) {
  const allotId = String(user?.seatUserAllotId || user?.seatUserAllotedIdMask || '').trim()
  if (allotId) {
    return allotId
  }

  const hierarchyCode = String(user?.hierarchyCode || '').trim()
  if (hierarchyCode && seats.length > 0) {
    const byCode = seats.find(
      (seat) =>
        String(seat.hierarchyCode || seat.code || '').trim() === hierarchyCode,
    )
    if (byCode?.idMask) {
      return byCode.idMask
    }
  }

  const hierarchyName = String(user?.hierarchyName || '').trim()
  if (hierarchyName && seats.length > 0) {
    const byName = seats.find((seat) => String(seat.name || '').trim() === hierarchyName)
    if (byName?.idMask) {
      return byName.idMask
    }
  }

  return ''
}

export function filterAuthorizedSeats(seats, query) {
  const tokens = String(query || '')
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
  if (tokens.length === 0) {
    return seats
  }

  return seats.filter((seat) => {
    const haystack = [
      seat.name,
      seat.hierarchyCode,
      seat.code,
      seat.postingName,
      seat.designation,
      seat.office,
      seat.officeType,
      seat.category,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return tokens.every((token) => haystack.includes(token))
  })
}

export function seatSummaryLine(seat) {
  return [seat?.office, seat?.officeType].filter(Boolean).join(' · ')
}
