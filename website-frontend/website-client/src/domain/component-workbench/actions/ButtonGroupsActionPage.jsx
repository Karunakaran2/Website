import { useState } from 'react'
import { Eye, Trash2, Printer, CheckCircle } from 'lucide-react'
import {
  TableRowActionsGroup,
  TableViewAction,
  TableEditAction,
  TableApproveAction,
  TableRejectAction,
  TableDeleteAction,
  TablePdfAction,
  GIGW_EDIT_ICON,
  GIGW_REJECT_ICON,
  ActionButton,
  PrimaryButton,
  CancelButton,
} from '@/shared/components/buttons'
import {
  PortalModalPrimaryButton,
  PortalModalCancelButton,
} from '@/shared/components/modals/PortalModalButtons'

export default function ButtonGroupsActionPage() {
  const [activeSegment, setActiveSegment] = useState('monthly')
  const [lastAction, setLastAction] = useState(null)

  const triggerAction = (name) => {
    setLastAction({
      name,
      time: new Date().toLocaleTimeString(),
    })
  }

  const overflowActionItems = [
    {
      key: 'view',
      label: 'View Specification',
      icon: Eye,
      onClick: () => triggerAction('View Action'),
      render: () => <TableViewAction title="View Item" onClick={() => triggerAction('View Item')} />,
    },
    {
      key: 'edit',
      label: 'Edit Asset Record',
      icon: GIGW_EDIT_ICON,
      onClick: () => triggerAction('Edit Action'),
      render: () => <TableEditAction title="Edit Item" onClick={() => triggerAction('Edit Item')} />,
    },
    {
      key: 'approve',
      label: 'Approve Sanction',
      icon: CheckCircle,
      onClick: () => triggerAction('Approve Action'),
      render: () => <TableApproveAction title="Approve Sanction" onClick={() => triggerAction('Approve Sanction')} />,
    },
    {
      key: 'reject',
      label: 'Reject Sanction',
      icon: GIGW_REJECT_ICON,
      onClick: () => triggerAction('Reject Action'),
      render: () => <TableRejectAction title="Reject Sanction" onClick={() => triggerAction('Reject Sanction')} />,
    },
    {
      key: 'pdf',
      label: 'Download PDF Report',
      icon: Printer,
      onClick: () => triggerAction('PDF Action'),
      render: () => <TablePdfAction title="Download PDF" onClick={() => triggerAction('Download PDF')} />,
    },
    {
      key: 'delete',
      label: 'Delete Asset Entry',
      icon: Trash2,
      onClick: () => triggerAction('Delete Action'),
      render: () => <TableDeleteAction title="Delete Item" onClick={() => triggerAction('Delete Item')} />,
    },
  ]

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* 1. Table Row Action Overflow Group */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Table Row Action Groups (TableRowActionsGroup)</h2>
          <p className="mt-1 text-xs text-slate-500">
            Automatically manages row action density. When total actions exceed 3, it displays the primary 2 inline and collapses the rest into an accessible portal popup menu (⋮).
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
            <span className="text-xs font-semibold text-slate-700 block mb-3">
              Row with 6 Actions (Demonstrating Responsive Overflow Menu)
            </span>
            <div className="inline-flex rounded-md border border-slate-300 bg-white p-1.5 shadow-2xs">
              <TableRowActionsGroup items={overflowActionItems} />
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Click the vertical ellipsis button (⋮) to reveal the portal popup containing additional actions.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Table Header Action Toolbar Group */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Listing Toolbar Action Groups</h2>
          <p className="mt-1 text-xs text-slate-500">
            Standard action cluster positioned at the top right of enterprise tables for record creation and bulk exports.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
          <div className="text-xs font-medium text-slate-600">
            Showing records for <strong>Department of Finance</strong>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ActionButton
              variant="add"
              onClick={() => triggerAction('Toolbar Add Action')}
            >
              Add New Record
            </ActionButton>
            <ActionButton
              variant="excel"
              onClick={() => triggerAction('Toolbar Export Excel')}
            >
              Export Excel
            </ActionButton>
            <ActionButton
              variant="pdf"
              onClick={() => triggerAction('Toolbar Export PDF')}
            >
              Export PDF
            </ActionButton>
          </div>
        </div>
      </div>

      {/* 3. Form Footer Action Bars */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Form & Modal Footer Action Groups</h2>
          <p className="mt-1 text-xs text-slate-500">
            Consistent button alignment and keyboard focus ordering for form submissions and modal confirmation dialogs.
          </p>
        </div>

        <div className="space-y-5">
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <span className="text-xs font-semibold text-slate-700 block mb-3">
              Standard Form Bottom Action Bar (Save + Submit + Reset + Cancel)
            </span>
            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 bg-white p-3 rounded-md">
              <ActionButton
                variant="reset"
                type="button"
                onClick={() => triggerAction('Form Reset')}
              >
                Reset
              </ActionButton>
              <CancelButton
                onClick={() => triggerAction('Form Cancel')}
              />
              <ActionButton
                variant="save"
                type="button"
                onClick={() => triggerAction('Form Save Draft')}
              >
                Save Draft
              </ActionButton>
              <PrimaryButton
                type="submit"
                onClick={() => triggerAction('Form Submit')}
              >
                Submit Form
              </PrimaryButton>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <span className="text-xs font-semibold text-slate-700 block mb-3">
              Modal Footer Button Pair (PortalModalPrimaryButton + PortalModalCancelButton)
            </span>
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white p-3 rounded-md">
              <PortalModalCancelButton
                onClick={() => triggerAction('Modal Cancel')}
              />
              <PortalModalPrimaryButton
                onClick={() => triggerAction('Modal Confirm')}
              >
                Confirm & Proceed
              </PortalModalPrimaryButton>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Segmented Action Switches */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Segmented Filter Groups</h2>
          <p className="mt-1 text-xs text-slate-500">
            Pill and segment switchers for reporting intervals and multi-view displays.
          </p>
        </div>

        <div className="inline-flex rounded-lg border border-slate-300 bg-slate-100 p-1">
          {['daily', 'weekly', 'monthly', 'quarterly', 'annual'].map((seg) => (
            <button
              key={seg}
              type="button"
              onClick={() => {
                setActiveSegment(seg)
                triggerAction(`Segment changed to ${seg}`)
              }}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-all focus:outline-none focus:ring-2 focus:ring-[#01458e] ${
                activeSegment === seg
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {seg}
            </button>
          ))}
        </div>

        {/* Telemetry Display */}
        <div className="mt-6 flex items-center justify-between rounded-lg bg-slate-50 p-4 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500">Last Action Invoked: </span>
            <strong className="text-slate-900">
              {lastAction ? `${lastAction.name} at ${lastAction.time}` : 'None yet (Interact with any button group above)'}
            </strong>
          </div>
          {lastAction && (
            <button
              type="button"
              onClick={() => setLastAction(null)}
              className="text-xs font-semibold text-[#01458e] underline hover:text-[#003366]"
            >
              Clear log
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
