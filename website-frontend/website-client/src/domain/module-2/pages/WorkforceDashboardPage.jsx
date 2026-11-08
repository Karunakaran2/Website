import { useCallback, useMemo, useState } from 'react'
import { Users, ListTodo, CalendarOff, AlertTriangle } from 'lucide-react'
import HrmsStatsCard from '../hrms/components/HrmsStatsCard'
import TaskStatsCard from '../tasks/components/TaskStatsCard'
import { useHrms } from '../hrms/hooks/useHrms'
import { useTaskManagement } from '../tasks/hooks/useTaskManagement'
import { workforceCaseService } from '../services/workforceCaseService'
import { useListPageHeaderActions } from '@/shared/hooks/useListPageHeaderActions'
import { PageContentToolbar, PageToolbarSearchInput } from '@/shared/components/page'
import { exportSimpleCsv } from '@/shared/utils/exportSimpleCsv'
import { showAppToast } from '@/shared/components'

export default function WorkforceDashboardPage() {
  const { stats: hrmsStats } = useHrms()
  const { stats: taskStats } = useTaskManagement()
  const [search, setSearch] = useState('')
  const openCases = useMemo(
    () => workforceCaseService.getAll().filter((c) => c.status !== 'Closed').length,
    [],
  )

  const summaryRows = useMemo(
    () => [
      { metric: 'Employees', value: String(hrmsStats.total), detail: `${hrmsStats.active} active` },
      { metric: 'On Leave Today', value: String(hrmsStats.onLeave), detail: 'Approved leave' },
      {
        metric: 'Open Tasks',
        value: String(taskStats.todo + taskStats.inProgress),
        detail: `${taskStats.completed} completed`,
      },
      { metric: 'Open Cases', value: String(openCases), detail: 'Active queue' },
    ],
    [hrmsStats, taskStats, openCases],
  )

  const filteredSummary = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return summaryRows
    return summaryRows.filter(
      (row) =>
        row.metric.toLowerCase().includes(q) ||
        row.detail.toLowerCase().includes(q),
    )
  }, [summaryRows, search])

  const handleExport = useCallback(() => {
    const ok = exportSimpleCsv(
      filteredSummary,
      [
        { key: 'metric', header: 'Metric' },
        { key: 'value', header: 'Value' },
        { key: 'detail', header: 'Detail' },
      ],
      'module-2-dashboard.csv',
    )
    if (ok) showAppToast('Export prepared successfully.', 'success', { action: 'export' })
    else showAppToast('Nothing to export.', 'warning')
  }, [filteredSummary])

  useListPageHeaderActions({
    onExport: handleExport,
  })

  const cards = useMemo(() => {
    const show = (label) =>
      !search.trim() || label.toLowerCase().includes(search.trim().toLowerCase())
    return [
      show('Employees') ? (
        <HrmsStatsCard
          key="employees"
          title="Employees"
          value={hrmsStats.total}
          description={`${hrmsStats.active} active · Directory`}
          icon={Users}
        />
      ) : null,
      show('On leave') ? (
        <HrmsStatsCard
          key="leave"
          title="On Leave Today"
          value={hrmsStats.onLeave}
          description="Approved leave"
          icon={CalendarOff}
        />
      ) : null,
      show('Open tasks') ? (
        <TaskStatsCard
          key="tasks"
          title="Open Tasks"
          value={taskStats.todo + taskStats.inProgress}
          description={`${taskStats.completed} completed · Task board`}
          icon={ListTodo}
        />
      ) : null,
      show('Open cases') ? (
        <HrmsStatsCard
          key="cases"
          title="Open Cases"
          value={openCases}
          description="Active case queue"
          icon={AlertTriangle}
        />
      ) : null,
    ].filter(Boolean)
  }, [hrmsStats, taskStats, openCases, search])

  return (
    <div className="space-y-5">
      <PageContentToolbar>
        <PageToolbarSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search metrics…"
          className="min-w-[200px] flex-1 sm:max-w-[280px]"
        />
      </PageContentToolbar>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {cards.length > 0 ? (
          cards
        ) : (
          <p className="col-span-full text-sm text-slate-600 m-0">No metrics match your search.</p>
        )}
      </div>
    </div>
  )
}
