import { describe, expect, it } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { DASHBOARD_PAGE_REGISTRY } from './loadDomainPages'
import {
  ASSET_ID,
  ASSET_SUB_TABS,
  SETUP_HOME_ID,
  SETUP_PRIMARY_NAV_ITEMS,
  getDefaultSecondaryTabId,
  getSecondaryNavItems,
} from '@/app/shell/constants/dashboard'
import { getModuleRoute } from '@/shared/constants'
import { resolveDashboardPage } from './loadDomainPages'
import { buildModule1Pages } from '@/domain/module-1/routes/buildModule1Pages'
import { buildModule2Pages } from '@/domain/module-2/routes/buildModule2Pages'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

const ROUTE_SOURCE_FILES = [
  'domain/administration/setup/routes/index.js',
  'domain/administration/asset/routes/index.js',
  'domain/component-workbench/routes/index.js',
  'domain/module-1/routes/buildModule1Pages.js',
  'domain/module-1/routes/sampleModuleRoutes.js',
  'domain/design-guidelines/routes/index.js',
  'domain/module-2/routes/buildModule2Pages.js',
  'domain/module-2/routes/index.js',
  'domain/dashboard/routes/index.js',
]

/** Registry keys that must map to a specific page module (regression guard). */
const CRITICAL_IMPORT_TARGETS = {
  'setup-dashboard:overview': 'SetupDashboardPage',
  'setup-master-data:overview': 'MasterDataPage',
  'asset-dashboard:overview': 'AssetDashboardPage',
  'asset-register:overview': 'AssetRegisterPage',
}

function parseLazyImportsFromSource(sourceText) {
  const map = new Map()
  const pattern =
    /['"]([a-z0-9-]+:[a-z0-9-]+)['"]\s*:\s*page\(\(\)\s*=>\s*import\(['"](\.\.?\/[^'"]+)['"]\)\)/g
  let match = pattern.exec(sourceText)
  while (match) {
    map.set(match[1], match[2])
    match = pattern.exec(sourceText)
  }
  return map
}

function resolveImportPath(routeFileRelative, importRelative) {
  const routeDir = path.dirname(path.join(projectRoot, routeFileRelative))
  const base = path.normalize(path.join(routeDir, importRelative))
  const candidates = [`${base}.jsx`, `${base}.js`, base]
  return candidates.find((candidate) => existsSync(candidate)) ?? null
}

describe('registry import contract', () => {
  it('has unique registry keys', () => {
    const keys = Object.keys(DASHBOARD_PAGE_REGISTRY)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('resolves lazy import files for every entry declared in route source files', () => {
    const missingFiles = []
    for (const routeFile of ROUTE_SOURCE_FILES) {
      const abs = path.join(projectRoot, routeFile)
      const source = readFileSync(abs, 'utf8')
      const imports = parseLazyImportsFromSource(source)
      for (const [registryKey, importRel] of imports) {
        const resolved = resolveImportPath(routeFile, importRel)
        if (!resolved) {
          missingFiles.push(`${registryKey} → ${routeFile} ${importRel}`)
        }
      }
    }
    expect(missingFiles, missingFiles.join('\n')).toEqual([])
  })

  it('includes every host registry key in route source declarations or inbox', () => {
    const declared = new Set(['inbox:overview'])
    for (const routeFile of ROUTE_SOURCE_FILES) {
      const source = readFileSync(path.join(projectRoot, routeFile), 'utf8')
      for (const key of parseLazyImportsFromSource(source).keys()) {
        declared.add(key)
      }
    }
    for (const key of Object.keys(buildModule1Pages())) declared.add(key)
    for (const key of Object.keys(buildModule2Pages())) declared.add(key)
    const undeclared = Object.keys(DASHBOARD_PAGE_REGISTRY).filter((key) => !declared.has(key))
    expect(undeclared, undeclared.join('\n')).toEqual([])
  })

  it('maps critical administration reference screens to the intended page modules', () => {
    const setupSource = readFileSync(
      path.join(projectRoot, 'domain/administration/setup/routes/index.js'),
      'utf8',
    )
    const assetSource = readFileSync(
      path.join(projectRoot, 'domain/administration/asset/routes/index.js'),
      'utf8',
    )
    const setupImports = parseLazyImportsFromSource(setupSource)
    const assetImports = parseLazyImportsFromSource(assetSource)

    for (const [key, moduleName] of Object.entries(CRITICAL_IMPORT_TARGETS)) {
      const importRel =
        key.startsWith('asset-') || key.startsWith('asset:')
          ? assetImports.get(key)
          : setupImports.get(key)
      expect(importRel, key).toBeTruthy()
      expect(importRel).toContain(moduleName)
    }
  })

  it('resolves administration setup primary nav tabs (excluding setup-home)', () => {
    const missing = []
    for (const item of SETUP_PRIMARY_NAV_ITEMS) {
      if (item.id === SETUP_HOME_ID) continue
      if (item.id === ASSET_ID) {
        for (const tab of ASSET_SUB_TABS) {
          if (!resolveDashboardPage(ASSET_ID, tab.id)) {
            missing.push(`${ASSET_ID}:${tab.id}`)
          }
        }
        continue
      }
      for (const secondaryId of secondaryIdsForPrimary(item.id)) {
        if (!resolveDashboardPage(item.id, secondaryId)) {
          missing.push(`${item.id}:${secondaryId}`)
        }
      }
    }
    expect(missing, missing.join('\n')).toEqual([])
  })

  it('builds canonical URLs for every registry key in route sources', () => {
    const bad = []
    for (const routeFile of ROUTE_SOURCE_FILES) {
      const source = readFileSync(path.join(projectRoot, routeFile), 'utf8')
      const imports = parseLazyImportsFromSource(source)
      for (const registryKey of imports.keys()) {
        const [primaryId, secondaryId] = registryKey.split(':')
        if (primaryId === 'dashboard') {
          // Probity-parity flat routes (/dashboard/overview) — not portal module prefixes.
          continue
        }
        const url = getModuleRoute(primaryId, secondaryId)
        if (!url.startsWith('/') || url.includes(':accountId')) {
          bad.push(`${registryKey} → ${url}`)
        }
        if (url.startsWith('/dashboard/') || url === '/dashboard') {
          bad.push(`${registryKey} → legacy dashboard prefix ${url}`)
        }
      }
    }
    expect(bad, bad.join('\n')).toEqual([])
  })
})

function secondaryIdsForPrimary(primaryId) {
  const tabs = getSecondaryNavItems(primaryId)
  if (tabs.length > 0) {
    return tabs.map((tab) => tab.id)
  }
  return [getDefaultSecondaryTabId(primaryId) || 'overview']
}
