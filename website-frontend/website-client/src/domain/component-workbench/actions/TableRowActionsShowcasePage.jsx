import { useState } from 'react'
import {
  TableRowActionsGroup,
  TABLE_ROW_ACTIONS_CLASS,
  TableViewAction,
  TableEditAction,
  TableDeleteAction,
  TableApproveAction,
  TableRejectAction,
  TableVerifyAction,
  TableWorkflowAction,
  TableSubmitAction,
  TablePdfAction,
  TableExcelAction,
  TableActivateAction,
  TableDeactivateAction,
} from '@/shared/components/buttons'
import ActionIconTooltip from '@/shared/components/buttons/gigw/ActionIconTooltip'
import { GigwIconButton } from '@/shared/components/buttons/gigw'
import { GIGW_EDIT_ICON, GIGW_ADD_ICON } from '@/shared/components/buttons/gigw/gigwLucideIcons'
import {
  WORKBENCH_PREVIEW_ROW_CLASS,
  WORKBENCH_PREVIEW_GRID_CLASS,
  WORKBENCH_SECTION_CARD_CLASS,
} from '../constants/workbenchPreviewStyles'

function ActionCell({ label, children }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 p-3 min-w-0">
      <span className="text-[11px] font-semibold text-slate-600 text-center">{label}</span>
      <div className={TABLE_ROW_ACTIONS_CLASS}>{children}</div>
    </div>
  )
}

export default function TableRowActionsShowcasePage() {
  const [last, setLast] = useState('')

  const fire = (name) => () => setLast(`${name} clicked at ${new Date().toLocaleTimeString()}`)

  return (
    <div className="space-y-6 pb-12 w-full min-w-0">
      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h2 className="text-base font-bold text-slate-900">Table row GIGW actions</h2>
        <p className="mt-1 text-[13px] text-slate-600 leading-relaxed">
          Production row action components used in the DataTable Action column. Each icon uses{' '}
          <code className="text-[12px]">ActionIconTooltip</code> (hover label, dismiss on click until
          next hover). Pair with <code className="text-[12px]">TableRowActionsGroup</code> for overflow
          when more than three actions.
        </p>
      </div>

      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h3 className="text-[14px] font-bold text-slate-900 mb-4">Individual action components</h3>
        <div className={`${WORKBENCH_PREVIEW_GRID_CLASS} sm:grid-cols-2 lg:grid-cols-4`}>
          <ActionCell label="View">
            <TableViewAction aria-label="View record" onClick={fire('View')} />
          </ActionCell>
          <ActionCell label="Edit">
            <TableEditAction aria-label="Edit record" onClick={fire('Edit')} />
          </ActionCell>
          <ActionCell label="Delete">
            <TableDeleteAction aria-label="Delete record" onClick={fire('Delete')} />
          </ActionCell>
          <ActionCell label="Approve">
            <TableApproveAction aria-label="Approve record" onClick={fire('Approve')} />
          </ActionCell>
          <ActionCell label="Verify">
            <TableVerifyAction aria-label="Verify record" onClick={fire('Verify')} />
          </ActionCell>
          <ActionCell label="Reject">
            <TableRejectAction aria-label="Reject record" onClick={fire('Reject')} />
          </ActionCell>
          <ActionCell label="Submit">
            <TableSubmitAction aria-label="Submit record" onClick={fire('Submit')} />
          </ActionCell>
          <ActionCell label="Workflow">
            <TableWorkflowAction aria-label="Open workflow" onClick={fire('Workflow')} />
          </ActionCell>
          <ActionCell label="PDF">
            <TablePdfAction aria-label="Download PDF" onClick={fire('PDF')} />
          </ActionCell>
          <ActionCell label="Excel">
            <TableExcelAction aria-label="Export Excel" onClick={fire('Excel')} />
          </ActionCell>
          <ActionCell label="Activate">
            <TableActivateAction aria-label="Activate" onClick={fire('Activate')} />
          </ActionCell>
          <ActionCell label="Deactivate">
            <TableDeactivateAction aria-label="Deactivate" onClick={fire('Deactivate')} />
          </ActionCell>
        </div>
      </div>

      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h3 className="text-[14px] font-bold text-slate-900 mb-2">TableRowActionsGroup (≤3 inline)</h3>
        <div className={WORKBENCH_PREVIEW_ROW_CLASS}>
          <TableRowActionsGroup
            items={[
              { key: 'view', label: 'View', render: () => <TableViewAction onClick={fire('View')} /> },
              { key: 'edit', label: 'Edit', render: () => <TableEditAction onClick={fire('Edit')} /> },
              { key: 'delete', label: 'Delete', render: () => <TableDeleteAction onClick={fire('Delete')} /> },
            ]}
          />
        </div>
        <h3 className="text-[14px] font-bold text-slate-900 mt-6 mb-2">Overflow (first 2 + ⋮ menu)</h3>
        <div className={WORKBENCH_PREVIEW_ROW_CLASS}>
          <TableRowActionsGroup
            items={[
              { key: 'view', label: 'View', render: () => <TableViewAction onClick={fire('View')} /> },
              { key: 'edit', label: 'Edit', render: () => <TableEditAction onClick={fire('Edit')} /> },
              { key: 'verify', label: 'Verify', render: () => <TableVerifyAction onClick={fire('Verify')} /> },
              { key: 'approve', label: 'Approve', render: () => <TableApproveAction onClick={fire('Approve')} /> },
            ]}
          />
        </div>
      </div>

      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h3 className="text-[14px] font-bold text-slate-900 mb-2">ActionIconTooltip (standalone)</h3>
        <p className="text-[13px] text-slate-600 mb-3">
          Wrap any icon-only control when not using a prebuilt Table*Action.
        </p>
        <ActionIconTooltip label="Add row">
          <GigwIconButton icon={GIGW_ADD_ICON} tone="primary" onClick={fire('Add')} aria-label="Add row" />
        </ActionIconTooltip>
        <ActionIconTooltip label="Edit field">
          <GigwIconButton icon={GIGW_EDIT_ICON} tone="info" onClick={fire('Edit icon')} aria-label="Edit" />
        </ActionIconTooltip>
      </div>

      {last ? (
        <p className="text-[12px] text-[#01458e] border border-blue-200 bg-blue-50/70 rounded-lg px-3 py-2">
          Last interaction: {last}
        </p>
      ) : null}
    </div>
  )
}
