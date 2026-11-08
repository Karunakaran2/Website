import { useState, useMemo, useCallback } from 'react'
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck, CheckSquare, RotateCcw, Layers } from 'lucide-react'
import SampleModuleLayout from '../layouts/SampleModuleLayout'
import SampleSectionHeader from '../components/SampleSectionHeader'
import DataTable from '@/shared/components/DataTable'
import StatusChip from '@/shared/components/status/StatusChip'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { TableRowActionsGroup } from '@/shared/components/buttons'
import { TABLE_ACTION_COLUMN_CLASS } from '@/shared/components/listing/listingTableStyles'
import { buildSampleQueueRowActions } from '../utils/buildSampleQueueRowActions'
import { confirmBeforeAction, useActionConfirm } from '@/shared/components/confirm'
import { showAppToast } from '@/shared/components'
import { SelectField } from '@/shared/components/forms'

const STATUS_FILTER_OPTIONS = [
  { value: 'All', label: 'All Statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Verified', label: 'Verified' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Draft', label: 'Draft' },
]

const INITIAL_QUEUE = [
  { id: 'SAN-2026-081', title: 'Solar Rooftop Grid Intertie Phase 2', department: 'Energy & Power Infrastructure', amount: '₹18,50,000', status: 'Pending', stage: 'Finance Scrutiny' },
  { id: 'SAN-2026-082', title: 'State Central Medical Oxygen Plant', department: 'Health & Family Welfare', amount: '₹95,00,000', status: 'Pending', stage: 'Technical Clearance' },
  { id: 'SAN-2026-083', title: 'District Road Widening & Culvert Works', department: 'Public Works & Roads', amount: '₹42,00,000', status: 'In Progress', stage: 'Supervisory Verification' },
  { id: 'SAN-2026-084', title: 'Secretariat High-Density Data Core', department: 'Information Technology', amount: '₹1,45,00,000', status: 'Verified', stage: 'Secretariat Endorsement' },
  { id: 'SAN-2026-085', title: 'Irrigation Canal Gate Modernization', department: 'Water Resources & Irrigation', amount: '₹28,00,000', status: 'Approved', stage: 'Disbursement Ready' },
  { id: 'SAN-2026-086', title: 'Municipal Solid Waste Sorting Facility', department: 'Local Self Government', amount: '₹64,50,000', status: 'Draft', stage: 'Initiation' },
]

export default function SampleActionsStatusPage() {
  const requestConfirm = useActionConfirm()
  const [queue, setQueue] = useState(INITIAL_QUEUE)
  const [selectedIds, setSelectedIds] = useState([])
  const [statusFilter, setStatusFilter] = useState('All')

  const filteredQueue = useMemo(() => {
    if (statusFilter === 'All') return queue
    return queue.filter((item) => item.status === statusFilter)
  }, [queue, statusFilter])

  const handleSingleAction = useCallback(
    (type, item) => {
      const isApprove = type === 'approve'
      confirmBeforeAction(requestConfirm, {
        action: isApprove ? 'approve' : 'reject',
        recordLabel: item.id,
        title: isApprove ? 'Approve Sanction Proposal' : 'Reject Sanction Proposal',
        message: `Execute ${type} for Proposal #${item.id}?`,
        description:
          'This will transition the proposal state and broadcast notification to the originating departmental desk.',
        runAction: async () => {
          await new Promise((resolve) => {
            setTimeout(resolve, 400)
          })
          const nextStatus = isApprove ? 'Approved' : 'Rejected'
          setQueue((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? {
                    ...i,
                    status: nextStatus,
                    stage: isApprove ? 'Sanctioned' : 'Rejected',
                  }
                : i,
            ),
          )
          showAppToast(`Proposal marked as ${nextStatus}.`, 'success', {
            action: isApprove ? 'approve' : 'reject',
          })
          return true
        },
      })
    },
    [requestConfirm],
  )

  const handleBatchAction = useCallback(
    (type) => {
      if (selectedIds.length === 0) {
        showAppToast('Select at least one proposal from the queue.', 'warning')
        return
      }
      const isBatchApprove = type === 'batch-approve'
      confirmBeforeAction(requestConfirm, {
        action: isBatchApprove ? 'approve' : 'verify',
        title: isBatchApprove ? 'Batch Sanction Approval' : 'Batch Verification',
        message: `Execute ${type} on ${selectedIds.length} selected proposals?`,
        description:
          'This will transition the proposal state and broadcast notification to the originating departmental desk.',
        runAction: async () => {
          await new Promise((resolve) => {
            setTimeout(resolve, 400)
          })
          const nextStatus = isBatchApprove ? 'Approved' : 'Verified'
          setQueue((prev) =>
            prev.map((i) => (selectedIds.includes(i.id) ? { ...i, status: nextStatus } : i)),
          )
          showAppToast(`${selectedIds.length} proposals updated.`, 'success', {
            action: isBatchApprove ? 'approve' : 'verify',
          })
          setSelectedIds([])
          return true
        },
      })
    },
    [requestConfirm, selectedIds],
  )

  const columns = useMemo(
    () => [
      {
        id: 'id',
        header: 'Sanction Ref',
        accessor: 'id',
        sortable: true,
        minWidth: 120,
        cell: (row) => <span className="font-mono font-bold text-[#01458e]">{row.id}</span>,
      },
      {
        id: 'title',
        header: 'Proposal Title',
        accessor: 'title',
        sortable: true,
        minWidth: 240,
        cell: (row) => <span className="font-semibold text-slate-900">{row.title}</span>,
      },
      {
        id: 'department',
        header: 'Department',
        accessor: 'department',
        sortable: true,
        minWidth: 180,
      },
      {
        id: 'amount',
        header: 'Amount (₹)',
        accessor: 'amount',
        align: 'right',
        sortable: true,
        minWidth: 130,
        cell: (row) => <span className="font-mono font-medium text-slate-900">{row.amount}</span>,
      },
      {
        id: 'stage',
        header: 'Workflow Stage',
        accessor: 'stage',
        sortable: true,
        minWidth: 160,
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
        header: 'Action',
        align: 'center',
        sortable: false,
        minWidth: 120,
        headerClassName: TABLE_ACTION_COLUMN_CLASS,
        cellClassName: TABLE_ACTION_COLUMN_CLASS,
        cell: (row) => {
          const items = buildSampleQueueRowActions(row, {
            onView: () => showAppToast('Opening proposal details.', 'info'),
            onApprove: () => handleSingleAction('approve', row),
            onReject: () => handleSingleAction('reject', row),
            onEdit: () => showAppToast('Opening draft editor.', 'info'),
          })
          if (!items.length) {
            return <span className="text-xs text-slate-400">—</span>
          }
          return <TableRowActionsGroup items={items} />
        },
      },
    ],
    [handleSingleAction],
  )

  return (
    <SampleModuleLayout activeTab="actions">
      <div className="space-y-6 w-full">
        {/* Batch Operations Bar */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              Selected Proposals: <strong className="text-slate-900 font-mono">{selectedIds.length}</strong> of {queue.length}
            </span>
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="text-xs text-slate-500 hover:text-slate-800 underline ml-2 cursor-pointer"
              >
                Clear selection
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <GigwButton
              type="button"
              variant="success"
              size="sm"
              icon={CheckCircle2}
              iconSize={14}
              disabled={selectedIds.length === 0}
              onClick={() => handleBatchAction('batch-approve')}
              className="text-xs"
            >
              Batch Approve ({selectedIds.length})
            </GigwButton>

            <GigwButton
              type="button"
              variant="primary"
              size="sm"
              icon={ShieldCheck}
              iconSize={14}
              disabled={selectedIds.length === 0}
              onClick={() => handleBatchAction('batch-verify')}
              className="text-xs"
            >
              Mark Verified ({selectedIds.length})
            </GigwButton>

            <GigwButton
              type="button"
              variant="outlineUtility"
              size="sm"
              icon={RotateCcw}
              iconSize={13}
              onClick={() => {
                confirmBeforeAction(requestConfirm, {
                  action: 'restore',
                  title: 'Reset queue',
                  message: 'Are you sure you want to reset the entered information?',
                  description: 'The queue will be restored to the initial demonstration list.',
                  runAction: async () => {
                    setQueue(INITIAL_QUEUE)
                    setSelectedIds([])
                    showAppToast('Queue restored to the initial list.', 'info')
                    return true
                  },
                  showSuccessToast: false,
                })
              }}
              className="text-xs"
            >
              Reset
            </GigwButton>
          </div>
        </div>

        <SampleSectionHeader
          title="Capital Sanctions Awaiting Action"
          icon={Layers}
          description="Select rows using checkboxes to execute batch state transitions."
          action={
            <SelectField
              name="queueStatusFilter"
              label="Filter Status"
              value={statusFilter}
              options={STATUS_FILTER_OPTIONS}
              onChange={(e) => setStatusFilter(e.target.value)}
              wrapperClassName="mb-0 min-w-[140px] [&_label]:text-xs [&_label]:text-slate-500 [&_label]:font-normal"
            />
          }
        >
          <DataTable
            columns={columns}
            rows={filteredQueue}
            rowKey="id"
            selectable
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            emptyMessage="No sanction records match the filter criteria."
          />
        </SampleSectionHeader>
      </div>
    </SampleModuleLayout>
  )
}
