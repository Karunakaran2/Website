import { useCallback, useMemo, useState } from 'react'
import SampleModuleLayout from '../layouts/SampleModuleLayout'
import SampleMetricCard from '../components/SampleMetricCard'
import SampleSectionHeader from '../components/SampleSectionHeader'
import { useSampleModuleData } from '../hooks/useSampleModuleData'
import { formatINR, formatDate } from '../utils/sampleModuleUtils'
import StatusChip from '@/shared/components/status/StatusChip'
import DataTable from '@/shared/components/DataTable'
import { Clock, FileText, AlertCircle, Activity } from 'lucide-react'
import { useListPageHeaderActions } from '@/shared/hooks/useListPageHeaderActions'
import { exportTableCsv } from '@/shared/utils/exportTableCsv'
import { showAppToast } from '@/shared/components'
import { dataTableColumn } from '@/shared/utils/buildDataTableColumn'

export default function SampleMyWorkPage() {
  const { records, activityLogs, demoCurrentUser } = useSampleModuleData()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const myRecords = useMemo(
    () => records.filter((r) => r.assignee === demoCurrentUser),
    [records, demoCurrentUser],
  )

  const openItems = myRecords.filter((r) =>
    ['Draft', 'Returned', 'Submitted', 'Under Review'].includes(r.applicationStatus),
  )

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return myRecords
    return myRecords.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q),
    )
  }, [myRecords, search])

  const columns = useMemo(
    () => [
      dataTableColumn({ id: 'code', header: 'Reference' }),
      dataTableColumn({ id: 'title' }),
      dataTableColumn({
        id: 'applicationStatus',
        header: 'Status',
        align: 'center',
        cell: (row) => <StatusChip label={row.applicationStatus} />,
      }),
      dataTableColumn({ id: 'dueDate', header: 'Due', cell: (row) => formatDate(row.dueDate) }),
      dataTableColumn({
        id: 'amount',
        align: 'right',
        format: 'currency',
        cell: (row) => formatINR(row.amount),
      }),
    ],
    [],
  )

  const tableRows = useMemo(
    () => filteredRows.slice((page - 1) * pageSize, page * pageSize),
    [filteredRows, page, pageSize],
  )

  const handleExport = useCallback(() => {
    const ok = exportTableCsv(filteredRows, columns, 'my-work.csv')
    if (ok) showAppToast('Export prepared successfully.', 'success', { action: 'export' })
    else showAppToast('No records to export.', 'warning')
  }, [filteredRows, columns])

  useListPageHeaderActions({
    onExport: handleExport,
  })

  return (
    <SampleModuleLayout>
      <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SampleMetricCard
          title="Assigned to me"
          value={String(myRecords.length)}
          icon={<FileText className="h-5 w-5" aria-hidden />}
          variant="primary"
        />
        <SampleMetricCard
          title="Open items"
          value={String(openItems.length)}
          icon={<Clock className="h-5 w-5" aria-hidden />}
          variant="warning"
        />
        <SampleMetricCard
          title="Needs correction"
          value={String(myRecords.filter((r) => r.applicationStatus === 'Returned').length)}
          icon={<AlertCircle className="h-5 w-5" aria-hidden />}
          variant="warning"
        />
      </div>
      <SampleSectionHeader
        title="Assigned Work Items"
        icon={FileText}
      >
        <DataTable
          columns={columns}
          rows={tableRows}
          rowKey="id"
          search={search}
          onSearchChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
          page={page}
          pageSize={pageSize}
          total={filteredRows.length}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setPage(1)
          }}
          emptyMessage="No work items are assigned to you."
        />
      </SampleSectionHeader>
      <SampleSectionHeader title="Recent Activity" icon={Activity} sectionId="my-work-activity">
        <ul className="space-y-2 text-xs text-slate-700">
          {activityLogs.slice(0, 6).map((log) => (
            <li key={log.id} className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2">
              <span className="font-semibold text-slate-900">{log.action}</span> — {log.details}
              <span className="mt-0.5 block text-[11px] text-slate-500">{log.timestamp}</span>
            </li>
          ))}
        </ul>
      </SampleSectionHeader>
      </div>
    </SampleModuleLayout>
  )
}
