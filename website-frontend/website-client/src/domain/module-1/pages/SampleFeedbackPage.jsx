import { useState } from 'react'
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  FileText,
  Download,
  Check,
  RotateCcw,
} from 'lucide-react'
import SampleModuleLayout from '../layouts/SampleModuleLayout'
import SampleSectionHeader from '../components/SampleSectionHeader'
import DataTable from '@/shared/components/DataTable'
import StatusChip from '@/shared/components/status/StatusChip'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { showAppToast } from '@/shared/components'
import { TABLE_ROW_ACTIONS_CLASS, TableViewAction } from '@/shared/components/buttons'
const BULLETINS = [
  {
    id: 'CIRC-2026-104',
    title: 'Advisory on Capital Expenditure Utilization for FY 2026-27 (Q3)',
    issuedBy: 'Principal Secretary (Finance)',
    date: '20-Oct-2026',
    category: 'Treasury Circular',
    priority: 'Urgent',
    acknowledged: false,
  },
  {
    id: 'CIRC-2026-103',
    title: 'Mandatory Electronic Invoicing for Contracts Exceeding ₹10 Lakhs',
    issuedBy: 'Commissioner of State Tax',
    date: '16-Oct-2026',
    category: 'Statutory Mandate',
    priority: 'High',
    acknowledged: true,
  },
  {
    id: 'CIRC-2026-102',
    title: 'Standard Operating Procedure: Physical Asset Verification & Tagging',
    issuedBy: 'Directorate of Fixed Assets & Estates',
    date: '10-Oct-2026',
    category: 'Operational Guidelines',
    priority: 'Medium',
    acknowledged: true,
  },
  {
    id: 'CIRC-2026-101',
    title: 'Quarterly Security Maintenance: Treasury Interconnect Gateway',
    issuedBy: 'State Information Technology Mission (KSITM)',
    date: '05-Oct-2026',
    category: 'System Notice',
    priority: 'Routine',
    acknowledged: true,
  },
]

export default function SampleFeedbackPage() {
  const [bulletins, setBulletins] = useState(BULLETINS)
  const [acknowledgedCount, setAcknowledgedCount] = useState(3)

  const handleAcknowledge = (id) => {
    setBulletins((prev) =>
      prev.map((b) => (b.id === id ? { ...b, acknowledged: true } : b))
    )
    setAcknowledgedCount((c) => c + 1)
    showAppToast(`Circular #${id} acknowledged and logged in user audit file.`, 'success', { action: 'save' })
  }

  const columns = [
    {
      id: 'id',
      header: 'Circular No.',
      accessor: 'id',
      sortable: true,
      minWidth: 130,
      cell: (row) => <span className="font-mono font-bold text-[#01458e]">{row.id}</span>,
    },
    {
      id: 'title',
      header: 'Subject & Executive Summary',
      accessor: 'title',
      sortable: true,
      minWidth: 280,
      cell: (row) => (
        <div>
          <span className="font-semibold text-slate-900 block">{row.title}</span>
          <span className="text-[11px] text-slate-500">Issued by: {row.issuedBy}</span>
        </div>
      ),
    },
    {
      id: 'category',
      header: 'Category',
      accessor: 'category',
      sortable: true,
      minWidth: 160,
    },
    {
      id: 'date',
      header: 'Issue Date',
      accessor: 'date',
      sortable: true,
      minWidth: 120,
    },
    {
      id: 'priority',
      header: 'Priority',
      accessor: 'priority',
      align: 'center',
      sortable: true,
      minWidth: 110,
      cell: (row) => <StatusChip label={row.priority} />,
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'acknowledged',
      align: 'center',
      sortable: true,
      minWidth: 130,
      cell: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
            row.acknowledged
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}
        >
          {row.acknowledged ? 'Acknowledged' : 'Action Required'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'center',
      sortable: false,
      minWidth: 120,
      cell: (row) => (
        <div className={TABLE_ROW_ACTIONS_CLASS}>
          <TableViewAction
            onClick={() => showAppToast(`Opening official circular statement for ${row.id}`, 'info')}
            title={`View ${row.id}`}
          />
          {!row.acknowledged && (
            <button
              type="button"
              onClick={() => handleAcknowledge(row.id)}
              className="px-2 py-1 bg-[#01458e] text-white hover:bg-[#002f6c] rounded text-[11px] font-bold cursor-pointer"
              title="Acknowledge Receipt"
            >
              Sign
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <SampleModuleLayout activeTab="feedback">
      <div className="space-y-6 w-full">
        {/* Critical Statutory Alert Banner */}
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-xl border border-amber-300 bg-amber-50/90 p-4 text-amber-950 flex items-start justify-between gap-3 shadow-xs"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-xs">Mandatory Action: Fiscal Year 2026-27 Q3 Expenditure Reconciliation</h3>
              <p className="mt-0.5 text-xs text-amber-800 leading-relaxed">
                All drawing and disbursing officers (DDOs) must finalize pending capital works vouchers before the quarterly audit freeze taking effect on <strong>31-Oct-2026 at 18:00 IST</strong>.
              </p>
            </div>
          </div>
          <GigwButton
            type="button"
            variant="success"
            size="sm"
            className="shrink-0 text-xs"
            onClick={() => showAppToast('Navigating to Reconciliation Queue', 'info')}
          >
            Review Reconciliation
          </GigwButton>
        </div>

        <SampleSectionHeader
          title="Official Government Circulars & Bulletins"
          icon={FileText}
          description="Authoritative notifications binding upon capital projects and treasury operations."
          action={
            <span className="text-xs text-slate-600">
              Acknowledged: <strong>{bulletins.filter((b) => b.acknowledged).length}</strong> of {bulletins.length}
            </span>
          }
        >
          <DataTable
            columns={columns}
            rows={bulletins}
            rowKey="id"
            emptyMessage="No active bulletins or circulars in this department queue."
          />
        </SampleSectionHeader>
      </div>
    </SampleModuleLayout>
  )
}
