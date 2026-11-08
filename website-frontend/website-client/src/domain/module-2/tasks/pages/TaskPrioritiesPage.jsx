import React, { useCallback, useMemo, useState } from 'react'
import { User, ChevronRight } from 'lucide-react'
import TaskLayout from '../layouts/TaskLayout'
import TaskDetailModal from '../components/TaskDetailModal'
import { useTaskManagement } from '../hooks/useTaskManagement'
import { StatusChip } from '@/shared/components/status'
import { useListPageHeaderActions } from '@/shared/hooks/useListPageHeaderActions'
import { PageContentToolbar, PageToolbarSearchInput } from '@/shared/components/page'
import { exportSimpleCsv } from '@/shared/utils/exportSimpleCsv'
import { showAppToast } from '@/shared/components'

export default function TaskPrioritiesPage() {
  const [search, setSearch] = useState('')
  const {
    tasks,
    selectedTask,
    isDetailModalOpen,
    handleOpenDetail,
    handleCloseModals,
    handleOpenEdit,
    handleUpdateStatus,
  } = useTaskManagement()

  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return tasks
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.priority.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q),
    )
  }, [tasks, search])

  const handleExport = useCallback(() => {
    const ok = exportSimpleCsv(
      filteredTasks.map((t) => ({
        id: t.id,
        title: t.title,
        priority: t.priority,
        status: t.status,
        assignee: t.assignee,
      })),
      [
        { key: 'id', header: 'Task ID' },
        { key: 'title', header: 'Title' },
        { key: 'priority', header: 'Priority' },
        { key: 'status', header: 'Status' },
        { key: 'assignee', header: 'Assignee' },
      ],
      'tasks-by-priority.csv',
    )
    if (ok) showAppToast('Export prepared successfully.', 'success', { action: 'export' })
    else showAppToast('No tasks to export.', 'warning')
  }, [filteredTasks])

  useListPageHeaderActions({
    onExport: handleExport,
  })

  const priorityGroups = [
    {
      level: 'High',
      description: 'Critical path tasks requiring immediate attention or unblocking dependencies.',
    },
    {
      level: 'Medium',
      description: 'Important milestone deliveries and feature enhancements for current sprint.',
    },
    {
      level: 'Low',
      description: 'Nice-to-have optimizations, minor refactors, and future polish items.',
    },
  ]

  return (
    <TaskLayout>
      <PageContentToolbar>
        <PageToolbarSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search tasks…"
          className="min-w-[200px] flex-1 sm:max-w-[280px]"
        />
      </PageContentToolbar>
      <div className="space-y-5">
        {priorityGroups.map((group) => {
          const groupTasks = filteredTasks.filter((t) => t.priority === group.level)

          return (
            <div key={group.level} className="rounded-lg border border-slate-200 bg-white p-5 shadow-none">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <StatusChip label={`${group.level} Priority`} />
                    <span className="text-xs text-slate-500 font-semibold">
                      ({groupTasks.length} {groupTasks.length === 1 ? 'task' : 'tasks'})
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{group.description}</p>
                </div>
              </div>

              {groupTasks.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No tasks in this priority category.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {groupTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => handleOpenDetail(t)}
                      className="py-2.5 flex items-center justify-between gap-4 hover:bg-slate-50 px-2 rounded-md transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-xs font-bold text-[#01458e] shrink-0">{t.id}</span>
                        <span className="text-sm font-medium text-slate-900 truncate">{t.title}</span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 text-xs">
                        <span className="hidden md:inline-flex items-center gap-1 text-slate-500">
                          <User size={13} className="text-slate-400" />
                          {t.assignee}
                        </span>
                        <StatusChip label={t.status} />
                        <ChevronRight size={14} className="text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

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
