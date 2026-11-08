import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Bell } from 'lucide-react'
import { DataTable } from '@/shared/components'
import { TableViewAction } from '@/shared/components/buttons'
import { PageSectionHeader } from '@/shared/components/page'
import { PAGE_SECTION_HEADER_SHELL_CLASS } from '@/shared/components/page/pageHeaderStyles'
import { StatusChip } from '@/shared/components/status'
import {
  PortalModalCancelButton,
  PortalModalPrimaryButton,
  PortalModalShell,
} from '@/shared/components/modals'
import { MODULE_LANDING_PANEL_CLASS } from '@/shared/constants/moduleLayoutStyles'
import { getModuleRoute } from '@/shared/constants'
import {
  countUnreadInboxMessages,
  filterInboxMessages,
  markInboxMessageRead,
  paginateInboxRows,
} from '@/app/shell/utils/portalInboxUtils'

const SAMPLE_INBOX_MESSAGES = [
  {
    id: 'msg-1',
    subject: 'New Button Component Guidelines',
    receivedFrom: 'Design System Core Team',
    receivedOn: '13-10-2026',
    status: 'Unread',
    category: 'Component',
    content:
      'Comprehensive guidelines for Primary, Secondary, Destructive, and Icon Buttons have been published. Review sizing standards, keyboard interaction patterns, and focus-visible outlines. All production buttons must implement WCAG 2.2 AA compliant focus states.',
    quickLink: {
      label: 'View Button Docs',
      path: () => getModuleRoute('actions', 'buttons'),
    },
  },
  {
    id: 'msg-2',
    subject: 'Accessibility Review Checklist Updated',
    receivedFrom: 'Accessibility Cell',
    receivedOn: '12-10-2026',
    status: 'Unread',
    category: 'Guideline',
    content:
      'The WCAG 2.2 Level AA accessibility review checklist has been updated. All interactive components must meet a minimum 4.5:1 text contrast and 3:1 focus ring contrast against their container background. Full keyboard operability and visible focus rings are required.',
    quickLink: {
      label: 'Read Accessibility Guide',
      path: () => getModuleRoute('guide-principles', 'overview'),
    },
  },
  {
    id: 'msg-3',
    subject: 'Form Validation Examples Available',
    receivedFrom: 'Frontend Guild',
    receivedOn: '11-10-2026',
    status: 'Read',
    category: 'Component',
    content:
      'Interactive form validation patterns including required indicators, inline error summaries, and ARIA describedby attributes are now available. These examples showcase reactive form state handling and error communication for KRAN enterprise forms.',
    quickLink: {
      label: 'Explore Form Validation',
      path: () => getModuleRoute('forms', 'form-validation'),
    },
  },
  {
    id: 'msg-4',
    subject: 'New Table Pagination Demo',
    receivedFrom: 'UI Architecture Desk',
    receivedOn: '10-10-2026',
    status: 'Read',
    category: 'Announcement',
    content:
      'The DataTable component now supports server-side and client-side pagination with custom page sizes, column sorting indicators, and screen reader announcements. Check out the interactive table demo with live data filtering.',
    quickLink: {
      label: 'Open Table Playground',
      path: () => getModuleRoute('data-display', 'tables'),
    },
  },
]

