import { Eye, FileSpreadsheet, Link2, Printer, Trash2 } from 'lucide-react'
import {
  GIGW_ADD_ICON,
  GIGW_EDIT_ICON,
  GIGW_ACTIVATE_ICON,
  GIGW_DEACTIVATE_ICON,
  GIGW_FINALIZE_ICON,
  GIGW_SUBMIT_ICON,
  GIGW_FREEZE_ICON,
  GIGW_REJECT_ICON,
  GIGW_VERIFY_ICON,
  GIGW_WORKFLOW_ICON,
  GIGW_REVERSE_ICON,
  GIGW_RECURRING_ICON,
} from '@/shared/components/buttons/gigw/gigwLucideIcons'

/** Resolve Lucide export name for workbench labels (fallback to component name). */
function lucideName(IconComponent, fallback) {
  return IconComponent?.displayName || IconComponent?.name || fallback
}

/**
 * Canonical GIGW tokens from gigwLucideIcons.js — always use these exports, not ad-hoc Lucide picks.
 */
export const GIGW_TOKEN_CATALOG = [
  {
    token: 'GIGW_ADD_ICON',
    icon: GIGW_ADD_ICON,
    lucide: lucideName(GIGW_ADD_ICON, 'Plus'),
    label: 'Add / Create',
    purpose: 'DomainListPageHeaderActions, GigwButton leading icon',
  },
  {
    token: 'GIGW_EDIT_ICON',
    icon: GIGW_EDIT_ICON,
    lucide: lucideName(GIGW_EDIT_ICON, 'SquarePen'),
    label: 'Edit',
    purpose: 'TableEditAction, draft row edit — not Pencil',
  },
  {
    token: 'GIGW_ACTIVATE_ICON',
    icon: GIGW_ACTIVATE_ICON,
    lucide: lucideName(GIGW_ACTIVATE_ICON, 'ToggleRight'),
    label: 'Activate',
    purpose: 'TableActivateAction — not generic Check',
  },
  {
    token: 'GIGW_DEACTIVATE_ICON',
    icon: GIGW_DEACTIVATE_ICON,
    lucide: lucideName(GIGW_DEACTIVATE_ICON, 'ToggleLeft'),
    label: 'Deactivate',
    purpose: 'TableDeactivateAction',
  },
  {
    token: 'GIGW_FINALIZE_ICON',
    icon: GIGW_FINALIZE_ICON,
    lucide: lucideName(GIGW_FINALIZE_ICON, 'CircleCheck'),
    label: 'Approve / Finalize',
    purpose: 'TableApproveAction — not Check or CircleCheck in raw Lucide grids',
  },
  {
    token: 'GIGW_SUBMIT_ICON',
    icon: GIGW_SUBMIT_ICON,
    lucide: lucideName(GIGW_SUBMIT_ICON, 'Send'),
    label: 'Submit',
    purpose: 'TableSubmitAction, forward to workflow',
  },
  {
    token: 'GIGW_FREEZE_ICON',
    icon: GIGW_FREEZE_ICON,
    lucide: lucideName(GIGW_FREEZE_ICON, 'Lock'),
    label: 'Freeze',
    purpose: 'Setup freeze row',
  },
  {
    token: 'GIGW_REJECT_ICON',
    icon: GIGW_REJECT_ICON,
    lucide: lucideName(GIGW_REJECT_ICON, 'XCircle'),
    label: 'Reject',
    purpose: 'TableRejectAction — not X or Trash2',
  },
  {
    token: 'GIGW_VERIFY_ICON',
    icon: GIGW_VERIFY_ICON,
    lucide: lucideName(GIGW_VERIFY_ICON, 'ShieldCheck'),
    label: 'Verify',
    purpose: 'TableVerifyAction — not Shield alone',
  },
  {
    token: 'GIGW_WORKFLOW_ICON',
    icon: GIGW_WORKFLOW_ICON,
    lucide: lucideName(GIGW_WORKFLOW_ICON, 'ClipboardList'),
    label: 'Workflow modal',
    purpose: 'TableWorkflowAction, open verify/approve/reject',
  },
  {
    token: 'GIGW_REVERSE_ICON',
    icon: GIGW_REVERSE_ICON,
    lucide: lucideName(GIGW_REVERSE_ICON, 'Undo2'),
    label: 'Reverse voucher',
    purpose: 'TableReverseAction',
  },
  {
    token: 'GIGW_RECURRING_ICON',
    icon: GIGW_RECURRING_ICON,
    lucide: lucideName(GIGW_RECURRING_ICON, 'Repeat'),
    label: 'Recurring',
    purpose: 'TableRecurringAction',
  },
]

