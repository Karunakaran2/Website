import React, { useCallback, useMemo } from 'react'
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  Archive,
  IndianRupee,
  Plus,
  ArrowRight,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useRegisterDashboardPageHeaderActions } from '@/app/shell/context/DashboardPageHeaderActionsContext'
import AssetModuleLayout from '../layouts/AssetModuleLayout'
import AssetStatsCard from '../components/AssetStatsCard'
import AssetDetailModal from '../components/AssetDetailModal'
import AssetRecordForm, { assetRecordFormTitle } from '../components/AssetRecordForm'
import { DomainListWithFormModal } from '@/shared/components/domain'
import { useAssetData } from '../hooks/useAssetData'
import { useDeleteConfirm } from '@/shared/components/confirm'
import { confirmAssetRegisterDelete } from '../../shared/listRecordConfirms'
import { formatINR, formatDate } from '../utils/assetUtils'
import DataTable from '@/shared/components/DataTable'
import StatusChip from '@/shared/components/status/StatusChip'
import {
  TABLE_ROW_ACTIONS_CLASS,
  TableViewAction,
  TableEditAction,
  TableDeleteAction,
} from '@/shared/components/buttons'
import ActionButton from '@/shared/components/buttons/ActionButton'

export default function AssetDashboardPage() {
  const navigate = useNavigate()
  const requestDelete = useDeleteConfirm()

  const {
    records,
    metrics,
    isFormModalOpen,
    setIsFormModalOpen,
    formModalMode,
    selectedAsset,
    isDetailModalOpen,
    setIsDetailModalOpen,
    openCreateModal,
    openEditModal,
    openDetailModal,
    handleCreate,
    handleUpdate,
    deleteRecord,
  } = useAssetData()

  const onConfirmDelete = useCallback(
    (row) => confirmAssetRegisterDelete(requestDelete, deleteRecord, row),
    [deleteRecord, requestDelete],
  )

  // Recent 6 assets for overview display
  const recentAssets = useMemo(() => records.slice(0, 6), [records])

  const columns = useMemo(
    () => [
      {
        id: 'code',
        header: 'Asset Code',
        accessor: 'code',
        sortable: true,
        pinned: true,
        minWidth: 120,
        cell: (row) => (
          <span className="font-mono font-bold text-[#01458e]">{row.code}</span>
        ),
      },
      {
        id: 'name',
        header: 'Asset Name',
        accessor: 'name',
        sortable: true,
        minWidth: 220,
        cell: (row) => (
          <span className="font-semibold text-slate-900">{row.name}</span>
        ),
      },
      {
        id: 'category',
        header: 'Category',
        accessor: 'category',
        sortable: true,
        minWidth: 150,
      },
      {
        id: 'department',
        header: 'Department',
        accessor: 'department',
        sortable: true,
        minWidth: 140,
      },
      {
        id: 'purchaseValue',
        header: 'Value (₹)',
        accessor: 'purchaseValue',
        align: 'right',
        sortable: true,
        minWidth: 130,
        cell: (row) => (
          <span className="font-medium text-slate-900">
            {formatINR(row.purchaseValue)}
          </span>
        ),
      },
      {
        id: 'purchaseDate',
        header: 'Acquired Date',
        accessor: 'purchaseDate',
        align: 'center',
        sortable: true,
        minWidth: 120,
        cell: (row) => (
          <span className="text-slate-600 whitespace-nowrap">
            {formatDate(row.purchaseDate)}
          </span>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        accessor: 'status',
        align: 'center',
        sortable: true,
        minWidth: 130,
        cell: (row) => <StatusChip label={row.status} />,
      },
      {
        id: 'actions',
        header: 'Actions',
        align: 'center',
        sortable: false,
        pinned: true,
        minWidth: 110,
        cell: (row) => (
          <div className={TABLE_ROW_ACTIONS_CLASS}>
            <TableViewAction
              onClick={() => openDetailModal(row)}
              title={`View ${row.name}`}
            />
            <TableEditAction
              onClick={() => openEditModal(row)}
              title={`Edit ${row.name}`}
            />
            <TableDeleteAction
              onClick={() => onConfirmDelete(row)}
              title={`Retire ${row.name}`}
            />
          </div>
        ),
      },
    ],
    [onConfirmDelete, openDetailModal, openEditModal]
  )

  const headerActions = useMemo(
    () => (
      <div className="flex flex-wrap items-center gap-2">
        <ActionButton
          variant="cancel"
          onClick={() => navigate('/administration/asset/asset-register/overview')}
          className="text-xs"
        >
          <span className="mr-1.5">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
          Open Full Register
        </ActionButton>
        <ActionButton variant="primary" onClick={openCreateModal} className="text-xs">
          <span className="mr-1.5">
            <Plus className="h-4 w-4" />
          </span>
          Register Asset
        </ActionButton>
      </div>
    ),
    [navigate, openCreateModal],
  )
  useRegisterDashboardPageHeaderActions(headerActions)

  return (
    <AssetModuleLayout>
      <DomainListWithFormModal
        formOpen={isFormModalOpen}
        onCloseForm={() => setIsFormModalOpen(false)}
        modalTitle={assetRecordFormTitle(formModalMode, selectedAsset)}
        form={
          <AssetRecordForm
            mode={formModalMode}
            initialData={selectedAsset}
            onCancel={() => setIsFormModalOpen(false)}
            onSave={formModalMode === 'create' ? handleCreate : handleUpdate}
          />
        }
        list={
          <>
      {/* Summary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <AssetStatsCard
          title="Total Assets"
          value={metrics.total}
          description="Catalogued fixed items"
          icon={Layers}
          variant="primary"
        />
        <AssetStatsCard
          title="Active Assets"
          value={metrics.active}
          description="Operational in departments"
          icon={CheckCircle2}
          variant="success"
        />
        <AssetStatsCard
          title="Under Maintenance"
          value={metrics.underMaintenance}
          description="Servicing & diagnostics"
          icon={AlertTriangle}
          variant="warning"
        />
        <AssetStatsCard
          title="Retired Assets"
          value={metrics.retired}
          description="Decommissioned / E-waste"
          icon={Archive}
          variant="neutral"
        />
        <AssetStatsCard
          title="Total Asset Value"
          value={metrics.formattedTotalValue}
          description="Book purchase capital"
          icon={IndianRupee}
          variant="purple"
        />
      </div>

      {/* Recent Assets Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Fixed Asset Registrations</h2>
            <p className="text-xs text-slate-500">
              Live enterprise records synced with local state.
            </p>
          </div>
          <ActionButton
            variant="cancel"
            onClick={() => navigate('/administration/asset/asset-register/overview')}
            className="text-xs"
          >
            View All ({metrics.total}) Assets
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </ActionButton>
        </div>

        <DataTable
          columns={columns}
          rows={recentAssets}
          rowKey="id"
          total={recentAssets.length}
          emptyMessage="No asset records available in local register."
        />
      </div>
          </>
        }
      />

      <AssetDetailModal
        isOpen={isDetailModalOpen}
        asset={selectedAsset}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={(item) => openEditModal(item)}
      />

    </AssetModuleLayout>
  )
}
