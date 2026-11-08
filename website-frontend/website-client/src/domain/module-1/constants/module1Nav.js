/** Module 1 — primary (gold nav) and secondary (white strip) navigation. */

export const MODULE_1_PRIMARY_NAV_ITEMS = [
  { id: 'm1-overview', label: 'Overview' },
  { id: 'm1-master', label: 'Master Data' },
  { id: 'm1-applications', label: 'Applications' },
  { id: 'm1-transactions', label: 'Transactions' },
  { id: 'm1-documents', label: 'Documents' },
  { id: 'm1-approvals', label: 'Approvals' },
  { id: 'm1-reports', label: 'Reports' },
  { id: 'm1-config', label: 'Configuration' },
]

export const MODULE_1_SECONDARY_NAV_BY_PRIMARY = {
  'm1-overview': [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'my-work', label: 'My Work' },
    { id: 'activity', label: 'Recent Activity' },
    { id: 'notifications', label: 'Notifications' },
  ],
  'm1-master': [
    { id: 'people', label: 'People & Beneficiaries' },
    { id: 'organisations', label: 'Organisations' },
    { id: 'departments', label: 'Departments' },
    { id: 'categories', label: 'Categories & Types' },
    { id: 'reference', label: 'Reference Data' },
  ],
  'm1-applications': [
    { id: 'all', label: 'All Applications' },
    { id: 'draft', label: 'Draft' },
    { id: 'submitted', label: 'Submitted' },
    { id: 'under-review', label: 'Under Review' },
    { id: 'returned', label: 'Returned' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'archived', label: 'Archived' },
  ],
  'm1-transactions': [
    { id: 'all', label: 'All Transactions' },
    { id: 'payments', label: 'Payments & Contributions' },
    { id: 'receipts', label: 'Receipts & References' },
    { id: 'reconciliation', label: 'Reconciliation' },
    { id: 'adjustments', label: 'Adjustments' },
    { id: 'history', label: 'Transaction History' },
  ],
  'm1-documents': [
    { id: 'register', label: 'Document Register' },
    { id: 'upload', label: 'Upload Documents' },
    { id: 'verification', label: 'Verification' },
    { id: 'missing', label: 'Missing Documents' },
    { id: 'history', label: 'Document History' },
  ],
  'm1-approvals': [
    { id: 'my-pending', label: 'My Pending' },
    { id: 'team-queue', label: 'Team Queue' },
    { id: 'history', label: 'Approval History' },
    { id: 'returned', label: 'Returned Items' },
    { id: 'escalations', label: 'Escalations' },
  ],
  'm1-reports': [
    { id: 'operational', label: 'Operational Reports' },
    { id: 'applications', label: 'Application Reports' },
    { id: 'transactions', label: 'Transaction Reports' },
    { id: 'audit', label: 'Audit Reports' },
    { id: 'export', label: 'Export Centre' },
  ],
  'm1-config': [
    { id: 'reference', label: 'Reference Data Settings' },
    { id: 'workflow', label: 'Workflow Configuration' },
    { id: 'notifications', label: 'Notification Preferences' },
    { id: 'import', label: 'Import & Validation' },
    { id: 'preferences', label: 'Module Preferences' },
  ],
}

export function getModule1SecondaryNav(primaryId) {
  return MODULE_1_SECONDARY_NAV_BY_PRIMARY[primaryId] ?? [{ id: 'dashboard', label: 'Overview' }]
}

export function getModule1DefaultSecondary(primaryId) {
  const tabs = getModule1SecondaryNav(primaryId)
  return tabs[0]?.id ?? 'dashboard'
}

export function isModule1Primary(primaryId) {
  return MODULE_1_PRIMARY_NAV_ITEMS.some((item) => item.id === primaryId)
}

/** Legacy sample-module primary ids (registry aliases). */
export const LEGACY_MODULE_1_PRIMARY_IDS = [
  'sample-dashboard',
  'sample-my-work',
  'sample-applications',
  'sample-approvals',
  'sample-forms',
  'sample-tables',
  'sample-documents',
  'sample-reports',
  'sample-modals',
  'sample-feedback',
  'sample-actions',
  'sample-layout',
  'sample-accessibility',
]

export function isLegacyModule1Primary(primaryId) {
  return LEGACY_MODULE_1_PRIMARY_IDS.includes(primaryId)
}
