/** Asset Information (capitalisation) — field options (mock until master/asset APIs). */

export const DOCUMENT_TYPE_OPTIONS = [
  { value: 'I', label: 'Purchase Invoice' },
  { value: 'J', label: 'Journal' },
  { value: 'P', label: 'Payment' },
  { value: 'N', label: 'Note' },
]

export const COST_CENTER_OPTIONS = [
  { value: '1', label: 'Admin Department' },
  { value: '2', label: 'Development' },
  { value: '3', label: 'Finance & Accounting' },
  { value: '4', label: 'HR Department' },
  { value: '5', label: 'Management' },
  { value: '7', label: 'Assam' },
  { value: '9', label: 'Delhi' },
  { value: '12', label: 'Maharashtra' },
  { value: '295', label: 'Head Office' },
  { value: '375', label: 'Admin Department' },
]

export const CUSTODIAN_OPTIONS = [
  { value: '0', label: '-Select Custodian-' },
  { value: '1234', label: 'Karunakaran' },
  { value: '1226', label: 'Cyriac' },
  { value: '155', label: 'Cyriac James' },
  { value: '612', label: 'Rahul' },
  { value: '640', label: 'Lijo' },
  { value: '831', label: 'Vivek' },
]

export function documentTypeLabel(code) {
  return DOCUMENT_TYPE_OPTIONS.find((item) => item.value === code)?.label ?? code ?? '—'
}

export function costCenterLabel(id) {
  if (id == null || id === '') {
    return '—'
  }
  return COST_CENTER_OPTIONS.find((item) => item.value === String(id))?.label ?? String(id)
}

export function custodianLabel(id) {
  if (id == null || id === '' || id === '0') {
    return '—'
  }
  return CUSTODIAN_OPTIONS.find((item) => item.value === String(id))?.label ?? String(id)
}

export function createEmptyDocumentLine() {
  return {
    localKey: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    id: '',
    documentType: 'I',
    documentNumber: '',
    documentAmount: '',
    openAmount: '',
    capitalizationAmount: '',
  }
}

export const ASSET_INFORMATION_FORM_DEFAULTS = {
  idMask: '',
  assetId: '',
  assetDescription: '',
  faGroupIdMask: '',
  capitalisationDate: '',
  putToUseDate: '',
  hsnCodeId: '',
  costCenterId: '',
  assetQty: '1',
  assetCost: '',
  serialNumber: '',
  custodianId: '',
  barcode: '',
  location: '',
  attachmentFileName: '',
  active: 'Y',
  documents: [createEmptyDocumentLine()],
}

export function createEmptyAssetInformationForm() {
  return {
    ...ASSET_INFORMATION_FORM_DEFAULTS,
    documents: [createEmptyDocumentLine()],
  }
}
