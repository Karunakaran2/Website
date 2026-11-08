import { lazyPage as page } from '@/app/routes/lazyPage'

export const taskManagementPages = {
  'task-board:overview': page(() => import('../pages/TaskDashboardPage')),
  'task-list:overview': page(() => import('../pages/TaskBoardPage')),
  'task-priorities:overview': page(() => import('../pages/TaskPrioritiesPage')),
}
