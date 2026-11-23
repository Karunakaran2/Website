import { describe, expect, it } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { DASHBOARD_PAGE_REGISTRY } from './loadDomainPages'
import { resolveDashboardPage } from './loadDomainPages'
import { buildKranAdminPages } from '@/domain/website-cms/routes/buildKranAdminPages'
import { getDefaultSecondaryTabId, getSecondaryNavItems } from '@/app/shell/constants/dashboard'
import { WEBSITE_CMS_PRIMARY_IDS } from '@/domain/website-cms/constants/websiteCmsNav'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

const ROUTE_SOURCE_FILES = ['domain/website-cms/routes/buildKranAdminPages.js']

function parseLazyImportsFromSource(sourceText) {
  const map = new Map()
  const pattern =
    /['"]([a-z0-9-]+:[a-z0-9-]+)['"]\s*:\s*(?:page\()?\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)\)?/g
  let match = pattern.exec(sourceText)
  while (match) {
    map.set(match[1], match[2])
    match = pattern.exec(sourceText)
  }
  return map
}

function resolveImportPath(routeFileRelative, importRelative) {
  const routeDir = path.dirname(path.join(projectRoot, routeFileRelative))
  const base = path.normalize(path.join(routeDir, importRelative.replace(/^@\//, '')))
  const fromAlias = path.normalize(
    path.join(projectRoot, importRelative.replace(/^@\//, '')),
  )
  const candidates = [
    `${base}.jsx`,
    `${base}.js`,
    base,
    `${fromAlias}.jsx`,
    `${fromAlias}.js`,
    fromAlias,
  ]
  return candidates.find((candidate) => existsSync(candidate)) ?? null
}

describe('registry import contract', () => {
  it('has unique registry keys', () => {
    const keys = Object.keys(DASHBOARD_PAGE_REGISTRY)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('resolves lazy import files for every CMS admin page declaration', () => {
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

  it('includes every host registry key in CMS route declarations', () => {
    const declared = new Set()
    for (const key of Object.keys(buildKranAdminPages())) declared.add(key)
    for (const routeFile of ROUTE_SOURCE_FILES) {
      const source = readFileSync(path.join(projectRoot, routeFile), 'utf8')
      for (const key of parseLazyImportsFromSource(source).keys()) {
        declared.add(key)
      }
    }
    const undeclared = Object.keys(DASHBOARD_PAGE_REGISTRY).filter((key) => !declared.has(key))
    expect(undeclared, undeclared.join('\n')).toEqual([])
  })

  it('resolves every CMS primary nav tab', () => {
    const missing = []
    for (const primaryId of WEBSITE_CMS_PRIMARY_IDS) {
      const tabs = getSecondaryNavItems(primaryId)
      const secondaryIds =
        tabs.length > 0 ? tabs.map((t) => t.id) : [getDefaultSecondaryTabId(primaryId)]
      for (const secondaryId of secondaryIds) {
        if (!resolveDashboardPage(primaryId, secondaryId)) {
          missing.push(`${primaryId}:${secondaryId}`)
        }
      }
    }
    expect(missing, missing.join('\n')).toEqual([])
  })
})