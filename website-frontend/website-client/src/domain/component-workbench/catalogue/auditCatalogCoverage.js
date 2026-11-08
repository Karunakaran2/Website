import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { WORKBENCH_COMPONENT_CATALOG } from './workbenchComponentRegistry.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../../../..')
const sharedRoot = path.join(repoRoot, 'src', 'shared', 'components')

const SKIP_DIRS = new Set(['__mocks__'])
const SKIP_FILE_PATTERN = /\.(test|spec)\.(jsx|js)$/

function walkJsxFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    if (name.isDirectory()) {
      if (SKIP_DIRS.has(name.name)) continue
      walkJsxFiles(path.join(dir, name.name), acc)
      continue
    }
    if (!name.name.endsWith('.jsx')) continue
    if (SKIP_FILE_PATTERN.test(name.name)) continue
    acc.push(path.join(dir, name.name))
  }
  return acc
}

/** @returns {Set<string>} paths relative to src/shared/components */
export function getRegistrySharedPaths(catalog = WORKBENCH_COMPONENT_CATALOG) {
  const paths = new Set()
  for (const entry of catalog) {
    if (entry.sharedPath) {
      paths.add(entry.sharedPath.replace(/\\/g, '/'))
    }
    if (entry.importPath?.startsWith('@/shared/components/')) {
      const tail = entry.importPath.replace('@/shared/components/', '')
      if (tail.endsWith('.jsx')) {
        paths.add(tail)
      } else {
        paths.add(`${tail}.jsx`)
        const base = tail.split('/').pop()
        paths.add(`${base}.jsx`)
      }
    }
    if (entry.name) {
      paths.add(`${entry.name}.jsx`)
    }
  }
  return paths
}

export function auditSharedComponentCoverage(catalog = WORKBENCH_COMPONENT_CATALOG) {
  const jsxFiles = walkJsxFiles(sharedRoot)
  const registryPaths = getRegistrySharedPaths(catalog)
  const listed = []
  const unlisted = []

  for (const file of jsxFiles) {
    const rel = path.relative(sharedRoot, file).replace(/\\/g, '/')
    const base = path.basename(file)
    const hit =
      registryPaths.has(rel)
      || registryPaths.has(base)
      || catalog.some(
        (e) =>
          e.name === base.replace('.jsx', '')
          || e.name === path.basename(rel, '.jsx'),
      )
    if (hit) {
      listed.push(rel)
    } else {
      unlisted.push(rel)
    }
  }

  return {
    totalJsx: jsxFiles.length,
    listedCount: listed.length,
    unlistedCount: unlisted.length,
    unlisted: unlisted.sort(),
    listed: listed.sort(),
  }
}
