import { CURRENT_USER } from '@/shared/constants/user'
import {
  MODULE_1_PRIMARY_NAV_ITEMS,
  getModule1SecondaryNav,
  getModule1DefaultSecondary,
  isModule1Primary,
  isLegacyModule1Primary,
} from '@/domain/module-1/constants/module1Nav'
import {
  MODULE_2_PRIMARY_NAV_ITEMS,
  getModule2SecondaryNav,
  getModule2DefaultSecondary,
  isModule2Primary,
  isLegacyModule2Primary,
} from '@/domain/module-2/constants/module2Nav'

/** @deprecated Prefer CURRENT_USER from @/constants */
export const DASHBOARD_USER = CURRENT_USER

export const SETUP_HOME_ID = 'setup-home'
export const STATUTORY_PAYMENT_ID = 'statutory-payment'
export const VOUCHER_APPROVAL_ID = 'voucher-approval'
export const VOUCHER_REVERSAL_ID = 'voucher-reversal'
export const BANK_RECONCILIATION_ID = 'bank-reconciliation'
export const REPORTS_ID = 'reports'
export const RECURRING_VOUCHER_ID = 'recurring-voucher'
export const ASSET_ID = 'asset'
export const SETUP_COMPANY_ID = 'company-setup'
export const SETUP_OFFICE_ID = 'office-setup'
export const SETUP_DFPR_ID = 'dfpr-setup'
export const SETUP_GROUP_ID = 'group-setup'
export const SETUP_CHART_OF_ACCOUNTS_ID = 'chart-of-accounts-setup'
export const SETUP_BANK_CASH_ID = 'bank-cash-setup'
export const SETUP_APPROVAL_ID = 'setup-approval'
export const SETUP_PARTY_ID = 'party-setup'
export const SETUP_COST_UNIT_ID = 'cost-unit-setup'
export const SETUP_NUMBERING_ID = 'numbering-setup'
export const SETUP_ITEM_SERVICE_ID = 'item-service-setup'
export const SETUP_OWN_TAX_ID = 'own-tax-setup'
export const SETUP_ALLOCATION_ID = 'allocation-setup'
export const SETUP_OPENING_BALANCE_ID = 'opening-balance-setup'
export const SETUP_FINANCIAL_YEAR_ID = 'financial-year-setup'
export const SETUP_TALLY_PORT_ID = 'tally-port-setup'
export const AUDIT_CLOSURE_ID = 'audit-closure'

/* -------------------------------------------------------------
 * MODULE 1: COMPONENT EXPLORER
 * ------------------------------------------------------------- */
export const EXPLORER_PRIMARY_NAV_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'actions', label: 'Actions' },
  { id: 'forms', label: 'Forms' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'data-display', label: 'Data Display' },
  { id: 'patterns', label: 'Patterns' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'guidelines', label: 'Guidelines' },
]

export const EXPLORER_PATTERNS_SUB_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'domain-crud', label: 'List + Form CRUD' },
  { id: 'upload-import', label: 'Upload Modal' },
  { id: 'workflow-ui', label: 'Workflow UI' },
]

export const EXPLORER_OVERVIEW_SUB_TABS = [
  { id: 'module-overview', label: 'Module Overview' },
  { id: 'component-catalog', label: 'Component Catalog' },
  { id: 'getting-started', label: 'Getting Started' },
]

export const EXPLORER_ACTIONS_SUB_TABS = [
  { id: 'buttons', label: 'Buttons' },
  { id: 'icon-buttons', label: 'Icon Buttons' },
  { id: 'table-row-actions', label: 'Table Row Actions' },
  { id: 'legacy-buttons', label: 'Legacy Buttons' },
  { id: 'button-groups', label: 'Button Groups' },
  { id: 'action-states', label: 'Action States' },
]

export const EXPLORER_FORMS_SUB_TABS = [
  { id: 'text-inputs', label: 'Text Inputs' },
  { id: 'select-controls', label: 'Select Controls' },
  { id: 'checkboxes', label: 'Checkboxes' },
  { id: 'radio-buttons', label: 'Radio Buttons' },
  { id: 'switches', label: 'Switches' },
  { id: 'date-time', label: 'Date & Time' },
  { id: 'form-layout', label: 'Form Layout' },
  { id: 'form-validation', label: 'Form Validation' },
]

export const EXPLORER_FEEDBACK_SUB_TABS = [
  { id: 'alerts', label: 'Alerts' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'modals-gallery', label: 'Modals & Dialogs' },
  { id: 'tooltips', label: 'Tooltips' },
  { id: 'loading-states', label: 'Loading States' },
  { id: 'empty-states', label: 'Empty States' },
]

export const EXPLORER_DATA_DISPLAY_SUB_TABS = [
  { id: 'cards', label: 'Cards' },
  { id: 'badges', label: 'Badges' },
  { id: 'tables', label: 'Tables' },
  { id: 'pagination', label: 'Pagination' },
  { id: 'report-overview', label: 'Report Overview' },
]

