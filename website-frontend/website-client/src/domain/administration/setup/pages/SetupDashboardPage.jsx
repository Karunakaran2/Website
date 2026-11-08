import React, { useCallback, useMemo } from 'react'
import {
  Layers,
  CheckCircle2,
  XCircle,
  FolderTree,
  Plus,
  ArrowRight,
  Building,
  MapPin,
  Tag,
  Ruler,
  Sliders,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useRegisterDashboardPageHeaderActions } from '@/app/shell/context/DashboardPageHeaderActionsContext'
import SetupModuleLayout from '../layouts/SetupModuleLayout'
import SetupStatsCard from '../components/SetupStatsCard'
import SetupRecordDetailModal from '../components/SetupRecordDetailModal'
import SetupRecordForm, { setupRecordFormTitle } from '../components/SetupRecordForm'
import { DomainListWithFormModal } from '@/shared/components/domain'
import { useSetupData } from '../hooks/useSetupData'
import { useActionConfirm, useDeleteConfirm } from '@/shared/components/confirm'
import {
  confirmSetupMasterDelete,
  confirmSetupMasterStatus,
} from '../../shared/listRecordConfirms'
import { formatDate } from '../utils/setupUtils'
import { MASTER_CATEGORIES } from '../constants/setupConstants'
import DataTable from '@/shared/components/DataTable'
import StatusChip from '@/shared/components/status/StatusChip'
import {
  TABLE_ROW_ACTIONS_CLASS,
  TableViewAction,
  TableEditAction,
  TableDeleteAction,
  TableActivateAction,
  TableDeactivateAction,
} from '@/shared/components/buttons'
import ActionButton from '@/shared/components/buttons/ActionButton'

