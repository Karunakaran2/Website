import React, { useCallback, useMemo, useState } from 'react'
import {
  Users,
  UserCheck,
  CalendarOff,
  Building2,
} from 'lucide-react'
import HrmsLayout from '../layouts/HrmsLayout'
import HrmsStatsCard from '../components/HrmsStatsCard'
import { HRMS_DEPARTMENTS, HRMS_STATUS_OPTIONS } from '../constants/hrmsConstants'
import { useListPageHeaderActions } from '@/shared/hooks/useListPageHeaderActions'
import { PageContentToolbar, PageToolbarSelect } from '@/shared/components/page'
import { stringsToSelectOptions } from '@/shared/utils/selectOptionUtils'
import { exportTableCsv } from '@/shared/utils/exportTableCsv'
import { showAppToast } from '@/shared/components'
import EmployeeForm, { employeeFormTitle } from '../components/EmployeeForm'
import { DomainListWithFormModal } from '@/shared/components/domain'
import EmployeeDetailModal from '../components/EmployeeDetailModal'
import { useHrms } from '../hooks/useHrms'
import { DataTable } from '@/shared/components'
import { TableRowActionsGroup } from '@/shared/components/buttons'
import { buildStandardCrudRowActions } from '@/shared/utils/buildStandardCrudRowActions'
import { TABLE_ACTION_COLUMN_CLASS } from '@/shared/components/listing/listingTableStyles'
import { GIGW_ADD_ICON, GigwButton } from '@/shared/components/buttons/gigw'
import { StatusChip } from '@/shared/components/status'
import { confirmBeforeAction, useActionConfirm, useDeleteConfirm } from '@/shared/components/confirm'
import ModuleInnerCard from '@/shared/layouts/ModuleInnerCard'

