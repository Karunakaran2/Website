import { useEffect, useMemo, useState } from 'react'
import { PortalModalShell } from '@/shared/components'
import { confirmBeforeAction, confirmedActionFailure, useActionConfirm } from '@/shared/components/confirm'
import { GigwButton } from '@/shared/components/buttons/gigw'
import {
  FORM_FOOTER_CANCEL_CLASS,
  FORM_FOOTER_PRIMARY_CLASS,
} from '@/shared/components/buttons/actionButtonStyles'
import { PORTAL_MODAL_LABEL_CLASS } from '@/shared/components/modals/modalChrome'
import {
  useForwardAssetMaintenanceMutation,
  useGetAssetMaintenanceForwardUserListQuery,
} from '../services/assetApi'

function toList(response) {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  return []
}

function userPublicId(row) {
  const idMask = row?.idMask ?? row?.id
  return idMask == null || idMask === '' ? '' : String(idMask)
}

function userLabel(row) {
  const userName = row?.userName || ''
  if (row?.hierarchyName) {
    return userName ? `${userName} (${row.hierarchyName})` : row.hierarchyName
  }
  return userName
}

function errorMessage(error) {
  if (typeof error?.data === 'string' && error.data.trim()) return error.data
  const payload = error?.data
  if (payload && typeof payload === 'object' && typeof payload.message === 'string') {
    return payload.message
  }
  return 'Unable to forward this maintenance record. Please try again.'
}

export default function AssetMaintenanceForwardModal({
  idMask,
  isOpen,
  onClose,
  onForwarded,
}) {
  const requestConfirm = useActionConfirm()
  const [selectedUserIdMask, setSelectedUserIdMask] = useState('')

  const { data: userListResponse, isFetching, isError } = useGetAssetMaintenanceForwardUserListQuery(
    idMask,
    { skip: !isOpen || !idMask },
  )

  const users = useMemo(() => toList(userListResponse), [userListResponse])

  const [forwardMaintenance, { isLoading: forwarding }] = useForwardAssetMaintenanceMutation()

  useEffect(() => {
    if (!isOpen) {
      setSelectedUserIdMask('')
    }
  }, [isOpen])

  const handleForward = () => {
    if (!idMask || !selectedUserIdMask) {
      return
    }
    confirmBeforeAction(requestConfirm, {
      action: 'forward',
      stack: 'nested',
      runAction: async () => {
        try {
          await forwardMaintenance({ idMask, toUserIdMask: selectedUserIdMask }).unwrap()
          onForwarded?.()
          return true
        } catch (error) {
          return confirmedActionFailure(errorMessage(error))
        }
      },
    })
  }

  return (
    <PortalModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Forward asset maintenance"
      size="md"
      stack="nested"
    >
      <div className="flex flex-col gap-4 p-4">
        <label className={PORTAL_MODAL_LABEL_CLASS} htmlFor="maintenance-forward-user">
          Forward to
        </label>
        <select
          id="maintenance-forward-user"
          className="h-[36px] w-full rounded border border-slate-300 px-3 text-[13px]"
          value={selectedUserIdMask}
          disabled={isFetching || forwarding}
          onChange={(event) => setSelectedUserIdMask(event.target.value)}
        >
          <option value="">— Select user —</option>
          {users.map((row) => {
            const id = userPublicId(row)
            return (
              <option key={id} value={id}>
                {userLabel(row)}
              </option>
            )
          })}
        </select>
        {isError ? (
          <p className="text-[13px] text-rose-600" role="alert">
            Unable to load users for forwarding.
          </p>
        ) : null}
        <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
          <GigwButton
            type="button"
            variant="secondary"
            className={FORM_FOOTER_CANCEL_CLASS}
            onClick={onClose}
            disabled={forwarding}
          >
            Cancel
          </GigwButton>
          <GigwButton
            type="button"
            variant="primary"
            className={FORM_FOOTER_PRIMARY_CLASS}
            loading={forwarding}
            disabled={!selectedUserIdMask || isFetching}
            onClick={handleForward}
          >
            Forward
          </GigwButton>
        </div>
      </div>
    </PortalModalShell>
  )
}
