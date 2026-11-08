export const MOCK_DEPRECIATION_HISTORY = {
  'dep-mask-001': [
    { assetId: 'FA-000101', description: 'Admin Building Block A', amount: '125000.00' },
    { assetId: 'FA-000205', description: 'Motor Vehicle MH-12-AB-1234', amount: '45200.50' },
  ],
  'dep-mask-002': [
    { assetId: 'OPN-00001', description: 'Opening fixed asset — sample', amount: '9800.00' },
  ],
}

export const INITIAL_DEPRECIATION_ROWS = [
  {
    idMask: 'dep-mask-001',
    depreciationAmount: 170200.5,
    depreciationNumber: 'DEP-2025-0003',
    depreciationDate: '2025-03-31',
    processUpTo: '2025-03-31',
    category: 'A',
    categoryLabel: 'All Asset',
  },
  {
    idMask: 'dep-mask-002',
    depreciationAmount: 9800,
    depreciationNumber: 'DEP-2025-0002',
    depreciationDate: '2025-02-28',
    processUpTo: '2025-02-28',
    category: 'T',
    categoryLabel: 'Asset Type',
    categoryList: 'BUILDING',
  },
]
