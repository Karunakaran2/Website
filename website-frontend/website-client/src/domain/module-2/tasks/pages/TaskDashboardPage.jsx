import React, { useCallback, useMemo, useState } from 'react'
import {
  CheckSquare,
  ListTodo,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import TaskLayout from '../layouts/TaskLayout'
import TaskStatsCard from '../components/TaskStatsCard'
import {
  TASK_ASSIGNEES,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
} from '../constants/taskConstants'
import { useListPageHeaderActions } from '@/shared/hooks/useListPageHeaderActions'
import { PageContentToolbar, PageToolbarSelect } from '@/shared/components/page'
import { exportTableCsv } from '@/shared/utils/exportTableCsv'
import { showAppToast } from '@/shared/components'
import TaskForm, { taskFormTitle } from '../components/TaskForm'
import { DomainListWithFormModal } from '@/shared/components/domain'
import TaskDetailModal from '../components/TaskDetailModal'
import { useTaskManagement } from '../hooks/useTaskManagement'
import { DataTable } from '@/shared/components'
import { TableRowActionsGroup } from '@/shared/components/buttons'
import { buildStandardCrudRowActions } from '@/shared/utils/buildStandardCrudRowActions'
import { TABLE_ACTION_COLUMN_CLASS } from '@/shared/components/listing/listingTableStyles'
import { GIGW_ADD_ICON, GigwButton } from '@/shared/components/buttons/gigw'
import { StatusChip } from '@/shared/components/status'
import { confirmBeforeAction, useActionConfirm, useDeleteConfirm } from '@/shared/components/confirm'
import ModuleInnerCard from '@/shared/layouts/ModuleInnerCard'

export default function TaskDashboardPage() {
  const requestConfirm = useActionConfirm()
  const requestDelete = useDeleteConfirm()
  const {
    filteredTasks,
    stats,
    search,
    status,
    priority,
    assignee,
    currentPage,
    pageSize,
    isFormModalOpen,
    isDetailModalOpen,
    formMode,
    selectedTask,
    notification,
    setSearch,
    setStatus,
    setPriority,
    setAssignee,
    setCurrentPage,
    setPageSize,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleCloseModals,
    handleSaveTask,
    handleUpdateStatus,
    handleDeleteTask,
    handleResetFilters,
  } = useTaskManagement()

  const [sort, setSort] = useState({ sortBy: null, sortDir: 'asc' })

  const confirmDeleteTask = useCallback(
    (row) => {
      if (!requestDelete) return
      requestDelete(
        async () => {
          handleDeleteTask(row.id)
          return true
        },
        {
          recordLabel: row.title,
          message: `Are you sure you want to delete task "${row.title}" (${row.id})? This action cannot be undone.`,
          showSuccessToast: false,
        },
      )
    },
    [handleDeleteTask, requestDelete],
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
        id: 'title',
        header: 'Task Name',
        accessor: 'title',
        sortable: true,
        minWidth: 220,
        cell: (row) => (
          <div
            className="cursor-pointer group min-w-0"
            onClick={() => handleOpenDetail(row)}
          >
            <span className="font-semibold text-slate-900 block truncate group-hover:text-[#01458e] group-hover:underline">
              {row.title}
            </span>
            <span className="text-xs text-slate-500 block truncate">{row.category || 'General'}</span>
          </div>
        ),
      },
      {
        id: 'id',
        header: 'Task ID',
        accessor: 'id',
        sortable: true,
        minWidth: 90,
        cell: (row) => <span className="font-mono text-xs text-slate-600">{row.id}</span>,
      },
      {
        id: 'priority',
        header: 'Priority',
        accessor: 'priority',
        sortable: true,
        align: 'center',
        minWidth: 90,
        cell: (row) => <StatusChip label={row.priority} />,
      },
      {
        id: 'status',
        header: 'Status',
        accessor: 'status',
        sortable: true,
        align: 'center',
        minWidth: 100,
        cell: (row) => <StatusChip label={row.status} />,
      },
      {
        id: 'assignee',
        header: 'Assignee',
        accessor: 'assignee',
        sortable: true,
        minWidth: 140,
      },
      {
        id: 'dueDate',
        header: 'Due Date',
        accessor: 'dueDate',
        sortable: true,
        minWidth: 110,
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
              onDelete: () => confirmDeleteTask(row),
              viewAriaLabel: `View task ${row.title}`,
              editAriaLabel: `Edit task ${row.title}`,
              deleteAriaLabel: `Delete task ${row.title}`,
            })}
          />
        ),
      },
    ],
    [confirmDeleteTask, handleOpenDetail, handleOpenEdit],
  )

  const sortedAndPagedTasks = useMemo(() => {
    let result = [...filteredTasks]
    if (sort.sortBy) {
      result.sort((a, b) => {
        const valA = a[sort.sortBy] ?? ''
        const valB = b[sort.sortBy] ?? ''
        const cmp = String(valA).localeCompare(String(valB))
        return sort.sortDir === 'desc' ? -cmp : cmp
      })
    }
    const start = (currentPage - 1) * pageSize
    return result.slice(start, start + pageSize).map((t, idx) => ({
      ...t,
      _serial: start + idx + 1,
    }))
  }, [filteredTasks, sort, currentPage, pageSize])

  const handleExport = useCallback(() => {
    const ok = exportTableCsv(filteredTasks, columns, 'tasks.csv')
    if (ok) {
      showAppToast('Export prepared successfully.', 'success', { action: 'export' })
    } else {
      showAppToast('No records to export.', 'warning')
    }
  }, [filteredTasks, columns])

  const statusFilterOptions = useMemo(
    () => TASK_STATUS_OPTIONS.map((opt) => ({ value: opt, label: opt })),
    [],
  )
  const priorityFilterOptions = useMemo(
    () => TASK_PRIORITY_OPTIONS.map((opt) => ({ value: opt, label: opt })),
    [],
  )
  const assigneeFilterOptions = useMemo(
    () => TASK_ASSIGNEES.map((opt) => ({ value: opt, label: opt })),
    [],
  )

  const pageToolbar = useMemo(
    () => (
      <>
        <PageToolbarSelect
          label="Status"
          name="taskHeaderStatus"
          value={status}
          options={statusFilterOptions}
          onChange={(value) => {
            setStatus(value)
            setCurrentPage(1)
          }}
          minWidth="min-w-[100px]"
        />
        <PageToolbarSelect
          label="Priority"
          name="taskHeaderPriority"
          value={priority}
          options={priorityFilterOptions}
          onChange={(value) => {
            setPriority(value)
            setCurrentPage(1)
          }}
          minWidth="min-w-[100px]"
        />
        <PageToolbarSelect
          label="Assignee"
          name="taskHeaderAssignee"
          value={assignee}
          options={assigneeFilterOptions}
          onChange={(value) => {
            setAssignee(value)
            setCurrentPage(1)
          }}
        />
        <GigwButton type="button" variant="primary" icon={GIGW_ADD_ICON} onClick={handleOpenCreate}>
          Create Task
        </GigwButton>
      </>
    ),
    [
      status,
      priority,
      assignee,
      statusFilterOptions,
      priorityFilterOptions,
      assigneeFilterOptions,
      setStatus,
      setPriority,
      setAssignee,
      setCurrentPage,
      handleOpenCreate,
    ],
  )

  useListPageHeaderActions({
    onExport: handleExport,
  })

  return (
    <TaskLayout notification={notification}>
      {!isFormModalOpen ? <PageContentToolbar>{pageToolbar}</PageContentToolbar> : null}
      <DomainListWithFormModal
        formOpen={isFormModalOpen}
        onCloseForm={handleCloseModals}
        modalTitle={taskFormTitle(formMode, selectedTask)}
        form={
          <TaskForm
            mode={formMode}
            initialData={selectedTask}
            onCancel={handleCloseModals}
            onSave={handleSaveTask}
          />
        }
        list={
          <>
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TaskStatsCard
          title="Total Tasks"
          value={stats.total ?? 0}
          description="Total work items logged"
          icon={ListTodo}
          variant="primary"
        />
        <TaskStatsCard
          title="To Do"
          value={stats.todo ?? 0}
          description="Awaiting assignment/start"
          icon={Clock}
          variant="neutral"
        />
        <TaskStatsCard
          title="In Progress"
          value={stats.inProgress ?? 0}
          description="Active delivery work"
          icon={CheckSquare}
          variant="info"
        />
        <TaskStatsCard
          title="Completed"
          value={stats.completed ?? 0}
          description="Verified finished items"
          icon={CheckCircle2}
          variant="success"
        />
      </div>

      <ModuleInnerCard title="Task register" sectionId="task-dashboard-list">
        <DataTable
          columns={columns}
          rows={sortedAndPagedTasks}
          rowKey="id"
          search={search}
          onSearchChange={(value) => {
            setSearch(value)
            setCurrentPage(1)
          }}
          page={currentPage}
          pageSize={pageSize}
          total={filteredTasks.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            if (setPageSize) setPageSize(newSize)
            setCurrentPage(1)
          }}
          sort={sort}
          onSortChange={setSort}
          emptyMessage="No tasks found matching your filter criteria."
        />
      </ModuleInnerCard>
          </>
        }
      />

      {/* Detail Modal */}
      <TaskDetailModal
        isOpen={isDetailModalOpen}
        task={selectedTask}
        onClose={handleCloseModals}
        onEdit={(tsk) => {
          handleCloseModals()
          handleOpenEdit(tsk)
        }}
        onStatusChange={handleUpdateStatus}
      />

    </TaskLayout>
  )
}
