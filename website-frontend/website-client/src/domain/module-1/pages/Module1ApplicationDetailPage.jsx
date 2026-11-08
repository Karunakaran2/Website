import { useCallback, useState } from 'react'
import EnterpriseDetailTabs from '@/shared/components/page/EnterpriseDetailTabs'
import SampleModuleLayout from '../layouts/SampleModuleLayout'
import { useSampleModuleData } from '../hooks/useSampleModuleData'
import { formatINR, formatDate } from '../utils/sampleModuleUtils'
import { OrgDataDisplay } from '@/shared/components/display'
import { BodyText } from '@/shared/components/typography'
import { useListPageHeaderActions } from '@/shared/hooks/useListPageHeaderActions'
import { PageContentToolbar, PageToolbarSearchInput } from '@/shared/components/page'
import { exportSimpleCsv } from '@/shared/utils/exportSimpleCsv'
import { showAppToast } from '@/shared/components'

const DETAIL_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'applicant', label: 'Applicant Details' },
  { id: 'documents', label: 'Documents' },
  { id: 'notes', label: 'Notes & Queries' },
  { id: 'approval', label: 'Approval History' },
  { id: 'activity', label: 'Activity' },
]

export default function Module1ApplicationDetailPage() {
  const { records, activityLogs } = useSampleModuleData()
  const record = records[0]
  const [tab, setTab] = useState('overview')
  const [search, setSearch] = useState('')

  const handleExport = useCallback(() => {
    if (!record) {
      showAppToast('No application data to export.', 'warning')
      return false
    }
    const ok = exportSimpleCsv(
      [
        { field: 'Reference', value: record.referenceNo ?? record.code ?? '—' },
        { field: 'Status', value: record.status ?? record.applicationStatus ?? '—' },
        { field: 'Category', value: record.category ?? '—' },
        { field: 'Amount', value: formatINR(record.amount) },
        { field: 'Applicant', value: record.applicantName ?? record.assignee ?? '—' },
      ],
      [
        { key: 'field', header: 'Field' },
        { key: 'value', header: 'Value' },
      ],
      'application-detail.csv',
    )
    if (ok) showAppToast('Export prepared successfully.', 'success', { action: 'export' })
    return ok
  }, [record])

  useListPageHeaderActions({
    onExport: handleExport,
  })

  if (!record) {
    return (
      <SampleModuleLayout>
        <BodyText>No application records are available. Create or open an application from Applications.</BodyText>
      </SampleModuleLayout>
    )
  }

  const activityItems = activityLogs
    .slice(0, 8)
    .filter((log) => {
      const q = search.trim().toLowerCase()
      if (!q) return true
      const hay = `${log.action} ${log.details} ${log.user}`.toLowerCase()
      return hay.includes(q)
    })

  return (
    <SampleModuleLayout>
      <PageContentToolbar>
        <PageToolbarSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search on this page…"
          className="min-w-[200px] flex-1 sm:max-w-[280px]"
        />
      </PageContentToolbar>
      <EnterpriseDetailTabs tabs={DETAIL_TABS} activeTabId={tab} onTabChange={setTab}>
        {tab === 'overview' && (
          <OrgDataDisplay
            items={[
              { label: 'Reference', value: record.referenceNo ?? record.code },
              { label: 'Status', value: record.status ?? record.applicationStatus },
              { label: 'Category', value: record.category },
              { label: 'Amount', value: formatINR(record.amount) },
              { label: 'Submitted Date', value: formatDate(record.submittedAt ?? record.createdDate) },
              { label: 'Updated Date', value: formatDate(record.updatedAt ?? record.createdDate) },
            ]}
          />
        )}
        {tab === 'applicant' && (
          <OrgDataDisplay
            items={[
              { label: 'Name', value: record.applicantName ?? record.assignee },
              { label: 'Contact', value: record.contactEmail || '—' },
              { label: 'Department', value: record.department || '—' },
            ]}
          />
        )}
        {tab === 'documents' && (
          <BodyText>No documents are linked to this application yet. Upload files from Documents → Upload Documents.</BodyText>
        )}
        {tab === 'notes' && (
          <BodyText>No notes or queries have been recorded for this application.</BodyText>
        )}
        {tab === 'approval' && (
          <BodyText>Approval history will appear here after review actions are recorded.</BodyText>
        )}
        {tab === 'activity' && (
          <ul className="space-y-2 text-[13px] text-slate-700">
            {activityItems.length === 0 ? (
              <li>No activity matches your search.</li>
            ) : (
              activityItems.map((log) => (
                <li key={log.id}>
                  {log.timestamp} — {log.action}: {log.details}
                </li>
              ))
            )}
          </ul>
        )}
      </EnterpriseDetailTabs>
    </SampleModuleLayout>
  )
}
