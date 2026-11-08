/** FA Group — field options aligned to legacy asset FA group screen. */

export const ASSET_CLASS_IT_OPTIONS = [
  { value: '4', label: 'Building', voucherType: 'BUILDING' },
  { value: '5', label: 'Land', voucherType: 'LAND' },
  { value: '6', label: 'Vehicles', voucherType: 'VEHICLES' },
]

export const DEPRECIATION_METHOD_OPTIONS = [
  { value: 'W', label: 'WDV' },
  { value: 'S', label: 'SLM' },
]

export const DEPRECIATION_BASIS_OPTIONS = [
  { value: 'D', label: 'Daily' },
  { value: 'W', label: 'Weekly' },
  { value: 'M', label: 'Monthly' },
  { value: 'Q', label: 'Quarterly' },
  { value: 'Y', label: 'Yearly' },
]

export const DEPRECIABLE_OPTIONS = [
  { value: 'Y', label: 'Yes' },
  { value: 'N', label: 'No' },
]

/** Mock numbering groups per asset class (replace with API when available). */
export const NUMBERING_OPTIONS_BY_CLASS = {
  4: [
    { value: 'BLD-GRP-01', label: 'BLD-GRP-01' },
    { value: 'BLD-GRP-02', label: 'BLD-GRP-02' },
  ],
  5: [
    { value: 'LND-GRP-01', label: 'LND-GRP-01' },
  ],
  6: [
    { value: 'VEH-GRP-01', label: 'VEH-GRP-01' },
    { value: 'VEH-GRP-02', label: 'VEH-GRP-02' },
  ],
}

export const FA_GROUP_FORM_DEFAULTS = {
  idMask: '',
  assetType: '',
  assetClassItId: '',
  assetNumber: '',
  depreciable: 'Y',
  depreciationRateIt: '0.0',
  depreciationMethod: 'W',
  residualValue: '5',
  depreciationBasis: 'M',
  usefulLife: '0',
  active: 'Y',
}

export function createEmptyFaGroupForm() {
  return { ...FA_GROUP_FORM_DEFAULTS }
}

export function assetClassItLabel(classId) {
  return ASSET_CLASS_IT_OPTIONS.find((item) => item.value === String(classId))?.label ?? '—'
}

export function depreciationMethodLabel(code) {
  return DEPRECIATION_METHOD_OPTIONS.find((item) => item.value === code)?.label ?? code ?? '—'
}

export function depreciationBasisLabel(code) {
  return DEPRECIATION_BASIS_OPTIONS.find((item) => item.value === code)?.label ?? code ?? '—'
}

export function numberingOptionsForClass(classId) {
  if (!classId) {
    return []
  }
  return NUMBERING_OPTIONS_BY_CLASS[String(classId)] ?? []
}