export const EXPLORER_NAVIGATION_SUB_TABS = [
  { id: 'headers', label: 'Header Navigation' },
  { id: 'app-chrome', label: 'App Chrome' },
  { id: 'page-layout', label: 'Page Layout' },
  { id: 'sidebars', label: 'Sidebar Shell' },
  { id: 'breadcrumbs', label: 'Breadcrumbs' },
  { id: 'tabs', label: 'Tabs' },
  { id: 'dropdown-menus', label: 'Dropdown Menus' },
  { id: 'grid-layout', label: 'Grid & Containers' },
]

export const EXPLORER_GUIDELINES_SUB_TABS = [
  { id: 'component-usage', label: 'Component Usage' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'responsive-behavior', label: 'Responsive Behavior' },
]

/* -------------------------------------------------------------
 * MODULE 2: KRAN UI COMPONENT LIBRARY
 * ------------------------------------------------------------- */
export const COMPONENT_LIBRARY_PRIMARY_NAV_ITEMS = [
  { id: 'lib-foundations', label: 'Foundations' },
  { id: 'lib-actions', label: 'Actions' },
  { id: 'lib-forms', label: 'Forms' },
  { id: 'lib-feedback', label: 'Feedback' },
  { id: 'lib-data-display', label: 'Data Display' },
  { id: 'lib-navigation', label: 'Navigation & Layout' },
  { id: 'lib-accessibility', label: 'Accessibility' },
  { id: 'lib-playgrounds', label: 'Playgrounds' },
]

export const LIB_FOUNDATIONS_SUB_TABS = [
  { id: 'tokens', label: 'Design Tokens' },
  { id: 'typography', label: 'Typography' },
  { id: 'spacing', label: 'Spacing & Grid' },
  { id: 'radius-shadows', label: 'Radius & Shadows' },
  { id: 'breakpoints', label: 'Breakpoints' },
  { id: 'icons', label: 'Icon Guidelines' },
]

export const LIB_ACTIONS_SUB_TABS = [
  { id: 'buttons', label: 'Buttons' },
  { id: 'icon-buttons', label: 'Icon Buttons' },
  { id: 'button-groups', label: 'Button Groups' },
  { id: 'action-states', label: 'Action States' },
]

export const LIB_FORMS_SUB_TABS = [
  { id: 'text-input', label: 'Text Input' },
  { id: 'password-input', label: 'Password Input' },
  { id: 'textarea', label: 'Textarea' },
  { id: 'select', label: 'Select Control' },
  { id: 'checkbox-radio', label: 'Checkbox & Radio' },
  { id: 'switch', label: 'Switch' },
  { id: 'date-input', label: 'Date Input' },
  { id: 'form-layout', label: 'Form Layout' },
  { id: 'validation', label: 'Form Validation' },
]

export const LIB_FEEDBACK_SUB_TABS = [
  { id: 'alerts', label: 'Alerts' },
  { id: 'toasts', label: 'Toasts & Notifications' },
  { id: 'modals-gallery', label: 'Modals & Dialogs' },
  { id: 'dialogs-modals', label: 'Dialogs & Modals (docs)' },
  { id: 'tooltips', label: 'Tooltips' },
  { id: 'loading-states', label: 'Loading States' },
  { id: 'empty-states', label: 'Empty States' },
]

export const LIB_DATA_DISPLAY_SUB_TABS = [
  { id: 'cards', label: 'Cards' },
  { id: 'badges-status', label: 'Badges & Status' },
  { id: 'tables', label: 'Data Tables' },
  { id: 'pagination', label: 'Pagination' },
  { id: 'accordions-tabs', label: 'Accordions & Tabs' },
  { id: 'report-overview', label: 'Report Overview' },
]

export const LIB_NAVIGATION_SUB_TABS = [
  { id: 'headers', label: 'Header Navigation' },
  { id: 'sidebars', label: 'Sidebar Shell' },
  { id: 'dropdowns', label: 'Dropdown Menus' },
  { id: 'breadcrumbs', label: 'Breadcrumbs' },
  { id: 'grid-layout', label: 'Grid & Containers' },
]

export const LIB_ACCESSIBILITY_SUB_TABS = [
  { id: 'wcag-standards', label: 'WCAG 2.2 AA' },
  { id: 'keyboard-nav', label: 'Keyboard Navigation' },
  { id: 'focus-management', label: 'Focus Management' },
  { id: 'screen-readers', label: 'Screen Readers' },
]

export const LIB_PLAYGROUNDS_SUB_TABS = [
  { id: 'btn-playground', label: 'Button Playground' },
  { id: 'form-playground', label: 'Form Playground' },
  { id: 'dialog-playground', label: 'Dialog Playground' },
  { id: 'table-playground', label: 'Table Playground' },
]

/* -------------------------------------------------------------
 * MODULE 3: DESIGN GUIDELINES
 * ------------------------------------------------------------- */
