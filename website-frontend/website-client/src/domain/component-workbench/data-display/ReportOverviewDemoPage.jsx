import { useCallback, useMemo, useState } from 'react'
import { PieChart, BarChart3, IndianRupee } from 'lucide-react'
import {
  ReportSplitLayout,
  ReportEmptyState,
  ReportFilterFooter,
  ReportTypeSelect,
  ReportCatalogGrid,
} from '@/shared/components/report'
import EnterpriseDetailTabs from '@/shared/components/page/EnterpriseDetailTabs'
import { TableViewAction } from '@/shared/components/buttons'
import { TABLE_ACTION_COLUMN_CLASS } from '@/shared/components/listing/listingTableStyles'
import { InputField, SelectField } from '@/shared/components/forms'
import DataTable from '@/shared/components/DataTable'
import StatusChip from '@/shared/components/status/StatusChip'
import SampleMetricCard from '@/domain/module-1/components/SampleMetricCard'
import DashboardChartWidget from '@/domain/dashboard/components/DashboardChartWidget'
import { DASHBOARD_CHART_GRID_CLASS } from '@/domain/dashboard/constants/dashboardStyles'
import { MOCK_DASHBOARD_CHARTS } from '@/shared/api/mock/data/dashboardMockData'
import { formatRupee } from '@/shared/utils/probityFormat'
import { showAppToast } from '@/shared/components'
import { exportTableCsv } from '@/shared/utils/exportTableCsv'
import { useListPageHeaderActions } from '@/shared/hooks/useListPageHeaderActions'
import { FormModal } from '@/shared/components'
import { OrgDataDisplay } from '@/shared/components/display'
import { ReportResultsSkeleton, SkeletonRegion } from '@/shared/components/skeleton'
import {
  REPORT_CATALOG_ENTRIES,
  REPORT_DEMO_DEPARTMENTS,
  REPORT_DEMO_ROWS,
  REPORT_DEMO_TYPES,
  resolveReportDemoType,
} from '../constants/reportDemoMockData'

const DEFAULT_FROM = '2026-04-01'
const DEFAULT_TO = '2026-09-30'

function validateDates(from, to) {
  if (!from || !to) return 'From date and to date are required.'
  if (from > to) return 'From date must be on or before to date.'
  return ''
}

