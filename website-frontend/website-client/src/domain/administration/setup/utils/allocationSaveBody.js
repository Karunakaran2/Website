import { resolveSetupNumericId, resolveSetupPublicId } from './setupRowId'

/** Build ledger-allocation save payload (backend expects numeric Long FKs). */
export function buildLedgerAllocationSaveBody(modalTarget, hoaPublicId, hoaRows) {
  if (!modalTarget || !hoaPublicId) {
    return null
  }

  const hoaKey = String(hoaPublicId)
  const hoaRow = (hoaRows ?? []).find(
    (row) => resolveSetupPublicId(row, { idField: 'id' }) === hoaKey,
  )
  const hoaId = resolveSetupNumericId(hoaRow?.id ?? hoaPublicId)
  if (!hoaId) {
    return null
  }

  if (modalTarget.kind === 'office') {
    const officeId = resolveSetupNumericId(modalTarget.targetRow?.officeId ?? modalTarget.id)
    if (!officeId) {
      return null
    }
    return { hoaId, officeId }
  }

  const costCenterId = resolveSetupNumericId(
    modalTarget.targetRow?.costCenterId ?? modalTarget.id,
  )
  if (!costCenterId) {
    return null
  }
  return { hoaId, costCenterId }
}

/** Build user-allocation save payload (backend expects numeric Long FKs). */
export function buildUserAllocationSaveBody(modalTarget, seatUserPublicId, seatUserRows) {
  if (!modalTarget || !seatUserPublicId) {
    return null
  }

  const seatKey = String(seatUserPublicId)
  const seatRow = (seatUserRows ?? []).find(
    (row) => resolveSetupPublicId(row, { idField: 'id' }) === seatKey,
  )
  const seatUserId = resolveSetupNumericId(seatRow?.id ?? seatUserPublicId)
  if (!seatUserId) {
    return null
  }

  if (modalTarget.kind === 'office') {
    const officeId = resolveSetupNumericId(modalTarget.targetRow?.officeId ?? modalTarget.id)
    if (!officeId) {
      return null
    }
    return { seatUserId, officeId }
  }

  const costCenterId = resolveSetupNumericId(
    modalTarget.targetRow?.costCenterId ?? modalTarget.id,
  )
  if (!costCenterId) {
    return null
  }
  return { seatUserId, costCenterId }
}