export const DESIGN_GUIDELINES_PRIMARY_NAV_ITEMS = [
  { id: 'guide-principles', label: 'Design Principles' },
  { id: 'guide-tokens', label: 'Design Tokens' },
  { id: 'guide-standards', label: 'Standards & Conventions' },
  { id: 'guide-layout', label: 'Page Layout & Reports' },
  { id: 'guide-datatable', label: 'DataTable Standards' },
  { id: 'guide-feedback', label: 'Feedback & Interaction' },
  { id: 'guide-architecture', label: 'Domain Architecture' },
  { id: 'guide-accessibility', label: 'Accessibility (WCAG)' },
]

export const GUIDE_DEFAULT_SUB_TABS = [
  { id: 'overview', label: 'Overview' },
]

/* -------------------------------------------------------------
 * MODULE 4: HRMS
 * ------------------------------------------------------------- */
export const HRMS_PRIMARY_NAV_ITEMS = [
  { id: 'hrms-directory', label: 'Employee Directory' },
  { id: 'hrms-departments', label: 'Departments' },
  { id: 'hrms-leave', label: 'Leave & Attendance' },
]

export const HRMS_DEFAULT_SUB_TABS = [
  { id: 'overview', label: 'Overview' },
]

/* -------------------------------------------------------------
 * MODULE 5: TASK MANAGEMENT
 * ------------------------------------------------------------- */
export const TASK_MANAGEMENT_PRIMARY_NAV_ITEMS = [
  { id: 'task-board', label: 'Task Dashboard' },
  { id: 'task-list', label: 'Visual Board' },
  { id: 'task-priorities', label: 'Priorities' },
]

export const TASK_DEFAULT_SUB_TABS = [
  { id: 'overview', label: 'Overview' },
]

/* -------------------------------------------------------------
 * MODULE 1 — Enterprise business reference
 * ------------------------------------------------------------- */
export const SAMPLE_MODULE_PRIMARY_NAV_ITEMS = MODULE_1_PRIMARY_NAV_ITEMS

export const SAMPLE_DEFAULT_SUB_TABS = [
  { id: 'overview', label: 'Overview' },
]

/* -------------------------------------------------------------
 * MODULE 7: ASSET MANAGEMENT
 * ------------------------------------------------------------- */
export const ASSET_MANAGEMENT_PRIMARY_NAV_ITEMS = [
  { id: 'asset-dashboard', label: 'Dashboard' },
  { id: 'asset-register', label: 'Asset Register' },
]

export const ASSET_MANAGEMENT_DEFAULT_SUB_TABS = [
  { id: 'overview', label: 'Overview' },
]

/* -------------------------------------------------------------
 * MODULE 8: SETUP & MASTER DATA
 * ------------------------------------------------------------- */
export const SETUP_MODULE_PRIMARY_NAV_ITEMS = [
  { id: 'setup-dashboard', label: 'Setup Dashboard' },
  { id: 'setup-master-data', label: 'Master Data' },
]

export const SETUP_MODULE_DEFAULT_SUB_TABS = [
  { id: 'overview', label: 'Overview' },
]

export const PRIMARY_NAV_ITEMS = [
  { id: 'inbox', label: 'Home' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'budget', label: 'Budget' },
  { id: STATUTORY_PAYMENT_ID, label: 'Statutory Payment' },
  { id: VOUCHER_APPROVAL_ID, label: 'Voucher Approval' },
  { id: VOUCHER_REVERSAL_ID, label: 'Voucher Reversal' },
  { id: 'financial-sanction', label: 'Financial Sanction' },
  { id: 'payment', label: 'Payment' },
  { id: 'deposits', label: 'Deposits' },
  { id: ASSET_ID, label: 'Asset' },
  { id: BANK_RECONCILIATION_ID, label: 'Bank Reconciliation' },
  { id: REPORTS_ID, label: 'Reports' },
  { id: RECURRING_VOUCHER_ID, label: 'Recurring Voucher' },
]

export const DEFAULT_SECONDARY_NAV_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'my-requests', label: 'My Requests' },
  { id: 'pending-actions', label: 'Pending Actions' },
  { id: 'history', label: 'History' },
]

/** Budget subtabs aligned with Probity 2.0 Finance budget strip. */
export const BUDGET_SUB_TABS = [
  { id: 'initiation', label: 'Initiation' },
  { id: 'preparation', label: 'Preparation' },
  { id: 'preparation-received', label: 'Preparation Received' },
  { id: 'consolidation', label: 'Consolidation' },
  { id: 'consolidation-received', label: 'Consolidation Received' },
  { id: 'reappropriation', label: 'Reappropriation' },
  { id: 'budget-vs-actual', label: 'Budget vs Actual' },
  { id: 'head-of-account', label: 'Head of Account' },
 
]

export const DEFAULT_BUDGET_TAB_ID = 'initiation'

/** Fixed-asset management subtabs (secondary nav under Asset). */
export const ASSET_APPROVAL_WORKFLOW_SUB_TABS = [
  { id: 'received', label: 'Received' },
  { id: 'forwarded', label: 'Forwarded' },
  { id: 'approved', label: 'Approved' },
]

