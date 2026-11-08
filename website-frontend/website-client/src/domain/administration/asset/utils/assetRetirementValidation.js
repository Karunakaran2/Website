import { parseAmount } from '@/shared/utils/probityFormat'
import { retirementCategoryRequiresList } from '../constants/assetRetirement'

export function validateRetirementProcessForm(values) {
  const fieldErrors = {}

  if (!String(values.retirementDateStr ?? '').trim()) {
    fieldErrors.retirementDateStr = 'Retirement date is required.'
  }

  if (!String(values.retirementGroupId ?? '').trim()) {
    fieldErrors.retirementGroupId = 'Retirement group is required.'
  }

  if (!values.category) {
    fieldErrors.category = 'Depreciation category is required.'
  }

  if (
    retirementCategoryRequiresList(values.category)
    && !String(values.categoryList ?? '').trim()
  ) {
    fieldErrors.categoryList = 'Select or enter a category value.'
  }

  return fieldErrors
}

export function validateRetirementPreviewLines(lines, previewState) {
  const errors = {}
  const selectedLines = (lines ?? []).filter((line) => line.selected)
  if (selectedLines.length === 0) {
    errors._form = 'Select at least one asset to process.'
    return errors
  }
  const anySale = selectedLines.some((line) => line.retirementType === 'Sale')
  if (anySale && !String(previewState?.salesNumberingIdMask ?? '').trim()) {
    errors._form = 'Sales numbering group is required when any selected line is Sale.'
  }
  for (const line of selectedLines) {
    if (line.retirementType === 'Sale') {
      const sale = parseAmount(line.saleValue)
      if (!Number.isFinite(sale) || sale <= 0) {
        errors._form = 'Sale value must be greater than zero for Sale lines.'
        break
      }
      if (!line.customerId) {
        errors._form = 'Customer is required for Sale lines.'
        break
      }
    } else if (line.retirementType === 'Scrap') {
      const scrapValue = parseAmount(line.saleValue)
      if (line.saleValue === '' || line.saleValue == null || !Number.isFinite(scrapValue) || scrapValue < 0) {
        errors._form = 'Enter a valid scrap value (zero or greater) for Scrap lines.'
        break
      }
    }
    if (line.accountsConfigured === false) {
      errors._form = 'Fixed asset group accounts are not configured for one or more assets.'
      break
    }
  }
  return errors
}

export function validateRetirementEditForm(values) {
  const fieldErrors = {}
  if (!String(values.retirementType ?? '').trim()) {
    fieldErrors.retirementType = 'Retirement type is required.'
  }
  if (values.retirementType === 'Sale') {
    const sale = parseAmount(values.saleValue)
    if (!Number.isFinite(sale) || sale <= 0) {
      fieldErrors.saleValue = 'Sale value must be greater than zero.'
    }
    if (!String(values.customerId ?? '').trim()) {
      fieldErrors.customerId = 'Customer is required for sale.'
    }
  } else if (values.retirementType === 'Scrap') {
    const scrapValue = parseAmount(values.saleValue)
    if (values.saleValue === '' || values.saleValue == null || !Number.isFinite(scrapValue) || scrapValue < 0) {
      fieldErrors.saleValue = 'Enter a valid scrap value (zero or greater).'
    }
  }
  return fieldErrors
}
