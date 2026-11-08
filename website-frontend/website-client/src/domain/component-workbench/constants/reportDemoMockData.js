/** Deterministic expenditure-style rows for the workbench report overview demo. */

export const REPORT_DEMO_TYPES = [
  { value: 'income-expenditure', label: 'Income and Expenditure Summary' },
  { value: 'department-allocation', label: 'Departmental Allocation Statement' },
  { value: 'sanctions-register', label: 'Detailed Sanctions Register' },
]

/** Catalog tiles (Probity-style); all map to the same interactive demo dataset. */
export const REPORT_CATALOG_ENTRIES = [
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

export function resolveReportDemoType(catalogId) {
  const supported = new Set(REPORT_DEMO_TYPES.map((t) => t.value))
  return supported.has(catalogId) ? catalogId : 'income-expenditure'
}

export const REPORT_DEMO_DEPARTMENTS = ['All Departments', 'Engineering', 'Finance & Accounts', 'Operations', 'Human Resources']

export const REPORT_DEMO_ROWS = [
  {
    id: 'R-001',
    code: 'CAP-2026-014',
    title: 'Quarterly GST Reconciliation',
    department: 'Finance & Accounts',
    category: 'Statutory',
    amount: 350000,
    status: 'Approved',
    period: 'Q2 FY 2026-27',
  },
  {
    id: 'R-002',
    code: 'INF-2026-008',
    title: 'Cloud DR Failover Drill',
    department: 'Engineering',
    category: 'Infrastructure',
    amount: 820000,
    status: 'Approved',
    period: 'Q2 FY 2026-27',
  },
  {
    id: 'R-003',
    code: 'HR-2026-003',
    title: 'Staff Welfare Programme',
    department: 'Human Resources',
    category: 'Welfare',
    amount: 125000,
    status: 'Under Review',
    period: 'Q2 FY 2026-27',
  },
  {
    id: 'R-004',
    code: 'OPS-2026-011',
    title: 'Regional Office Maintenance',
    department: 'Operations',
    category: 'Maintenance',
    amount: 96000,
    status: 'Approved',
    period: 'Q2 FY 2026-27',
  },
  {
    id: 'R-005',
    code: 'FIN-2026-019',
    title: 'Audit Compliance Toolkit',
    department: 'Finance & Accounts',
    category: 'Compliance',
    amount: 54000,
    status: 'Submitted',
    period: 'Q2 FY 2026-27',
  },
  {
    id: 'R-006',
    code: 'ENG-2026-006',
    title: 'Design System Centralization',
    department: 'Engineering',
    category: 'Digital',
    amount: 410000,
    status: 'Approved',
    period: 'Q2 FY 2026-27',
  },
  {
    id: 'R-007',
    code: 'OPS-2026-015',
    title: 'Fleet Fuel Allocation',
    department: 'Operations',
    category: 'Operations',
    amount: 178000,
    status: 'Approved',
    period: 'Q2 FY 2026-27',
  },
  {
    id: 'R-008',
    code: 'HR-2026-007',
    title: 'Training & Certification',
    department: 'Human Resources',
    category: 'Capacity Building',
    amount: 92000,
    status: 'Draft',
    period: 'Q2 FY 2026-27',
  },
]
