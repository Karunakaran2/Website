import { useTranslation } from 'react-i18next'
import ModulePlaceholder from '@/shared/components/ui/ModulePlaceholder'

export default function DashboardPanel() {
  const { t } = useTranslation()
  const title = t('modules.dashboard')

  return <ModulePlaceholder title={title} description={t('modules.comingSoon', { title })} />
}
