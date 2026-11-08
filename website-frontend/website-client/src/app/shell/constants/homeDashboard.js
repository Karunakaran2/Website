/** Home / Inbox details for KRAN Consulting Design System. */

/** Main scroll locked; Inbox + Modules panels split viewport height. */
export const HOME_LANDING_MAIN_CLASS =
  'custom-scrollbar flex min-h-0 min-w-0 max-w-full flex-1 flex-col overflow-hidden bg-[#FDFEFF] px-3 py-4 outline-none sm:px-5 sm:py-5 xl:px-[20px]'

export const HOME_TITLE = 'Design System Workbench'

export const HOME_REMINDERS = [
  {
    id: 'dsReview',
    eyebrow: 'Design System Release',
    message: 'Component library v2.4 tokens review scheduled today',
    tone: 'info',
  },
  {
    id: 'a11yAudit',
    eyebrow: 'Quality Assurance',
    message: 'WCAG 2.1 AA accessibility sign-off pending for data grid',
    tone: 'danger',
  },
]

export const HOME_INBOX_COLUMNS = [
  {
    id: 'index',
    header: 'Sl. No.',
    sortable: true,
    headerClassName: '!min-w-[4.75rem] !w-[4.75rem] whitespace-nowrap',
    cellClassName: '!min-w-[4.75rem] !w-[4.75rem] text-center',
  },
  {
    id: 'description',
    header: 'Deliverable / Component Description',
    sortable: true,
    headerClassName: '!text-left',
  },
  {
    id: 'receivedFrom',
    header: 'Project / Module Team',
    sortable: true,
    headerClassName: '!w-[28%] !text-left',
    cellClassName: '!w-[28%]',
  },
  {
    id: 'receivedOn',
    header: 'Submitted On',
    sortable: true,
    headerClassName: '!w-[22%] !text-left',
    cellClassName: '!w-[22%]',
  },
]

export const HOME_INBOX_EMPTY_MESSAGE = 'No pending items in queue'

export const HOME_PAGE_SIZE = 8

export const HOME_PAGE_SIZE_OPTIONS = [{ value: 8, label: '8' }]

export const HOME_SUMMARY_COUNTS = [
  { id: 'components', label: 'Design Components', value: '142', tone: 'green' },
  { id: 'tokens', label: 'Design Tokens', value: '586', tone: 'blue' },
  { id: 'projects', label: 'Adopting Projects', value: '24', tone: 'amber' },
]

export const HOME_PENDING_TITLE = 'Pending Reviews'

export const HOME_PENDING_ITEMS = [
  { id: 'component-rfc', label: 'Component RFC Approvals', value: '3' },
  { id: 'ux-reviews', label: 'UX Pattern Reviews', value: '4' },
  { id: 'a11y-audits', label: 'Accessibility Audit Tickets', value: '2' },
  { id: 'template-prs', label: 'Layout Template Reviews', value: '5' },
  { id: 'draft-components', label: 'Pending Draft Components', value: '7', emphasize: true },
  { id: 'dev-queries', label: 'Developer Inquiries', value: '3' },
  { id: 'resolved-items', label: 'Resolved Tickets this Sprint', value: '18' },
]
