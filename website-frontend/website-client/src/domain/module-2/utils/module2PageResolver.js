import WorkforceDashboardPage from '../pages/WorkforceDashboardPage'
import WorkforceCasesPage from '../pages/WorkforceCasesPage'
import HrmsDirectoryPage from '../hrms/pages/HrmsDirectoryPage'
import HrmsDepartmentsPage from '../hrms/pages/HrmsDepartmentsPage'
import HrmsLeavePage from '../hrms/pages/HrmsLeavePage'
import TaskDashboardPage from '../tasks/pages/TaskDashboardPage'
import TaskBoardPage from '../tasks/pages/TaskBoardPage'
import TaskPrioritiesPage from '../tasks/pages/TaskPrioritiesPage'
import Module2ReferenceScreen from '../pages/Module2ReferenceScreen'
import Module2EmployeeDetailPage from '../pages/Module2EmployeeDetailPage'

export function resolveModule2PageComponent(primaryId, secondaryId) {
  if (primaryId === 'm2-overview' && secondaryId === 'dashboard') return WorkforceDashboardPage
  if (primaryId === 'm2-overview' && secondaryId === 'workspace') return TaskDashboardPage
  if (primaryId === 'm2-cases' && secondaryId === 'queue') return WorkforceCasesPage

  if (primaryId === 'm2-people' && secondaryId === 'directory') return HrmsDirectoryPage
  if (primaryId === 'm2-people' && secondaryId === 'departments') return HrmsDepartmentsPage
  if (primaryId === 'm2-people' && secondaryId === 'details') return Module2EmployeeDetailPage

  if (primaryId === 'm2-leave' && secondaryId === 'apply') return HrmsLeavePage
  if (primaryId === 'm2-leave' && secondaryId === 'my-requests') return HrmsLeavePage
  if (primaryId === 'm2-leave' && secondaryId === 'pending') return HrmsLeavePage

  if (primaryId === 'm2-tasks' && secondaryId === 'kanban') return TaskBoardPage
  if (primaryId === 'm2-tasks' && secondaryId === 'list') return TaskBoardPage
  if (primaryId === 'm2-tasks' && secondaryId === 'priorities') return TaskPrioritiesPage
  if (primaryId === 'm2-tasks' && secondaryId === 'my-tasks') return TaskDashboardPage

  if (primaryId === 'hrms-directory') return HrmsDirectoryPage
  if (primaryId === 'hrms-departments') return HrmsDepartmentsPage
  if (primaryId === 'hrms-leave') return HrmsLeavePage
  if (primaryId === 'workforce-dashboard') return WorkforceDashboardPage
  if (primaryId === 'workforce-cases') return WorkforceCasesPage
  if (primaryId === 'task-board') return TaskDashboardPage
  if (primaryId === 'task-list') return TaskBoardPage
  if (primaryId === 'task-priorities') return TaskPrioritiesPage

  return Module2ReferenceScreen
}
