import { isAmountFieldKey } from '@/shared/utils/amountFieldKey'

/** Setup master field descriptor — amount inputs and Indian grouping on lists. */
export function isSetupAmountField(field) {
  if (!field) {
    return false
  }
  if (field.type === 'amount') {
    return true
  }
  if (field.formatKey === 'indianAmount' || field.valueFormat === 'currency') {
    return true
  }
  if (field.type === 'select' || field.type === 'textarea' || field.type === 'checkbox' || field.type === 'date') {
    return false
  }
  if (field.digitsOnly || field.formatKey === 'bankAccountNumber') {
    return false
  }
  return isAmountFieldKey(field.name)
}
