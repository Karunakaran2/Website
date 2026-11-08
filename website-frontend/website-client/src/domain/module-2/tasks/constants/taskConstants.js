/**
 * Task Management Constants
 * Initial task records, options, and status configurations.
 */

export const INITIAL_TASKS = [
  {
    id: 'TSK-201',
    title: 'Implement accessible dark theme color tokens',
    description: 'Map high contrast WCAG 2.2 AA compliant CSS variable tokens into root stylesheet.',
    assignee: 'Rahul Nair',
    priority: 'High',
    status: 'In Progress',
    dueDate: '2026-10-20',
    category: 'Design System',
  },
  {
    id: 'TSK-202',
    title: 'Audit keyboard focus trap on modal dialogs',
    description: 'Verify Tab, Shift+Tab, and Escape key behavior across all shared dialog components.',
    assignee: 'Divya Varma',
    priority: 'High',
    status: 'To Do',
    dueDate: '2026-10-18',
    category: 'Accessibility',
  },
  {
    id: 'TSK-203',
    title: 'Create React Micro Frontend integration guideline',
    description: 'Document standard routing, webpack module federation, and lazy-loading architecture.',
    assignee: 'Ananya Sharma',
    priority: 'Medium',
    status: 'Completed',
    dueDate: '2026-10-12',
    category: 'Architecture',
  },
  {
    id: 'TSK-204',
    title: 'Build reusable status badge and chip components',
    description: 'Develop StatusBadge with variants for success, warning, error, info, and neutral.',
    assignee: 'Arjun Nambiar',
    priority: 'Medium',
    status: 'Completed',
    dueDate: '2026-10-14',
    category: 'UI Library',
  },
  {
    id: 'TSK-205',
    title: 'Integrate datepicker format validation in HRMS',
    description: 'Ensure ISO date string parsing and user-friendly localized validation messages.',
    assignee: 'Karthik Subramanian',
    priority: 'Low',
    status: 'In Progress',
    dueDate: '2026-10-22',
    category: 'HRMS',
  },
  {
    id: 'TSK-206',
    title: 'Verify screen reader announcements for toast alerts',
    description: 'Add aria-live="polite" and role="status" to shared notification components.',
    assignee: 'Divya Varma',
    priority: 'High',
    status: 'To Do',
    dueDate: '2026-10-25',
    category: 'Accessibility',
  },
  {
    id: 'TSK-207',
    title: 'Document CSS variable tokens in Design Guidelines',
    description: 'Create interactive color token swatches and copyable code tokens.',
    assignee: 'Meera Mohan',
    priority: 'Medium',
    status: 'Completed',
    dueDate: '2026-10-15',
    category: 'Documentation',
  },
  {
    id: 'TSK-208',
    title: 'Optimize rollup bundle chunk splitting for MFE',
    description: 'Fine-tune manualChunks to keep shared vendors and domain code clean.',
    assignee: 'Vivek Krishnan',
    priority: 'High',
    status: 'To Do',
    dueDate: '2026-10-28',
    category: 'DevOps',
  },
]

export const TASK_STATUS_OPTIONS = ['All', 'To Do', 'In Progress', 'Completed']

export const TASK_PRIORITY_OPTIONS = ['All', 'High', 'Medium', 'Low']

export const TASK_ASSIGNEES = [
  'All',
  'Ananya Sharma',
  'Rahul Nair',
  'Divya Varma',
  'Arjun Nambiar',
  'Karthik Subramanian',
  'Meera Mohan',
  'Vivek Krishnan',
]
