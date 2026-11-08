export function formatStatusLabel(value) {
  if (value == null || value === '') {
    return '—'
  }
  return String(value)
}

export function yesNoLabel(value) {
  if (value === true || value === 'Y' || value === 'y') {
    return 'Yes'
  }
  return 'No'
}

function isTruthyFlag(value) {
  return value === true || value === 'Y' || value === 'y' || value === 1 || value === '1'
}

function isFalsyFlag(value) {
  return value === false || value === 'N' || value === 'n' || value === 0 || value === '0'
}

/** Active / Inactive from common setup row shapes (Y/N, boolean, isActive, isDeleted). */
export function activeInactiveLabelFromRow(row) {
  if (!row || typeof row !== 'object') {
    return 'Inactive'
  }
  if (typeof row.isActive === 'boolean') {
    return row.isActive ? 'Active' : 'Inactive'
  }
  if (typeof row.active === 'boolean') {
    return row.active ? 'Active' : 'Inactive'
  }
  if (isTruthyFlag(row.isActive) || isTruthyFlag(row.active)) {
    return 'Active'
  }
  if (isFalsyFlag(row.isActive) || isFalsyFlag(row.active)) {
    return 'Inactive'
  }
  if (typeof row.activeStatus === 'string' && row.activeStatus.trim() !== '') {
    return isTruthyFlag(row.activeStatus.trim()) ? 'Active' : 'Inactive'
  }
  if (typeof row.activeStatus === 'boolean') {
    return row.activeStatus ? 'Active' : 'Inactive'
  }
  if (typeof row.isDeleted === 'boolean') {
    return row.isDeleted ? 'Inactive' : 'Active'
  }
  if (isTruthyFlag(row.isDeleted) || row.deleteStatus === 'Y') {
    return 'Inactive'
  }
  if (isFalsyFlag(row.isDeleted) || row.deleteStatus === 'N') {
    return 'Active'
  }
  return 'Inactive'
}

/** Same rules as status chip — use for Activate/Deactivate actions. */
export function isRowActive(row) {
  return activeInactiveLabelFromRow(row) === 'Active'
}

/** @deprecated Use isRowActive */
export function isSetupRowActive(row) {
  return isRowActive(row)
}
