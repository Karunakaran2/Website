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
  useForwardAssetInformationMutation,
  useGetAssetInformationForwardUserListQuery,
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
  return 'Unable to forward this asset. Please try again.'
}

export default function AssetInformationForwardModal({
  idMask,
  isOpen,
  onClose,
  onForwarded,
}) {
  const requestConfirm = useActionConfirm()
  const [selectedUserIdMask, setSelectedUserIdMask] = useState('')
  const [formError, setFormError] = useState('')
  const userQuery = useGetAssetInformationForwardUserListQuery(idMask, {
    skip: !isOpen || !idMask,
    refetchOnMountOrArgChange: true,
  })
  const [forwardAssetInformation, { isLoading }] = useForwardAssetInformationMutation()

  useEffect(() => {
    if (!isOpen) {
      setSelectedUserIdMask('')
      setFormError('')
    }
  }, [isOpen])

  const users = useMemo(
    () =>
      toList(userQuery.data)
        .map((row) => ({
          value: userPublicId(row),
          label: userLabel(row),
        }))
        .filter((row) => row.value),
    [userQuery.data],
  )

  const handleForward = () => {
    if (!selectedUserIdMask) {
      setFormError('Please select a recipient.')
      return
    }
    confirmBeforeAction(requestConfirm, {
      action: 'forward',
      stack: 'nested',
      validate: () => Boolean(selectedUserIdMask),
      runAction: async () => {
        setFormError('')
        try {
          await forwardAssetInformation({
            idMask,
            toUserIdMask: selectedUserIdMask,
          }).unwrap()
          onForwarded?.()
          onClose?.()
          return true
        } catch (error) {
          const message = errorMessage(error)
          setFormError(message)
          return confirmedActionFailure(message)
        }
      },
    })
  }

  return (
    <PortalModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Forward Asset Information"
      size="md"
      stack="nested"
    >
      <div className="flex flex-col gap-4 p-4">
        {formError ? (
          <p className="text-[13px] text-rose-600" role="alert">
            {formError}
          </p>
        ) : null}
        <label className={PORTAL_MODAL_LABEL_CLASS} htmlFor="asset-forward-recipient">
          Forward to
        </label>
        <select
          id="asset-forward-recipient"
          className="h-[36px] w-full rounded border border-slate-300 px-2 text-[13px]"
          value={selectedUserIdMask}
          disabled={userQuery.isFetching || isLoading}
          onChange={(event) => {
            setSelectedUserIdMask(event.target.value)
            setFormError('')
          }}
        >
          <option value="">Select seat user</option>
          {users.map((user) => (
            <option key={user.value} value={user.value}>
              {user.label}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
          <GigwButton
            type="button"
            variant="secondary"
            className={FORM_FOOTER_CANCEL_CLASS}
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </GigwButton>
          <GigwButton
            type="button"
            variant="primary"
            className={FORM_FOOTER_PRIMARY_CLASS}
            loading={isLoading}
            disabled={isLoading || userQuery.isFetching}
            onClick={handleForward}
          >
            Forward
          </GigwButton>
        </div>
      </div>
    </PortalModalShell>
  )
}
