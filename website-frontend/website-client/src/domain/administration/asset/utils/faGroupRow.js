import {
  assetClassItLabel,
  depreciationBasisLabel,
  depreciationMethodLabel,
} from '../constants/faGroup'

export function createFaGroupIdMask() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `fa-group-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/** Map form values to a list row (includes display labels for accounts until GL linkage exists). */
export function faGroupFormToRow(formValues) {
  const idMask = String(formValues.idMask ?? '').trim()
  const active = formValues.active ?? 'Y'
  return {
    idMask,
    assetType: String(formValues.assetType ?? '').trim(),
    assetClassItId: String(formValues.assetClassItId ?? ''),
    assetClassLabel: assetClassItLabel(formValues.assetClassItId),
    assetNumber: formValues.assetNumber ?? '',
    depreciable: formValues.depreciable ?? 'Y',
    depreciationRateIt: formValues.depreciationRateIt ?? '',
    depreciationMethod: formValues.depreciationMethod ?? '',
    depreciationMethodLabel: depreciationMethodLabel(formValues.depreciationMethod),
    residualValue: formValues.residualValue ?? '',
    depreciationBasis: formValues.depreciationBasis ?? '',
    depreciationBasisLabel: depreciationBasisLabel(formValues.depreciationBasis),
    usefulLife: formValues.usefulLife ?? '',
    assetAccount: formValues.assetAccount ?? '—',
    depreciationAccount: formValues.depreciationAccount ?? '—',
    cumDepreciationAccount: formValues.cumDepreciationAccount ?? '—',
    cwipAccount: formValues.cwipAccount ?? '—',
    active,
    isActive: active === 'Y',
  }
}

export function faGroupRowToForm(row) {
  if (!row) {
    return null
  }
  return {
    idMask: row.idMask ?? '',
    assetType: row.assetType ?? '',
    assetClassItId: row.assetClassItId ?? '',
    assetNumber:
      row.assetNumber
      ?? (row.numberingGroupId != null ? String(row.numberingGroupId) : ''),
    numberingGroupId: row.numberingGroupId,
    depreciable: row.depreciable ?? 'Y',
    depreciationRateIt: String(row.depreciationRateIt ?? ''),
    depreciationMethod: row.depreciationMethod ?? 'W',
    residualValue: String(row.residualValue ?? ''),
    depreciationBasis: row.depreciationBasis ?? 'M',
    usefulLife: String(row.usefulLife ?? ''),
    active: row.active ?? (row.isActive === false ? 'N' : 'Y'),
  }
}
