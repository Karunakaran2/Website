/**
 * In-Memory & LocalStorage Mock State Store
 * Keeps state persistent across browser navigation and reloads.
 */
import { MOCK_COMPANY_SETUP, MOCK_OFFICES, MOCK_COST_CATEGORIES, MOCK_COST_CENTRES, MOCK_HOA_LIST, MOCK_PARTIES, MOCK_BANKS, MOCK_BANK_ACCOUNTS, MOCK_CASH_ACCOUNTS, MOCK_NUMBERING_SETUPS, MOCK_SERVICE_TYPES, MOCK_UOM, MOCK_TDS_TYPES, MOCK_TCS_TYPES, MOCK_HSN_CODES, MOCK_SAC_CODES, MOCK_DFPR_USERS } from './data/setupMockData'
import { MOCK_DRAFT_VOUCHERS, MOCK_CONTRA_ENTRIES, MOCK_REVERSABLE_VOUCHERS, MOCK_RECURRING_VOUCHERS } from './data/accountingMockData'
const MOCK_VOUCHER_APPROVALS = []
const MOCK_STATUTORY_PAYMENTS = []
import { MOCK_BUDGET_HEADS, MOCK_BUDGET_INITIATIONS, MOCK_BUDGET_PREPARATIONS, MOCK_BUDGET_REAPPROPRIATIONS, MOCK_BUDGET_VS_ACTUAL } from './data/budgetMockData'
import { MOCK_FINANCIAL_SANCTIONS, MOCK_PURCHASE_SANCTIONS } from './data/financialSanctionMockData'
import { MOCK_PAYMENT_SANCTIONS } from './data/paymentMockData'
import { MOCK_DEPOSITS } from './data/depositsMockData'
import { MOCK_DASHBOARD_CARDS, MOCK_DASHBOARD_CHARTS } from './data/dashboardMockData'
import { MOCK_FA_GROUP_ROWS } from '@/domain/administration/asset/constants/faGroupMockData'
import { MOCK_ASSET_INFORMATION_ROWS } from '@/domain/administration/asset/constants/assetInformationMockData'
import { MOCK_OPENING_FIXED_ASSET_IMPORT_ROWS } from '@/domain/administration/asset/constants/openingFixedAssetMockData'


const STORAGE_PREFIX = 'kran_ds_mock_'

function loadStored(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch {
    // fallback
  }
  return fallback
}

function saveStored(key, data) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(data))
  } catch {
    // ignore
  }
}

// In-memory active stores
class MockStore {
  constructor() {
    this.company = loadStored('company', MOCK_COMPANY_SETUP)
    this.offices = loadStored('offices', [...MOCK_OFFICES])
    this.costCategories = loadStored('costCategories', [...MOCK_COST_CATEGORIES])
    this.costCentres = loadStored('costCentres', [...MOCK_COST_CENTRES])
    this.hoaList = loadStored('hoaList', [...MOCK_HOA_LIST])
    this.parties = loadStored('parties', [...MOCK_PARTIES])
    this.banks = loadStored('banks', [...MOCK_BANKS])
    this.bankAccounts = loadStored('bankAccounts', [...MOCK_BANK_ACCOUNTS])
    this.cashAccounts = loadStored('cashAccounts', [...MOCK_CASH_ACCOUNTS])
    this.numbering = loadStored('numbering', [...MOCK_NUMBERING_SETUPS])
    this.serviceTypes = loadStored('serviceTypes', [...MOCK_SERVICE_TYPES])
    this.uom = loadStored('uom', [...MOCK_UOM])
    this.tdsTypes = loadStored('tdsTypes', [...MOCK_TDS_TYPES])
    this.tcsTypes = loadStored('tcsTypes', [...MOCK_TCS_TYPES])
    this.hsnCodes = loadStored('hsnCodes', [...MOCK_HSN_CODES])
    this.sacCodes = loadStored('sacCodes', [...MOCK_SAC_CODES])
    this.dfprUsers = loadStored('dfprUsers', [...MOCK_DFPR_USERS])

    this.draftVouchers = loadStored('draftVouchers', [...MOCK_DRAFT_VOUCHERS])
    this.contraEntries = loadStored('contraEntries', [...MOCK_CONTRA_ENTRIES])
    this.voucherApprovals = loadStored('voucherApprovals', [...MOCK_VOUCHER_APPROVALS])
    this.reversibleVouchers = loadStored('reversibleVouchers', [...MOCK_REVERSABLE_VOUCHERS])
    this.recurringVouchers = loadStored('recurringVouchers', [...MOCK_RECURRING_VOUCHERS])

    this.budgetHeads = loadStored('budgetHeads', [...MOCK_BUDGET_HEADS])
    this.budgetInitiations = loadStored('budgetInitiations', [...MOCK_BUDGET_INITIATIONS])
    this.budgetPreparations = loadStored('budgetPreparations', [...MOCK_BUDGET_PREPARATIONS])
    this.budgetReappropriations = loadStored('budgetReappropriations', [...MOCK_BUDGET_REAPPROPRIATIONS])
    this.budgetVsActual = loadStored('budgetVsActual', [...MOCK_BUDGET_VS_ACTUAL])

    this.financialSanctions = loadStored('financialSanctions', [...MOCK_FINANCIAL_SANCTIONS])
    this.purchaseSanctions = loadStored('purchaseSanctions', [...MOCK_PURCHASE_SANCTIONS])
    this.paymentSanctions = loadStored('paymentSanctions', [...MOCK_PAYMENT_SANCTIONS])
    this.statutoryPayments = loadStored('statutoryPayments', [...MOCK_STATUTORY_PAYMENTS])
    this.deposits = loadStored('deposits', [...MOCK_DEPOSITS])

    this.dashboardCards = loadStored('dashboardCards', [...MOCK_DASHBOARD_CARDS])
    this.dashboardCharts = loadStored('dashboardCharts', [...MOCK_DASHBOARD_CHARTS])
    this.hiddenWidgets = loadStored('hiddenWidgets', [])

    this.faGroups = loadStored('faGroups', [...MOCK_FA_GROUP_ROWS])
    this.assetInformation = loadStored('assetInformation', [...MOCK_ASSET_INFORMATION_ROWS])
    this.openingAssets = loadStored('openingAssets', [...MOCK_OPENING_FIXED_ASSET_IMPORT_ROWS])
  }

