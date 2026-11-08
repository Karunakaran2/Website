import React, { useCallback, useMemo, useState } from 'react'
import { Clock, CheckCircle2, ListTodo, ArrowRight, User } from 'lucide-react'
import TaskLayout from '../layouts/TaskLayout'
import TaskForm, { taskFormTitle } from '../components/TaskForm'
import { DomainListWithFormModal } from '@/shared/components/domain'
import TaskDetailModal from '../components/TaskDetailModal'
import { useTaskManagement } from '../hooks/useTaskManagement'
import { GIGW_ADD_ICON, GigwButton } from '@/shared/components/buttons/gigw'
import { StatusChip } from '@/shared/components/status'
import { useListPageHeaderActions } from '@/shared/hooks/useListPageHeaderActions'
import { PageContentToolbar, PageToolbarSearchInput } from '@/shared/components/page'
import { exportSimpleCsv } from '@/shared/utils/exportSimpleCsv'
import { showAppToast } from '@/shared/components'

export default function TaskBoardPage() {
  const [search, setSearch] = useState('')
  const {
    tasks,
    isFormModalOpen,
    isDetailModalOpen,
    formMode,
    selectedTask,
    notification,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleCloseModals,
    handleSaveTask,
    handleUpdateStatus,
  } = useTaskManagement()

  const columns = [
    { id: 'To Do', title: 'To Do', icon: ListTodo, color: 'text-slate-700 bg-slate-100 border-slate-300' },
    { id: 'In Progress', title: 'In Progress', icon: Clock, color: 'text-blue-700 bg-blue-100 border-blue-300' },
    { id: 'Completed', title: 'Completed', icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-100 border-emerald-300' },
  ]

  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return tasks
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q),
    )
  }, [tasks, search])

  const handleExport = useCallback(() => {
    const ok = exportSimpleCsv(
      filteredTasks.map((t) => ({
        id: t.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        assignee: t.assignee,
      })),
      [
        { key: 'id', header: 'Task ID' },
        { key: 'title', header: 'Title' },
        { key: 'status', header: 'Status' },
        { key: 'priority', header: 'Priority' },
        { key: 'assignee', header: 'Assignee' },
      ],
      'tasks-board.csv',
    )
    if (ok) showAppToast('Export prepared successfully.', 'success', { action: 'export' })
    else showAppToast('No tasks to export.', 'warning')
  }, [filteredTasks])

  useListPageHeaderActions({
    onExport: handleExport,
  })

  return (
    <TaskLayout notification={notification}>
      {!isFormModalOpen ? (
        <PageContentToolbar>
          <PageToolbarSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search tasks…"
            className="min-w-[200px] flex-1 sm:max-w-[280px]"
          />
          <GigwButton type="button" variant="primary" icon={GIGW_ADD_ICON} onClick={handleOpenCreate}>
            New Task
          </GigwButton>
        </PageContentToolbar>
      ) : null}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id)
          const ColIcon = col.icon

          return (
            <div key={col.id} className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 flex flex-col">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <ColIcon size={16} className="text-slate-500" />
                  <h2 className="font-bold text-xs uppercase tracking-wider text-slate-700">{col.title}</h2>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${col.color}`}>
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto min-h-[300px]">
                {colTasks.length === 0 ? (
                  <div className="text-center py-10 text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
                    No tasks in {col.title}
                  </div>
                ) : (
                  colTasks.map((t) => (
                    <div
                      key={t.id}
                      className="rounded-lg border border-slate-200 bg-white p-4 shadow-none hover:border-[#01458e]/40 hover:shadow-xs transition cursor-pointer group"
                      onClick={() => handleOpenDetail(t)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-[#01458e]">{t.id}</span>
                        <StatusChip label={t.priority} />
                      </div>

                      <h3 className="font-semibold text-sm text-slate-900 mb-1 group-hover:text-[#01458e] transition">
                        {t.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                        {t.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <span className="flex items-center gap-1.5 text-slate-600">
                          <User size={13} className="text-slate-400" />
                          {t.assignee}
                        </span>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition text-[#01458e] font-medium">
                          <span>Details</span>
                          <ArrowRight size={12} />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
          </div>
        }
      />

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
