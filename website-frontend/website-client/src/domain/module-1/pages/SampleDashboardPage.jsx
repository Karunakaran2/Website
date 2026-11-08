import React, { useCallback, useMemo, useState } from 'react'
import {
  RefreshCw,
  FolderKanban,
  CheckCircle2,
  Clock,
  IndianRupee,
  Eye,
  AlertTriangle,
  FileText,
  Activity,
  Layers,
} from 'lucide-react'
import SampleModuleLayout from '../layouts/SampleModuleLayout'
import { GIGW_ADD_ICON, GigwButton } from '@/shared/components/buttons/gigw'
import SampleSectionHeader from '../components/SampleSectionHeader'
import SampleMetricCard from '../components/SampleMetricCard'
import {
  SAMPLE_CATEGORY_OPTIONS,
  SAMPLE_STATUS_OPTIONS,
} from '../constants/sampleModuleConstants'
import { useListPageHeaderActions } from '@/shared/hooks/useListPageHeaderActions'
import { PageContentToolbar, PageToolbarGigwButton, PageToolbarSelect } from '@/shared/components/page'
import { exportTableCsv } from '@/shared/utils/exportTableCsv'
import { showAppToast } from '@/shared/components'
import SampleRecordDetailModal from '../components/SampleRecordDetailModal'
import SampleRecordForm, { sampleRecordFormTitle } from '../components/SampleRecordForm'
import { DomainListWithFormModal } from '@/shared/components/domain'
import { useSampleModuleData } from '../hooks/useSampleModuleData'
import { formatINR, formatDate } from '../utils/sampleModuleUtils'
import StatusChip from '@/shared/components/status/StatusChip'
import { TableViewAction } from '@/shared/components/buttons'
import TableRowActionsGroup from '@/shared/components/buttons/TableRowActionsGroup'
import { dataTableActionColumn, dataTableColumn } from '@/shared/utils/buildDataTableColumn'
import { TABLE_ACTION_COLUMN_CLASS } from '@/shared/components/listing/listingTableStyles'
import DataTable from '@/shared/components/DataTable'
import {
  DashboardMetricsSkeleton,
  SkeletonRegion,
  TableSkeleton,
} from '@/shared/components/skeleton'

