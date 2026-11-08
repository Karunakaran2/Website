import { useTranslation } from 'react-i18next'
import ModulePlaceholder from '@/shared/components/ui/ModulePlaceholder'

/**
 * Placeholder for primary menus whose secondary tabs are not implemented yet.
 */
export default function SubmenuPlaceholderPage({ primaryId, secondaryId }) {
  const { t } = useTranslation()
  const primaryTitle = t(`nav.primary.${primaryId}`, { defaultValue: primaryId })
  const secondaryLabel = t(`nav.secondary.${secondaryId}`, { defaultValue: secondaryId })
  const title = `${primaryTitle} — ${secondaryLabel}`

  return (
    <ModulePlaceholder title={title} description={t('modules.comingSoon', { title: primaryTitle })} />
  )
}
