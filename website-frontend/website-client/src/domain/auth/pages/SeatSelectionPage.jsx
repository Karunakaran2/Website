import { useTranslation } from 'react-i18next'
import AccountHeader from '@/shared/components/common/Header/AccountHeader'
import SeatSelectionSkeleton from '@/shared/components/skeletons/SeatSelectionSkeleton'
import MainLayout from '@/shared/layouts/MainLayout/MainLayout'
import { MODULE_MAIN_CLASS } from '@/shared/constants/moduleContentStyles'
import ModulePageShell from '@/shared/layouts/ModulePageShell'
import SeatSelectionPanel from '../components/SeatSelectionPanel'
import { useSeatSelection } from '../hooks/useSeatSelection'

export default function SeatSelectionPage() {
  const { t } = useTranslation()
  const {
    user,
    seats,
    isLoading,
    listError,
    selectError,
    selectingId,
    selectSeat,
  } = useSeatSelection()

  const displayName = user?.name || user?.username || t('seats.user')
  const seatCount = seats.length
  const subtitleKey =
    seatCount === 0
      ? 'seats.subtitleNone'
      : seatCount === 1
        ? 'seats.subtitleOne'
        : 'seats.subtitleMany'

  return (
    <MainLayout
      header={<AccountHeader />}
      beforeMain={
        <div className="h-[5px] shrink-0 bg-dashboard-nav" aria-hidden="true" />
      }
      mainClassName={MODULE_MAIN_CLASS}
    >
      {isLoading ? (
        <ModulePageShell title={t('seats.title')} hidePageHeader>
          <SeatSelectionSkeleton />
        </ModulePageShell>
      ) : (
        <ModulePageShell
          title={t('seats.title')}
          subtitle={t(subtitleKey, { name: displayName })}
        >
          <SeatSelectionPanel
            user={user}
            seats={seats}
            selectingId={selectingId}
            selectError={selectError}
            listError={listError}
            onSelect={selectSeat}
          />
        </ModulePageShell>
      )}
    </MainLayout>
  )
}