/** Pre-built table row actions — icons and tones match production tableRowActions.jsx */
export const GIGW_TABLE_ROW_CATALOG = [
  {
    component: 'TableViewAction',
    icon: Eye,
    lucide: 'Eye',
    tone: 'info',
    label: 'View',
  },
  {
    component: 'TableEditAction',
    icon: GIGW_EDIT_ICON,
    lucide: lucideName(GIGW_EDIT_ICON, 'SquarePen'),
    tone: 'info',
    label: 'Edit',
  },
  {
    component: 'TableDeleteAction',
    icon: Trash2,
    lucide: 'Trash2',
    tone: 'destructive',
    label: 'Delete',
  },
  {
    component: 'TableActivateAction',
    icon: GIGW_ACTIVATE_ICON,
    lucide: lucideName(GIGW_ACTIVATE_ICON, 'ToggleRight'),
    tone: 'positive',
    label: 'Activate',
  },
  {
    component: 'TableDeactivateAction',
    icon: GIGW_DEACTIVATE_ICON,
    lucide: lucideName(GIGW_DEACTIVATE_ICON, 'ToggleLeft'),
    tone: 'destructive',
    label: 'Deactivate',
  },
  {
    component: 'TableLinkAction',
    icon: Link2,
    lucide: 'Link2',
    tone: 'primary',
    label: 'Link',
  },
  {
    component: 'TableSubmitAction',
    icon: GIGW_SUBMIT_ICON,
    lucide: lucideName(GIGW_SUBMIT_ICON, 'Send'),
    tone: 'primary',
    label: 'Submit',
  },
  {
    component: 'TableApproveAction',
    icon: GIGW_FINALIZE_ICON,
    lucide: lucideName(GIGW_FINALIZE_ICON, 'CircleCheck'),
    tone: 'positive',
    label: 'Approve',
  },
  {
    component: 'TableRejectAction',
    icon: GIGW_REJECT_ICON,
    lucide: lucideName(GIGW_REJECT_ICON, 'XCircle'),
    tone: 'destructive',
    label: 'Reject',
  },
  {
    component: 'TableVerifyAction',
    icon: GIGW_VERIFY_ICON,
    lucide: lucideName(GIGW_VERIFY_ICON, 'ShieldCheck'),
    tone: 'positive',
    label: 'Verify',
  },
  {
    component: 'TableWorkflowAction',
    icon: GIGW_WORKFLOW_ICON,
    lucide: lucideName(GIGW_WORKFLOW_ICON, 'ClipboardList'),
    tone: 'primary',
    label: 'Workflow',
  },
  {
    component: 'TableReverseAction',
    icon: GIGW_REVERSE_ICON,
    lucide: lucideName(GIGW_REVERSE_ICON, 'Undo2'),
    tone: 'primary',
    label: 'Reverse',
  },
  {
    component: 'TableRecurringAction',
    icon: GIGW_RECURRING_ICON,
    lucide: lucideName(GIGW_RECURRING_ICON, 'Repeat'),
    tone: 'primary',
    label: 'Recurring',
  },
  {
    component: 'TablePdfAction',
    icon: Printer,
    lucide: 'Printer',
    tone: 'pdf',
    label: 'PDF / Print',
  },
  {
    component: 'TableExcelAction',
    icon: FileSpreadsheet,
    lucide: 'FileSpreadsheet',
    tone: 'excel',
    label: 'Excel export',
  },
]
