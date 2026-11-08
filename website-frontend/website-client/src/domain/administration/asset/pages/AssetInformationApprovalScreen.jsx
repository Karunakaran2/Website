import { useCallback, useMemo, useState } from 'react'
import { DataTable, showAppToast } from '@/shared/components'
import { TABLE_ACTION_COLUMN_CLASS } from '@/shared/components/listing/listingTableStyles'
import { MODULE_FORM_ERROR_BANNER_CLASS } from '@/shared/constants/moduleLayoutStyles'
import { DEFAULT_ASSET_APPROVAL_WORKFLOW_TAB_ID } from '@/app/shell/constants/dashboard'
import AssetInformationApprovalActionCell from '../components/AssetInformationApprovalActionCell'
import AssetInformationForwardModal from '../components/AssetInformationForwardModal'
import AssetInformationViewModal from '../components/AssetInformationViewModal'
import { useAssetInformationApprovalTable } from '../hooks/useAssetInformationApprovalTable'
import { useLazyGetAssetInformationByIdQuery } from '../services/assetApi'
import { assetInformationWorkflowStatusLabel } from '../utils/assetInformationStatus'
import { assetApprovalWorkflowPartyColumns } from '../utils/assetApprovalWorkflowColumns'

export default function AssetInformationApprovalScreen({
  embedded = false,
  workflowTab: workflowTabProp,
} = {}) {
  const [internalWorkflowTab, setInternalWorkflowTab] = useState(DEFAULT_ASSET_APPROVAL_WORKFLOW_TAB_ID)
  const workflowTab = embedded ? workflowTabProp : internalWorkflowTab
  const [forwardRow, setForwardRow] = useState(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [viewRow, setViewRow] = useState(null)
  const [viewLoading, setViewLoading] = useState(false)
  const [fetchAssetInformationById] = useLazyGetAssetInformationByIdQuery()

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
    clearActionError,
    loadError,
    isFetching,
    refetch,
  } = useAssetInformationApprovalTable(workflowTab)

  const openView = useCallback(
    async (row) => {
      if (!row?.idMask) {
        return
      }
      setViewOpen(true)
      setViewRow(null)
      setViewLoading(true)
      try {
        const full = await fetchAssetInformationById(row.idMask).unwrap()
        setViewRow(full)
      } catch (error) {
        setViewOpen(false)
        showAppToast(error?.data?.message || 'Unable to load asset for view.', 'error')
      } finally {
        setViewLoading(false)
      }
    },
    [fetchAssetInformationById],
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
        id: 'status',
        header: 'Status',
        accessor: 'status',
        cell: (row) => assetInformationWorkflowStatusLabel(row.status),
      },
      { id: 'assetType', header: 'Asset type', accessor: 'assetType' },
      ...assetApprovalWorkflowPartyColumns(workflowTab),
      {
        id: 'action',
        header: 'Action',
        sortable: false,
        headerClassName: TABLE_ACTION_COLUMN_CLASS,
        cellClassName: TABLE_ACTION_COLUMN_CLASS,
        cell: (row) => (
          <AssetInformationApprovalActionCell
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

      <AssetInformationForwardModal
        idMask={forwardRow?.idMask}
        isOpen={Boolean(forwardRow?.idMask)}
        onClose={() => setForwardRow(null)}
        onForwarded={() => {
          setForwardRow(null)
          refetch()
          showAppToast('Asset information forwarded.', 'success', { action: 'forward' })
        }}
      />

      <AssetInformationViewModal
        open={viewOpen}
        row={viewRow}
        loading={viewLoading}
        onClose={() => {
          setViewOpen(false)
          setViewRow(null)
        }}
      />
    </>
  )
}