export default function HrmsDirectoryPage() {
  const requestConfirm = useActionConfirm()
  const requestDelete = useDeleteConfirm()
  const {
    filteredEmployees,
    pagedEmployees,
    stats,
    search,
    department,
    status,
    currentPage,
    pageSize,
    isFormModalOpen,
    isDetailModalOpen,
    formMode,
    selectedEmployee,
    setSearch,
    setDepartment,
    setStatus,
    setCurrentPage,
    setPageSize,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleCloseModals,
    handleSaveEmployee,
    handleDeleteEmployee,
    handleResetFilters,
  } = useHrms()

  const [sort, setSort] = useState({ sortBy: null, sortDir: 'asc' })

  const confirmDeleteEmployee = useCallback(
    (row) => {
      if (!requestDelete) return
      requestDelete(
        async () => {
          handleDeleteEmployee(row.id)
          return true
        },
        {
          recordLabel: row.name,
          message: `Are you sure you want to delete the employee record for "${row.name}" (${row.id})? This action cannot be undone.`,
          showSuccessToast: false,
        },
      )
    },
    [handleDeleteEmployee, requestDelete],
  )

  const columns = useMemo(
    () => [
      {
        id: '_serial',
        header: '#',
        accessor: '_serial',
        sortable: false,
        align: 'center',
        minWidth: 44,
      },
      {
        id: 'name',
        header: 'Employee',
        accessor: 'name',
        sortable: true,
        minWidth: 200,
        cell: (row) => (
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${row.avatarColor || 'bg-sky-100 text-[#01458e]'}`}
            >
              {row.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-slate-900 block truncate">{row.name}</span>
              <span className="text-xs text-slate-500 block truncate">{row.email}</span>
            </div>
          </div>
        ),
      },
      {
        id: 'id',
        header: 'ID',
        accessor: 'id',
        sortable: true,
        minWidth: 90,
        cell: (row) => <span className="font-mono text-xs text-slate-600">{row.id}</span>,
      },
      {
        id: 'department',
        header: 'Department',
        accessor: 'department',
        sortable: true,
        minWidth: 140,
      },
      {
        id: 'designation',
        header: 'Designation',
        accessor: 'designation',
        sortable: true,
        minWidth: 150,
      },
      {
        id: 'joiningDate',
        header: 'Joining Date',
        accessor: 'joiningDate',
        sortable: true,
        minWidth: 110,
      },
      {
        id: 'status',
        header: 'Status',
        accessor: 'status',
        sortable: true,
        align: 'center',
        minWidth: 90,
        cell: (row) => <StatusChip label={row.status} />,
      },
      {
        id: 'action',
        header: 'Action',
        sortable: false,
        align: 'center',
        minWidth: 100,
        headerClassName: TABLE_ACTION_COLUMN_CLASS,
        cellClassName: TABLE_ACTION_COLUMN_CLASS,
        cell: (row) => (
          <TableRowActionsGroup
            items={buildStandardCrudRowActions({
              rowKey: row.id,
              onView: () => handleOpenDetail(row),
              onEdit: () => handleOpenEdit(row),
              onDelete: () => confirmDeleteEmployee(row),
              viewAriaLabel: `View details for ${row.name}`,
              editAriaLabel: `Edit ${row.name}`,
              deleteAriaLabel: `Delete ${row.name}`,
            })}
          />
        ),
      },
    ],
    [confirmDeleteEmployee, handleOpenDetail, handleOpenEdit],
  )

  const sortedAndPagedEmployees = useMemo(() => {
    let result = [...filteredEmployees]
    if (sort.sortBy) {
      result.sort((a, b) => {
        const valA = a[sort.sortBy] ?? ''
        const valB = b[sort.sortBy] ?? ''
        const cmp = String(valA).localeCompare(String(valB))
        return sort.sortDir === 'desc' ? -cmp : cmp
      })
    }
    const start = (currentPage - 1) * pageSize
    return result.slice(start, start + pageSize).map((emp, idx) => ({
      ...emp,
      _serial: start + idx + 1,
    }))
  }, [filteredEmployees, sort, currentPage, pageSize])

  const handleExport = useCallback(() => {
    const ok = exportTableCsv(filteredEmployees, columns, 'employees.csv')
    if (ok) {
      showAppToast('Export prepared successfully.', 'success', { action: 'export' })
    } else {
      showAppToast('No records to export.', 'warning')
    }
  }, [filteredEmployees, columns])

  const hrmsDeptOptions = useMemo(() => stringsToSelectOptions(HRMS_DEPARTMENTS), [])
  const hrmsStatusOptions = useMemo(() => stringsToSelectOptions(HRMS_STATUS_OPTIONS), [])

  const pageToolbar = useMemo(
    () => (
      <>
        <PageToolbarSelect
          label="Department"
          name="hrmsToolbarDept"
          value={department}
          options={hrmsDeptOptions}
          onChange={(value) => {
            setDepartment(value)
            setCurrentPage(1)
          }}
        />
        <PageToolbarSelect
          label="Status"
          name="hrmsToolbarStatus"
          value={status}
          options={hrmsStatusOptions}
          onChange={(value) => {
            setStatus(value)
            setCurrentPage(1)
          }}
          minWidth="min-w-[100px]"
        />
        <GigwButton type="button" variant="primary" icon={GIGW_ADD_ICON} onClick={handleOpenCreate}>
          Add Employee
        </GigwButton>
      </>
    ),
    [department, status, hrmsDeptOptions, hrmsStatusOptions, setDepartment, setStatus, setCurrentPage, handleOpenCreate],
  )

  useListPageHeaderActions({
    onExport: handleExport,
  })

  return (
    <HrmsLayout>
      {!isFormModalOpen ? <PageContentToolbar>{pageToolbar}</PageContentToolbar> : null}
      <DomainListWithFormModal
        formOpen={isFormModalOpen}
        onCloseForm={handleCloseModals}
        modalTitle={employeeFormTitle(formMode, selectedEmployee)}
        form={
          <EmployeeForm
            mode={formMode}
            initialData={selectedEmployee}
            onCancel={handleCloseModals}
            onSave={handleSaveEmployee}
          />
        }
        list={
          <>
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <HrmsStatsCard
          title="Total Employees"
          value={stats.total}
          description="Total workforce records"
          icon={Users}
          variant="primary"
        />
        <HrmsStatsCard
          title="Active Employees"
          value={stats.active}
          description="Currently available"
          icon={UserCheck}
          variant="success"
        />
        <HrmsStatsCard
          title="On Leave"
          value={stats.onLeave}
          description="Approved planned leaves"
          icon={CalendarOff}
          variant="warning"
        />
        <HrmsStatsCard
          title="Departments"
          value={stats.departmentsCount}
          description="Active organizational units"
          icon={Building2}
          variant="purple"
        />
      </div>

      <ModuleInnerCard title="Employee directory" sectionId="hrms-directory-list">
        <DataTable
          columns={columns}
          rows={sortedAndPagedEmployees}
          rowKey="id"
          search={search}
          onSearchChange={(value) => {
            setSearch(value)
            setCurrentPage(1)
          }}
          page={currentPage}
          pageSize={pageSize}
          total={filteredEmployees.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            if (setPageSize) setPageSize(newSize)
            setCurrentPage(1)
          }}
          sort={sort}
          onSortChange={setSort}
          emptyMessage="No employees matched your filter criteria."
        />
      </ModuleInnerCard>
          </>
        }
      />

      {/* Detail Modal */}
      <EmployeeDetailModal
        isOpen={isDetailModalOpen}
        employee={selectedEmployee}
        onClose={handleCloseModals}
        onEdit={(emp) => {
          handleCloseModals()
          handleOpenEdit(emp)
        }}
      />

    </HrmsLayout>
  )
}
