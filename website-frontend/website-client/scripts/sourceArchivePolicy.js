/** @typedef {'deny' | 'allow'} ArchiveDecision */

const DENY_DIR_NAMES = new Set([
  'node_modules',
  'dist',
  '.git',
  'coverage',
  'test-results',
  'releases',
  'AgentStores',
])

/** Committed Vite mode env files (no local overrides). */
const ALLOWED_ENV_MODE_FILES = new Set([
  '.env.example',
  '.env.development',
  '.env.testing',
  '.env.uat',
  '.env.production',
  '.env.kran-development',
  '.env.kran-testing',
  '.env.kran-uat',
  '.env.kran-production',
])

const ALLOW_ROOT_FILES = new Set([
  'package.json',
  'package-lock.json',
  'index.html',
  'vite.config.js',
  'postcss.config.js',
  'tailwind.config.js',
  'jsconfig.json',
  'README.md',
  'AGENTS.md',
  'frontend-kran-design-system.yaml',
  ...ALLOWED_ENV_MODE_FILES,
])

const ALLOW_TOP_DIRS = new Set(['src', 'docs', 'public', 'scripts', 'tailwreck', '.cursor'])

const SECRET_FILE_PATTERN =
  /(?:^|\/)\.env(?!\.example)(?:\.|$)|(?:^|\/)id_rsa|\.pem$|\.pfx$|\.p12$|credentials\.json$/i

const SECRET_CONTENT_PATTERN =
  /(?:AKIA[0-9A-Z]{16}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/

/**
 * @param {string} relativePosix path from repo root, forward slashes
 * @returns {boolean}
 */
export function shouldExcludeArchiveEntry(relativePosix) {
  const normalized = relativePosix.replace(/\\/g, '/').replace(/^\.\//, '').replace(/\/+$/, '')
  if (!normalized) return true

  const segments = normalized.split('/')
  if (segments.some((segment) => DENY_DIR_NAMES.has(segment))) {
    return true
  }

  const base = segments[segments.length - 1]
  if (base === '.env') return true
  if (base.includes('.local')) return true
  if (segments.length === 1 && ALLOWED_ENV_MODE_FILES.has(base)) return false
  if (base.startsWith('.env.') && !ALLOWED_ENV_MODE_FILES.has(base)) return true
  if (base.endsWith('.zip') || base.endsWith('.log')) return true
  if (SECRET_FILE_PATTERN.test(normalized)) return true

  return false
}

/**
 * @param {string} relativePosix
 * @returns {boolean}
 */
export function isAllowedArchivePath(relativePosix) {
  const normalized = relativePosix.replace(/\\/g, '/').replace(/^\.\//, '')
  if (shouldExcludeArchiveEntry(normalized)) return false

  if (!normalized.includes('/')) {
    return ALLOW_ROOT_FILES.has(normalized)
  }

  const [top] = normalized.split('/')
  return ALLOW_TOP_DIRS.has(top)
}

/**
 * @param {string} text
 * @returns {boolean}
 */
export function contentLooksSensitive(text) {
  return SECRET_CONTENT_PATTERN.test(text)
}

export const SOURCE_ARCHIVE_POLICY = {
  ALLOW_ROOT_FILES,
  ALLOW_TOP_DIRS,
  DENY_DIR_NAMES,
}
