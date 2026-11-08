import { useCallback, useState } from 'react'
import EnterpriseDetailTabs from '@/shared/components/page/EnterpriseDetailTabs'
import { OrgDataDisplay } from '@/shared/components/display'
import { useHrms } from '../hrms/hooks/useHrms'
import { BodyText } from '@/shared/components/typography'
import { useListPageHeaderActions } from '@/shared/hooks/useListPageHeaderActions'
import { PageContentToolbar, PageToolbarSearchInput } from '@/shared/components/page'
import { exportSimpleCsv } from '@/shared/utils/exportSimpleCsv'
import { showAppToast } from '@/shared/components'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'employment', label: 'Employment' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'leave', label: 'Leave' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'documents', label: 'Documents' },
  { id: 'activity', label: 'Activity' },
]

export default function Module2EmployeeDetailPage() {
  const { employees } = useHrms()
  const employee = employees[0]
  const [tab, setTab] = useState('overview')
  const [search, setSearch] = useState('')

  const handleExport = useCallback(() => {
    if (!employee) {
      showAppToast('No employee data to export.', 'warning')
      return false
    }
    const ok = exportSimpleCsv(
      [
        { field: 'Name', value: employee.name },
        { field: 'Employee ID', value: employee.id },
        { field: 'Department', value: employee.department },
        { field: 'Status', value: employee.status },
        { field: 'Email', value: employee.email },
      ],
      [
        { key: 'field', header: 'Field' },
        { key: 'value', header: 'Value' },
      ],
      'employee-detail.csv',
    )
    if (ok) showAppToast('Export prepared successfully.', 'success', { action: 'export' })
    return ok
  }, [employee])

  useListPageHeaderActions({
    onExport: handleExport,
  })

  if (!employee) {
    return <BodyText>No employee records are available. Open Employee Directory first.</BodyText>
  }

  return (
    <>
      <PageContentToolbar className="mb-4">
        <PageToolbarSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search on this page…"
          className="min-w-[200px] flex-1 sm:max-w-[280px]"
        />
      </PageContentToolbar>
      <EnterpriseDetailTabs tabs={TABS} activeTabId={tab} onTabChange={setTab}>
      {tab === 'overview' && (
        <OrgDataDisplay
          items={[
            { label: 'Name', value: employee.name },
            { label: 'Employee ID', value: employee.id },
            { label: 'Department', value: employee.department },
            { label: 'Status', value: employee.status },
            { label: 'Email', value: employee.email },
          ]}
        />
      )}
      {tab === 'employment' && (
        <OrgDataDisplay
          items={[
            { label: 'Designation', value: employee.designation || '—' },
            { label: 'Manager', value: employee.manager || '—' },
            { label: 'Join date', value: employee.joiningDate || '—' },
          ]}
        />
      )}
      {tab !== 'overview' && tab !== 'employment' && (
        <BodyText>{tab} details will appear here when linked records are available.</BodyText>
      )}
    </EnterpriseDetailTabs>
    </>
  )
}
