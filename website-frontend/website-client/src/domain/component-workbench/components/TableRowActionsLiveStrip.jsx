import {
  TableViewAction,
  TableEditAction,
  TableDeleteAction,
  TableActivateAction,
  TableDeactivateAction,
  TableLinkAction,
  TableSubmitAction,
  TableApproveAction,
  TableRejectAction,
  TableVerifyAction,
  TableWorkflowAction,
  TableReverseAction,
  TableRecurringAction,
  TablePdfAction,
  TableExcelAction,
} from '@/shared/components/buttons'

const TABLE_ROW_ACTION_DEMOS = [
  { Component: TableViewAction, title: 'View' },
  { Component: TableEditAction, title: 'Edit' },
  { Component: TableDeleteAction, title: 'Delete' },
  { Component: TableActivateAction, title: 'Activate' },
  { Component: TableDeactivateAction, title: 'Deactivate' },
  { Component: TableLinkAction, title: 'Link' },
  { Component: TableSubmitAction, title: 'Submit' },
  { Component: TableApproveAction, title: 'Approve' },
  { Component: TableRejectAction, title: 'Reject' },
  { Component: TableVerifyAction, title: 'Verify' },
  { Component: TableWorkflowAction, title: 'Workflow' },
  { Component: TableReverseAction, title: 'Reverse' },
  { Component: TableRecurringAction, title: 'Recurring' },
  { Component: TablePdfAction, title: 'Print / PDF' },
  { Component: TableExcelAction, title: 'Export Excel' },
]

export default function TableRowActionsLiveStrip({ onAction }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/60 p-4">
      {TABLE_ROW_ACTION_DEMOS.map(({ Component, title }) => (
        <Component
          key={title}
          title={title}
          onClick={() => onAction?.(title)}
        />
      ))}
    </div>
  )
}
