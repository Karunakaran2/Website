/** Matches monetary / quantity amount field names (forms, tables, API keys). */
export const AMOUNT_FIELD_KEY_PATTERN =
  /(amount|price|balance|debit|credit|total|rate|tds|tcs|tax|payable|outstanding|instrument|request|rupee|valuation|salary|fee|charge|net|gross|bookValue|saleValue|salesValue|gainOrLoss|bgAmount)/i

/** Keys that look like amounts but are identifiers, codes, or non-money fields. */
export const AMOUNT_FIELD_EXCLUDE_PATTERN =
  /(creditOrDebit|gstRate|taxType|rateType|status|date|count|number$|documentNo|voucherNo|invoiceNo|id$|idMask|percent|percentage|costCenter|costCentre|costCategory|costUnit|officeName|allocatedCount|lastGeneratedNumber|accountNumber|ifscNo|contactNumber|mobile|phone|pincode|aadhaar|aadhar|corporateIdentificationNumber|pettyCashCodeOrCashCode)/i

/**
 * Whether a form/API field name should use Indian amount display and input (en-IN, 2 decimals).
 * @param {string} fieldName — plain or dotted path (`lines.0.debitAmount`)
 */
export function isAmountFieldKey(fieldName) {
  if (fieldName == null || fieldName === '') {
    return false
  }
  const base = String(fieldName).split('.').pop()
  if (AMOUNT_FIELD_EXCLUDE_PATTERN.test(base)) {
    return false
  }
  return AMOUNT_FIELD_KEY_PATTERN.test(base)
}
