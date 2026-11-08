/** In-modal status text while a confirmed action runs. */
export function getActionLoadingLabel(action) {
  switch (action) {
    case 'delete':
      return 'Deleting…'
    case 'activate':
      return 'Activating…'
    case 'deactivate':
      return 'Deactivating…'
    case 'setDefault':
    case 'unsetDefault':
      return 'Updating default…'
    case 'submit':
      return 'Submitting…'
    case 'forward':
      return 'Forwarding…'
    case 'download':
      return 'Downloading…'
    case 'hide':
      return 'Hiding…'
    case 'restore':
      return 'Restoring…'
    case 'upload':
      return 'Uploading…'
    case 'process':
    case 'assetRetirement':
      return 'Processing…'
    case 'assetAllocate':
      return 'Allocating asset…'
    case 'assetReturnToStore':
      return 'Returning to store…'
    case 'save':
      return 'Saving…'
    case 'update':
      return 'Updating…'
    case 'allocateLedger':
    case 'allocateUser':
      return 'Allocating…'
    default:
      return 'Please wait…'
  }
}
