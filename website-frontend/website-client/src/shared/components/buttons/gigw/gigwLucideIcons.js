import {
  CircleCheck,
  ClipboardList,
  Lock,
  Plus,
  Send,
  ShieldCheck,
  SquarePen,
  ToggleLeft,
  ToggleRight,
  Repeat,
  Undo2,
  XCircle,
} from 'lucide-react'

/** Primary list Add — plus before label. */
export const GIGW_ADD_ICON = Plus

/** Row edit action. */
export const GIGW_EDIT_ICON = SquarePen

/** Enable / mark active (switch on). */
export const GIGW_ACTIVATE_ICON = ToggleRight

/** Disable / mark inactive (switch off). */
export const GIGW_DEACTIVATE_ICON = ToggleLeft

/** Finalize row — complete/lock-in (not forward/send). */
export const GIGW_FINALIZE_ICON = CircleCheck

/** Submit to approval / workflow. */
export const GIGW_SUBMIT_ICON = Send

/** Freeze setup row. */
export const GIGW_FREEZE_ICON = Lock

/** Workflow reject — not delete. */
export const GIGW_REJECT_ICON = XCircle

/** Workflow verify. */
export const GIGW_VERIFY_ICON = ShieldCheck

/** Open a workflow action modal (verify / approve / reject). */
export const GIGW_WORKFLOW_ICON = ClipboardList

/** Reverse a posted voucher / undo a posted entry. */
export const GIGW_REVERSE_ICON = Undo2

/** Set a posted voucher to repeat on a schedule. */
export const GIGW_RECURRING_ICON = Repeat