export const DEFAULT_ASSET_APPROVAL_WORKFLOW_TAB_ID = 'received'
export const ASSET_INFORMATION_APPROVAL_SUB_TABS = ASSET_APPROVAL_WORKFLOW_SUB_TABS
export const DEFAULT_ASSET_INFORMATION_APPROVAL_TAB_ID = 'received'

export const ASSET_SUB_TABS = [
  { id: 'fa-group', label: 'FA Group' },
  { id: 'asset-information', label: 'Asset Information' },
  { id: 'asset-approval', label: 'Asset Approval' },
  { id: 'opening-fixed-assets', label: 'Opening Fixed Assets' },
  { id: 'asset-depreciation', label: 'Asset Depreciation' },
  { id: 'view-all-asset', label: 'View All Asset' },
  { id: 'assets-disposal', label: 'Assets Disposal' },
  { id: 'assets-allocation', label: 'Assets Allocation' },
  { id: 'asset-maintenance', label: 'Asset Maintenance' },
]

export const DEFAULT_ASSET_TAB_ID = 'fa-group'

/** Financial sanction subtabs aligned with Probity 2.0 Fin. Sanction strip. */
export const FINANCIAL_SANCTION_SUB_TABS = [
  { id: 'sanction', label: 'Financial Sanction' },
  { id: 'draft', label: 'Draft' },
  // Queried, Pending DS, and File Track hidden until those screens are ready.
  // { id: 'queried', label: 'Queried' },
  { id: 'received', label: 'Received' },
  { id: 'forwarded', label: 'Forwarded' },
  // { id: 'pending-ds', label: 'Pending DS' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
  // { id: 'file-track', label: 'File Track' },
]

export const DEFAULT_FINANCIAL_SANCTION_TAB_ID = 'sanction'

export const PAYMENT_SUB_TABS = [
  { id: 'payment-sanction', label: 'Payment Sanction' },
  { id: 'disbursement', label: 'Disbursement' },
  { id: 'successful-transactions', label: 'Successful Transactions' },
]

export const DEFAULT_PAYMENT_TAB_ID = 'payment-sanction'

export const INBOX_SUB_TABS = [{ id: 'overview', label: 'Inbox' }]

export const STATUTORY_PAYMENT_SUB_TABS = [
  { id: 'add-new', label: 'Add New' },
  { id: 'draft', label: 'Draft' },
  { id: 'received', label: 'Received' },
  { id: 'forwarded', label: 'Forwarded' },
  { id: 'approved', label: 'Approved' },
]

export const VOUCHER_APPROVAL_SUB_TABS = [
  { id: 'received', label: 'Received' },
  { id: 'forwarded', label: 'Forwarded' },
  { id: 'approved', label: 'Approved' },
]

export const VOUCHER_REVERSAL_SUB_TABS = [
  { id: 'reversal', label: 'Add Reversal' },
  { id: 'reversed', label: 'Reversed' },
]

export const BANK_RECONCILIATION_SUB_TABS = [
  { id: 'auto', label: 'Auto' },
  { id: 'manual', label: 'Manual' },
]

export const SETUP_PRIMARY_NAV_ITEMS = [
  { id: SETUP_HOME_ID, label: 'Home' },
  { id: SETUP_COMPANY_ID, label: 'Company Setup' },
  { id: SETUP_OFFICE_ID, label: 'Office Setup' },
  { id: SETUP_DFPR_ID, label: 'DFPR Setup' },
  { id: SETUP_GROUP_ID, label: 'Group Setup' },
  { id: SETUP_CHART_OF_ACCOUNTS_ID, label: 'Chart of Accounts' },
  { id: SETUP_BANK_CASH_ID, label: 'Bank/Cash Setup' },
  // Setup Approval tab hidden until the approval inbox is aligned with Probity.
  // { id: SETUP_APPROVAL_ID, label: 'Setup Approval' },
  { id: SETUP_PARTY_ID, label: 'Party Setup' },
  { id: SETUP_COST_UNIT_ID, label: 'Cost Unit' },
  { id: SETUP_NUMBERING_ID, label: 'Numbering Setup' },
  { id: SETUP_ITEM_SERVICE_ID, label: 'Item/Service Master' },
  // Own Tax Information tab hidden until the screen is ready for use.
  // { id: SETUP_OWN_TAX_ID, label: 'Own Tax Information' },
  { id: SETUP_ALLOCATION_ID, label: 'Ledger/ User Allocation' },
  { id: ASSET_ID, label: 'Fixed Assets' },
  { id: AUDIT_CLOSURE_ID, label: 'Audit Closure' },
  // Opening Balance, Financial Year, and Tally Port tabs hidden until those screens are ready.
  // { id: SETUP_OPENING_BALANCE_ID, label: 'Opening Balance' },
  // { id: SETUP_FINANCIAL_YEAR_ID, label: 'Financial Year' },
  // { id: SETUP_TALLY_PORT_ID, label: 'Tally Port' },
]