export default function SampleDashboardPage() {
  const {
    records,
    activityLogs,
    filteredRecords,
    paginatedRecords,
    metrics,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    selectedCategory,
    setSelectedCategory,
    resetFilters,
    page,
    setPage,
    pageSize,
    setPageSize,
    // Modals
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
    // Demo State Toggles
    isLoading,
    setIsLoading,
    hasError,
    setHasError,
  } = useSampleModuleData()

  // State toggle helpers for live testing
  const toggleLoading = () => setIsLoading((prev) => !prev)
  const toggleError = () => setHasError((prev) => !prev)

  const exportColumns = useMemo(
    () => [
      { id: 'code', header: 'Code', accessor: 'code' },
      { id: 'title', header: 'Project Title', accessor: 'title' },
      { id: 'category', header: 'Category', accessor: 'category' },
      { id: 'amount', header: 'Budget', accessor: 'amount' },
      { id: 'status', header: 'Status', accessor: 'status' },
    ],
    [],
  )

  const dashboardTableColumns = useMemo(
    () => [
      dataTableColumn({
        id: 'code',
        minWidth: 90,
        pinned: true,
        cell: (item) => <span className="font-mono font-bold text-[#01458e]">{item.code}</span>,
      }),
      dataTableColumn({
        id: 'title',
        header: 'Project Title',
        minWidth: 180,
        cell: (item) => (
          <span className="block max-w-xs truncate font-semibold text-slate-900">{item.title}</span>
        ),
      }),
      dataTableColumn({ id: 'category', minWidth: 130, hideable: true }),
      dataTableColumn({
        id: 'amount',
        header: 'Budget (₹)',
        headerTitleCase: false,
        align: 'right',
        minWidth: 110,
        cell: (item) => <span className="font-medium text-slate-900">{formatINR(item.amount)}</span>,
      }),
      dataTableColumn({
        id: 'status',
        align: 'center',
        minWidth: 100,
        cell: (item) => <StatusChip label={item.status} />,
      }),
      dataTableActionColumn({
        headerClassName: TABLE_ACTION_COLUMN_CLASS,
        cell: (item) => (
          <TableRowActionsGroup
            items={[
              {
                key: 'view',
                label: 'View',
                render: () => (
                  <TableViewAction
                    onClick={() => openDetailModal(item)}
                    ariaLabel={`View ${item.code}`}
                  />
                ),
              },
            ]}
          />
        ),
      }),
    ],
    [openDetailModal],
  )

  const handleHeaderExport = useCallback(() => {
    const ok = exportTableCsv(filteredRecords, exportColumns, 'dashboard-projects.csv')
    if (ok) {
      showAppToast('Export prepared successfully.', 'success', { action: 'export' })
    } else {
      showAppToast('No records to export.', 'warning')
    }
  }, [filteredRecords, exportColumns])

  const pageToolbar = useMemo(
    () => (
      <>
        <PageToolbarSelect
          label="Category"
          name="dashboardCategory"
          value={selectedCategory}
          options={SAMPLE_CATEGORY_OPTIONS}
          onChange={(value) => {
            setSelectedCategory(value)
            setPage(1)
          }}
        />
        <PageToolbarGigwButton type="button" variant="primary" icon={GIGW_ADD_ICON} onClick={openCreateModal}>
          Create Project
        </PageToolbarGigwButton>
        <PageToolbarGigwButton type="button" variant="outlinePrimary" icon={RefreshCw} onClick={toggleLoading}>
          {isLoading ? 'Hide Loader' : 'Simulate Loader'}
        </PageToolbarGigwButton>
        <PageToolbarGigwButton type="button" variant="outlinePrimary" icon={AlertTriangle} onClick={toggleError}>
          {hasError ? 'Dismiss Error' : 'Simulate Error'}
        </PageToolbarGigwButton>
      </>
    ),
    [
      selectedCategory,
      setSelectedCategory,
      setPage,
      openCreateModal,
      toggleLoading,
      isLoading,
      toggleError,
      hasError,
    ],
  )

  useListPageHeaderActions({
    filterLabel: 'Status',
    filterValue: selectedStatus,
    filterOptions: SAMPLE_STATUS_OPTIONS,
    onFilterChange: (value) => {
      setSelectedStatus(value)
      setPage(1)
    },
    onExport: handleHeaderExport,
  })

  return (
    <SampleModuleLayout activeTab="dashboard">
      {/* Simulated Error State */}
      {!isFormModalOpen ? <PageContentToolbar>{pageToolbar}</PageContentToolbar> : null}

      {!isFormModalOpen && hasError && (
        <div className="mb-6 p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Simulated network error: Failed to sync the operational queue. Your local data is unchanged.
            </span>
          </div>
          <GigwButton
            type="button"
            variant="outlineUtility"
            size="sm"
            className="shrink-0 text-xs"
            onClick={() => setHasError(false)}
          >
            Dismiss
          </GigwButton>
        </div>
      )}

      <DomainListWithFormModal
        formOpen={isFormModalOpen}
        onCloseForm={() => setIsFormModalOpen(false)}
        modalTitle={sampleRecordFormTitle(formModalMode)}
        form={
          <SampleRecordForm
            mode={formModalMode}
            initialData={selectedRecord}
            onCancel={() => setIsFormModalOpen(false)}
            onSave={formModalMode === 'create' ? handleCreate : handleUpdate}
          />
        }
        list={
          <>
      {/* Simulated Loading Skeleton */}
      {isLoading ? (
        <SkeletonRegion message="Loading dashboard content" className="space-y-6">
          <DashboardMetricsSkeleton count={4} />
          <TableSkeleton rows={5} columns={6} />
        </SkeletonRegion>
      ) : (
        <>
          {/* Section 1: KPI Summary Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <SampleMetricCard
              title="Total Projects"
              value={metrics.totalCount}
              subtitle="All registered enterprise initiatives"
              icon={<FolderKanban className="w-5 h-5" />}
              trend={{ text: '+14% MoM', isPositive: true }}
              variant="default"
            />
            <SampleMetricCard
              title="Active Execution"
              value={metrics.activeCount}
              subtitle={`${metrics.completedCount} initiatives already completed`}
              icon={<CheckCircle2 className="w-5 h-5" />}
              trend={{ text: `${metrics.averageProgress}% Avg Progress`, isPositive: true }}
              variant="primary"
            />
            <SampleMetricCard
              title="Pending Approval"
              value={metrics.pendingCount}
              subtitle="Awaiting administrative sanction"
              icon={<Clock className="w-5 h-5" />}
              trend={{ text: '3 High Priority', isPositive: false }}
              variant="warning"
            />
            <SampleMetricCard
              title="Sanctioned Budget"
              value={formatINR(metrics.totalAmount)}
              subtitle="Total capital expenditure allocation"
              icon={<IndianRupee className="w-5 h-5" />}
              trend={{ text: 'FY 2026-27', isPositive: true }}
              variant="success"
            />
          </div>

          {/* Section 2: Main Workspace Grid (Table + Activity Feed) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left 2 Cols: Mini Data Table with Filter Panel */}
            <div className="lg:col-span-2">
              <SampleSectionHeader
                title="Active Project Records"
                icon={Layers}
                action={
                  <span className="text-xs font-semibold text-slate-600">
                    Showing {filteredRecords.length} records
                  </span>
                }
              >
                <DataTable
                  columns={dashboardTableColumns}
                  rows={paginatedRecords}
                  rowKey="id"
                  search={searchQuery}
                  onSearchChange={(value) => {
                    setSearchQuery(value)
                    setPage(1)
                  }}
                  page={page}
                  pageSize={pageSize}
                  total={filteredRecords.length}
                  onPageChange={setPage}
                  onPageSizeChange={setPageSize}
                  pageSizeOptions={[5, 10, 20]}
                  emptyMessage="No matching records found. Try clearing filters or search parameters."
                />
              </SampleSectionHeader>
            </div>

            <SampleSectionHeader
              title="Operational Activity"
              icon={Activity}
              action={<span className="text-[11px] font-medium text-slate-500">Real-time</span>}
            >
              <div className="space-y-3.5">
                {activityLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2.5 text-xs">
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#01458e]" />
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-slate-900">{log.user}</span>
                        <span className="shrink-0 text-[10px] text-slate-500">{log.timestamp}</span>
                      </div>
                      <p className="text-[11px] font-medium text-[#01458e]">{log.action}</p>
                      <p className="text-[11px] leading-snug text-slate-600">{log.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SampleSectionHeader>
          </div>
        </>
      )}
          </>
        }
      />

      <SampleRecordDetailModal
        isOpen={isDetailModalOpen}
        record={selectedRecord}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={(rec) => openEditModal(rec)}
      />

    </SampleModuleLayout>
  )
}
