/** Synthetic Module 2 portal datasets (deterministic demo). */

export const INITIAL_ATTENDANCE_ROWS = [
  { id: 'ATT-1', employee: 'Ananya Sharma', date: '2026-10-24', status: 'Present', checkIn: '09:02', checkOut: '18:01', department: 'Engineering' },
  { id: 'ATT-2', employee: 'Vikram Menon', date: '2026-10-24', status: 'Present', checkIn: '09:15', checkOut: '17:45', department: 'Engineering' },
  { id: 'ATT-3', employee: 'Meera Krishnan', date: '2026-10-24', status: 'On leave', checkIn: '—', checkOut: '—', department: 'Finance' },
  { id: 'ATT-4', employee: 'Rajesh Nair', date: '2026-10-24', status: 'Present', checkIn: '08:55', checkOut: '18:10', department: 'Compliance' },
  { id: 'ATT-5', employee: 'Siddharth Varma', date: '2026-10-23', status: 'Late', checkIn: '10:22', checkOut: '18:00', department: 'HR' },
]

export const INITIAL_LEAVE_ROWS = [
  { id: 'LV-101', employee: 'Ananya Sharma', type: 'Casual Leave', from: '2026-10-28', to: '2026-10-29', days: 2, status: 'Pending approval', approver: 'Rajesh Nair' },
  { id: 'LV-102', employee: 'Vikram Menon', type: 'Earned Leave', from: '2026-11-04', to: '2026-11-08', days: 5, status: 'Approved', approver: 'Siddharth Varma' },
  { id: 'LV-103', employee: 'Meera Krishnan', type: 'Sick Leave', from: '2026-10-20', to: '2026-10-21', days: 2, status: 'Returned', approver: 'Siddharth Varma' },
]

export const INITIAL_COLLABORATION_ROWS = [
  { id: 'COL-1', subject: 'Clarification on GST reconciliation', channel: 'Query', author: 'Meera Krishnan', updated: '2026-10-24', visibility: 'Requester visible' },
  { id: 'COL-2', subject: 'Internal review — payment gateway UAT', channel: 'Note', author: 'Vikram Menon', updated: '2026-10-23', visibility: 'Internal only' },
  { id: 'COL-3', subject: 'Attachment: signed vendor MOU', channel: 'Attachment', author: 'Rajesh Nair', updated: '2026-10-22', visibility: 'Internal only' },
]

export const INITIAL_REPORT_ROWS = [
  { id: 'RPT-1', name: 'Workforce headcount summary', period: 'Oct 2026', records: 128, status: 'Ready' },
  { id: 'RPT-2', name: 'Leave utilisation by department', period: 'Q3 2026', records: 45, status: 'Ready' },
  { id: 'RPT-3', name: 'Task throughput — engineering', period: 'Oct 2026', records: 312, status: 'Generating' },
]

export const INITIAL_CONFIG_ROWS = [
  { id: 'CFG-1', key: 'Default task status', value: 'To Do', scope: 'Tasks' },
  { id: 'CFG-2', key: 'Leave approval chain', value: 'Manager → HR', scope: 'Leave' },
  { id: 'CFG-3', key: 'Case auto-assign rule', value: 'Round-robin by category', scope: 'Cases' },
]
