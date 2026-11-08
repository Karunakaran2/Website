import { createElement } from 'react'
import SampleDashboardPage from '../pages/SampleDashboardPage'
import SampleMyWorkPage from '../pages/SampleMyWorkPage'
import SampleApplicationsPage from '../pages/SampleApplicationsPage'
import Module1ApprovalsPage from '../pages/Module1ApprovalsPage'
import SampleDocumentsPage from '../pages/SampleDocumentsPage'
import SampleTablesPage from '../pages/SampleTablesPage'
import SampleReportsPage from '../pages/SampleReportsPage'
import SampleFormsPage from '../pages/SampleFormsPage'
import Module1ReferenceScreen from '../pages/Module1ReferenceScreen'
import Module1ActivityPage from '../pages/Module1ActivityPage'

const STATUS_FILTER_MAP = {
  'm1-applications:draft': 'Draft',
  'm1-applications:submitted': 'Submitted',
  'm1-applications:under-review': 'Under Review',
  'm1-applications:returned': 'Returned',
  'm1-applications:approved': 'Approved',
  'm1-applications:rejected': 'Rejected',
  'm1-applications:archived': 'Archived',
}

function filteredReferenceScreen(statusFilter) {
  return function FilteredReferenceScreen() {
    return createElement(Module1ReferenceScreen, { statusFilter })
  }
}

export function resolveModule1PageComponent(primaryId, secondaryId) {
  const key = `${primaryId}:${secondaryId}`

  if (primaryId === 'm1-overview' && secondaryId === 'dashboard') return SampleDashboardPage
  if (primaryId === 'm1-overview' && secondaryId === 'my-work') return SampleMyWorkPage
  if (primaryId === 'm1-overview' && secondaryId === 'activity') return Module1ActivityPage
  if (primaryId === 'm1-overview' && secondaryId === 'notifications') return Module1ActivityPage

  if (primaryId === 'm1-applications') {
    if (secondaryId === 'all') return SampleApplicationsPage
    if (STATUS_FILTER_MAP[key]) return filteredReferenceScreen(STATUS_FILTER_MAP[key])
    return Module1ReferenceScreen
  }

  if (primaryId === 'm1-approvals') return Module1ApprovalsPage
  if (primaryId === 'm1-documents' && secondaryId === 'register') return SampleDocumentsPage
  if (primaryId === 'm1-master' && secondaryId === 'people') return SampleTablesPage
  if (primaryId === 'm1-reports') return SampleReportsPage
  if (primaryId === 'm1-config' && secondaryId === 'import') return SampleFormsPage
  if (primaryId === 'sample-approvals') return Module1ApprovalsPage

  if (STATUS_FILTER_MAP[key]) return filteredReferenceScreen(STATUS_FILTER_MAP[key])

  return Module1ReferenceScreen
}
