import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Building2 } from 'lucide-react'
import FormProfileSection from '@/shared/components/forms/FormProfileSection'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { SkeletonBlock, SkeletonRegion } from '@/shared/components/skeleton'
import AccountSwitchSeatList from './AccountSwitchSeatList'
import SwitchAccountModal from './SwitchAccountModal'
import { resolveActiveSeatIdMask } from '@/domain/auth/utils/activeSeat'
import { useAuthorizedSeats } from '../hooks/useAuthorizedSeats'
import { getSeatSelected } from '../utils/session'

export default function ProfileAccountsSection({ user }) {
  const { t } = useTranslation()
  const [switchOpen, setSwitchOpen] = useState(false)
  const seatReady = Boolean(user?.seatSelected) || getSeatSelected()
  const { seats, isLoading, listError } = useAuthorizedSeats({ skip: !seatReady })
  const activeSeatIdMask = resolveActiveSeatIdMask(user, seats)

  if (!seatReady) {
    return null
  }

  return (
    <>
      <FormProfileSection
        icon={Building2}
        title={t('profile.sections.accounts', 'Authorized accounts')}
        headerTrailing={
          seats.length > 1 ? (
            <GigwButton type="button" variant="secondary" onClick={() => setSwitchOpen(true)}>
              {t('accountSwitch.menuLabel', 'Switch account')}
            </GigwButton>
          ) : null
        }
      >
        {isLoading ? (
          <SkeletonRegion message={t('accountSwitch.loading', 'Loading accounts…')}>
            <SkeletonBlock className="h-24 w-full rounded-lg" />
          </SkeletonRegion>
        ) : (
          <AccountSwitchSeatList
            user={user}
            seats={seats}
            isLoading={false}
            listError={listError}
            switchingIdMask=""
            interactive={false}
          />
        )}
        {activeSeatIdMask ? (
          <p className="m-0 mt-3 text-xs text-slate-500" role="note">
            {t('profile.activeSeatId', 'Active posting ID')}:{' '}
            <span className="font-mono text-slate-700">{activeSeatIdMask}</span>
          </p>
        ) : null}
      </FormProfileSection>

      <SwitchAccountModal open={switchOpen} onClose={() => setSwitchOpen(false)} />
    </>
  )
}
