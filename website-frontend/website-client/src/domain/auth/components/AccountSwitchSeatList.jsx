import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Building2, CheckCircle2 } from 'lucide-react'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { SkeletonBlock, SkeletonRegion } from '@/shared/components/skeleton'
import {
  filterAuthorizedSeats,
  resolveActiveSeatIdMask,
  seatSummaryLine,
} from '@/domain/auth/utils/activeSeat'

function AccountSwitchSeatCard({
  seat,
  isActive,
  isSwitching,
  disabled,
  onSwitch,
  interactive = true,
}) {
  const { t } = useTranslation()
  const summary = seatSummaryLine(seat)

  return (
    <li
      className={`list-none rounded-lg border p-3 transition-colors sm:p-4 ${
        isActive
          ? 'border-[#01458e] bg-[#F4FAFF]'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
              isActive ? 'bg-[#01458e] text-white' : 'bg-slate-100 text-[#01458e]'
            }`}
            aria-hidden
          >
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="m-0 text-sm font-semibold text-slate-900">{seat.name}</p>
              {isActive ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                  <CheckCircle2 className="h-3 w-3" aria-hidden />
                  {t('accountSwitch.currentBadge', 'Current')}
                </span>
              ) : null}
            </div>
            {summary ? (
              <p className="m-0 mt-1 text-xs text-slate-600">{summary}</p>
            ) : null}
            <dl className="mt-2 grid grid-cols-1 gap-1 text-xs text-slate-600 sm:grid-cols-2">
              <div>
                <dt className="inline font-medium text-slate-700">
                  {t('accountSwitch.seatCode', 'Code')}:{' '}
                </dt>
                <dd className="inline">{seat.hierarchyCode || seat.code || '—'}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-slate-700">
                  {t('accountSwitch.role', 'Role')}:{' '}
                </dt>
                <dd className="inline">{seat.postingName || seat.designation || '—'}</dd>
              </div>
              {seat.category ? (
                <div className="sm:col-span-2">
                  <dt className="inline font-medium text-slate-700">
                    {t('accountSwitch.category', 'Category')}:{' '}
                  </dt>
                  <dd className="inline">{seat.category}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>
        {interactive ? (
          <div className="shrink-0 sm:pt-1">
            {isActive ? (
              <span className="block text-center text-xs font-medium text-slate-500 sm:text-right">
                {t('accountSwitch.activeHint', 'Active in this session')}
              </span>
            ) : (
              <GigwButton
                type="button"
                variant="primary"
                className="w-full min-w-[7rem] sm:w-auto"
                disabled={disabled}
                aria-busy={isSwitching}
                onClick={() => onSwitch(seat)}
              >
                {isSwitching
                  ? t('accountSwitch.switching', 'Switching…')
                  : t('accountSwitch.switchTo', 'Switch')}
              </GigwButton>
            )}
          </div>
        ) : null}
      </div>
    </li>
  )
}

export default function AccountSwitchSeatList({
  user,
  seats,
  isLoading,
  listError,
  switchingIdMask,
  onSwitchSeat,
  interactive = true,
}) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const activeSeatIdMask = resolveActiveSeatIdMask(user, seats)
  const filteredSeats = useMemo(
    () => filterAuthorizedSeats(seats, query),
    [query, seats],
  )
  const switchingBusy = Boolean(switchingIdMask)

  if (isLoading) {
    return (
      <SkeletonRegion message={t('accountSwitch.loading', 'Loading accounts…')}>
        <div className="flex flex-col gap-3">
          <SkeletonBlock className="h-10 w-full rounded-lg" />
          <SkeletonBlock className="h-28 w-full rounded-lg" />
          <SkeletonBlock className="h-28 w-full rounded-lg" />
        </div>
      </SkeletonRegion>
    )
  }

  if (listError) {
    return (
      <p className="m-0 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
        {listError}
      </p>
    )
  }

  if (seats.length === 0) {
    return (
      <p className="m-0 rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
        {t(
          'accountSwitch.empty',
          'No additional accounts are linked to your user. Contact your administrator if you need access.',
        )}
      </p>
    )
  }

  return (
    <div className="flex min-w-0 flex-col gap-3">
      {seats.length > 3 ? (
        <label className="flex min-w-0 flex-col gap-1">
          <span className="text-xs font-medium text-slate-700">
            {t('accountSwitch.searchLabel', 'Search accounts')}
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('accountSwitch.searchPlaceholder', 'Name, code, office, role…')}
            className="input-field h-11 min-h-11 w-full min-w-0 rounded-lg border border-slate-300 px-3 text-sm text-slate-800 focus:border-[#01458e] focus:outline-none focus:ring-1 focus:ring-[#01458e]"
            autoComplete="off"
          />
        </label>
      ) : null}

      {filteredSeats.length === 0 ? (
        <p className="m-0 text-sm text-slate-600">
          {t('accountSwitch.noSearchResults', 'No accounts match your search.')}
        </p>
      ) : (
        <ul className="m-0 flex max-h-[min(24rem,60vh)] flex-col gap-3 overflow-y-auto p-0">
          {filteredSeats.map((seat) => (
            <AccountSwitchSeatCard
              key={seat.idMask || seat.id}
              seat={seat}
              isActive={seat.idMask === activeSeatIdMask}
              isSwitching={switchingIdMask === seat.idMask}
              disabled={switchingBusy}
              interactive={interactive}
              onSwitch={(selected) =>
                onSwitchSeat?.(selected.idMask, { seatLabel: selected.name })
              }
            />
          ))}
        </ul>
      )}
    </div>
  )
}
