import { depreciationCategoryRequiresList } from '../constants/assetDepreciation'

export function validateDepreciationProcessForm(values) {
  const fieldErrors = {}

  if (!String(values.depreciationDateStr ?? '').trim()) {
    fieldErrors.depreciationDateStr = 'Date is required.'
  }

  if (!values.category) {
    fieldErrors.category = 'Depreciation category is required.'
  }

  if (
    depreciationCategoryRequiresList(values.category)
    && !String(values.categoryList ?? '').trim()
  ) {
    fieldErrors.categoryList = 'Select or enter a category value.'
  }

  return fieldErrors
}
