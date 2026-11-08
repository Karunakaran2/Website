import { Check } from 'lucide-react'
import {
  GIGW_EDIT_ICON,
  GIGW_FINALIZE_ICON,
  GigwIconButton,
  TableDeactivateAction,
  TableEditAction,
  TableRowActionsGroup,
} from '@/shared/components/buttons'
import { confirmBeforeAction, useActionConfirm } from '@/shared/components/confirm'
import {
  deactivatePreClosureTodo,
  finalizePreClosureTodo,
  markPreClosureTodoComplete,
} from '../constants/auditClosureStore'

export default function PreClosureTodoActionCell({ row, onEdit }) {
  const requestConfirm = useActionConfirm()
  const items = []

  if (!row.complete && !row.finalized) {
    items.push({
      key: 'complete',
      label: 'Todo complete',
      icon: Check,
      onClick: () => confirmBeforeAction(requestConfirm, {
        action: 'submit',
        submitLabel: 'Complete',
        recordLabel: row.title,
        message: 'Do you want to mark this todo as complete?',
        successMessage: 'Todo marked as complete.',
        runAction: () => {
          markPreClosureTodoComplete(row.idMask)
          return true
        },
      }),
      render: () => (
        <GigwIconButton
          icon={Check}
          tone="positive"
          context="table"
          tooltip="Todo complete"
          aria-label={`Mark ${row.title} complete`}
          onClick={() => items.find((item) => item.key === 'complete')?.onClick()}
        />
      ),
    })
  }

  if (row.active) {
    items.push({
      key: 'deactivate',
      label: 'Deactivate',
      onClick: () => confirmBeforeAction(requestConfirm, {
        action: 'deactivate',
        recordLabel: row.title,
        runAction: () => {
          deactivatePreClosureTodo(row.idMask)
          return true
        },
      }),
      render: () => (
        <TableDeactivateAction
          type="button"
          aria-label={`Deactivate ${row.title}`}
          onClick={() => items.find((item) => item.key === 'deactivate')?.onClick()}
        />
      ),
    })
  }

  if (!row.finalized) {
    items.push({
      key: 'edit',
      label: 'Edit',
      icon: GIGW_EDIT_ICON,
      onClick: () => onEdit(row),
      render: () => (
        <TableEditAction
          type="button"
          aria-label={`Edit ${row.title}`}
          onClick={() => onEdit(row)}
        />
      ),
    })
  }

  if (!row.finalized) {
    items.push({
      key: 'finalize',
      label: 'Finalize',
      icon: GIGW_FINALIZE_ICON,
      onClick: () => confirmBeforeAction(requestConfirm, {
        action: 'finalize',
        recordLabel: row.title,
        runAction: () => {
          finalizePreClosureTodo(row.idMask)
          return true
        },
      }),
      render: () => (
        <GigwIconButton
          icon={GIGW_FINALIZE_ICON}
          tone="positive"
          context="table"
          tooltip="Finalize"
          aria-label={`Finalize ${row.title}`}
          onClick={() => items.find((item) => item.key === 'finalize')?.onClick()}
        />
      ),
    })
  }

  if (items.length === 0) {
    return null
  }

  return <TableRowActionsGroup className="justify-center" items={items} />
}
