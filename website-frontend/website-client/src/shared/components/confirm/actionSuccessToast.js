/**
 * Default success copy after a confirmed action completes successfully.
 * Override per call with `successMessage` on `requestConfirm` / `confirmBeforeAction`.
 */
export function getActionSuccessToastMessage(action) {
  switch (action) {
    case 'delete':
      return 'Deleted successfully.'
    case 'activate':
      return 'Activated successfully.'
    case 'deactivate':
      return 'Deactivated successfully.'
    case 'setDefault':
      return 'Default updated successfully.'
    case 'unsetDefault':
      return 'Default removed successfully.'
    case 'submit':
      return 'Submitted successfully.'
    case 'forward':
      return 'Forwarded successfully.'
    case 'download':
      return 'Downloaded successfully.'
    case 'hide':
      return 'Widget hidden.'
    case 'restore':
      return 'Widget restored.'
    case 'upload':
      return 'Uploaded successfully.'
    case 'process':
    case 'assetRetirement':
      return 'Processed successfully.'
    case 'assetAllocate':
      return 'Asset allocated successfully.'
    case 'assetReturnToStore':
      return 'Asset returned to store successfully.'
    case 'save':
      return 'Saved successfully.'
    case 'update':
      return 'Updated successfully.'
    case 'verify':
      return 'Verified successfully.'
    case 'approve':
      return 'Approved successfully.'
    case 'finalize':
      return 'Finalized successfully.'
    case 'reverse':
      return 'Reversed successfully.'
    case 'allocateLedger':
    case 'allocateUser':
      return 'Allocated successfully.'
    default:
      return null
  }
}
