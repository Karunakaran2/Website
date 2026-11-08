/** Positive numeric id for save payloads (master-setup still expects Long FKs in JSON bodies). */
export function resolveSetupNumericId(value) {
  if (value == null || value === '') {
    return undefined
  }
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return value
  }
  const text = String(value).trim()
  if (!/^\d+$/.test(text)) {
    return undefined
  }
  const parsed = Number(text)
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed
  }
  return undefined
}

/** Client-side public id for setup rows (prefers idMask; falls back to legacy numeric keys). */
export function resolveSetupPublicId(row, master) {
  if (!row) {
    return ''
  }

  const preferred = master?.idField ?? 'idMask'
  const candidates = [preferred, 'idMask', 'id', 'costId']

  for (const key of candidates) {
    const value = row[key]
    if (value != null && value !== '') {
      return String(value)
    }
  }

  return ''
}

export function normalizeSetupRow(row, master) {
  if (!row) {
    return row
  }
  const idMask = resolveSetupPublicId(row, master)
  if (!idMask) {
    return row
  }
  return row.idMask === idMask ? row : { ...row, idMask }
}

export function normalizeSetupRows(rows, master) {
  return (rows ?? []).map((row) => normalizeSetupRow(row, master))
}

/** Fields to merge on update when the API still expects legacy numeric ids in the body. */
export function setupMutationIdFields(editingRow, publicId) {
  const fields = {}
  if (publicId) {
    fields.idMask = publicId
  }
  if (editingRow?.id != null && editingRow.id !== '') {
    fields.id = editingRow.id
  }
  if (editingRow?.costId != null && editingRow.costId !== '') {
    fields.costId = editingRow.costId
  }
  return fields
}
