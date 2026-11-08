import { useState } from 'react'
import {
  PrimaryButton,
  ActionButton,
  CancelButton,
  SubmitButton,
  TABLE_ROW_ACTIONS_CLASS,
  TableViewAction,
  TableEditAction,
  TableDeleteAction,
  TableApproveAction,
} from '@/shared/components/buttons'

export default function ActionsExplorerPage() {
  const [clickedAction, setClickedAction] = useState('None yet')

  return (
    <div className="space-y-6 pb-12">
      {/* Main Showcase Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-3">
            Primary Form Action Buttons
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            <PrimaryButton onClick={() => setClickedAction('PrimaryButton (Save)')}>
              Save Record
            </PrimaryButton>

            <ActionButton variant="excel" onClick={() => setClickedAction('ActionButton (Excel)')}>
              Export Excel
            </ActionButton>

            <ActionButton variant="pdf" onClick={() => setClickedAction('ActionButton (PDF)')}>
              Export PDF
            </ActionButton>

            <CancelButton onClick={() => setClickedAction('CancelButton (Cancel)')}>
              Cancel
            </CancelButton>

            <ActionButton
              type="button"
              variant="delete"
              onClick={() => setClickedAction('ActionButton (Delete)')}
            >
              Delete Entry
            </ActionButton>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-3">
            Table Row Actions Toolbar
          </h3>
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 border border-slate-200 w-fit">
            <div className={TABLE_ROW_ACTIONS_CLASS}>
              <TableViewAction
                onClick={() => setClickedAction('TableViewAction')}
                title="View Record"
              />
              <TableEditAction
                onClick={() => setClickedAction('TableEditAction')}
                title="Edit Record"
              />
              <TableApproveAction
                onClick={() => setClickedAction('TableApproveAction')}
                title="Approve Record"
              />
              <TableDeleteAction
                onClick={() => setClickedAction('TableDeleteAction')}
                title="Delete Record"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span>Active Action Triggered: <strong className="text-slate-800">{clickedAction}</strong></span>
          <span className="text-[11px] text-slate-400">All actions are keyboard focusable (<kbd>Tab</kbd>)</span>
        </div>
      </div>
    </div>
  )
}
