import { useTranslation } from 'react-i18next'
import FormModal from '@/shared/components/modals/FormModal'
import { Briefcase } from 'lucide-react'
import AccountSwitchSeatList from './AccountSwitchSeatList'
import { useAccountSwitch } from '../hooks/useAccountSwitch'

export default function SwitchAccountModal({ open, onClose }) {
  const { t } = useTranslation()
  const {
    user,
    seats,
    isLoading,
    listError,
    switchingIdMask,
    switchToSeat,
    canSwitch,
  } = useAccountSwitch({ enabled: open, onSwitched: onClose })

  const handleClose = () => {
    if (switchingIdMask) {
      return
    }
    onClose?.()
  }

  return (
    <FormModal
      open={open}
      onClose={handleClose}
      title={t('accountSwitch.modalTitle', 'Switch account')}
      subtitle={t(
        'accountSwitch.modalSubtitle',
        'Choose another authorized posting. You stay signed in; your module context will refresh.',
      )}
      icon={<Briefcase size={16} aria-hidden />}
      size="lg"
      showFooter={false}
      cancelDisabled={Boolean(switchingIdMask)}
      stack="nested"
    >
      {!canSwitch ? (
        <p className="m-0 text-sm text-slate-600" role="note">
          {t(
            'accountSwitch.selectSeatFirst',
            'Complete seat selection after login before switching accounts.',
          )}
        </p>
      ) : (
        <AccountSwitchSeatList
          user={user}
          seats={seats}
          isLoading={isLoading}
          listError={listError}
          switchingIdMask={switchingIdMask}
          onSwitchSeat={switchToSeat}
        />
      )}
    </FormModal>
  )
}
