/** Copy and ConfirmDialog `tone` for standard CRUD / workflow actions. */
export function getActionConfirmDialogProps(action, { recordLabel, submitLabel } = {}) {
  const quoted = recordLabel ? `"${recordLabel}"` : null

  switch (action) {
    case 'delete':
      return {
        title: 'Delete confirmation',
        message: 'Do you want to delete this record?',
        description: quoted
          ? `${quoted} will be permanently removed.`
          : 'This action cannot be undone.',
        confirmLabel: 'Delete',
        tone: 'danger',
      }
    case 'activate':
      return {
        title: 'Activate confirmation',
        message: 'Do you want to activate this record?',
        description: quoted ? `${quoted} will be marked as active.` : undefined,
        confirmLabel: 'Activate',
        tone: 'activate',
      }
    case 'deactivate':
      return {
        title: 'Deactivate confirmation',
        message: 'Do you want to deactivate this record?',
        description: quoted ? `${quoted} will be marked as inactive.` : undefined,
        confirmLabel: 'Deactivate',
        tone: 'deactivate',
      }
    case 'setDefault':
      return {
        title: 'Default confirmation',
        message: 'Do you want to set this as the default?',
        description: quoted ? `${quoted} will be used as the default.` : undefined,
        confirmLabel: 'Yes',
        tone: 'primary',
      }
    case 'unsetDefault':
      return {
        title: 'Default confirmation',
        message: 'Do you want to remove the default status?',
        description: quoted ? `${quoted} will no longer be the default.` : undefined,
        confirmLabel: 'Yes',
        tone: 'deactivate',
      }
    case 'submit': {
      const label = submitLabel || 'Submit'
      return {
        title: `${label} confirmation`,
        message: `Do you want to ${label.toLowerCase()} this record?`,
        description: quoted ? `${quoted} will be ${label.toLowerCase()}d.` : undefined,
        confirmLabel: label,
        tone: 'primary',
      }
    }
    case 'forward':
      return {
        title: 'Forward confirmation',
        message: 'Do you want to forward this record?',
        description: quoted ? `${quoted} will be forwarded.` : undefined,
        confirmLabel: 'Forward',
        tone: 'primary',
      }
    case 'download': {
      const label = submitLabel || 'Download'
      return {
        title: 'Download confirmation',
        message: `Do you want to download this ${label}?`,
        confirmLabel: label,
        tone: 'primary',
      }
    }
    case 'export':
      return {
        title: 'Export confirmation',
        message: 'Are you sure you want to export the selected records?',
        description: quoted ? `Export will include ${quoted}.` : undefined,
        confirmLabel: 'Export',
        tone: 'primary',
      }
    case 'hide':
      return {
        title: 'Hide confirmation',
        message: 'Do you want to hide this widget?',
        confirmLabel: 'Hide',
        tone: 'primary',
      }
    case 'restore':
      return {
        title: 'Restore confirmation',
        message: 'Do you want to restore this widget?',
        confirmLabel: 'Restore',
        tone: 'primary',
      }
    case 'upload':
      return {
        title: 'Upload confirmation',
        message: 'Do you want to upload this document?',
        description: recordLabel ? `File: ${recordLabel}` : undefined,
        confirmLabel: 'Upload Document',
        tone: 'primary',
      }
    case 'process':
      return {
        title: 'Process confirmation',
        message: 'Do you want to run depreciation processing?',
        description: recordLabel
          ? `Depreciation no. ${recordLabel} will be processed for the selected category and period.`
          : 'Assets in the selected category will be depreciated for the chosen period.',
        confirmLabel: 'Process',
        tone: 'primary',
      }
    case 'assetRetirement':
      return {
        title: 'Process confirmation',
        message: 'Do you want to run fixed asset retirement processing?',
        description: recordLabel
          ? `Assets matching the selected category will be retired as of ${recordLabel}.`
          : 'Assets in the selected category will be loaded for retirement.',
        confirmLabel: 'Process',
        tone: 'primary',
      }
    case 'assetAllocate':
      return {
        title: 'Allocation confirmation',
        message: 'Do you want to allocate this asset?',
        description: recordLabel
          ? `${recordLabel} will be assigned to the selected custodian and location.`
          : undefined,
        confirmLabel: 'Allocate',
        tone: 'primary',
      }
    case 'assetReturnToStore':
      return {
        title: 'Return confirmation',
        message: 'Do you want to return this asset to store?',
        description: recordLabel ? `${recordLabel} will be marked as returned to store.` : undefined,
        confirmLabel: 'Return to Store',
        tone: 'primary',
      }
    case 'openingAssetSave':
      return {
        title: 'Save confirmation',
        message: 'Do you want to save Asset Information?',
        description: recordLabel
          ? `Uploaded rows from ${recordLabel} will be created in asset information.`
          : 'Uploaded rows will be created in asset information.',
        confirmLabel: 'Save',
        tone: 'primary',
      }
    case 'save':
      return {
        title: 'Save confirmation',
        message: 'Do you want to save?',
        description: quoted ? `Changes to ${quoted} will be saved.` : undefined,
        confirmLabel: 'Save',
        tone: 'primary',
      }
    case 'update':
      return {
        title: 'Update confirmation',
        message: 'Do you want to update?',
        description: quoted ? `Changes to ${quoted} will be updated.` : undefined,
        confirmLabel: 'Update',
        tone: 'primary',
      }
    case 'verify':
      return {
        title: 'Verify confirmation',
        message: 'Do you want to verify this record?',
        description: quoted ? `${quoted} will be marked as verified.` : undefined,
        confirmLabel: 'Verify',
        tone: 'verify',
      }
    case 'approve':
      return {
        title: 'Approve confirmation',
        message: 'Do you want to approve this record?',
        description: quoted ? `${quoted} will be approved.` : undefined,
        confirmLabel: 'Approve',
        tone: 'approve',
      }
    case 'finalize':
      return {
        title: 'Finalize confirmation',
        message: 'Do you want to finalize this record?',
        description: quoted ? `${quoted} will be finalized.` : undefined,
        confirmLabel: 'Finalize',
        tone: 'approve',
      }
    case 'reject':
      return {
        title: 'Reject confirmation',
        message: 'Do you want to reject this record?',
        description: quoted ? `${quoted} will be rejected.` : undefined,
        confirmLabel: 'Reject',
        tone: 'danger',
      }
    case 'reverse':
      return {
        title: 'Reverse confirmation',
        message: 'Do you want to reverse this voucher?',
        confirmLabel: 'Reverse',
        tone: 'primary',
      }
    case 'allocateLedger':
      return {
        title: 'Allocation confirmation',
        message: 'Do you want to allocate the selected ledger?',
        confirmLabel: 'Yes',
        tone: 'primary',
      }
    case 'allocateUser':
      return {
        title: 'Allocation confirmation',
        message: 'Do you want to allocate the selected user?',
        confirmLabel: 'Yes',
        tone: 'primary',
      }
    case 'switchAccount':
      return {
        title: 'Switch account',
        message: 'Switch to this account?',
        description: quoted
          ? `Your active posting will change to ${quoted}. Module data and permissions will refresh for the new context.`
          : 'Your active posting and module context will refresh.',
        confirmLabel: 'Switch account',
        tone: 'primary',
      }
    default:
      return {
        title: 'Confirm',
        message: 'Do you want to continue?',
        confirmLabel: 'Yes',
        tone: 'primary',
      }
  }
}
