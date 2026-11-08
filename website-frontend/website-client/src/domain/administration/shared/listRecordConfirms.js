import { confirmBeforeAction } from '@/shared/components/confirm'

const SETUP_DELETE_DESCRIPTION =
  'This master configuration record will be removed from the active category dictionary. Linked domain references may be affected.'

const ASSET_DELETE_DESCRIPTION =
  'This action will permanently remove the asset record from the active register and recalculate all capital asset balance metrics.'

export function confirmSetupMasterDelete(requestDelete, deleteRecord, record) {
  if (!requestDelete || !record) return
  requestDelete(
    async () => deleteRecord(record),
    {
      title: 'Delete Master Configuration Record?',
      message: `Are you sure you want to permanently delete "${record.name}" (${record.code})?`,
      description: SETUP_DELETE_DESCRIPTION,
      confirmLabel: 'Yes, Delete Record',
      showSuccessToast: false,
    },
  )
}

export function confirmSetupMasterStatus(requestConfirm, toggleRecordStatus, record) {
  if (!requestConfirm || !record) return
  const targetStatus = record.status === 'Active' ? 'Inactive' : 'Active'
  const isDeactivating = targetStatus === 'Inactive'
  confirmBeforeAction(requestConfirm, {
    action: isDeactivating ? 'deactivate' : 'activate',
    stack: 'base',
    title: `${isDeactivating ? 'Deactivate' : 'Activate'} Master Record?`,
    message: `Are you sure you want to mark "${record.name}" (${record.code}) as ${targetStatus}?`,
    description: isDeactivating
      ? 'Inactive records will be excluded from active selection dropdowns and new transaction entry forms.'
      : 'Active records will become immediately selectable in forms across all dependent application modules.',
    confirmLabel: `Yes, Set ${targetStatus}`,
    showSuccessToast: false,
    runAction: async () => toggleRecordStatus(record),
  })
}

export function confirmAssetRegisterDelete(requestDelete, deleteRecord, asset) {
  if (!requestDelete || !asset) return
  requestDelete(
    async () => deleteRecord(asset),
    {
      title: 'Retire / Delete Fixed Asset?',
      message: `Are you sure you want to retire and remove "${asset.name}" (${asset.code}) from the register?`,
      description: ASSET_DELETE_DESCRIPTION,
      confirmLabel: 'Yes, Delete Asset',
      showSuccessToast: false,
    },
  )
}
