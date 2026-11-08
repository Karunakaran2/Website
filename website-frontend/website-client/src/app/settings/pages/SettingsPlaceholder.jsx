import { useTranslation } from 'react-i18next'
import ModulePlaceholder from '@/shared/components/ui/ModulePlaceholder'

export default function SettingsPlaceholder() {
  const { t } = useTranslation()

  return (
    <ModulePlaceholder
      title={t('modules.settings')}
      description={t('modules.settingsComingSoon')}
    />
  )
}
