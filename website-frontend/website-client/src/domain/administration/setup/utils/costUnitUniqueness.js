export const DUPLICATE_COST_UNIT_MESSAGE =
  'Cost Unit Name already exists under this Cost Category.'

export function normalizeCostUnitName(value) {
  return String(value || '').trim().toLowerCase()
}

function sameCostUnit(item, currentRecord) {
  if (!item || !currentRecord) {
    return false
  }
  if (currentRecord.idMask != null && currentRecord.idMask !== ''
    && item.idMask != null && String(item.idMask) === String(currentRecord.idMask)) {
    return true
  }
  const currentCostId = currentRecord.costId ?? currentRecord.id
  const itemCostId = item.costId ?? item.id
  if (currentCostId != null && currentCostId !== ''
    && itemCostId != null && String(itemCostId) === String(currentCostId)) {
    return true
  }
  return false
}

function toCostUnitList(items) {
  if (Array.isArray(items)) {
    return items
  }
  if (Array.isArray(items?.data)) {
    return items.data
  }
  return []
}

/** True when another unit in the same category already uses this name. */
export function isDuplicateCostUnitName(costCentreName, costCategoryId, existingItems, currentRecord) {
  const name = normalizeCostUnitName(costCentreName)
  if (!name || costCategoryId == null || costCategoryId === '') {
    return false
  }
  const categoryId = String(costCategoryId)
  return toCostUnitList(existingItems).some((item) => (
    String(item?.costCategoryId ?? '') === categoryId
    && normalizeCostUnitName(item?.costCentreName) === name
    && !sameCostUnit(item, currentRecord)
  ))
}