export const SETUP_BANK_CASH_SUB_TABS = [
  { id: 'bank', label: 'Bank' },
  { id: 'cash', label: 'Cash' },
]

export const SETUP_APPROVAL_SUB_TABS = [
  { id: 'draft', label: 'Draft' },
  { id: 'received', label: 'Received' },
  { id: 'forward', label: 'Forward' },
  { id: 'approved', label: 'Approved' },
]

export const SETUP_PARTY_SUB_TABS = [
  { id: 'add-new', label: 'Add New' },
  { id: 'custom-party-ledger', label: 'Add New Party Ledger' },
]

export const SETUP_ALLOCATION_SUB_TABS = [
  { id: 'ledger-allocation', label: 'Ledger Allocation' },
  { id: 'user-allocation', label: 'User Allocation' },
]

export const SETUP_OPENING_BALANCE_SUB_TABS = [
  { id: 'ledger-opening-balance', label: 'Ledger Opening Balance' },
  { id: 'sub-ledger-opening-balance', label: 'Sub Ledger Opening Balance' },
]

export const SETUP_FINANCIAL_YEAR_SUB_TABS = [
  { id: 'fin-closure', label: 'Closure' },
  { id: 'add-fin-year', label: 'Add Fin.Year' },
]

export const AUDIT_CLOSURE_SUB_TABS = [
  { id: 'overview', label: 'Audit Closure' },
  { id: 'yearly-checklist', label: 'Yearly Checklist' },
  { id: 'monthly-checklist', label: 'Monthly Checklist' },
  { id: 'audit-closure-list', label: 'Audit Closure List' },
]

/** Primary modules with dedicated pages but not shown in the yellow nav bar yet. */
export const EXTENDED_PRIMARY_NAV_ITEMS = [
  { id: 'asset', label: 'Asset' },
  { id: 'deposits', label: 'Deposits' },
  { id: 'master-setup', label: 'Master Setup' },
  { id: 'external-integration', label: 'External Integration' },
]

export function isExtendedPrimary(primaryNavId) {
  return EXTENDED_PRIMARY_NAV_ITEMS.some((item) => item.id === primaryNavId)
}

export const DEFAULT_PRIMARY_NAV_ID = 'inbox'
export const DEFAULT_SECONDARY_NAV_ID = 'overview'
export const JOURNAL_VOUCHER_TAB_ID = 'journal'
export const DEFAULT_STATUTORY_PAYMENT_TAB_ID = 'add-new'
export const DEFAULT_VOUCHER_APPROVAL_TAB_ID = 'received'
export const DEFAULT_VOUCHER_REVERSAL_TAB_ID = 'reversal'
export const DEFAULT_BANK_RECONCILIATION_TAB_ID = 'auto'
export const DEFAULT_SETUP_BANK_CASH_TAB_ID = 'bank'
export const DEFAULT_SETUP_APPROVAL_TAB_ID = 'received'
export const DEFAULT_SETUP_PARTY_TAB_ID = 'add-new'
export const DEFAULT_SETUP_ALLOCATION_TAB_ID = 'ledger-allocation'
export const DEFAULT_SETUP_OPENING_BALANCE_TAB_ID = 'ledger-opening-balance'
export const DEFAULT_SETUP_FINANCIAL_YEAR_TAB_ID = 'fin-closure'
export const DEFAULT_AUDIT_CLOSURE_TAB_ID = 'overview'

export const SETUP_EXCLUSIVE_PRIMARY_NAV_IDS = [
  SETUP_HOME_ID,
  SETUP_COMPANY_ID,
  SETUP_OFFICE_ID,
  SETUP_DFPR_ID,
  SETUP_GROUP_ID,
  SETUP_CHART_OF_ACCOUNTS_ID,
  SETUP_BANK_CASH_ID,
  SETUP_PARTY_ID,
  SETUP_COST_UNIT_ID,
  SETUP_NUMBERING_ID,
  SETUP_ITEM_SERVICE_ID,
  SETUP_ALLOCATION_ID,
  AUDIT_CLOSURE_ID,
]

export function isSetupPrimary(primaryNavId) {
  return SETUP_EXCLUSIVE_PRIMARY_NAV_IDS.includes(primaryNavId)
}

export function isExplorerPrimary(primaryNavId) {
  return EXPLORER_PRIMARY_NAV_ITEMS.some((item) => item.id === primaryNavId)
}

export function isComponentLibraryPrimary(primaryNavId) {
  return COMPONENT_LIBRARY_PRIMARY_NAV_ITEMS.some((item) => item.id === primaryNavId)
}

export function isDesignGuidelinesPrimary(primaryNavId) {
  return DESIGN_GUIDELINES_PRIMARY_NAV_ITEMS.some((item) => item.id === primaryNavId)
}

export function isHrmsPrimary(primaryNavId) {
  return HRMS_PRIMARY_NAV_ITEMS.some((item) => item.id === primaryNavId)
}