export default function PortalInboxCard({ initialMessages = SAMPLE_INBOX_MESSAGES }) {
  const navigate = useNavigate()
  const [messages, setMessages] = useState(initialMessages)
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'unread' | 'archive'
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [sort, setSort] = useState({ sortBy: null, sortDir: 'asc' })
  const [selectedIds, setSelectedIds] = useState([])
  const [viewingMessage, setViewingMessage] = useState(null)

  const unreadCount = useMemo(() => countUnreadInboxMessages(messages), [messages])

  const filteredMessages = useMemo(
    () => filterInboxMessages(messages, { activeTab, search, sort }),
    [messages, activeTab, search, sort],
  )

  const paginatedMessages = useMemo(
    () => paginateInboxRows(filteredMessages, currentPage, pageSize),
    [filteredMessages, currentPage, pageSize],
  )

  const openMessageModal = useCallback((msg) => {
    setViewingMessage(msg)
    setMessages((prev) => markInboxMessageRead(prev, msg.id))
  }, [])

  const columns = useMemo(
    () => [
      {
        id: '_serial',
        header: '#',
        accessor: '_serial',
        sortable: false,
        align: 'center',
        minWidth: 44,
      },
      {
        id: 'subject',
        header: 'Subject',
        accessor: 'subject',
        sortable: true,
        minWidth: 220,
        cell: (row) => (
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => openMessageModal(row)}
          >
            {row.status === 'Unread' && (
              <span
                className="h-2 w-2 rounded-full bg-blue-600 shrink-0"
                aria-hidden="true"
              />
            )}
            <span
              className={`truncate group-hover:text-[#01458e] group-hover:underline ${
                row.status === 'Unread'
                  ? 'font-semibold text-slate-900'
                  : 'font-normal text-slate-700'
              }`}
            >
              {row.subject}
            </span>
          </div>
        ),
      },
      {
        id: 'receivedFrom',
        header: 'Received From',
        accessor: 'receivedFrom',
        sortable: true,
        minWidth: 160,
      },
      {
        id: 'receivedOn',
        header: 'Received On',
        accessor: 'receivedOn',
        sortable: true,
        minWidth: 110,
      },
      {
        id: 'status',
        header: 'Status',
        accessor: 'status',
        sortable: true,
        align: 'center',
        minWidth: 90,
        cell: (row) => <StatusChip label={row.status} />,
      },
      {
        id: 'action',
        header: 'Action',
        sortable: false,
        align: 'center',
        minWidth: 60,
        cell: (row) => (
          <TableViewAction
            onClick={() => openMessageModal(row)}
            ariaLabel={`View message ${row.subject}`}
          />
        ),
      },
    ],
    [openMessageModal],
  )

  const filterTabs = (
    <div
      role="tablist"
      aria-label="Filter messages"
      className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs"
    >
      {[
        { id: 'all', label: 'All' },
        { id: 'unread', label: 'Unread' },
        { id: 'archive', label: 'Archive' },
      ].map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => {
              setActiveTab(tab.id)
              setCurrentPage(1)
            }}
            className={`rounded-md px-3 py-1 font-medium transition-all duration-150 ${
              isActive
                ? 'bg-white text-[#01458e] font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )

  return (
    <section aria-labelledby="inbox-section-title" className={MODULE_LANDING_PANEL_CLASS}>
      <div className={`${PAGE_SECTION_HEADER_SHELL_CLASS} shrink-0`}>
        <PageSectionHeader
          title="Inbox"
          subtitle={`${unreadCount} unread message${unreadCount === 1 ? '' : 's'}`}
          actions={filterTabs}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4 sm:p-5">
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
        <DataTable
          columns={columns}
          rows={paginatedMessages}
          rowKey="id"
          search={search}
          onSearchChange={(val) => {
            setSearch(val)
            setCurrentPage(1)
          }}
          page={currentPage}
          pageSize={pageSize}
          total={filteredMessages.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={(nextSize) => {
            setPageSize(nextSize)
            setCurrentPage(1)
          }}
          sort={sort}
          onSortChange={setSort}
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          emptyMessage="No messages in inbox"
        />
        </div>
      </div>

      {/* Message Detail Modal using standard PortalModalShell */}
      {viewingMessage && (
        <PortalModalShell
          isOpen={Boolean(viewingMessage)}
          onClose={() => setViewingMessage(null)}
          title={viewingMessage.subject}
          icon={Bell}
          size="md"
          footer={
            <>
              {viewingMessage.quickLink && (
                <PortalModalPrimaryButton
                  onClick={() => {
                    const path = viewingMessage.quickLink.path()
                    setViewingMessage(null)
                    navigate(path)
                  }}
                  className="inline-flex items-center gap-1.5"
                >
                  <span>{viewingMessage.quickLink.label}</span>
                  <ArrowRight size={14} />
                </PortalModalPrimaryButton>
              )}
              <PortalModalCancelButton onClick={() => setViewingMessage(null)}>
                Close
              </PortalModalCancelButton>
            </>
          }
        >
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2 text-xs text-slate-500">
              <div>
                <span className="font-semibold text-slate-700">From:</span> {viewingMessage.receivedFrom}
              </div>
              <div>
                <span className="font-semibold text-slate-700">Date:</span> {viewingMessage.receivedOn}
              </div>
              <div>
                <StatusChip label={viewingMessage.status} />
              </div>
            </div>

            <div className="text-xs leading-relaxed text-slate-700">
              <p>{viewingMessage.content}</p>
            </div>
          </div>
        </PortalModalShell>
      )}
    </section>
  )
}
