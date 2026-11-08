import { describe, expect, it } from 'vitest'
import {
  contentLooksSensitive,
  isAllowedArchivePath,
  shouldExcludeArchiveEntry,
} from './sourceArchivePolicy.js'

describe('sourceArchivePolicy', () => {
  it('excludes dependencies and build output', () => {
    expect(shouldExcludeArchiveEntry('node_modules/react/index.js')).toBe(true)
    expect(shouldExcludeArchiveEntry('dist/assets/index.js')).toBe(true)
    expect(shouldExcludeArchiveEntry('.git/config')).toBe(true)
  })

  it('excludes private env but allows committed mode files', () => {
    expect(shouldExcludeArchiveEntry('.env')).toBe(true)
    expect(shouldExcludeArchiveEntry('.env.local')).toBe(true)
    expect(shouldExcludeArchiveEntry('.env.production.local')).toBe(true)
    expect(shouldExcludeArchiveEntry('.env.production')).toBe(false)
    expect(isAllowedArchivePath('.env.production')).toBe(true)
    expect(isAllowedArchivePath('.env.example')).toBe(true)
  })

  it('includes cursor rules for developers', () => {
    expect(isAllowedArchivePath('.cursor/rules/kran-shared-components.mdc')).toBe(true)
  })

  it('allows src and safe root files', () => {
    expect(isAllowedArchivePath('src/app/App.jsx')).toBe(true)
    expect(isAllowedArchivePath('package.json')).toBe(true)
    expect(isAllowedArchivePath('docs/ARCHITECTURE.md')).toBe(true)
  })

  it('flags obvious secret content', () => {
    expect(contentLooksSensitive('key_id=AKIAIOSFODNN7EXAMPLE')).toBe(true)
    expect(contentLooksSensitive('export const x = 1')).toBe(false)
  })
})
