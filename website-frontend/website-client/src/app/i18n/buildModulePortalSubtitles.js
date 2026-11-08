import { MODULE_1_SECONDARY_NAV_BY_PRIMARY } from '@/domain/module-1/constants/module1Nav'
import { MODULE_2_SECONDARY_NAV_BY_PRIMARY } from '@/domain/module-2/constants/module2Nav'

function buildPrimarySubtitles(navByPrimary, moduleDescriptor, locale) {
  const pageSubtitles = {}
  for (const [primaryId, tabs] of Object.entries(navByPrimary)) {
    pageSubtitles[primaryId] = {}
    for (const tab of tabs) {
      if (locale === 'hi') {
        pageSubtitles[primaryId][tab.id] =
          `${tab.label} — ${moduleDescriptor}.`
      } else {
        pageSubtitles[primaryId][tab.id] =
          `${tab.label} — ${moduleDescriptor}.`
      }
    }
  }
  return pageSubtitles
}

/** Page header subtitles for Module 1 primary/secondary nav (merged into i18n). */
export function buildModulePortalSubtitlesEn() {
  return {
    ...buildPrimarySubtitles(
      MODULE_1_SECONDARY_NAV_BY_PRIMARY,
      'Enterprise business workflows',
      'en',
    ),
    ...buildPrimarySubtitles(
      MODULE_2_SECONDARY_NAV_BY_PRIMARY,
      'Workforce and operational workflows',
      'en',
    ),
  }
}

export function buildModulePortalSubtitlesHi() {
  return {
    ...buildPrimarySubtitles(
      MODULE_1_SECONDARY_NAV_BY_PRIMARY,
      'मॉड्यूल 1 उद्यम',
      'hi',
    ),
    ...buildPrimarySubtitles(
      MODULE_2_SECONDARY_NAV_BY_PRIMARY,
      'मॉड्यूल 2 कार्यबल',
      'hi',
    ),
  }
}

export function mergeAppLocalePageSubtitles(appLocale, builtPrimaryBlocks) {
  return {
    ...appLocale,
    pageSubtitles: {
      ...(appLocale.pageSubtitles ?? {}),
      ...builtPrimaryBlocks,
    },
  }
}