export function isTaskManagementPrimary(primaryNavId) {
  return TASK_MANAGEMENT_PRIMARY_NAV_ITEMS.some((item) => item.id === primaryNavId)
}

export function isSampleModulePrimary(primaryNavId) {
  return isModule1Primary(primaryNavId) || isLegacyModule1Primary(primaryNavId)
}

export function isAssetManagementPrimary(primaryNavId) {
  return primaryNavId === ASSET_ID || ASSET_MANAGEMENT_PRIMARY_NAV_ITEMS.some((item) => item.id === primaryNavId)
}

export function isSetupModulePrimary(primaryNavId) {
  return isSetupPrimary(primaryNavId) || SETUP_MODULE_PRIMARY_NAV_ITEMS.some((item) => item.id === primaryNavId)
}

export const WORKBENCH_PRIMARY_NAV_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'actions', label: 'Actions' },
  { id: 'forms', label: 'Forms' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'data-display', label: 'Data Display' },
  { id: 'patterns', label: 'Patterns' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'guidelines', label: 'Guidelines' },
  { id: 'lib-foundations', label: 'Foundations' },
  { id: 'lib-playgrounds', label: 'Playgrounds' },
  { id: 'lib-accessibility', label: 'Accessibility' },
]

export function isWorkbenchPrimary(primaryNavId) {
  return (
    isExplorerPrimary(primaryNavId) ||
    isComponentLibraryPrimary(primaryNavId) ||
    WORKBENCH_PRIMARY_NAV_ITEMS.some((item) => item.id === primaryNavId)
  )
}

export function isAdministrationPrimary(primaryNavId) {
  return (
    isSetupPrimary(primaryNavId) ||
    isSetupModulePrimary(primaryNavId) ||
    isAssetManagementPrimary(primaryNavId) ||
    primaryNavId === 'administration'
  )
}

export const WORKFORCE_PRIMARY_NAV_ITEMS = MODULE_2_PRIMARY_NAV_ITEMS

export function isWorkforcePrimary(primaryNavId) {
  return (
    isModule2Primary(primaryNavId) ||
    isLegacyModule2Primary(primaryNavId) ||
    isHrmsPrimary(primaryNavId) ||
    isTaskManagementPrimary(primaryNavId) ||
    primaryNavId === 'workforce' ||
    primaryNavId === 'module-2'
  )
}

export function getPrimaryNavItems(primaryNavId) {
  if (isWorkbenchPrimary(primaryNavId)) {
    return WORKBENCH_PRIMARY_NAV_ITEMS
  }
  if (isDesignGuidelinesPrimary(primaryNavId)) {
    return DESIGN_GUIDELINES_PRIMARY_NAV_ITEMS
  }
  if (isWorkforcePrimary(primaryNavId)) {
    return WORKFORCE_PRIMARY_NAV_ITEMS
  }
  if (isSampleModulePrimary(primaryNavId)) {
    return SAMPLE_MODULE_PRIMARY_NAV_ITEMS
  }
  if (isAdministrationPrimary(primaryNavId)) {
    return SETUP_PRIMARY_NAV_ITEMS
  }
  if (PRIMARY_NAV_ITEMS.some((item) => item.id === primaryNavId)) {
    return PRIMARY_NAV_ITEMS
  }
  return WORKBENCH_PRIMARY_NAV_ITEMS
}

