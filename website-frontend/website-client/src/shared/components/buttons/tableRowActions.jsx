import {
  Eye,
  FileSpreadsheet,
  Link2,
  Printer,
  Trash2,
} from 'lucide-react'
import {
  GIGW_ACTIVATE_ICON,
  GIGW_DEACTIVATE_ICON,
  GIGW_EDIT_ICON,
  GIGW_FINALIZE_ICON,
  GIGW_REJECT_ICON,
  GIGW_VERIFY_ICON,
  GIGW_WORKFLOW_ICON,
  GIGW_SUBMIT_ICON,
  GIGW_RECURRING_ICON,
  GIGW_REVERSE_ICON,
  GIGW_TOGGLE_ICON_SIZE,
  GigwIconButton,
} from './gigw'

/** Listing row toolbar (GIGW action icons) — single line, no wrap. */
export const TABLE_ROW_ACTIONS_CLASS =
  'inline-flex flex-nowrap items-center justify-center gap-1.5 overflow-visible'

const tableIconProps = { context: 'table' }

export function TableViewAction({ title = 'View', tooltip, ...props }) {
  return (
    <GigwIconButton icon={Eye} tone="info" tooltip={tooltip ?? title} {...tableIconProps} {...props} />
  )
}

export function TableActivateAction({ title = 'Activate', tooltip, ...props }) {
  return (
    <GigwIconButton
      icon={GIGW_ACTIVATE_ICON}
      tone="positive"
      iconSize={GIGW_TOGGLE_ICON_SIZE}
      tooltip={tooltip ?? title}
      {...tableIconProps}
      {...props}
    />
  )
}

export function TableDeactivateAction({ title = 'Deactivate', tooltip, ...props }) {
  return (
    <GigwIconButton
      icon={GIGW_DEACTIVATE_ICON}
      tone="destructive"
      iconSize={GIGW_TOGGLE_ICON_SIZE}
      tooltip={tooltip ?? title}
      {...tableIconProps}
      {...props}
    />
  )
}

export function TableActiveStatusAction({
  isActive,
  onActivate,
  onDeactivate,
  title,
  tooltip,
  ...props
}) {
  const statusTitle = tooltip ?? title ?? (isActive ? 'Deactivate' : 'Activate')

  if (isActive) {
    return (
      <GigwIconButton
        icon={GIGW_DEACTIVATE_ICON}
        tone="destructive"
        iconSize={GIGW_TOGGLE_ICON_SIZE}
        tooltip={statusTitle}
        onClick={onDeactivate}
        {...tableIconProps}
        {...props}
      />
    )
  }
  return (
    <GigwIconButton
      icon={GIGW_ACTIVATE_ICON}
      tone="positive"
      iconSize={GIGW_TOGGLE_ICON_SIZE}
      tooltip={statusTitle}
      onClick={onActivate}
      {...tableIconProps}
      {...props}
    />
  )
}

export function TableLinkAction({ title = 'Link', tooltip, ...props }) {
  return (
    <GigwIconButton
      icon={Link2}
      tone="primary"
      tooltip={tooltip ?? title}
      {...tableIconProps}
      {...props}
    />
  )
}

export function TableEditAction({ title = 'Edit', tooltip, ...props }) {
  return (
    <GigwIconButton
      icon={GIGW_EDIT_ICON}
      tone="info"
      tooltip={tooltip ?? title}
      {...tableIconProps}
      {...props}
    />
  )
}

export function TableDeleteAction({ title = 'Delete', tooltip, ...props }) {
  return (
    <GigwIconButton
      icon={Trash2}
      tone="destructive"
      tooltip={tooltip ?? title}
      {...tableIconProps}
      {...props}
    />
  )
}

export function TableSubmitAction({
  title = 'Submit',
  tooltip,
  icon = GIGW_SUBMIT_ICON,
  ...props
}) {
  return (
    <GigwIconButton
      icon={icon}
      tone="primary"
      tooltip={tooltip ?? title}
      {...tableIconProps}
      {...props}
    />
  )
}

export function TableApproveAction({ title = 'Approve', tooltip, ...props }) {
  return (
    <GigwIconButton
      icon={GIGW_FINALIZE_ICON}
      tone="positive"
      tooltip={tooltip ?? title}
      {...tableIconProps}
      {...props}
    />
  )
}

export function TableRejectAction({ title = 'Reject', tooltip, ...props }) {
  return (
    <GigwIconButton
      icon={GIGW_REJECT_ICON}
      tone="destructive"
      tooltip={tooltip ?? title}
      {...tableIconProps}
      {...props}
    />
  )
}

export function TableVerifyAction({ title = 'Verify', tooltip, ...props }) {
  return (
    <GigwIconButton
      icon={GIGW_VERIFY_ICON}
      tone="positive"
      tooltip={tooltip ?? title}
      {...tableIconProps}
      {...props}
    />
  )
}

export function TableWorkflowAction({ title = 'Actions', tooltip, ...props }) {
  return (
    <GigwIconButton
      icon={GIGW_WORKFLOW_ICON}
      tone="primary"
      tooltip={tooltip ?? title}
      {...tableIconProps}
      {...props}
    />
  )
}

export function TableReverseAction({ title = 'Reverse', tooltip, ...props }) {
  return (
    <GigwIconButton
      icon={GIGW_REVERSE_ICON}
      tone="primary"
      tooltip={tooltip ?? title}
      {...tableIconProps}
      {...props}
    />
  )
}

export function TableRecurringAction({ title = 'Recurring', tooltip, ...props }) {
  return (
    <GigwIconButton
      icon={GIGW_RECURRING_ICON}
      tone="primary"
      tooltip={tooltip ?? title}
      {...tableIconProps}
      {...props}
    />
  )
}

export function TablePdfAction({ title = 'Print / PDF', tooltip, ...props }) {
  return (
    <GigwIconButton
      icon={Printer}
      tone="pdf"
      tooltip={tooltip ?? title}
      {...tableIconProps}
      {...props}
    />
  )
}

export function TableExcelAction({ title = 'Export Excel', tooltip, ...props }) {
  return (
    <GigwIconButton
      icon={FileSpreadsheet}
      tone="excel"
      tooltip={tooltip ?? title}
      {...tableIconProps}
      {...props}
    />
  )
}
