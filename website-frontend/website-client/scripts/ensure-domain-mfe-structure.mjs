/**
 * Ensures each src/domain/* module has the standard MFE folder layout.
 * Idempotent: skips files that already exist.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const domainRoot = path.join(__dirname, '..', 'src', 'domain')

const STANDARD_DIRS = [
  'components',
  'constants',
  'hooks',
  'layouts',
  'redux',
  'services',
  'utils',
  'types',
]

/** @type {Array<{ id: string, camel: string, pascal: string, reduxKey?: string, tag: string, skipDirs?: string[] }>} */
const DOMAINS = [
  { id: 'accounting', camel: 'accounting', pascal: 'Accounting', tag: 'Accounting' },
  { id: 'asset', camel: 'asset', pascal: 'Asset', tag: 'Asset' },
  { id: 'audit-closure', camel: 'auditClosure', pascal: 'AuditClosure', tag: 'AuditClosure' },
  { id: 'auth', camel: 'auth', pascal: 'Auth', tag: 'Auth', skipDirs: ['routes'] },
  { id: 'bank-integration', camel: 'bankIntegration', pascal: 'BankIntegration', tag: 'BankIntegration' },
  { id: 'budget', camel: 'budget', pascal: 'Budget', tag: 'Budget' },
  { id: 'dashboard', camel: 'dashboard', pascal: 'Dashboard', tag: 'Dashboard' },
  { id: 'deposits', camel: 'deposits', pascal: 'Deposits', tag: 'Deposits' },
  { id: 'external-integration', camel: 'externalIntegration', pascal: 'ExternalIntegration', tag: 'ExternalIntegration' },
  { id: 'financial-sanction', camel: 'financialSanction', pascal: 'FinancialSanction', tag: 'FinancialSanction' },
  { id: 'payment', camel: 'payment', pascal: 'Payment', tag: 'Payment' },
  {
    id: 'reporting',
    camel: 'reporting',
    pascal: 'Reporting',
    reduxKey: 'reports',
    tag: 'Report',
  },
  { id: 'setup', camel: 'setup', pascal: 'Setup', tag: 'Setup' },
  { id: 'statutory-payment', camel: 'statutoryPayment', pascal: 'StatutoryPayment', tag: 'StatutoryPayment' },
  { id: 'voucher-approval', camel: 'voucherApproval', pascal: 'VoucherApproval', tag: 'VoucherApproval' },
]

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function writeIfMissing(filePath, content) {
  if (fs.existsSync(filePath)) {
    return false
  }
  ensureDir(path.dirname(filePath))
  fs.writeFileSync(filePath, content, 'utf8')
  return true
}

function gitkeep(domainDir, sub) {
  writeIfMissing(path.join(domainDir, sub, '.gitkeep'), '')
}

function constantsContent() {
  return `export const DEFAULT_PAGE_SIZE = 10

export const LIST_PAGE_SIZE_OPTIONS = [
  { value: 10, label: '10' },
  { value: 25, label: '25' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
]
`
}

function sliceContent({ camel, pascal, reduxKey }) {
  const stateKey = reduxKey ?? camel
  return `import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  /** Client UI state for ${pascal} (extend when features land). */
  ready: true,
}

const ${camel}Slice = createSlice({
  name: '${stateKey}',
  initialState,
  reducers: {
    reset${pascal}UiState() {
      return initialState
    },
  },
})

export const { reset${pascal}UiState } = ${camel}Slice.actions
export const ${camel}Reducer = ${camel}Slice.reducer
`
}

function selectorsContent({ camel, reduxKey }) {
  const stateKey = reduxKey ?? camel
  return `export const select${camel.charAt(0).toUpperCase() + camel.slice(1)}State = (state) => state.${stateKey}
`
}

function apiContent({ camel, pascal, tag }) {
  const hookName = `useGet${pascal}ModuleHealthQuery`
  return `import { baseApi } from '@/shared/api/baseApi'

/** RTK Query endpoints for ${pascal}. Replace stub queryFn with real HTTP when APIs exist. */
export const ${camel}Api = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    get${pascal}ModuleHealth: builder.query({
      queryFn: async () => ({ data: { ok: true } }),
      providesTags: ['${tag}'],
    }),
  }),
})

export const { ${hookName} } = ${camel}Api
`
}

function typesContent({ pascal }) {
  return `/**
 * Domain types for ${pascal} (JSDoc). Add @typedef blocks as APIs stabilize.
 */

export {}
`
}

function layoutPanelContent({ pascal }) {
  return `/** Shell layout entry for ${pascal}; re-export panel until a dedicated layout is needed. */
export { default } from '../pages/${pascal}Panel'
`
}

function panelPageExists(domainDir, pascal) {
  return fs.existsSync(path.join(domainDir, 'pages', `${pascal}Panel.jsx`))
}

const created = []

for (const domain of DOMAINS) {
  const domainDir = path.join(domainRoot, domain.id)
  if (!fs.existsSync(domainDir)) {
    continue
  }

  const skip = new Set(domain.skipDirs ?? [])

  for (const sub of STANDARD_DIRS) {
    if (skip.has(sub)) {
      continue
    }
    const subPath = path.join(domainDir, sub)
    ensureDir(subPath)

    if (sub === 'components' || sub === 'hooks' || sub === 'utils') {
      if (writeIfMissing(path.join(subPath, '.gitkeep'), '')) {
        created.push(`${domain.id}/${sub}/.gitkeep`)
      }
      continue
    }

    if (sub === 'constants') {
      const f = path.join(subPath, 'listDefaults.js')
      if (writeIfMissing(f, constantsContent())) {
        created.push(`${domain.id}/constants/listDefaults.js`)
      }
      continue
    }

    if (sub === 'redux') {
      const slicePath = path.join(subPath, 'slice.js')
      const selPath = path.join(subPath, 'selectors.js')
      if (writeIfMissing(slicePath, sliceContent(domain))) {
        created.push(`${domain.id}/redux/slice.js`)
      }
      if (writeIfMissing(selPath, selectorsContent(domain))) {
        created.push(`${domain.id}/redux/selectors.js`)
      }
      continue
    }

    if (sub === 'services') {
      const apiFile =
        domain.id === 'reporting'
          ? path.join(subPath, 'reportsApi.js')
          : path.join(subPath, `${domain.camel}Api.js`)
      if (fs.existsSync(apiFile)) {
        continue
      }
      if (domain.id === 'reporting') {
        continue
      }
      if (writeIfMissing(apiFile, apiContent(domain))) {
        created.push(`${domain.id}/services/${path.basename(apiFile)}`)
      }
      continue
    }

    if (sub === 'types') {
      const typeFile = path.join(subPath, `${domain.camel}.js`)
      if (writeIfMissing(typeFile, typesContent(domain))) {
        created.push(`${domain.id}/types/${domain.camel}.js`)
      }
      continue
    }

    if (sub === 'layouts') {
      const layoutFile = path.join(subPath, `${domain.pascal}Panel.jsx`)
      if (fs.existsSync(layoutFile)) {
        continue
      }
      if (panelPageExists(domainDir, domain.pascal)) {
        if (writeIfMissing(layoutFile, layoutPanelContent(domain))) {
          created.push(`${domain.id}/layouts/${domain.pascal}Panel.jsx`)
        }
      } else {
        if (writeIfMissing(path.join(subPath, '.gitkeep'), '')) {
          created.push(`${domain.id}/layouts/.gitkeep`)
        }
      }
    }
  }
}

console.log(`Created ${created.length} scaffold file(s):`)
for (const line of created) {
  console.log(`  - ${line}`)
}
