import { Eye, Trash2 } from 'lucide-react'
import {
  GIGW_ACTIVATE_ICON,
  GIGW_DEACTIVATE_ICON,
  GIGW_EDIT_ICON,
  GIGW_FINALIZE_ICON,
  GIGW_FREEZE_ICON,
  GIGW_SUBMIT_ICON,
  TableActiveStatusAction,
  TableDeleteAction,
  TableEditAction,
  TableRowActionsGroup,
  TableSubmitAction,
  TableViewAction,
} from '@/shared/components/buttons'
import { useActionConfirm } from '@/shared/components/confirm'
import { setupRowDeleteDescription } from '../utils/setupRowDeleteDescription'
import { isSetupRowActive } from '@/shared/components/status/statusLabels'
import { resolveSetupPublicId } from '../utils/setupRowId'

function resolveSetupSubmitRowIcon(submitLabel) {
  if (submitLabel === 'Finalize') {
    return GIGW_FINALIZE_ICON
  }
  if (submitLabel === 'Freeze') {
    return GIGW_FREEZE_ICON
  }
  return GIGW_SUBMIT_ICON
}

export default function SetupActionCell({
  row,
  master,
  onEdit,
  onRemove,
  onToggleActive,
  onSubmit,
  onSetDefault,
}) {
  const requestConfirm = useActionConfirm()
  const isActive = isSetupRowActive(row)
  const rowId = resolveSetupPublicId(row, master)
  const recordLabel = setupRowDeleteDescription(row, master)
  const showActiveToggle = master.hasActive
    && master.showActiveToggle !== false
    && !master.labeledActiveActions
  const showLabeledActiveActions = master.labeledActiveActions === true
  const isFinalized =
    row.isFinalized === true
    || row.finalizeStatus === 'Y'
    || row.submittedStatus === 'Y'
    || (master.submitLabel === 'Freeze' && row.freezeStatus === 'Y')
  const showSubmit = master.canSubmit === true && !isFinalized
  const showDelete = master.canRemove !== false && !showLabeledActiveActions

  const runWithConfirm = (action, runAction, extra = {}) => {
    if (!requestConfirm) {
      runAction()
      return
    }
    requestConfirm(runAction, {
      action,
      recordLabel,
      submitLabel: master.submitLabel,
      ...extra,
    })
  }

  const handleToggleActiveClick = () => {
    runWithConfirm(isActive ? 'deactivate' : 'activate', () => onToggleActive(row))
  }

  const handleDeleteClick = () => {
    runWithConfirm('delete', () => onRemove(row))
  }

  const handleSetDefaultClick = () => {
    runWithConfirm('setDefault', () => onSetDefault(row))
  }

  const handleSubmitClick = () => {
    const submitLabel = master.submitLabel || 'Submit'
    runWithConfirm('submit', () => onSubmit(row), {
      successMessage:
        submitLabel === 'Finalize'
          ? 'Finalized successfully.'
          : submitLabel === 'Freeze'
            ? 'Frozen successfully.'
            : submitLabel === 'Submit'
              ? 'Submitted successfully.'
              : undefined,
    })
  }

  const actionItems = []

  actionItems.push({
      key: 'edit',
      label: 'Edit',
      icon: GIGW_EDIT_ICON,
      onClick: () => onEdit(row),
      render: () => (
        <TableEditAction
          type="button"
          aria-label={`Edit row ${rowId}`}
          title="Edit"
          onClick={() => onEdit(row)}
        />
      ),
    })

  if (showActiveToggle || showLabeledActiveActions) {
    const activeLabel = isActive ? 'Deactivate' : 'Activate'
    actionItems.push({
        key: 'active-status',
        label: activeLabel,
        icon: isActive ? GIGW_DEACTIVATE_ICON : GIGW_ACTIVATE_ICON,
        onClick: handleToggleActiveClick,
        render: () => (
          <TableActiveStatusAction
            isActive={isActive}
            onActivate={handleToggleActiveClick}
            onDeactivate={handleToggleActiveClick}
            aria-label={`${activeLabel} row ${rowId}`}
            title={activeLabel}
          />
        ),
    })
  }

  if (master.hasDefault && row.defaultStatus !== 'Y' && onSetDefault) {
    actionItems.push({
        key: 'set-default',
        label: 'Set as Default',
        icon: Eye,
        onClick: handleSetDefaultClick,
        render: () => (
          <TableViewAction
            type="button"
            aria-label={`Set default row ${rowId}`}
            title="Set as Default"
            onClick={handleSetDefaultClick}
          />
        ),
    })
  }

  if (showSubmit) {
    const submitLabel = master.submitLabel || 'Submit'
    const submitIcon = resolveSetupSubmitRowIcon(submitLabel)
    actionItems.push({
        key: 'submit',
        label: submitLabel,
        icon: submitIcon,
        onClick: handleSubmitClick,
        render: () => (
          <TableSubmitAction
            type="button"
            icon={submitIcon}
            aria-label={`${submitLabel} row ${rowId}`}
            title={submitLabel}
            onClick={handleSubmitClick}
          />
        ),
    })
  }

  if (showDelete) {
    actionItems.push({
        key: 'delete',
        label: 'Delete',
        icon: Trash2,
        onClick: handleDeleteClick,
        render: () => (
          <TableDeleteAction
            type="button"
            aria-label={`Delete row ${rowId}`}
            title="Delete"
            onClick={handleDeleteClick}
          />
        ),
    })
  }

  return <TableRowActionsGroup items={actionItems} className="justify-start" />
}