export default function ReportOverviewDemoPage() {
  const [reportType, setReportType] = useState('')
  const [department, setDepartment] = useState(REPORT_DEMO_DEPARTMENTS[0])
  const [fromDate, setFromDate] = useState(DEFAULT_FROM)
  const [toDate, setToDate] = useState(DEFAULT_TO)
  const [filterError, setFilterError] = useState('')
  const [generated, setGenerated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [previewRow, setPreviewRow] = useState(null)
  const [activePanel, setActivePanel] = useState('catalog')

  const filteredRows = useMemo(() => {
    let rows = [...REPORT_DEMO_ROWS]
    if (department && department !== 'All Departments') {
      rows = rows.filter((r) => r.department === department)
    }
    const q = search.trim().toLowerCase()
    if (q) {
      rows = rows.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.code.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q),
      )
    }
    return rows
  }, [department, search])

  const totalAmount = useMemo(
    () => filteredRows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0),
    [filteredRows],
  )

  const columns = useMemo(
    () => [
      { id: 'code', header: 'Item Code', accessor: 'code', minWidth: 110, sortable: true },
      { id: 'title', header: 'Description', accessor: 'title', minWidth: 200, sortable: true },
      { id: 'department', header: 'Department', accessor: 'department', minWidth: 140 },
      {
        id: 'amount',
        header: 'Amount (₹)',
        accessor: 'amount',
        align: 'right',
        sortable: true,
        cell: (row) => <span className="tabular-nums">{formatRupee(row.amount)}</span>,
      },
      {
        id: 'status',
        header: 'Status',
        align: 'center',
        cell: (row) => <StatusChip label={row.status} />,
      },
      {
        id: 'action',
        header: 'Action',
        align: 'center',
        headerClassName: TABLE_ACTION_COLUMN_CLASS,
        cellClassName: TABLE_ACTION_COLUMN_CLASS,
        cell: (row) => (
          <TableViewAction onClick={() => setPreviewRow(row)} ariaLabel={`View ${row.title}`} />
        ),
      },
    ],
    [],
  )

  const pagedRows = useMemo(
    () => filteredRows.slice((page - 1) * pageSize, page * pageSize),
    [filteredRows, page, pageSize],
  )

  const demoCharts = useMemo(() => MOCK_DASHBOARD_CHARTS.slice(0, 2), [])

  const handleGenerate = useCallback(() => {
    const err = validateDates(fromDate, toDate)
    if (!reportType) {
      setFilterError('Select a report type before generating.')
      return
    }
    if (err) {
      setFilterError(err)
      return
    }
    setFilterError('')
    setLoading(true)
    setGenerated(false)
    window.setTimeout(() => {
      setLoading(false)
      setGenerated(true)
      setPage(1)
      showAppToast('Report generated successfully.', 'success', { action: 'process' })
    }, 600)
  }, [fromDate, toDate, reportType])

  const handleExportCsv = useCallback(() => {
    if (!generated) {
      showAppToast('Generate the report before exporting.', 'warning')
      return
    }
    const ok = exportTableCsv(filteredRows, columns, 'report-overview.csv')
    if (ok) showAppToast('Export prepared successfully.', 'success', { action: 'export' })
    else showAppToast('No rows to export.', 'warning')
  }, [generated, filteredRows, columns])

  const handlePrint = useCallback(() => {
    if (!generated) {
      showAppToast('Generate the report before printing.', 'warning')
      return
    }
    window.print()
  }, [generated])

  useListPageHeaderActions({
    enabled: generated,
    onExport: handleExportCsv,
  })

  const filters = (
    <>
      <ReportTypeSelect
        value={reportType}
        onChange={setReportType}
        options={REPORT_DEMO_TYPES}
      />
      <InputField
        label="From Date"
        type="date"
        required
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
      />
      <InputField
        label="To Date"
        type="date"
        required
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
      />
      <SelectField
        label="Department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      >
        {REPORT_DEMO_DEPARTMENTS.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </SelectField>
      {filterError ? (
        <p className="m-0 text-xs font-medium text-rose-600" role="alert">
          {filterError}
        </p>
      ) : null}
      <ReportFilterFooter
        onGenerate={handleGenerate}
        generateLoading={loading}
        generateDisabled={!reportType}
        onPdf={generated ? handlePrint : undefined}
        onExcel={generated ? handleExportCsv : undefined}
      />
    </>
  )

  let results = <ReportEmptyState />
  if (loading) {
    results = (
      <SkeletonRegion message="Generating report">
        <ReportResultsSkeleton />
      </SkeletonRegion>
    )
  } else if (generated) {
    results = (
      <div id="report-overview-results" className="space-y-5 print:space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SampleMetricCard
            title="Total Sanctioned"
            value={formatRupee(totalAmount)}
            subtitle={`${filteredRows.length} line items`}
            icon={<IndianRupee className="h-5 w-5" aria-hidden />}
            variant="primary"
          />
          <SampleMetricCard
            title="Approved Lines"
            value={String(filteredRows.filter((r) => r.status === 'Approved').length)}
            subtitle="Within selected period"
            icon={<BarChart3 className="h-5 w-5" aria-hidden />}
            variant="success"
          />
          <SampleMetricCard
            title="Pending Review"
            value={String(filteredRows.filter((r) => r.status !== 'Approved').length)}
            subtitle="Requires action"
            icon={<PieChart className="h-5 w-5" aria-hidden />}
            variant="warning"
          />
        </div>
        <div className={DASHBOARD_CHART_GRID_CLASS}>
          {demoCharts.map((chart) => (
            <DashboardChartWidget key={chart.widgetKey} chart={chart} />
          ))}
        </div>
        <DataTable
          columns={columns}
          rows={pagedRows}
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
          emptyMessage="No records match the selected filters."
        />
      </div>
    )
  }

  const detailTabs = [
    { id: 'catalog', label: 'Report Catalog' },
    { id: 'workspace', label: 'Generate and View' },
  ]

  return (
    <EnterpriseDetailTabs tabs={detailTabs} activeTabId={activePanel} onTabChange={setActivePanel}>
      {activePanel === 'catalog' ? (
        <ReportCatalogGrid
          reports={REPORT_CATALOG_ENTRIES}
          onSelect={(catalogId) => {
            setReportType(resolveReportDemoType(catalogId))
            setGenerated(false)
            setFilterError('')
            setActivePanel('workspace')
          }}
        />
      ) : (
        <>
          <ReportSplitLayout filters={filters} results={results} />
          <FormModal
            isOpen={Boolean(previewRow)}
            onClose={() => setPreviewRow(null)}
            title={previewRow?.title || 'Line Detail'}
            showFooter={false}
            size="lg"
          >
            {previewRow ? (
              <OrgDataDisplay
                items={[
                  { label: 'Item Code', value: previewRow.code },
                  { label: 'Department', value: previewRow.department },
                  { label: 'Category', value: previewRow.category },
                  { label: 'Amount', value: formatRupee(previewRow.amount) },
                  { label: 'Status', value: previewRow.status },
                  { label: 'Period', value: previewRow.period },
                ]}
              />
            ) : null}
          </FormModal>
        </>
      )}
    </EnterpriseDetailTabs>
  )
}
