/** Module 1 operational reports — catalog and types (Probity report module pattern). */

export const MODULE_1_REPORT_TYPES = [
  { value: 'income-expenditure', label: 'Income and Expenditure Summary' },
  { value: 'department-allocation', label: 'Departmental Allocation Statement' },
  { value: 'sanctions-register', label: 'Detailed Sanctions Register' },
]

export const MODULE_1_REPORT_CATALOG = [
  { id: 'income-expenditure', label: 'Income and Expenditure Summary' },
  { id: 'trial-balance', label: 'Trial Balance' },
  { id: 'ledger', label: 'Ledger Report' },
  { id: 'department-allocation', label: 'Departmental Allocation Statement' },
  { id: 'sanctions-register', label: 'Detailed Sanctions Register' },
  { id: 'receipt-payment', label: 'Receipt and Payment Register' },
  { id: 'balance-sheet', label: 'Balance Sheet (NPO)' },
  { id: 'fixed-asset-register', label: 'Fixed Asset Register' },
  { id: 'asset-nbv', label: 'Asset NBV Summary' },
]

export function resolveModule1ReportType(catalogId) {
  const supported = new Set(MODULE_1_REPORT_TYPES.map((t) => t.value))
  return supported.has(catalogId) ? catalogId : 'income-expenditure'
}

/** Default report type when opening a reports secondary tab. */
export const MODULE_1_REPORT_TAB_DEFAULTS = {
  operational: 'income-expenditure',
  applications: 'sanctions-register',
  transactions: 'receipt-payment',
  audit: 'department-allocation',
  export: 'income-expenditure',
}

export const MODULE_1_REPORT_DEPARTMENTS = ['All Departments', ...[
  'Engineering',
  'Finance & Accounts',
  'Human Resources',
  'Operations',
  'Quality Assurance',
  'Legal & Compliance',
]]
