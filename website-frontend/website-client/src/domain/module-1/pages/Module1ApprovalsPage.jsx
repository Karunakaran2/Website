import { useCallback, useMemo, useState } from 'react'
import { useDashboardNav } from '@/app/shell/hooks/useDashboardNav'
import SampleModuleLayout from '../layouts/SampleModuleLayout'
import SampleRecordDetailModal from '../components/SampleRecordDetailModal'
import { useSampleModuleData } from '../hooks/useSampleModuleData'
import { formatINR, formatDate } from '../utils/sampleModuleUtils'
import { buildApplicationApprovalRowActions } from '../utils/buildApplicationApprovalRowActions'
import StatusChip from '@/shared/components/status/StatusChip'
import DataTable from '@/shared/components/DataTable'
import { dataTableActionColumn, dataTableColumn } from '@/shared/utils/buildDataTableColumn'
import TableRowActionsGroup from '@/shared/components/buttons/TableRowActionsGroup'
import { TableViewAction } from '@/shared/components/buttons'
import { sampleModuleService } from '../services/sampleModuleService'
import { confirmBeforeAction } from '@/shared/components/confirm'
import { useActionConfirm } from '@/shared/components/confirm'
import { showAppToast } from '@/shared/components'
import { useListPageHeaderActions } from '@/shared/hooks/useListPageHeaderActions'
import { exportTableCsv } from '@/shared/utils/exportTableCsv'

const APPROVAL_MODES = {
  'my-pending': {
    emptyMessage: 'No applications pending your approval.',
    filter: (r) => ['Submitted', 'Under Review'].includes(r.applicationStatus),
  },
  'team-queue': {
    emptyMessage: 'The team approval queue is empty.',
    filter: (r) =>
      ['Submitted', 'Under Review'].includes(r.applicationStatus) &&
      r.assignee !== 'Current User',
  },
  history: {
    emptyMessage: 'No completed approval decisions yet.',
    filter: (r) => ['Approved', 'Rejected'].includes(r.applicationStatus),
  },
  returned: {
    emptyMessage: 'No items returned for correction.',
    filter: (r) => r.applicationStatus === 'Returned',
  },
  escalations: {
    emptyMessage: 'No escalated approvals.',
    filter: (r) =>
      ['Submitted', 'Under Review'].includes(r.applicationStatus) &&
      (r.priority === 'Critical' || r.priority === 'High'),
  },
}

function SummaryCard({ label, value, hint }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-none">
      <p className="m-0 text-[12px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="m-0 mt-1 text-xl font-bold text-[#01458e]">{value}</p>
      {hint ? <p className="m-0 mt-1 text-[12px] text-slate-600">{hint}</p> : null}
    </div>
  )
}

export default function Module1ApprovalsPage() {
  const { activeSecondaryId } = useDashboardNav()
  const modeKey = APPROVAL_MODES[activeSecondaryId] ? activeSecondaryId : 'my-pending'
  const mode = APPROVAL_MODES[modeKey]

  const requestConfirm = useActionConfirm()
  const {
    records,
    syncFromService,
    openDetailModal,
    isDetailModalOpen,
    setIsDetailModalOpen,
    selectedRecord,
  } = useSampleModuleData()

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const queue = useMemo(() => records.filter(mode.filter), [records, mode])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return queue
    return queue.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q) ||
        r.assignee.toLowerCase().includes(q),
    )
  }, [queue, search])

  const rows = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize],
  )

  const pendingCount = records.filter((r) =>
    ['Submitted', 'Under Review'].includes(r.applicationStatus),
  ).length

  const confirmReview = (row, action, tone = 'primary') => {
    const labels = {
      approve: 'Approve application',
      reject: 'Reject application',
      return: 'Return for correction',
      startReview: 'Start review',
    }
    confirmBeforeAction(requestConfirm, {
      action: action === 'reject' ? 'reject' : action === 'approve' ? 'approve' : 'save',
      title: labels[action] ?? 'Confirm',
      message: `${labels[action] ?? 'Update'} "${row.title}" (${row.code})?`,
      tone,
      runAction: async () => {
        const decision = action === 'startReview' ? 'startReview' : action
        const result = sampleModuleService.reviewApplication(row.id, decision)
        if (!result.ok) {
          showAppToast(result.message, 'error')
          return false
        }
        syncFromService()
        showAppToast('Application status updated.', 'success', {
          action: action === 'approve' ? 'approve' : action === 'reject' ? 'reject' : 'save',
        })
        return true
      },
    })
  }

  const columns = useMemo(() => {
    const viewOnly = (row) => (
      <TableRowActionsGroup
        items={[
          {
            key: 'view',
            label: 'View',
            render: () => (
              <TableViewAction
                onClick={() => openDetailModal(row)}
                ariaLabel={`View ${row.code}`}
              />
            ),
          },
        ]}
      />
    )

    return [
      dataTableColumn({ id: 'code', header: 'Application No.', sortable: true, minWidth: 110 }),
      dataTableColumn({ id: 'title', sortable: true, minWidth: 200 }),
      dataTableColumn({ id: 'assignee', header: 'Submitted By' }),
      dataTableColumn({
        id: 'applicationStatus',
        header: 'Status',
        align: 'center',
        cell: (row) => <StatusChip label={row.applicationStatus} />,
      }),
      dataTableColumn({
        id: 'amount',
        align: 'right',
        format: 'currency',
        cell: (row) => formatINR(row.amount),
      }),
      dataTableColumn({
        id: 'createdDate',
        header: 'Submitted',
        cell: (row) => formatDate(row.createdDate),
        minWidth: 110,
      }),
      dataTableActionColumn({
        cell: (row) => {
          const canAct = ['Submitted', 'Under Review'].includes(row.applicationStatus)
          if (!canAct) return viewOnly(row)
          return (
            <TableRowActionsGroup
              items={buildApplicationApprovalRowActions({
                row,
                onView: openDetailModal,
                onStartReview: (r) => confirmReview(r, 'startReview'),
                onApprove: (r) => confirmReview(r, 'approve', 'approve'),
                onReject: (r) => confirmReview(r, 'reject', 'danger'),
                onReturn: (r) => confirmReview(r, 'return'),
              })}
            />
          )
        },
      }),
    ]
  }, [openDetailModal, requestConfirm])

  const handleExport = useCallback(() => {
    const ok = exportTableCsv(filtered, columns, 'approvals.csv')
    if (ok) {
      showAppToast('Export prepared successfully.', 'success', { action: 'export' })
    } else {
      showAppToast('No records to export.', 'warning')
    }
  }, [filtered, columns])

  useListPageHeaderActions({
    onExport: handleExport,
  })

  return (
    <SampleModuleLayout>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard label="Pending Queue" value={pendingCount} hint="Submitted and under review" />
        <SummaryCard label="In This View" value={filtered.length} hint="Matching search" />
        <SummaryCard label="Assigned Approver" value="Current User" hint="Your queue" />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        rowKey="id"
        search={search}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
        }}
        page={page}
        pageSize={pageSize}
        total={filtered.length}
        onPageChange={setPage}
        onPageSizeChange={(n) => {
          setPageSize(n)
          setPage(1)
        }}
        emptyMessage={mode.emptyMessage}
      />

      <SampleRecordDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        record={selectedRecord}
      />
    </SampleModuleLayout>
  )
}
