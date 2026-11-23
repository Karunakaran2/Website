import { useTranslation } from 'react-i18next'
import { getPrimaryNavItems, getSecondaryNavItems } from '../constants/dashboard'
import { useDashboardNav } from './useDashboardNav'
import { isWebsiteCmsPrimary } from '@/domain/website-cms/constants/websiteCmsNav'

function resolvePageSubtitle(t, primaryId, secondaryId) {
  const secondaryKey = secondaryId || 'overview'
  return t(`pageSubtitles.${primaryId}.${secondaryKey}`, { defaultValue: '' })
}

/** Page heading for a primary and secondary nav id. Shared by the header and the document title. */
export function resolveDashboardPageHeading(t, activePrimaryId, activeSecondaryId) {
  const primaryItems = getPrimaryNavItems(activePrimaryId)
  const primaryItem = primaryItems.find((item) => item.id === activePrimaryId)
  const secondaryItems = getSecondaryNavItems(activePrimaryId)
  const secondaryItem = secondaryItems.find((item) => item.id === activeSecondaryId)

  const primaryTitle =
    primaryItem?.label ??
    t(`nav.primary.${activePrimaryId}`, {
      defaultValue: activePrimaryId,
    })
  const secondaryTitle =
    secondaryItem?.label ??
    t(`nav.secondary.${activeSecondaryId}`, {
      defaultValue: activeSecondaryId,
    })

  const cmsCategory =
    isWebsiteCmsPrimary(activePrimaryId) && activePrimaryId !== 'website-dashboard'

  const hasSecondaryRow = activePrimaryId !== 'inbox' && secondaryItems.length > 0

  const pageSubtitle = resolvePageSubtitle(t, activePrimaryId, activeSecondaryId)

  if (activePrimaryId === 'inbox') {
    const inboxSubtitle = pageSubtitle || t('home.pageSubtitle', { defaultValue: '' })
    return {
      title: primaryTitle,
      subtitle: inboxSubtitle || undefined,
    }
  }

  if (hasSecondaryRow && activeSecondaryId) {
    const isGenericOverview =
      activeSecondaryId === 'overview' ||
      secondaryTitle.toLowerCase() === 'overview'
    if (isGenericOverview) {
      return { title: primaryTitle, subtitle: pageSubtitle || undefined }
    }
    if (cmsCategory) {
      return {
        title: secondaryTitle,
        subtitle: pageSubtitle || primaryTitle,
      }
    }
    return { title: secondaryTitle, subtitle: pageSubtitle || primaryTitle }
  }

  return { title: primaryTitle, subtitle: pageSubtitle || undefined }
}

/** Org UI page title/subtitle from active nav (Probity card header pattern). */
export function useDashboardPageHeader() {
  const { t } = useTranslation()
  const { activePrimaryId, activeSecondaryId } = useDashboardNav()
  return resolveDashboardPageHeading(t, activePrimaryId, activeSecondaryId)
}