  save(collectionKey) {
    saveStored(collectionKey, this[collectionKey])
  }

  /**
   * Universal Datatables-compatible pager / sorter / filter
   */
  paginate(items = [], options = {}) {
    const {
      draw = 1,
      start = 0,
      length = 10,
      page,
      pageSize,
      search = '',
      sortBy,
      sortDir = 'asc',
      filterFn,
    } = options

    const effPage = page != null ? Number(page) : Math.floor(Number(start || 0) / Number(length || 10)) + 1
    const effSize = pageSize != null ? Number(pageSize) : Number(length || 10)
    const searchValue = typeof search === 'string' ? search.trim().toLowerCase() : (search?.value || '').trim().toLowerCase()

    let filtered = [...items]

    if (searchValue) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((val) =>
          val != null && String(val).toLowerCase().includes(searchValue),
        ),
      )
    }

    if (typeof filterFn === 'function') {
      filtered = filtered.filter(filterFn)
    }

    if (sortBy) {
      filtered.sort((a, b) => {
        const valA = a[sortBy] ?? ''
        const valB = b[sortBy] ?? ''
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDir === 'desc' ? valB - valA : valA - valB
        }
        const strA = String(valA).toLowerCase()
        const strB = String(valB).toLowerCase()
        return sortDir === 'desc' ? strB.localeCompare(strA) : strA.localeCompare(strB)
      })
    }

    const recordsTotal = items.length
    const recordsFiltered = filtered.length
    const offset = Math.max(0, (effPage - 1) * effSize)
    const paged = filtered.slice(offset, offset + effSize)

    return {
      draw: Number(draw || effPage),
      recordsTotal,
      recordsFiltered,
      data: paged,
      rows: paged,
      total: recordsFiltered,
      page: effPage,
      pageSize: effSize,
      totalPages: Math.ceil(recordsFiltered / effSize) || 1,
    }
  }

  find(collectionKey, predicate) {
    const list = this[collectionKey] || []
    return list.find(predicate) ?? null
  }

  findById(collectionKey, id) {
    const list = this[collectionKey] || []
    const strId = String(id)
    return list.find((item) => String(item.id) === strId || String(item.idMask) === strId) ?? null
  }

  insert(collectionKey, item) {
    if (!this[collectionKey]) {
      this[collectionKey] = []
    }
    const id = item.id || Date.now()
    const idMask = item.idMask || `mock-${collectionKey}-${id}`
    const newItem = { ...item, id, idMask, active: item.active || 'Y', isActive: item.isActive !== false }
    this[collectionKey].unshift(newItem)
    this.save(collectionKey)
    return newItem
  }

  update(collectionKey, id, updates) {
    const list = this[collectionKey] || []
    const strId = String(id)
    const index = list.findIndex((item) => String(item.id) === strId || String(item.idMask) === strId)
    if (index >= 0) {
      list[index] = { ...list[index], ...updates }
      this.save(collectionKey)
      return list[index]
    }
    return null
  }

  remove(collectionKey, id) {
    const list = this[collectionKey] || []
    const strId = String(id)
    const index = list.findIndex((item) => String(item.id) === strId || String(item.idMask) === strId)
    if (index >= 0) {
      const removed = list.splice(index, 1)[0]
      this.save(collectionKey)
      return removed
    }
    return null
  }
}

export const mockStore = new MockStore()
