import { useTranslation } from 'react-i18next'
import ModulePlaceholder from '@/shared/components/ui/ModulePlaceholder'

export default function OverviewPanel({ title }) {
  const { t } = useTranslation()

  return (
    <ModulePlaceholder
      title={title || t('nav.primary.inbox')}
      description={t('home.overviewPlaceholder')}
    />
  )
}
