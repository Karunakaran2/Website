import { useCallback, useMemo, useState } from 'react'
import SampleModuleLayout from '../layouts/SampleModuleLayout'
import { useSampleModuleData } from '../hooks/useSampleModuleData'
import StatusChip from '@/shared/components/status/StatusChip'
import { useListPageHeaderActions } from '@/shared/hooks/useListPageHeaderActions'
import { PageContentToolbar, PageToolbarSearchInput } from '@/shared/components/page'
import { exportSimpleCsv } from '@/shared/utils/exportSimpleCsv'
import { showAppToast } from '@/shared/components'

export default function Module1ActivityPage() {
  const { activityLogs } = useSampleModuleData()
  const [search, setSearch] = useState('')

  const filteredLogs = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return activityLogs
    return activityLogs.filter(
      (log) =>
        log.action?.toLowerCase().includes(q) ||
        log.details?.toLowerCase().includes(q) ||
        log.user?.toLowerCase().includes(q),
    )
  }, [activityLogs, search])

  const handleExport = useCallback(() => {
    const ok = exportSimpleCsv(
      filteredLogs.map((log) => ({
        timestamp: log.timestamp,
        user: log.user,
        action: log.action,
        details: log.details,
      })),
      [
        { key: 'timestamp', header: 'Timestamp' },
        { key: 'user', header: 'User' },
        { key: 'action', header: 'Action' },
        { key: 'details', header: 'Details' },
      ],
      'activity.csv',
    )
    if (ok) showAppToast('Export prepared successfully.', 'success', { action: 'export' })
    else showAppToast('No activity to export.', 'warning')
  }, [filteredLogs])

  useListPageHeaderActions({
    onExport: handleExport,
  })

  return (
    <SampleModuleLayout>
      <PageContentToolbar>
        <PageToolbarSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search activity…"
          className="min-w-[200px] flex-1 sm:max-w-[280px]"
        />
      </PageContentToolbar>
      <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
        {filteredLogs.length === 0 ? (
          <li className="p-4 text-sm text-slate-600">No recent activity to display.</li>
        ) : (
          filteredLogs.slice(0, 50).map((log) => (
            <li key={log.id} className="flex flex-wrap items-center gap-2 px-4 py-3 text-[13px]">
              <span className="text-slate-500 tabular-nums">{log.timestamp}</span>
              <StatusChip label={log.action} status="info" />
              <span className="text-slate-800">{log.details}</span>
            </li>
          ))
        )}
      </ul>
    </SampleModuleLayout>
  )
}
