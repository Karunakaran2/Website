import { useMemo, useState } from 'react'
import { confirmBeforeAction, confirmedActionFailure, useActionConfirm } from '@/shared/components/confirm'
import {
  useApproveAssetDisposalMutation,
  useSearchAssetDisposalWorkflowQuery,
  useVerifyAssetDisposalMutation,
} from '../services/assetApi'
import { assetApprovalWorkflowLoadErrorMessage } from '../utils/assetApprovalLoadError'
import { normalizeAssetApprovalWorkflowRow } from '../utils/normalizeAssetApprovalWorkflowRow'

export function useAssetDisposalApprovalTable(status) {
  const requestConfirm = useActionConfirm()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sort, setSort] = useState({ sortBy: 'assetId', sortDir: 'asc' })
  const [actionError, setActionError] = useState('')

  const { data, isFetching, isError, error, refetch } = useSearchAssetDisposalWorkflowQuery(
    {
      status,
      search,
      page,
      pageSize,
      sortBy: sort.sortBy,
      sortDir: sort.sortDir,
    },
    { refetchOnMountOrArgChange: true },
  )

  const [verifyAssetDisposal, { isLoading: isVerifying }] = useVerifyAssetDisposalMutation()
  const [approveAssetDisposal, { isLoading: isApproving }] = useApproveAssetDisposalMutation()

  const rows = useMemo(
    () =>
      (Array.isArray(data?.data) ? data.data : [])
        .map(normalizeAssetApprovalWorkflowRow)
        .filter(Boolean),
    [data],
  )
  const total = isError ? 0 : data?.recordsFiltered ?? data?.recordsTotal ?? 0
  const loadError = isError ? assetApprovalWorkflowLoadErrorMessage(error) : ''

  const runRowAction = async (action, idMask) => {
    setActionError('')
    try {
      await action(idMask).unwrap()
      refetch()
      return true
    } catch {
      const message = 'Unable to complete the disposal workflow action. Please try again.'
      setActionError(message)
      return confirmedActionFailure(message)
    }
  }

  const verifyRow = (idMask) =>
    confirmBeforeAction(requestConfirm, {
      action: 'verify',
      stack: 'base',
      successMessage: 'Disposal record verified.',
      runAction: () => runRowAction(verifyAssetDisposal, idMask),
    })

  const approveRow = (idMask) =>
    confirmBeforeAction(requestConfirm, {
      action: 'approve',
      stack: 'base',
      successMessage: 'Disposal record approved.',
      runAction: () => runRowAction(approveAssetDisposal, idMask),
    })

  return {
    rows,
    total,
    search,
    page,
    pageSize,
    sort,
    setSearch,
    setPage,
    setPageSize,
    setSort,
    verifyRow,
    approveRow,
    isVerifying,
    isApproving,
    actionError,
    clearActionError: () => setActionError(''),
    loadError,
    isFetching,
    refetch,
  }
}
