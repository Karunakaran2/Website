/**
 * Mock Data for Payment Sanctions & Disbursement
 * KRAN Consulting Design System Context
 */

export const MOCK_PAYMENT_SANCTIONS = [
  {
    id: 1,
    idMask: 'pay-001',
    sanctionNo: 'PAY-SAN/2026/012',
    sanctionDate: '05-03-2026',
    beneficiaryName: 'Amazon Web Services (Cloud Infrastructure)',
    paymentAmount: 125450.0,
    bankName: 'State Bank of India',
    bankHoaIdMask: 'hoa-sbi-06',
    status: 'Disbursed',
    statusLabel: 'Disbursed',
    transactionMode: 'NEFT',
    transactionNumber: 'SBIN9284019284',
    instrumentDate: '06-03-2026',
  },
  {
    id: 2,
    idMask: 'pay-002',
    sanctionNo: 'PAY-SAN/2026/015',
    sanctionDate: '08-03-2026',
    beneficiaryName: 'Figma Inc (Enterprise Design Tooling)',
    paymentAmount: 840000.0,
    bankName: 'State Bank of India',
    bankHoaIdMask: 'hoa-sbi-06',
    status: 'Approved',
    statusLabel: 'Approved',
    transactionMode: 'RTGS',
    transactionNumber: 'SBINR20260308001',
    instrumentDate: '09-03-2026',
  },
  {
    id: 3,
    idMask: 'pay-003',
    sanctionNo: 'PAY-SAN/2026/018',
    sanctionDate: '12-03-2026',
    beneficiaryName: 'GitHub Inc (CI/CD Runners & Automated Testing)',
    paymentAmount: 218300.0,
    bankName: 'HDFC Bank',
    bankHoaIdMask: 'hoa-hdfc-07',
    status: 'Pending',
    statusLabel: 'Pending',
    transactionMode: 'NEFT',
    transactionNumber: '',
    instrumentDate: null,
  },
]
