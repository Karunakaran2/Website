import {
  Send,
  Save,
  Eye,
  Trash2,
  MinusCircle,
  ShieldCheck,
  Plus,
  Pencil,
  Printer,
  FileSpreadsheet,
  ArrowLeft,
  RotateCcw,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import {
  BTN_BACK_CLASS,
  BTN_CANCEL_CLASS,
  BTN_DELETE_CLASS,
  BTN_EXCEL_CLASS,
  BTN_LINK_CLASS,
  BTN_PDF_CLASS,
  BTN_PRIMARY_CLASS,
  BTN_REMOVE_CLASS,
  BTN_RESET_CLASS,
  BTN_SAVE_CLASS,
  BTN_SUBMIT_CLASS,
  BTN_VIEW_CLASS,
  BTN_DRAFT_CLASS,
  BTN_VERIFY_CLASS,
  BTN_COST_UNIT_CLASS,
  BTN_APPROVE_CLASS,
  BTN_ACTIVATE_CLASS,
  BTN_DEACTIVATE_CLASS,
} from "./actionButtonStyles";

export const ACTION_VARIANTS = {
  primary: {
    className: BTN_PRIMARY_CLASS,
    Icon: null,
    defaultLabel: null,
  },
  submit: {
    className: BTN_SUBMIT_CLASS,
    Icon: Send,
    defaultLabel: "Submit",
  },
  save: {
    className: BTN_SAVE_CLASS,
    Icon: Save,
    defaultLabel: "Save",
  },
  cancel: {
    className: BTN_CANCEL_CLASS,
    Icon: null,
    defaultLabel: "Cancel",
  },
  reset: {
    className: BTN_RESET_CLASS,
    Icon: RotateCcw,
    defaultLabel: "Reset",
  },
  view: {
    className: BTN_VIEW_CLASS,
    Icon: Eye,
    defaultLabel: "View",
  },
  delete: {
    className: BTN_DELETE_CLASS,
    Icon: Trash2,
    defaultLabel: "Delete",
  },
  remove: {
    className: BTN_REMOVE_CLASS,
    Icon: MinusCircle,
    defaultLabel: "Remove",
  },
  verify: {
    className: BTN_VERIFY_CLASS,
    Icon: ShieldCheck,
    defaultLabel: "Verify",
  },
  draft: {
    className: BTN_DRAFT_CLASS,
    Icon: Save,
    defaultLabel: "Save Draft",
  },
  costUnit: {
    className: BTN_COST_UNIT_CLASS,
    Icon: null,
    defaultLabel: "Cost Unit",
  },
  approve: {
    className: BTN_APPROVE_CLASS,
    Icon: ShieldCheck,
    defaultLabel: "Approve",
  },
  activate: {
    className: BTN_ACTIVATE_CLASS,
    Icon: ToggleRight,
    defaultLabel: "Activate",
  },
  deactivate: {
    className: BTN_DEACTIVATE_CLASS,
    Icon: ToggleLeft,
    defaultLabel: "Deactivate",
  },
  edit: {
    className: BTN_PRIMARY_CLASS,
    Icon: Pencil,
    defaultLabel: "Edit",
  },
  add: {
    className: BTN_PRIMARY_CLASS,
    Icon: Plus,
    defaultLabel: "Add",
  },
  pdf: {
    className: BTN_PDF_CLASS,
    Icon: Printer,
    defaultLabel: "Print / Save as PDF",
  },
  excel: {
    className: BTN_EXCEL_CLASS,
    Icon: FileSpreadsheet,
    defaultLabel: "Export Excel",
  },
  back: {
    className: BTN_BACK_CLASS,
    Icon: ArrowLeft,
    defaultLabel: "Back",
  },
  link: {
    className: BTN_LINK_CLASS,
    Icon: null,
    defaultLabel: null,
  },
};
