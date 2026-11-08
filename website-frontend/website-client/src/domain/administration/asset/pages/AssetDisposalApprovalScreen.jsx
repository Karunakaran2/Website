import { useCallback, useMemo, useState } from 'react'
import { DataTable, showAppToast } from '@/shared/components'
import { TABLE_ACTION_COLUMN_CLASS } from '@/shared/components/listing/listingTableStyles'
import { MODULE_FORM_ERROR_BANNER_CLASS } from '@/shared/constants/moduleLayoutStyles'
import { DEFAULT_ASSET_APPROVAL_WORKFLOW_TAB_ID } from '@/app/shell/constants/dashboard'
import AssetDisposalApprovalActionCell from '../components/AssetDisposalApprovalActionCell'
import AssetDisposalForwardModal from '../components/AssetDisposalForwardModal'
import AssetRetirementViewModal from '../components/AssetRetirementViewModal'
import { useAssetDisposalApprovalTable } from '../hooks/useAssetDisposalApprovalTable'
import { useLazyGetAssetDisposalViewQuery } from '../services/assetApi'
import { assetDisposalWorkflowStatusLabel } from '../constants/assetRetirement'
import { assetApprovalWorkflowPartyColumns } from '../utils/assetApprovalWorkflowColumns'

export default function AssetDisposalApprovalScreen({
  embedded = false,
  workflowTab: workflowTabProp,
} = {}) {
  const [internalWorkflowTab, setInternalWorkflowTab] = useState(DEFAULT_ASSET_APPROVAL_WORKFLOW_TAB_ID)
  const workflowTab = embedded ? workflowTabProp : internalWorkflowTab
  const [forwardRow, setForwardRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [fetchDisposalView] = useLazyGetAssetDisposalViewQuery()

  const {
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
    loadError,
    isFetching,
    refetch,
  } = useAssetDisposalApprovalTable(workflowTab)

  const openView = useCallback(
    async (row) => {
      if (!row?.idMask) {
        return
      }
      try {
        const full = await fetchDisposalView(row.idMask).unwrap()
        setViewRow(full ?? row)
      } catch (error) {
        showAppToast(error?.data?.message || 'Unable to load disposal for view.', 'error')
      }
    },
    [fetchDisposalView],
  )

  const handleVerify = useCallback(
    (row) => {
      if (row?.idMask) {
        verifyRow(row.idMask)
      }
    },
    [verifyRow],
  )

  const handleApprove = useCallback(
    (row) => {
      if (row?.idMask) {
        approveRow(row.idMask)
      }
    },
    [approveRow],
  )

  const columns = useMemo(
    () => [
      { id: 'assetId', header: 'Asset ID', accessor: 'assetId' },
      { id: 'assetDescription', header: 'Description', accessor: 'assetDescription' },
      {
        id: 'workflowStatus',
        header: 'Status',
        accessor: 'workflowStatus',
        cell: (row) => assetDisposalWorkflowStatusLabel(row.workflowStatus),
      },
      {
        id: 'retirementDate',
        header: 'Disposal Date',
        accessor: (row) => row.retirementDate ?? row.disposalDate,
      },
      { id: 'retirementType', header: 'Type', accessor: 'retirementType' },
      ...assetApprovalWorkflowPartyColumns(workflowTab),
      {
        id: 'action',
        header: 'Action',
        sortable: false,
        headerClassName: TABLE_ACTION_COLUMN_CLASS,
        cellClassName: TABLE_ACTION_COLUMN_CLASS,
        cell: (row) => (
          <AssetDisposalApprovalActionCell
            row={row}
            status={workflowTab}
            disabled={isVerifying || isApproving}
            onView={openView}
            onForward={setForwardRow}
            onVerify={handleVerify}
            onApprove={handleApprove}
          />
        ),
      },
    ],
    [handleApprove, handleVerify, isApproving, isVerifying, openView, workflowTab],
  )

  return (
    <>
      {loadError ? (
        <p className={`mb-2 ${MODULE_FORM_ERROR_BANNER_CLASS}`} role="alert">
          {loadError}
        </p>
      ) : null}
      {actionError ? (
        <p className="mb-2 text-[13px] text-rose-600" role="alert">
          {actionError}
        </p>
      ) : null}

      <DataTable
        columns={columns}
        rows={rows}
        rowKey="idMask"
        search={search}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
        }}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(value) => {
          setPageSize(value)
          setPage(1)
        }}
        sort={sort}
        onSortChange={setSort}
        loading={isFetching}
        emptyMessage="No data available in table"
      />

      <AssetDisposalForwardModal
        idMask={forwardRow?.idMask}
        isOpen={Boolean(forwardRow?.idMask)}
        onClose={() => setForwardRow(null)}
        onForwarded={() => {
          setForwardRow(null)
          refetch()
          showAppToast('Disposal record forwarded.', 'success', { action: 'forward' })
        }}
      />

      <AssetRetirementViewModal
        open={Boolean(viewRow)}
        row={viewRow}
        onClose={() => setViewRow(null)}
      />
    </>
  )
}