export function getSecondaryNavItems(primaryNavId) {
  // Module 1: Component Explorer
  if (primaryNavId === 'overview') return EXPLORER_OVERVIEW_SUB_TABS
  if (primaryNavId === 'actions') return EXPLORER_ACTIONS_SUB_TABS
  if (primaryNavId === 'forms') return EXPLORER_FORMS_SUB_TABS
  if (primaryNavId === 'feedback') return EXPLORER_FEEDBACK_SUB_TABS
  if (primaryNavId === 'data-display') return EXPLORER_DATA_DISPLAY_SUB_TABS
  if (primaryNavId === 'patterns') return EXPLORER_PATTERNS_SUB_TABS
  if (primaryNavId === 'navigation') return EXPLORER_NAVIGATION_SUB_TABS
  if (primaryNavId === 'guidelines') return EXPLORER_GUIDELINES_SUB_TABS

  // Module 2: KRAN UI Component Library
  if (primaryNavId === 'lib-foundations') return LIB_FOUNDATIONS_SUB_TABS
  if (primaryNavId === 'lib-actions') return LIB_ACTIONS_SUB_TABS
  if (primaryNavId === 'lib-forms') return LIB_FORMS_SUB_TABS
  if (primaryNavId === 'lib-feedback') return LIB_FEEDBACK_SUB_TABS
  if (primaryNavId === 'lib-data-display') return LIB_DATA_DISPLAY_SUB_TABS
  if (primaryNavId === 'lib-navigation') return LIB_NAVIGATION_SUB_TABS
  if (primaryNavId === 'lib-accessibility') return LIB_ACCESSIBILITY_SUB_TABS
  if (primaryNavId === 'lib-playgrounds') return LIB_PLAYGROUNDS_SUB_TABS

  // Module 3: Design Guidelines
  if (isDesignGuidelinesPrimary(primaryNavId)) return GUIDE_DEFAULT_SUB_TABS

  // Module 4: HRMS
  if (isHrmsPrimary(primaryNavId)) return HRMS_DEFAULT_SUB_TABS

  // Module 5: Task Management
  if (isTaskManagementPrimary(primaryNavId)) return TASK_DEFAULT_SUB_TABS

  if (isModule1Primary(primaryNavId)) {
    return getModule1SecondaryNav(primaryNavId)
  }
  if (isLegacyModule1Primary(primaryNavId)) {
    return SAMPLE_DEFAULT_SUB_TABS
  }

  if (isModule2Primary(primaryNavId)) {
    return getModule2SecondaryNav(primaryNavId)
  }
  if (isLegacyModule2Primary(primaryNavId)) {
    return SAMPLE_DEFAULT_SUB_TABS
  }

  if (SETUP_MODULE_PRIMARY_NAV_ITEMS.some((item) => item.id === primaryNavId)) {
    return SETUP_MODULE_DEFAULT_SUB_TABS
  }

  if (ASSET_MANAGEMENT_PRIMARY_NAV_ITEMS.some((item) => item.id === primaryNavId)) {
    return ASSET_MANAGEMENT_DEFAULT_SUB_TABS
  }

  if (primaryNavId === 'deposits') {
    return []
  }

  if (primaryNavId === 'inbox') {
    return INBOX_SUB_TABS
  }

  if (primaryNavId === 'dashboard') {
    return []
  }

  if (primaryNavId === 'budget') {
    return BUDGET_SUB_TABS
  }

  if (primaryNavId === STATUTORY_PAYMENT_ID) {
    return STATUTORY_PAYMENT_SUB_TABS
  }

  if (primaryNavId === VOUCHER_APPROVAL_ID) {
    return VOUCHER_APPROVAL_SUB_TABS
  }

  if (primaryNavId === VOUCHER_REVERSAL_ID) {
    return VOUCHER_REVERSAL_SUB_TABS
  }

  if (primaryNavId === BANK_RECONCILIATION_ID) {
    return BANK_RECONCILIATION_SUB_TABS
  }

  if (primaryNavId === ASSET_ID) {
    return ASSET_SUB_TABS
  }

  if (primaryNavId === 'financial-sanction') {
    return FINANCIAL_SANCTION_SUB_TABS
  }

  if (primaryNavId === 'payment') {
    return PAYMENT_SUB_TABS
  }

  if (primaryNavId === REPORTS_ID || primaryNavId === RECURRING_VOUCHER_ID) {
    return []
  }

  if (isExtendedPrimary(primaryNavId)) {
    return DEFAULT_SECONDARY_NAV_ITEMS
  }

  if (primaryNavId === SETUP_BANK_CASH_ID) {
    return SETUP_BANK_CASH_SUB_TABS
  }

  if (primaryNavId === SETUP_APPROVAL_ID) {
    return SETUP_APPROVAL_SUB_TABS
  }

  if (primaryNavId === SETUP_PARTY_ID) {
    return SETUP_PARTY_SUB_TABS
  }

  if (primaryNavId === SETUP_ALLOCATION_ID) {
    return SETUP_ALLOCATION_SUB_TABS
  }

  if (primaryNavId === SETUP_OPENING_BALANCE_ID) {
    return SETUP_OPENING_BALANCE_SUB_TABS
  }

  if (primaryNavId === SETUP_FINANCIAL_YEAR_ID) {
    return SETUP_FINANCIAL_YEAR_SUB_TABS
  }

  if (primaryNavId === AUDIT_CLOSURE_ID) {
    return AUDIT_CLOSURE_SUB_TABS
  }

  if (isSetupPrimary(primaryNavId)) {
    return []
  }

  return DEFAULT_SECONDARY_NAV_ITEMS
}

