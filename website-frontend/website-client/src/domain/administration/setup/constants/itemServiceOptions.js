import { formatIndianAmount } from '@/shared/utils/probityFormat'

/** Hardcoded Item/Service Master options — same codes as Probity 2.0 viewservicetypesetup.js */
export const ITEM_SERVICE_CATEGORY_OPTIONS = [
  { value: 'I', label: 'Item Code' },
  { value: 'S', label: 'Service Code' },
]

export const ITEM_SERVICE_TYPE_OPTIONS = [
  { value: 'S', label: 'Sales' },
  { value: 'P', label: 'Purchase' },
  { value: 'B', label: 'Both' },
]

export const ITEM_SERVICE_GST_RATE_OPTIONS = [
  { value: '0', label: '0%' },
  { value: '5', label: '5%' },
  { value: '12', label: '12%' },
  { value: '18', label: '18%' },
  { value: '28', label: '28%' },
]

/** Live DB has no service_nature table — Nature is a varchar column. */
export const ITEM_SERVICE_NATURE_OPTIONS = [
  { value: 'Goods', label: 'Goods' },
  { value: 'Services', label: 'Services' },
  { value: 'Fixed Asset', label: 'Fixed Asset' },
]

export const ITEM_SERVICE_YES_NO_OPTIONS = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
]

/** rcm_applicable is boolean in live DB — UI still uses Y/N. */
export const ITEM_SERVICE_RCM_OPTIONS = [
  { value: 'Y', label: 'Yes' },
  { value: 'N', label: 'No' },
]

/** Probity goToServiceTypeSetup uses baseAccountTypeId 3 = Income, 4 = Expense. */
export const ITEM_SERVICE_INCOME_BASE_ACCOUNT_TYPE_ID = 3
export const ITEM_SERVICE_EXPENSE_BASE_ACCOUNT_TYPE_ID = 4

export function unwrapSetupList(response) {
  if (Array.isArray(response)) {
    return response
  }
  if (Array.isArray(response?.data)) {
    return response.data
  }
  return []
}

/** Resolve Income (3) / Expense (4) from HOA row; fall back to chart group when base is unset. */
export function resolveHoaBaseAccountTypeId(hoa, accountSetupsByGroupId) {
  if (hoa?.baseAccountTypeId != null && hoa.baseAccountTypeId !== '') {
    return Number(hoa.baseAccountTypeId)
  }
  const groupId = hoa?.accountTypeId
  if (groupId == null || groupId === '') {
    return NaN
  }
  const group = accountSetupsByGroupId?.get(Number(groupId))
  if (group?.accountTypeId == null || group.accountTypeId === '') {
    return NaN
  }
  return Number(group.accountTypeId)
}

export function filterHoaLedgersByBaseAccountType(hoaLedgers, accountSetups, baseAccountTypeId) {
  const byGroupId = new Map()
  for (const group of unwrapSetupList(accountSetups)) {
    if (group?.id != null) {
      byGroupId.set(Number(group.id), group)
    }
  }
  return unwrapSetupList(hoaLedgers).filter(
    (hoa) => resolveHoaBaseAccountTypeId(hoa, byGroupId) === Number(baseAccountTypeId),
  )
}

/** Sales → Income groups only; Purchase → Expense groups only. */
export function getItemServiceLedgerGroupOptions(accountSetups, primaryBaseAccountTypeId) {
  const list = unwrapSetupList(accountSetups)
  return list
    .filter((item) => Number(item?.accountTypeId) === Number(primaryBaseAccountTypeId)
      && item?.id != null
      && item?.accountName)
    .sort((a, b) => String(a.accountName).localeCompare(String(b.accountName)))
    .map((item) => ({
      value: String(item.id),
      label: String(item.accountName),
    }))
}

export function resolveTcsRate(tcsType, tcsTypes = []) {
  const match = (tcsTypes || []).find((item) => String(item.id) === String(tcsType))
  if (match?.tcsRate != null) {
    return String(match.tcsRate)
  }
  switch (String(tcsType || '')) {
    case '2':
    case '3':
      return '1'
    case '4':
      return '0.10'
    default:
      return '0'
  }
}

export function toSelectOptions(items, valueKey, labelKey) {
  return (items || [])
    .filter((item) => item?.[valueKey] != null && item?.[labelKey])
    .map((item) => ({
      value: String(item[valueKey]),
      label: String(item[labelKey]),
    }))
}

export function toCodeSelectOptions(items, idKey, codeKey, descriptionKey) {
  return (items || [])
    .filter((item) => item?.[idKey] != null && item?.[codeKey])
    .map((item) => ({
      value: String(item[idKey]),
      label: item[descriptionKey]
        ? `${item[codeKey]} - ${item[descriptionKey]}`
        : String(item[codeKey]),
    }))
}

export function normalizeItemServiceCode(value) {
  return String(value || '').trim().toLowerCase()
}

function sameSetupRecord(item, currentRecord) {
  if (!item || !currentRecord) {
    return false
  }
  if (currentRecord.idMask != null && currentRecord.idMask !== ''
    && item.idMask != null && String(item.idMask) === String(currentRecord.idMask)) {
    return true
  }
  if (currentRecord.id != null && currentRecord.id !== ''
    && item.id != null && String(item.id) === String(currentRecord.id)) {
    return true
  }
  return false
}

/** True when another non-current Item/Service row already uses this code. */
export function isDuplicateItemServiceCode(serviceType, existingItems, currentRecord) {
  const code = normalizeItemServiceCode(serviceType)
  if (!code) {
    return false
  }
  return unwrapSetupList(existingItems).some((item) => (
    normalizeItemServiceCode(item?.serviceType) === code
    && !sameSetupRecord(item, currentRecord)
  ))
}

export function isItemServicePriceApplicable(itemType, side) {
  const type = String(itemType || '').toUpperCase()
  if (side === 'sales') {
    return type === 'S' || type === 'B'
  }
  if (side === 'purchase') {
    return type === 'P' || type === 'B'
  }
  return false
}

function isZeroOrEmptyItemServicePrice(value) {
  if (value == null || value === '') {
    return true
  }
  const number = Number(String(value).replace(/,/g, ''))
  return !Number.isNaN(number) && number === 0
}

/** List grid: non-applicable or unset prices show as em dash (Probity 2.0 parity). */
export function formatItemServiceListPrice(value, itemType, side) {
  if (!isItemServicePriceApplicable(itemType, side)) {
    return '—'
  }
  if (isZeroOrEmptyItemServicePrice(value)) {
    return '—'
  }
  return formatIndianAmount(value, { empty: '—' })
}

/** Edit form: do not pre-fill 0 on sides that are hidden or unused. */
export function formatItemServiceFormPrice(value, itemType, side) {
  if (!isItemServicePriceApplicable(itemType, side)) {
    return ''
  }
  if (isZeroOrEmptyItemServicePrice(value)) {
    return ''
  }
  return formatIndianAmount(value)
}
