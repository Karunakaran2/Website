import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useRegisterDashboardPageHeaderActions } from '@/app/shell/context/DashboardPageHeaderActionsContext'
import { BackButton } from '@/shared/components/buttons'

/** Probity pattern: Back lives in the page header band while an inline list form is open. */
export function useCmsFormPageHeaderBack(formOpen, onBack) {
  const { t } = useTranslation()

  const actions = useMemo(() => {
    if (!formOpen || !onBack) {
      return null
    }
    return (
      <BackButton type="button" onClick={onBack}>
        {t('common.backToList', { defaultValue: 'Back to list' })}
      </BackButton>
    )
  }, [formOpen, onBack, t])

  useRegisterDashboardPageHeaderActions(actions)
}