import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '@/shared/constants'
import AccountCard from './AccountCard'
import { ACCOUNTS } from '../constants/accounts'
import { useAccountSelection } from '../hooks/useAccountSelection'

export default function AccountSelection() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { selectedAccountId, setSelectedAccountId } = useAccountSelection()

  const handleAccountSelect = (accountId) => {
    setSelectedAccountId(accountId)
    navigate(ROUTES.HOME)
  }

  return (
    <section aria-label={t('accounts.title')}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
        {ACCOUNTS.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            selected={selectedAccountId === account.id}
            onSelect={handleAccountSelect}
          />
        ))}
      </div>
    </section>
  )
}
