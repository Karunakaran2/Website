import { lazyPage as page } from '@/app/routes/lazyPage'

export const hrmsPages = {
  'hrms-directory:overview': page(() => import('../pages/HrmsDirectoryPage')),
  'hrms-departments:overview': page(() => import('../pages/HrmsDepartmentsPage')),
  'hrms-leave:overview': page(() => import('../pages/HrmsLeavePage')),
}
