/** Module 2 — primary and secondary navigation. */

export const MODULE_2_PRIMARY_NAV_ITEMS = [
  { id: 'm2-overview', label: 'Overview' },
  { id: 'm2-people', label: 'People' },
  { id: 'm2-attendance', label: 'Attendance' },
  { id: 'm2-leave', label: 'Leave' },
  { id: 'm2-tasks', label: 'Tasks & Projects' },
  { id: 'm2-cases', label: 'Workflow & Cases' },
  { id: 'm2-collaboration', label: 'Collaboration' },
  { id: 'm2-reports', label: 'Reports' },
  { id: 'm2-config', label: 'Configuration' },
]

export const MODULE_2_SECONDARY_NAV_BY_PRIMARY = {
  'm2-overview': [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'workspace', label: 'My Workspace' },
    { id: 'team', label: 'Team Overview' },
    { id: 'feed', label: 'Activity Feed' },
  ],
  'm2-people': [
    { id: 'directory', label: 'Employee Directory' },
    { id: 'details', label: 'Employee Details' },
    { id: 'departments', label: 'Departments' },
    { id: 'designations', label: 'Designations' },
    { id: 'teams', label: 'Teams' },
    { id: 'reporting', label: 'Reporting Relationships' },
  ],
  'm2-attendance': [
    { id: 'register', label: 'Attendance Register' },
    { id: 'daily', label: 'Daily Attendance' },
    { id: 'calendar', label: 'Calendar View' },
    { id: 'availability', label: 'Availability' },
    { id: 'schedule', label: 'Work Schedule' },
  ],
  'm2-leave': [
    { id: 'apply', label: 'Apply for Leave' },
    { id: 'my-requests', label: 'My Leave Requests' },
    { id: 'team-calendar', label: 'Team Leave Calendar' },
    { id: 'pending', label: 'Pending Approvals' },
    { id: 'history', label: 'Leave History' },
    { id: 'balances', label: 'Leave Types & Balances' },
  ],
  'm2-tasks': [
    { id: 'my-tasks', label: 'My Tasks' },
    { id: 'all-tasks', label: 'All Tasks' },
    { id: 'team-tasks', label: 'Team Tasks' },
    { id: 'kanban', label: 'Kanban Board' },
    { id: 'list', label: 'List View' },
    { id: 'calendar', label: 'Calendar View' },
    { id: 'projects', label: 'Projects' },
    { id: 'priorities', label: 'Categories & Priorities' },
  ],
  'm2-cases': [
    { id: 'queue', label: 'Work Queue' },
    { id: 'assigned', label: 'Assigned Cases' },
    { id: 'unassigned', label: 'Unassigned Cases' },
    { id: 'pending-review', label: 'Pending Review' },
    { id: 'escalated', label: 'Escalated Cases' },
    { id: 'completed', label: 'Completed Cases' },
  ],
  'm2-collaboration': [
    { id: 'comments', label: 'Comments & Activity' },
    { id: 'notes', label: 'Notes' },
    { id: 'queries', label: 'Queries' },
    { id: 'attachments', label: 'Attachments' },
    { id: 'notifications', label: 'Notifications' },
  ],
  'm2-reports': [
    { id: 'workforce', label: 'Workforce Summary' },
    { id: 'attendance', label: 'Attendance Reports' },
    { id: 'leave', label: 'Leave Reports' },
    { id: 'tasks', label: 'Task Performance' },
    { id: 'workload', label: 'Workload Distribution' },
    { id: 'operational', label: 'Operational Reports' },
  ],
  'm2-config': [
    { id: 'statuses', label: 'Task Statuses' },
    { id: 'priorities', label: 'Priorities' },
    { id: 'categories', label: 'Categories' },
    { id: 'assignment', label: 'Team Assignment Rules' },
    { id: 'workflow', label: 'Workflow Rules' },
  ],
}

export function getModule2SecondaryNav(primaryId) {
  return MODULE_2_SECONDARY_NAV_BY_PRIMARY[primaryId] ?? [{ id: 'dashboard', label: 'Overview' }]
}

export function getModule2DefaultSecondary(primaryId) {
  const tabs = getModule2SecondaryNav(primaryId)
  return tabs[0]?.id ?? 'dashboard'
}

export function isModule2Primary(primaryId) {
  return MODULE_2_PRIMARY_NAV_ITEMS.some((item) => item.id === primaryId)
}

export const LEGACY_MODULE_2_PRIMARY_IDS = [
  'workforce-dashboard',
  'workforce-cases',
  'hrms-directory',
  'hrms-departments',
  'hrms-leave',
  'task-board',
  'task-list',
  'task-priorities',
]

export function isLegacyModule2Primary(primaryId) {
  return LEGACY_MODULE_2_PRIMARY_IDS.includes(primaryId)
}
