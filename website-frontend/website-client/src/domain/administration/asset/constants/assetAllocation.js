/** Asset allocation — assign custodian / location (legacy assetAllotForm). */

export const ALLOCATION_CUSTODIAN_OPTIONS = [
  { idMask: 'cust-mask-ajith', label: 'Ajith Kumar' },
  { idMask: 'cust-mask-arun-g', label: 'Arun G Nair' },
  { idMask: 'cust-mask-arjun-ap', label: 'Arjun A P' },
  { idMask: 'cust-mask-arya', label: 'Arya' },
  { idMask: 'cust-mask-karunakaran', label: 'Karunakaran' },
  { idMask: 'cust-mask-cyriac', label: 'Cyriac' },
  { idMask: 'cust-mask-anand', label: 'Anand S V' },
  { idMask: 'cust-mask-meera', label: 'Meera Beegam' },
  { idMask: 'cust-mask-nivetha', label: 'Nivetha' },
  { idMask: 'cust-mask-shameer', label: 'Shameer' },
  { idMask: 'cust-mask-vivek', label: 'Vivek' },
  { idMask: 'cust-mask-lijo', label: 'Lijo' },
  { idMask: 'cust-mask-rahul', label: 'Rahul' },
  { idMask: 'cust-mask-abhijith', label: 'Abhijith' },
  { idMask: 'cust-mask-anjali', label: 'Anjali' },
  { idMask: 'cust-mask-deepak', label: 'Deepak' },
  { idMask: 'cust-mask-harikrishnan', label: 'Harikrishnan' },
  { idMask: 'cust-mask-athira', label: 'Athira' },
  { idMask: 'cust-mask-sneha', label: 'Sneha' },
  { idMask: 'cust-mask-manoj', label: 'Manoj' },
]

export function createEmptyAssetAllocationForm() {
  const today = new Date().toISOString().slice(0, 10)
  return {
    assetInformationIdMask: '',
    newLocation: '',
    custodianIdMask: '',
    allocationDateStr: today,
    comments: '',
  }
}

export function allocationCustodianLabel(idMask) {
  if (!idMask) {
    return '—'
  }
  return ALLOCATION_CUSTODIAN_OPTIONS.find((opt) => opt.idMask === idMask)?.label ?? '—'
}