export default function SetupDashboardPage() {
  const navigate = useNavigate()
  const requestConfirm = useActionConfirm()
  const requestDelete = useDeleteConfirm()

  const {
    records,
    metrics,
    isFormModalOpen,
    setIsFormModalOpen,
    formModalMode,
    selectedRecord,
    isDetailModalOpen,
    setIsDetailModalOpen,
    openCreateModal,
    openEditModal,
    openDetailModal,
    handleCreate,
    handleUpdate,
    deleteRecord,
    toggleRecordStatus,
  } = useSetupData()

  const onConfirmDelete = useCallback(
    (row) => confirmSetupMasterDelete(requestDelete, deleteRecord, row),
    [deleteRecord, requestDelete],
  )

  const onConfirmStatus = useCallback(
    (row) => confirmSetupMasterStatus(requestConfirm, toggleRecordStatus, row),
    [requestConfirm, toggleRecordStatus],
  )

  // Category Icon Resolver
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Departments':
        return Building
      case 'Locations & Offices':
        return MapPin
      case 'Asset Categories':
        return Tag
      case 'Units of Measurement':
        return Ruler
      default:
        return Sliders
    }
  }

  // Recent 6 master records
  const recentRecords = useMemo(() => records.slice(0, 6), [records])

  const columns = useMemo(
    () => [
      {
        id: 'code',
        header: 'Code',
        accessor: 'code',
        sortable: true,
        pinned: true,
        minWidth: 130,
        cell: (row) => (
          <span className="font-mono font-bold text-[#01458e]">{row.code}</span>
        ),
      },
      {
        id: 'name',
        header: 'Configuration Name',
        accessor: 'name',
        sortable: true,
        minWidth: 240,
        cell: (row) => (
          <span className="font-semibold text-slate-900">{row.name}</span>
        ),
      },
      {
        id: 'category',
        header: 'Category',
        accessor: 'category',
        sortable: true,
        minWidth: 160,
      },
      {
        id: 'head',
        header: 'Responsible Head',
        accessor: 'head',
        sortable: true,
        minWidth: 160,
        cell: (row) => (
          <span className="text-slate-700">{row.head || '—'}</span>
        ),
      },
      {
        id: 'updatedDate',
        header: 'Last Updated',
        accessor: 'updatedDate',
        align: 'center',
        sortable: true,
        minWidth: 120,
        cell: (row) => (
          <span className="text-slate-600 whitespace-nowrap">
            {formatDate(row.updatedDate)}
          </span>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        accessor: 'status',
        align: 'center',
        sortable: true,
        minWidth: 120,
        cell: (row) => <StatusChip label={row.status} />,
      },
      {
        id: 'actions',
        header: 'Actions',
        align: 'center',
        sortable: false,
        pinned: true,
        minWidth: 130,
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
            {row.status === 'Active' ? (
              <TableDeactivateAction
                onClick={() => onConfirmStatus(row)}
                title={`Deactivate ${row.name}`}
              />
            ) : (
              <TableActivateAction
                onClick={() => onConfirmStatus(row)}
                title={`Activate ${row.name}`}
              />
            )}
            <TableDeleteAction
              onClick={() => onConfirmDelete(row)}
              title={`Delete ${row.name}`}
            />
          </div>
        ),
      },
    ],
    [onConfirmDelete, onConfirmStatus, openDetailModal, openEditModal]
  )

  const headerActions = useMemo(
    () => (
      <div className="flex flex-wrap items-center gap-2">
        <ActionButton
          variant="cancel"
          onClick={() => navigate('/administration/setup/setup-master-data/overview')}
          className="text-xs"
        >
          <span className="mr-1.5">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
          Manage Master Data
        </ActionButton>
        <ActionButton
          variant="primary"
          onClick={() => openCreateModal('Departments')}
          className="text-xs"
        >
          <span className="mr-1.5">
            <Plus className="h-4 w-4" />
          </span>
          Add Configuration Record
        </ActionButton>
      </div>
    ),
    [navigate, openCreateModal],
  )
  useRegisterDashboardPageHeaderActions(headerActions)

  return (
    <SetupModuleLayout>
      <DomainListWithFormModal
        formOpen={isFormModalOpen}
        onCloseForm={() => setIsFormModalOpen(false)}
        modalTitle={setupRecordFormTitle(formModalMode, selectedRecord)}
        form={
          <SetupRecordForm
            mode={formModalMode}
            initialData={selectedRecord}
            existingRecords={records}
            onCancel={() => setIsFormModalOpen(false)}
            onSave={formModalMode === 'create' ? handleCreate : handleUpdate}
          />
        }
        list={
          <>
      {/* Summary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SetupStatsCard
          title="Total Configuration Records"
          value={metrics.total}
          description="Master dictionaries and codes"
          icon={Layers}
          variant="primary"
        />
        <SetupStatsCard
          title="Active Records"
          value={metrics.active}
          description="Operational in transaction forms"
          icon={CheckCircle2}
          variant="success"
        />
        <SetupStatsCard
          title="Inactive Records"
          value={metrics.inactive}
          description="Archived or deprecated rules"
          icon={XCircle}
          variant="neutral"
        />
        <SetupStatsCard
          title="Configuration Categories"
          value={metrics.categoriesCount}
          description="Governed organizational scopes"
          icon={FolderTree}
          variant="purple"
        />
      </div>

      {/* Master Data Category Quick Navigation Cards */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">Configuration Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {MASTER_CATEGORIES.map((category) => {
            const Icon = getCategoryIcon(category)
            const catStats = metrics.byCategory[category] || { total: 0, active: 0, inactive: 0 }

            return (
              <div
                key={category}
                onClick={() =>
                  navigate(
                    `/administration/setup/setup-master-data/overview?category=${encodeURIComponent(
                      category
                    )}`
                  )
                }
                className="bg-white rounded-lg border border-slate-200 p-3.5 hover:border-[#01458e] hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-md bg-blue-50 text-[#01458e] flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {catStats.total}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mb-1">{category}</h3>
                  <p className="text-[11px] text-slate-500">
                    {catStats.active} Active • {catStats.inactive} Inactive
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-[#01458e]">
                  <span>Browse Table</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Records Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Master Data Records</h2>
            <p className="text-xs text-slate-500">
              Synchronized organizational configuration dictionaries.
            </p>
          </div>
          <ActionButton
            variant="cancel"
            onClick={() => navigate('/administration/setup/setup-master-data/overview')}
            className="text-xs"
          >
            Open All Master Data
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </ActionButton>
        </div>

        <DataTable
          columns={columns}
          rows={recentRecords}
          rowKey="id"
          total={recentRecords.length}
          emptyMessage="No configuration records found."
        />
      </div>
          </>
        }
      />

      <SetupRecordDetailModal
        isOpen={isDetailModalOpen}
        record={selectedRecord}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={(item) => openEditModal(item)}
      />

    </SetupModuleLayout>
  )
}
