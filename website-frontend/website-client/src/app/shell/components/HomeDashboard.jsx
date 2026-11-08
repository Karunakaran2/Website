import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DataTable } from '@/shared/components'
import { WarningIcon } from '@/shared/components/icons/AppIcons'
import {
  HOME_INBOX_COLUMNS,
  HOME_PAGE_SIZE,
  HOME_PAGE_SIZE_OPTIONS,
  HOME_PENDING_ITEMS,
  HOME_REMINDERS,
  HOME_SUMMARY_COUNTS,
} from '../constants/homeDashboard'

const reminderToneClass = {
  info: {
    icon: 'bg-blue-50 text-blue-600',
    message: 'text-blue-700',
  },
  danger: {
    icon: 'bg-red-50 text-red-500',
    message: 'text-red-500',
  },
}

const summaryToneClass = {
  green: 'bg-[#E7F6EE]',
  blue: 'bg-[#E8F1FB]',
  amber: 'bg-[#FFF3E0]',
}

const summaryBadgeClass = {
  green: 'bg-white text-emerald-600',
  blue: 'bg-blue-600 text-white',
  amber: 'bg-white text-amber-600',
}

function ReminderCard({ reminder }) {
  const { t } = useTranslation()
  const tone = reminderToneClass[reminder.tone] ?? reminderToneClass.info
  const message = reminder.message ? t(`home.${reminder.id}Message`, { defaultValue: reminder.message }) : t('home.reminderGstr1')
  const eyebrow = reminder.eyebrow ? t(`home.${reminder.id}Eyebrow`, { defaultValue: reminder.eyebrow }) : t('home.reminderEyebrow')

  return (
    <div className="flex w-fit max-w-full items-start gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3.5">
      <span
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tone.icon}`}
      >
        <WarningIcon className="text-[18px]" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium leading-4 text-slate-400">
          {eyebrow}
        </p>
        <p className={`mt-1 text-sm font-semibold leading-5 ${tone.message}`}>
          {message}
        </p>
      </div>
    </div>
  )
}

function SummaryCountCard({ item }) {
  const { t } = useTranslation()

  return (
    <div
      className={`flex h-12 items-center justify-between gap-3 rounded-lg px-4 shadow-none ${summaryToneClass[item.tone]}`}
    >
      <p className="truncate text-sm font-medium text-slate-700">
        {t(`home.summary.${item.id}`, { defaultValue: item.label })}
      </p>
      <span
        className={`inline-flex min-w-9 shrink-0 items-center justify-center rounded-full px-2.5 py-1 text-xs font-bold shadow-sm ${summaryBadgeClass[item.tone]}`}
      >
        {item.value}
      </span>
    </div>
  )
}

function PendingPanel() {
  const { t } = useTranslation()

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-2.5 sm:px-5">
        <h2 className="m-0 text-sm font-semibold text-red-500">{t('home.pending')}</h2>
      </div>
      <ul className="m-0 list-none space-y-0 px-4 py-2 sm:px-5">
        {HOME_PENDING_ITEMS.map((item) => (
          <li key={item.id} className="flex h-10 items-center justify-between gap-3">
            <p className="truncate text-sm text-slate-600">
              {t(`home.pendingItems.${item.id}`, { defaultValue: item.label })}
            </p>
            <span
              className={`inline-flex min-w-7 shrink-0 items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${
                item.emphasize ? 'bg-red-500 text-white' : 'bg-red-50 text-red-500'
              }`}
            >
              {item.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function HomeDashboard() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(HOME_PAGE_SIZE)
  const [sort, setSort] = useState({ sortBy: 'index', sortDir: 'asc' })
  const inboxColumns = HOME_INBOX_COLUMNS.map((column) => ({
    ...column,
    header: t(`home.col.${column.id}`, { defaultValue: column.header }),
  }))

  const mockRows = [
    {
      id: 'inbox-1',
      index: 1,
      description: 'Payment Voucher PV/841/25-26 from KSEB electricity charges',
      receivedFrom: 'Accounts Section – South Zone',
      receivedOn: '12-03-2026',
    },
    {
      id: 'inbox-2',
      index: 2,
      description: 'Journal Voucher JV/1044/25-26 NIC software AMC renewal',
      receivedFrom: 'IT Finance Cell',
      receivedOn: '11-03-2026',
    },
    {
      id: 'inbox-3',
      index: 3,
      description: 'Purchase Voucher PU/623/25-26 Indian Oil patrol fuel diesel',
      receivedFrom: 'Logistics Division – HQ',
      receivedOn: '10-03-2026',
    },
    {
      id: 'inbox-4',
      index: 4,
      description: 'Receipt Voucher RV/311/25-26 Canara Bank FD Interest credit',
      receivedFrom: 'Treasury Investment Desk',
      receivedOn: '09-03-2026',
    },
  ]

  const filteredRows = search
    ? mockRows.filter(
        (r) =>
          r.description.toLowerCase().includes(search.toLowerCase()) ||
          r.receivedFrom.toLowerCase().includes(search.toLowerCase()),
      )
    : mockRows

  return (
    <section
      className="flex flex-col gap-5 md:flex-row md:items-start"
      aria-labelledby="home-inbox-title"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-5 md:min-w-0">
        <div className="flex flex-wrap items-start gap-3">
          {HOME_REMINDERS.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))}
        </div>

        <DataTable
          columns={inboxColumns}
          rows={filteredRows}
          rowKey="id"
          search={search}
          onSearchChange={setSearch}
          page={page}
          pageSize={pageSize}
          total={filteredRows.length}
          onPageChange={setPage}
          onPageSizeChange={(nextSize) => {
            setPageSize(nextSize)
            setPage(1)
          }}
          pageSizeOptions={HOME_PAGE_SIZE_OPTIONS}
          showToolbarPrefix={false}
          sort={sort}
          onSortChange={setSort}
          emptyMessage={t('home.empty')}
          tableContainerClassName="!min-h-[280px]"
        />
      </div>

      <aside className="flex w-full shrink-0 flex-col gap-5 md:w-[280px] xl:w-[300px]">
        {HOME_SUMMARY_COUNTS.map((item) => (
          <SummaryCountCard key={item.id} item={item} />
        ))}
        <PendingPanel />
      </aside>
    </section>
  )
}
