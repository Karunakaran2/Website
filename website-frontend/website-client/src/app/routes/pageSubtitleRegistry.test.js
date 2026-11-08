import { describe, expect, it } from 'vitest'
import { DASHBOARD_PAGE_REGISTRY } from './loadDomainPages'
import enBase from '@/app/i18n/locales/en'
import hiBase from '@/app/i18n/locales/hi'
import {
  buildModulePortalSubtitlesEn,
  buildModulePortalSubtitlesHi,
  mergeAppLocalePageSubtitles,
} from '@/app/i18n/buildModulePortalSubtitles'

const en = mergeAppLocalePageSubtitles(enBase, buildModulePortalSubtitlesEn())
const hi = mergeAppLocalePageSubtitles(hiBase, buildModulePortalSubtitlesHi())

/** Portal reference modules — exclude Probity-parity flat finance keys still in the registry. */
const SKIP_SUBTITLE_CHECK_PREFIXES = new Set(['dashboard'])

function collectRegistryKeysForSubtitleAudit() {
  return Object.keys(DASHBOARD_PAGE_REGISTRY).filter((key) => {
    const [primaryId] = key.split(':')
    return !SKIP_SUBTITLE_CHECK_PREFIXES.has(primaryId)
  })
}

function resolveSubtitle(locale, primaryId, secondaryId) {
  const primaryBlock = locale.pageSubtitles?.[primaryId]
  if (!primaryBlock || typeof primaryBlock !== 'object') {
    return undefined
  }
  return primaryBlock[secondaryId]
}

describe('pageSubtitle registry contract', () => {
  it('defines non-empty English and Hindi subtitles for registered portal pages', () => {
    const missingEn = []
    const missingHi = []
    const emptyEn = []
    const emptyHi = []

    for (const key of collectRegistryKeysForSubtitleAudit()) {
      const [primaryId, secondaryId] = key.split(':')
      const enSubtitle = resolveSubtitle(en, primaryId, secondaryId)
      const hiSubtitle = resolveSubtitle(hi, primaryId, secondaryId)

      if (enSubtitle === undefined) missingEn.push(key)
      else if (typeof enSubtitle !== 'string' || !enSubtitle.trim()) emptyEn.push(key)

      if (hiSubtitle === undefined) missingHi.push(key)
      else if (typeof hiSubtitle !== 'string' || !hiSubtitle.trim()) emptyHi.push(key)
    }

    expect(missingEn, `Missing en pageSubtitles:\n${missingEn.join('\n')}`).toEqual([])
    expect(emptyEn, `Empty en pageSubtitles:\n${emptyEn.join('\n')}`).toEqual([])
    expect(missingHi, `Missing hi pageSubtitles:\n${missingHi.join('\n')}`).toEqual([])
    expect(emptyHi, `Empty hi pageSubtitles:\n${emptyHi.join('\n')}`).toEqual([])
  })
})
