import { useTranslation } from 'react-i18next'
import {
  getPrimaryNavItems,
  getSecondaryNavItems,
  isSetupPrimary,
  isSetupModulePrimary,
  SETUP_PRIMARY_NAV_ITEMS,
  ASSET_MANAGEMENT_PRIMARY_NAV_ITEMS,
} from '../constants/dashboard'
import { useDashboardNav } from './useDashboardNav'

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

  const hasSecondaryRow =
    activePrimaryId !== 'inbox' && secondaryItems.length > 0

  const pageSubtitle = resolvePageSubtitle(t, activePrimaryId, activeSecondaryId)

  if (activePrimaryId === 'inbox') {
    const inboxSubtitle = pageSubtitle || t('home.pageSubtitle', { defaultValue: '' })
    return {
      title: primaryTitle,
      subtitle: inboxSubtitle || undefined,
    }
  }

  if (isSetupPrimary(activePrimaryId) || isSetupModulePrimary(activePrimaryId)) {
    const primaryItem = SETUP_PRIMARY_NAV_ITEMS.find((item) => item.id === activePrimaryId)
    const primaryLabel = t(`nav.primary.${activePrimaryId}`, {
      defaultValue: primaryItem?.label ?? activePrimaryId,
    })
    const setupTabs = getSecondaryNavItems(activePrimaryId)

    if (setupTabs.length > 0 && activeSecondaryId) {
      const tab = setupTabs.find((item) => item.id === activeSecondaryId)
      const tabLabel =
        tab?.label ??
        t(`nav.secondary.${activeSecondaryId}`, { defaultValue: activeSecondaryId })
      const isGenericOverview =
        activeSecondaryId === 'overview' || tabLabel.toLowerCase() === 'overview'
      if (isGenericOverview) {
        return { title: primaryLabel, subtitle: pageSubtitle || undefined }
      }
      return { title: tabLabel, subtitle: pageSubtitle || primaryLabel }
    }

    return {
      title: primaryLabel,
      subtitle: pageSubtitle || t('nav.setupArea', { defaultValue: 'Setup' }),
    }
  }

  if (ASSET_MANAGEMENT_PRIMARY_NAV_ITEMS.some((item) => item.id === activePrimaryId)) {
    const assetPrimaryItem = ASSET_MANAGEMENT_PRIMARY_NAV_ITEMS.find(
      (item) => item.id === activePrimaryId,
    )
    const assetPrimaryLabel = t(`nav.primary.${activePrimaryId}`, {
      defaultValue: assetPrimaryItem?.label ?? activePrimaryId,
    })
    const assetTabs = getSecondaryNavItems(activePrimaryId)
    if (assetTabs.length > 0 && activeSecondaryId) {
      const tab = assetTabs.find((item) => item.id === activeSecondaryId)
      const tabLabel =
        tab?.label ??
        t(`nav.secondary.${activeSecondaryId}`, { defaultValue: activeSecondaryId })
      const isGenericOverview =
        activeSecondaryId === 'overview' || tabLabel.toLowerCase() === 'overview'
      if (isGenericOverview) {
        return { title: assetPrimaryLabel, subtitle: pageSubtitle || undefined }
      }
      return { title: tabLabel, subtitle: pageSubtitle || assetPrimaryLabel }
    }
    return {
      title: assetPrimaryLabel,
      subtitle: pageSubtitle || undefined,
    }
  }

  if (hasSecondaryRow && activeSecondaryId) {
    const isGenericOverview =
      activeSecondaryId === 'overview' ||
      secondaryTitle.toLowerCase() === 'overview'
    if (isGenericOverview) {
      return { title: primaryTitle, subtitle: pageSubtitle || undefined }
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
