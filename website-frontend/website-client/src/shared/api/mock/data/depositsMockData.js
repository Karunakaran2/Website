/**
 * Mock Data for Deposits (Security Deposits, Earnest Money Deposit)
 * KRAN Consulting Design System Context
 */

export const MOCK_DEPOSITS = [
  {
    id: 1,
    idMask: 'dep-001',
    depositReceiptNo: 'DEP/2026/041',
    depositDate: '10-01-2026',
    depositType: 'Earnest Money Deposit (EMD)',
    partyName: 'National Informatics Centre (NIC)',
    amount: 250000.0,
    tenderRef: 'TEN-KRAN-DS-2026-02',
    bankName: 'State Bank of India',
    status: 'Approved',
    statusLabel: 'Approved',
    refundStatus: 'Not Refunded',
    remarks: 'EMD for Digital Governance Enterprise Design Framework',
  },
  {
    id: 2,
    idMask: 'dep-002',
    depositReceiptNo: 'DEP/2026/044',
    depositDate: '22-01-2026',
    depositType: 'Security Deposit',
    partyName: 'Figma Inc (Enterprise Design Tooling)',
    amount: 500000.0,
    tenderRef: 'TEN-KRAN-TOOL-2025-09',
    bankName: 'HDFC Bank',
    status: 'Approved',
    statusLabel: 'Approved',
    refundStatus: 'Not Refunded',
    remarks: 'Performance guarantee for enterprise tooling SLA',
  },
  {
    id: 3,
    idMask: 'dep-003',
    depositReceiptNo: 'DEP/2025/118',
    depositDate: '15-11-2025',
    depositType: 'Security Deposit',
    partyName: 'Kerala State Electronics Development Corp (KELTRON)',
    amount: 150000.0,
    tenderRef: 'TEN-KRAN-UI-2025-04',
    bankName: 'State Bank of India',
    status: 'Refunded',
    statusLabel: 'Refunded',
    refundStatus: 'Refunded',
    remarks: 'Component library implementation warranty period completed',
  },
]
