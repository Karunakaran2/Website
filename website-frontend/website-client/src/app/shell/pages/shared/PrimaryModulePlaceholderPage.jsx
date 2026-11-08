import { useTranslation } from 'react-i18next'
import ModulePlaceholder from '@/shared/components/ui/ModulePlaceholder'

/** Placeholder for a whole primary module (all secondaries share one panel today). */
export default function PrimaryModulePlaceholderPage({ primaryId }) {
  const { t } = useTranslation()
  const title = t(`nav.primary.${primaryId}`, { defaultValue: primaryId })

  return <ModulePlaceholder title={title} description={t('modules.comingSoon', { title })} />
}
