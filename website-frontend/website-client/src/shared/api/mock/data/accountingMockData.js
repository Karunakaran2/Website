/**
 * Mock Data for Accounting & Vouchers (Drafts, Contra, Journal, Sales, Purchase, Receipt, etc.)
 * KRAN Consulting Design System Context
 */

export const MOCK_DRAFT_VOUCHERS = [
  {
    id: 1,
    idMask: 'draft-jv-101',
    documentDate: '2026-03-10',
    documentNo: 'JV/1044/26-27',
    voucherType: 'Journal',
    voucherId: 1,
    documentAmount: 86000.0,
    partyName: 'National Informatics Centre (NIC)',
    submittedStatus: 'N',
    narration: 'Enterprise UI design system component library phase-1 delivery adjustment',
  },
  {
    id: 2,
    idMask: 'draft-cv-102',
    documentDate: '2026-03-11',
    documentNo: 'CV/155/26-27',
    voucherType: 'Contra',
    voucherId: 2,
    documentAmount: 500000.0,
    partyName: 'State Bank of India',
    submittedStatus: 'N',
    narration: 'Cash withdrawal for Technopark Design Lab operations imprest',
  },
  {
    id: 3,
    idMask: 'draft-pu-103',
    documentDate: '2026-03-12',
    documentNo: 'PU/623/26-27',
    voucherType: 'Purchase',
    voucherId: 3,
    documentAmount: 218300.0,
    partyName: 'Figma Inc (Enterprise Design Tooling)',
    submittedStatus: 'N',
    narration: 'Annual Figma Enterprise Organization license renewal for UX team',
  },
  {
    id: 4,
    idMask: 'draft-pv-104',
    documentDate: '2026-03-14',
    documentNo: 'PV/841/26-27',
    voucherType: 'Payment',
    voucherId: 4,
    documentAmount: 125450.0,
    partyName: 'Amazon Web Services (Cloud & Edge Infrastructure)',
    submittedStatus: 'N',
    narration: 'Cloud sandbox and CDN hosting charges for design token distribution',
  },
  {
    id: 5,
    idMask: 'draft-sal-105',
    documentDate: '2026-03-15',
    documentNo: 'SAL/217/26-27',
    voucherType: 'Sales',
    voucherId: 5,
    documentAmount: 450000.0,
    partyName: 'Department of Digital Governance (Client)',
    submittedStatus: 'N',
    narration: 'UI Architecture and Design System enablement consultation invoice',
  },
  {
    id: 6,
    idMask: 'draft-rv-106',
    documentDate: '2026-03-16',
    documentNo: 'RV/311/26-27',
    voucherType: 'Receipt',
    voucherId: 6,
    documentAmount: 52400.0,
    partyName: 'HDFC Bank',
    submittedStatus: 'N',
    narration: 'Quarterly interest credit on technology operating deposit',
  },
]

export const MOCK_CONTRA_ENTRIES = [
  {
    id: 1,
    idMask: 'contra-001',
    documentDate: '2026-03-11',
    numberingGroupId: 1,
    numberingGroupIdMask: 'num-cv',
    documentNo: 'CV/155/26-27',
    costCategoryId: 1,
    costCategoryIdMask: 'cat-ds',
    costUnitId: 1,
    costUnitIdMask: 'cc-ds-01',
    submittedStatus: 'N',
    narration: 'Cash withdrawal from SBI Corporate account to Technopark Lab Cash',
    depositDetails: {
      contraTypeId: 2,
      contraTypeIdMask: 'ct-bank-to-cash',
      payingHoaId: 6,
      payingHoaIdMask: 'hoa-sbi-06',
      receivingHoaId: 8,
      receivingHoaIdMask: 'hoa-cash-08',
      payMode: 'C',
      refNo: 'CHQ-894102',
      amount: 500000.0,
    },
    accountingEntries: [
      {
        type: 'Cr',
        hoaId: 6,
        hoaIdMask: 'hoa-sbi-06',
        amount: 500000.0,
        currentBalance: 241540000.0,
      },
      {
        type: 'Dr',
        hoaId: 8,
        hoaIdMask: 'hoa-cash-08',
        amount: 500000.0,
        currentBalance: 5450000.0,
      },
    ],
    totalDebitAmount: 500000.0,
    totalCreditAmount: 500000.0,
  },
]

export const MOCK_CONTRA_TYPES = [
  { id: 1, idMask: 'ct-cash-to-bank', contraTypeName: 'Cash to Bank (Deposit)' },
  { id: 2, idMask: 'ct-bank-to-cash', contraTypeName: 'Bank to Cash (Withdrawal)' },
  { id: 3, idMask: 'ct-bank-to-bank', contraTypeName: 'Bank to Bank (Transfer)' },
]

export const MOCK_REVERSABLE_VOUCHERS = [
  {
    id: 1,
    idMask: 'rev-001',
    voucherType: 'Payment',
    documentNo: 'PV/830/26-27',
    documentDate: '2026-02-15',
    partyName: 'GitHub Inc (CI/CD & DevOps Enterprise)',
    amount: 42750.0,
    narration: 'Design system automated testing runner hours – duplicate billing adjustment',
    isReversible: true,
  },
  {
    id: 2,
    idMask: 'rev-002',
    voucherType: 'Journal',
    documentNo: 'JV/1020/26-27',
    documentDate: '2026-02-20',
    partyName: 'Figma Inc (Enterprise Design Tooling)',
    amount: 675000.0,
    narration: 'Component prototyping seat allocation adjustment',
    isReversible: true,
  },
]

export const MOCK_RECURRING_VOUCHERS = [
  {
    id: 1,
    idMask: 'rec-001',
    voucherType: 'Journal',
    documentNo: 'JV-REC/01',
    title: 'Monthly Cloud Infrastructure Amortisation for UI Hosting',
    frequency: 'Monthly',
    amount: 64200.0,
    nextExecutionDate: '2026-04-01',
    status: 'ACTIVE',
    logs: [
      { executionDate: '2026-03-01', generatedVoucherNo: 'JV/1039/26-27', status: 'SUCCESS' },
      { executionDate: '2026-02-01', generatedVoucherNo: 'JV/1004/26-27', status: 'SUCCESS' },
    ],
  },
]
