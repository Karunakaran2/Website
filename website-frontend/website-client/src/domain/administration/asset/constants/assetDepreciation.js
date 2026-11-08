/** Fixed asset depreciation — process form and listing (legacy assetDepreciation). */

import { formatIndianAmount } from '@/shared/utils/probityFormat'

export const DEPRECIATION_CATEGORY_OPTIONS = [
  { value: 'A', label: 'All Asset' },
  { value: 'S', label: 'Asset Class' },
  { value: 'T', label: 'Asset Type' },
  { value: 'I', label: 'Asset ID' },
  { value: 'C', label: 'Cost Center' },
  { value: 'L', label: 'Location' },
]

export const DEPRECIATION_CATEGORY_SUGGESTIONS = {
  S: ['Building', 'Plant & Machinery', 'Motor Vehicles', 'Furniture & Fixtures'],
  T: ['BUILDING', 'PLANT', 'VEHICLE', 'COMPUTER'],
  I: ['FA-000101', 'FA-000205', 'OPN-00001'],
  C: ['Development', 'Administrative', 'Estate', 'Finance Division'],
  L: ['Head Office', 'Warehouse Block A', 'SEEPZ Unit 12'],
}

export function createEmptyDepreciationForm() {
  const today = new Date().toISOString().slice(0, 10)
  return {
    depreciationNo: '',
    depreciationDateStr: today,
    processUpToStr: '',
    category: 'A',
    categoryList: '',
  }
}

export function depreciationCategoryRequiresList(category) {
  return category && category !== 'A'
}

export function depreciationCategoryLabel(code) {
  return DEPRECIATION_CATEGORY_OPTIONS.find((opt) => opt.value === code)?.label ?? code
}

export function formatDepreciationAmount(value) {
  if (value == null || value === '') {
    return '—'
  }
  return formatIndianAmount(value)
}