export function getDefaultSecondaryTabId(primaryNavId) {
  // Module 1 Explorer defaults
  if (primaryNavId === 'overview') return 'module-overview'
  if (primaryNavId === 'actions') return 'buttons'
  if (primaryNavId === 'forms') return 'text-inputs'
  if (primaryNavId === 'feedback') return 'alerts'
  if (primaryNavId === 'data-display') return 'cards'
  if (primaryNavId === 'patterns') return 'overview'
  if (primaryNavId === 'navigation') return 'breadcrumbs'
  if (primaryNavId === 'guidelines') return 'component-usage'

  // Module 2 Library defaults
  if (primaryNavId === 'lib-foundations') return 'tokens'
  if (primaryNavId === 'lib-actions') return 'buttons'
  if (primaryNavId === 'lib-forms') return 'text-input'
  if (primaryNavId === 'lib-feedback') return 'alerts'
  if (primaryNavId === 'lib-data-display') return 'cards'
  if (primaryNavId === 'lib-navigation') return 'headers'
  if (primaryNavId === 'lib-accessibility') return 'wcag-standards'
  if (primaryNavId === 'lib-playgrounds') return 'btn-playground'

  if (primaryNavId === ASSET_ID) {
    return DEFAULT_ASSET_TAB_ID
  }

  if (primaryNavId === SETUP_BANK_CASH_ID) {
    return DEFAULT_SETUP_BANK_CASH_TAB_ID
  }

  if (primaryNavId === SETUP_PARTY_ID) {
    return DEFAULT_SETUP_PARTY_TAB_ID
  }

  if (primaryNavId === SETUP_ALLOCATION_ID) {
    return DEFAULT_SETUP_ALLOCATION_TAB_ID
  }

  if (primaryNavId === AUDIT_CLOSURE_ID) {
    return DEFAULT_AUDIT_CLOSURE_TAB_ID
  }

  // Module 3 Guidelines defaults
  if (isDesignGuidelinesPrimary(primaryNavId)) return 'overview'

  // Module 4 HRMS defaults
  if (isHrmsPrimary(primaryNavId)) return 'overview'

  if (isModule1Primary(primaryNavId)) return getModule1DefaultSecondary(primaryNavId)
  if (isLegacyModule1Primary(primaryNavId)) return 'overview'

  if (isModule2Primary(primaryNavId)) return getModule2DefaultSecondary(primaryNavId)
  if (isLegacyModule2Primary(primaryNavId)) return 'overview'

  if (ASSET_MANAGEMENT_PRIMARY_NAV_ITEMS.some((item) => item.id === primaryNavId)) {
    return 'overview'
  }

  if (primaryNavId === ASSET_ID) {
    return DEFAULT_ASSET_TAB_ID
  }

  if (SETUP_MODULE_PRIMARY_NAV_ITEMS.some((item) => item.id === primaryNavId)) {
    return 'overview'
  }

  // Setup configuration primaries (company-setup, office-setup, …)
  if (isSetupModulePrimary(primaryNavId)) return 'overview'

  if (primaryNavId === 'budget') {
    return DEFAULT_BUDGET_TAB_ID
  }

  if (primaryNavId === STATUTORY_PAYMENT_ID) {
    return DEFAULT_STATUTORY_PAYMENT_TAB_ID
  }

  if (primaryNavId === VOUCHER_APPROVAL_ID) {
    return DEFAULT_VOUCHER_APPROVAL_TAB_ID
  }

  if (primaryNavId === VOUCHER_REVERSAL_ID) {
    return DEFAULT_VOUCHER_REVERSAL_TAB_ID
  }

  if (primaryNavId === BANK_RECONCILIATION_ID) {
    return DEFAULT_BANK_RECONCILIATION_TAB_ID
  }

  if (primaryNavId === 'financial-sanction') {
    return DEFAULT_FINANCIAL_SANCTION_TAB_ID
  }

  if (primaryNavId === 'payment') {
    return DEFAULT_PAYMENT_TAB_ID
  }

  if (primaryNavId === SETUP_APPROVAL_ID) {
    return DEFAULT_SETUP_APPROVAL_TAB_ID
  }

  if (primaryNavId === SETUP_OPENING_BALANCE_ID) {
    return DEFAULT_SETUP_OPENING_BALANCE_TAB_ID
  }

  if (primaryNavId === SETUP_FINANCIAL_YEAR_ID) {
    return DEFAULT_SETUP_FINANCIAL_YEAR_TAB_ID
  }

  return DEFAULT_SECONDARY_NAV_ID
}

export function isSecondaryTabValid(primaryNavId, secondaryTabId) {
  return getSecondaryNavItems(primaryNavId).some((tab) => tab.id === secondaryTabId)
}

export function isPrimaryNavValid(primaryNavId) {
  return (
    isWorkbenchPrimary(primaryNavId) ||
    isExplorerPrimary(primaryNavId) ||
    isComponentLibraryPrimary(primaryNavId) ||
    isDesignGuidelinesPrimary(primaryNavId) ||
    isWorkforcePrimary(primaryNavId) ||
    isHrmsPrimary(primaryNavId) ||
    isTaskManagementPrimary(primaryNavId) ||
    isSampleModulePrimary(primaryNavId) ||
    isAdministrationPrimary(primaryNavId) ||
    isAssetManagementPrimary(primaryNavId) ||
    isSetupModulePrimary(primaryNavId) ||
    isSetupPrimary(primaryNavId) ||
    PRIMARY_NAV_ITEMS.some((item) => item.id === primaryNavId)
  )
}

/** Resolve menu/submenu from the URL so refresh does not flash the Home page. */
export function resolveDashboardNavIds(primaryTab, secondaryTab) {
  const primaryId =
    primaryTab && isPrimaryNavValid(primaryTab) ? primaryTab : DEFAULT_PRIMARY_NAV_ID
  const secondaryId =
    secondaryTab && isSecondaryTabValid(primaryId, secondaryTab)
      ? secondaryTab
      : getDefaultSecondaryTabId(primaryId)
  return { primaryId, secondaryId }
}
