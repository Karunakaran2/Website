/**
 * Comprehensive Mock API Router
 * Handles all network requests across the application without a backend.
 */
import { generateMockCaptcha, getCurrentCaptcha, MOCK_SEATS, MOCK_USERS } from './data/authMockData'
import { mockStore } from './mockStore'
import { MOCK_DAY_BOOK, MOCK_CASH_BOOK, MOCK_BANK_BOOK, MOCK_TRIAL_BALANCE, MOCK_BALANCE_SHEET, MOCK_FIXED_ASSET_REGISTER } from './data/reportsMockData'
const MOCK_STATUTORY_PAYMENTS = []
const MOCK_VOUCHER_APPROVALS = []

function parseJsonSafe(body) {
  if (!body) return {}
  if (typeof body === 'object') return body
  try {
    return JSON.parse(body)
  } catch {
    return {}
  }
}

function normalizeUrl(url) {
  if (!url) return ''
  const trimmed = String(url).trim()
  try {
    const parsed = new URL(trimmed, 'http://localhost')
    return {
      pathname: parsed.pathname,
      searchParams: parsed.searchParams,
    }
  } catch {
    const [pathPart, queryPart] = trimmed.split('?')
    return {
      pathname: pathPart,
      searchParams: new URLSearchParams(queryPart || ''),
    }
  }
}

let activeUserSession = { ...MOCK_USERS.admin }

export async function handleMockRequest(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  const { pathname, searchParams } = normalizeUrl(url)
  const body = parseJsonSafe(options.body)

  // --------------------------------------------------------------------------
  // AUTH & SESSION
  // --------------------------------------------------------------------------
  if (pathname.includes('/api/v1/captcha/getCaptcha')) {
    const captcha = generateMockCaptcha()
    return { status: 200, data: captcha }
  }

  if (pathname.includes('/api/v1/login/loginUser')) {
    const username = (body.username || 'admin').trim()
    const baseUser = MOCK_USERS[username] || {
      ...MOCK_USERS.admin,
      username,
      displayName: username.charAt(0).toUpperCase() + username.slice(1),
    }

    activeUserSession = {
      ...baseUser,
      accessToken: `mock-token-${Date.now()}`,
      refreshToken: `mock-refresh-${Date.now()}`,
      sessionId: `mock-session-${Date.now()}`,
      seatSelected: false,
    }

    return {
      status: 200,
      data: {
        ...activeUserSession,
        tokenType: 'Bearer',
      },
    }
  }

  if (pathname.includes('/api/v1/login/getLoginUser')) {
    return { status: 200, data: activeUserSession }
  }

  if (pathname.includes('/api/v1/login/refreshAccessToken')) {
    return {
      status: 200,
      data: {
        accessToken: `mock-token-${Date.now()}`,
        refreshToken: `mock-refresh-${Date.now()}`,
      },
    }
  }

  if (pathname.includes('/api/v1/login/logoutUser')) {
    return { status: 200, data: { success: true } }
  }

  if (pathname.includes('/api/v1/login/exchangeSpfoAccessToken')) {
    activeUserSession.seatSelected = true
    return { status: 200, data: { ...activeUserSession, tokenType: 'Bearer' } }
  }

  if (pathname.includes('/api/v1/seat-context/getHierarchySetupByUserId')) {
    return { status: 200, data: MOCK_SEATS }
  }

  if (pathname.includes('/api/v1/seat-context/updateSeatUserAlloted')) {
    const seatId = body.seatUserAllotedIdMask || 'seat-hq-fin-01'
    const foundSeat = MOCK_SEATS.find((s) => s.idMask === seatId) || MOCK_SEATS[0]
    activeUserSession = {
      ...activeUserSession,
      seatSelected: true,
      seatUserAllotId: foundSeat.idMask,
      hierarchyName: foundSeat.hierarchyName,
      hierarchyCode: foundSeat.hierarchyCode,
      designation: foundSeat.postingName,
      accessToken: `mock-token-seat-${Date.now()}`,
      refreshToken: `mock-refresh-seat-${Date.now()}`,
    }
    return { status: 200, data: activeUserSession }
  }

  // --------------------------------------------------------------------------
  // DASHBOARD
  // --------------------------------------------------------------------------
  if (pathname.includes('/api/v1/dashboard/getDashboardCardList')) {
    return { status: 200, data: mockStore.dashboardCards }
  }

  if (pathname.includes('/api/v1/dashboard/getDashboardChartList')) {
    return { status: 200, data: mockStore.dashboardCharts }
  }

  if (pathname.includes('/api/v1/dashboard/getHiddenDashboardWidgetList')) {
    return { status: 200, data: mockStore.hiddenWidgets }
  }

  if (pathname.includes('/api/v1/dashboard/saveDashboardWidgetConfigList')) {
    return { status: 200, data: { success: true } }
  }

  if (pathname.includes('/api/v1/dashboard/updateDashboardWidgetColor')) {
    return { status: 200, data: { success: true } }
  }

  if (pathname.includes('/api/v1/dashboard/updateDashboardWidgetStatus')) {
    return { status: 200, data: { success: true } }
  }

  // --------------------------------------------------------------------------
  // SETUP DOMAIN
  // --------------------------------------------------------------------------
  if (pathname.includes('/api/v1/company-setup/getCompanySetup')) {
    return { status: 200, data: mockStore.company }
  }

  // Offices
  if (pathname.includes('/api/v1/office-setup/getOfficeSetupList')) {
    return { status: 200, data: mockStore.offices }
  }
  if (pathname.includes('/api/v1/office-setup/getOfficeSetupById')) {
    const id = pathname.split('/').pop()
    const item = mockStore.findById('offices', id) || mockStore.offices[0]
    return { status: 200, data: item }
  }
  if (pathname.includes('/api/v1/office-setup/search')) {
    return { status: 200, data: mockStore.paginate(mockStore.offices, body) }
  }

  // Cost Category & Cost Centre
  if (pathname.includes('/api/v1/cost-category/getCostCategoryList')) {
    return { status: 200, data: mockStore.costCategories }
  }
  if (pathname.includes('/api/v1/cost-category/search')) {
    return { status: 200, data: mockStore.paginate(mockStore.costCategories, body) }
  }
  if (pathname.includes('/api/v1/cost-centre/getCostCentreList')) {
    return { status: 200, data: mockStore.costCentres }
  }
  if (pathname.includes('/api/v1/cost-centre/getCostCentreById')) {
    const id = pathname.split('/').pop()
    return { status: 200, data: mockStore.findById('costCentres', id) || mockStore.costCentres[0] }
  }
  if (pathname.includes('/api/v1/cost-centre/search')) {
    return { status: 200, data: mockStore.paginate(mockStore.costCentres, body) }
  }

  // Head of Account (HOA)
  if (pathname.includes('/api/v1/hoa-setup/getHoaSetupList')) {
    return { status: 200, data: mockStore.hoaList }
  }
  if (pathname.includes('/api/v1/hoa-setup/getHoaSetupById')) {
    const id = pathname.split('/').pop()
    return { status: 200, data: mockStore.findById('hoaList', id) || mockStore.hoaList[0] }
  }
  if (pathname.includes('/api/v1/hoa-setup/search')) {
    return { status: 200, data: mockStore.paginate(mockStore.hoaList, body) }
  }
  if (pathname.includes('/api/v1/hoa-setup/saveSalesLedger') || pathname.includes('/api/v1/hoa-setup/savePurchaseLedger')) {
    const created = mockStore.insert('hoaList', body)
    return { status: 200, data: created }
  }

  // Client Details / Parties
  if (pathname.includes('/api/v1/client-details/getClientDetailsList')) {
    return { status: 200, data: mockStore.parties }
  }
  if (pathname.includes('/api/v1/client-details/getClientDetailsById')) {
    const id = pathname.split('/').pop()
    return { status: 200, data: mockStore.findById('parties', id) || mockStore.parties[0] }
  }
  if (pathname.includes('/api/v1/client-details/search')) {
    return { status: 200, data: mockStore.paginate(mockStore.parties, body) }
  }

  // Banks & Accounts
  if (pathname.includes('/api/v1/bank-setup/getBankSetupList') || pathname.includes('/api/v1/bank-setup/search')) {
    return pathname.includes('search')
      ? { status: 200, data: mockStore.paginate(mockStore.banks, body) }
      : { status: 200, data: mockStore.banks }
  }
  if (pathname.includes('/api/v1/bank-account-setup/getBankAccountSetupList')) {
    return { status: 200, data: mockStore.bankAccounts }
  }
  if (pathname.includes('/api/v1/bank-account-setup/search')) {
    return { status: 200, data: mockStore.paginate(mockStore.bankAccounts, body) }
  }
  if (pathname.includes('/api/v1/cash-setup/getCashSetupList')) {
    return { status: 200, data: mockStore.cashAccounts }
  }
  if (pathname.includes('/api/v1/cash-setup/search')) {
    return { status: 200, data: mockStore.paginate(mockStore.cashAccounts, body) }
  }

  // Numbering Setup
  if (pathname.includes('/api/v1/numbering-setup/getNumberingSetupList')) {
    return { status: 200, data: mockStore.numbering }
  }
  if (pathname.includes('/api/v1/numbering-setup/search')) {
    return { status: 200, data: mockStore.paginate(mockStore.numbering, body) }
  }
  if (pathname.includes('/api/v1/numbering-setup/getNumberingSetupListByVoucherType')) {
    return { status: 200, data: mockStore.numbering }
  }

  // Service Types
  if (pathname.includes('/api/v1/service-type-setup/getServiceTypeSetupList') || pathname.includes('/api/v1/service-type-setup/getServiceTypeSetupByStatus')) {
    return { status: 200, data: mockStore.serviceTypes }
  }
  if (pathname.includes('/api/v1/service-type-setup/search')) {
    return { status: 200, data: mockStore.paginate(mockStore.serviceTypes, body) }
  }

  // Taxes, UOM, DFPR
  if (pathname.includes('/api/v1/unit-of-measure/getUnitOfMeasureList')) return { status: 200, data: mockStore.uom }
  if (pathname.includes('/api/v1/tds-type/getTdsTypeList') || pathname.includes('/api/v1/own-tax-info/getTdsTypeList')) return { status: 200, data: mockStore.tdsTypes }
  if (pathname.includes('/api/v1/tcs-type/getTcsTypeList')) return { status: 200, data: mockStore.tcsTypes }
  if (pathname.includes('/api/v1/hsn-code/getHsnCodeList')) return { status: 200, data: mockStore.hsnCodes }
  if (pathname.includes('/api/v1/sac-code/getSacCodeList')) return { status: 200, data: mockStore.sacCodes }
  if (pathname.includes('/api/v1/dfpr-setup/getDfprSeatUserList')) return { status: 200, data: mockStore.dfprUsers }

  // User Allocation & Ledger Allocation
  if (pathname.includes('/api/v1/user-allocation/getActiveSeatUserAllotedList')) {
    return { status: 200, data: MOCK_SEATS }
  }
  if (pathname.includes('/api/v1/user-allocation/getUserAllocationOfficeList')) {
    return { status: 200, data: mockStore.offices }
  }
  if (pathname.includes('/api/v1/user-allocation/getUserAllocationCostCentreList')) {
    return { status: 200, data: mockStore.costCentres }
  }

  // --------------------------------------------------------------------------
  // ACCOUNTING & VOUCHERS
  // --------------------------------------------------------------------------
  if (pathname.includes('/api/v1/draft-voucher/search')) {
    return { status: 200, data: mockStore.paginate(mockStore.draftVouchers, body) }
  }

  // Contra
  if (pathname.includes('/api/v1/contra/getContraEntryTypeList')) {
    return { status: 200, data: [
      { id: 1, idMask: 'ct-1', contraTypeName: 'Bank to Cash' },
      { id: 2, idMask: 'ct-2', contraTypeName: 'Cash to Bank' },
      { id: 3, idMask: 'ct-3', contraTypeName: 'Bank to Bank' },
    ] }
  }
  if (pathname.includes('/api/v1/contra/getBankCashHoaList')) {
    return { status: 200, data: mockStore.hoaList.filter((h) => h.accountType === 'Bank / Cash') }
  }
  if (pathname.includes('/api/v1/contra/getCostCategoryList')) {
    return { status: 200, data: mockStore.costCategories }
  }
  if (pathname.includes('/api/v1/contra/getCostCentreList')) {
    return { status: 200, data: mockStore.costCentres }
  }
  if (pathname.includes('/api/v1/contra/getNumberingSetupListForContra')) {
    return { status: 200, data: mockStore.numbering.filter((n) => n.voucherType === 'Contra') }
  }
  if (pathname.includes('/api/v1/contra/getContraEntryById')) {
    return { status: 200, data: mockStore.contraEntries[0] }
  }
  if (pathname.includes('/api/v1/contra/saveContraEntry') || pathname.includes('/api/v1/contra/updateContraEntry')) {
    const entry = mockStore.insert('contraEntries', body)
    mockStore.insert('draftVouchers', {
      documentNo: entry.documentNo || 'CV/156/25-26',
      documentDate: entry.documentDate || '2026-03-12',
      voucherType: 'Contra',
      documentAmount: entry.depositDetails?.amount || 500000,
      partyName: 'State Bank of India',
    })
    return { status: 200, data: entry }
  }

  // Journal
  if (pathname.includes('/api/v1/journal/search')) {
    return { status: 200, data: mockStore.paginate(mockStore.draftVouchers.filter((v) => v.voucherType === 'Journal'), body) }
  }
  if (pathname.includes('/api/v1/journal/getJournalById')) {
    return { status: 200, data: mockStore.draftVouchers[0] }
  }
  if (pathname.includes('/api/v1/journal/getNumberingSetupListByVoucherId')) {
    return { status: 200, data: mockStore.numbering.filter((n) => n.voucherType === 'Journal') }
  }
  if (pathname.includes('/api/v1/journal/getHoaSetupList')) {
    return { status: 200, data: mockStore.hoaList }
  }
  if (pathname.includes('/api/v1/journal/saveJournal') || pathname.includes('/api/v1/journal/updateJournal')) {
    mockStore.insert('draftVouchers', {
      documentNo: body.invoiceNo || 'JV/1045/25-26',
      documentDate: body.journalDate || '2026-03-12',
      voucherType: 'Journal',
      documentAmount: body.totalDebitAmount || 86000,
      partyName: 'National Informatics Centre',
      narration: body.journalNarration || 'Journal entry',
    })
    return { status: 200, data: { success: true, idMask: `jv-${Date.now()}` } }
  }

  // Sales Voucher
  if (pathname.includes('/api/v1/sales-voucher/getNumberingGroupList')) {
    return { status: 200, data: mockStore.numbering.filter((n) => n.voucherType === 'Sales') }
  }
  if (pathname.includes('/api/v1/sales-voucher/getCustomerList')) {
    return { status: 200, data: mockStore.parties }
  }
  if (pathname.includes('/api/v1/sales-voucher/getNextSalesVoucherDocumentNo')) {
    return { status: 200, data: { documentNo: 'SAL/218/25-26' } }
  }
  if (pathname.includes('/api/v1/sales-voucher/saveSalesVoucher')) {
    return { status: 200, data: { success: true, idMask: `sal-${Date.now()}` } }
  }

  // Purchase Voucher
  if (pathname.includes('/api/v1/purchase/savePurchaseEntry')) {
    return { status: 200, data: { success: true, idMask: `pu-${Date.now()}` } }
  }

  // Receipt Voucher
  if (pathname.includes('/api/v1/receipt-voucher/getNumberingGroupList')) {
    return { status: 200, data: mockStore.numbering.filter((n) => n.voucherType === 'Receipt') }
  }
  if (pathname.includes('/api/v1/receipt-voucher/getPartyList')) {
    return { status: 200, data: mockStore.parties }
  }
  if (pathname.includes('/api/v1/receipt-voucher/getNextReceiptVoucherDocumentNo')) {
    return { status: 200, data: { documentNo: 'RV/312/25-26' } }
  }

  // Reversal & Recurring
  if (pathname.includes('/api/v1/voucher-reversal/search')) {
    return { status: 200, data: mockStore.paginate(mockStore.reversibleVouchers, body) }
  }
  if (pathname.includes('/api/v1/voucher-reversal/searchReversed')) {
    return { status: 200, data: mockStore.paginate([], body) }
  }
  if (pathname.includes('/api/v1/recurring-voucher/search')) {
    return { status: 200, data: mockStore.paginate(mockStore.recurringVouchers, body) }
  }

  // --------------------------------------------------------------------------
  // VOUCHER APPROVAL WORKFLOW
  // --------------------------------------------------------------------------
  if (pathname.includes('/api/v1/journal/workflow/search')) {
    const tab = searchParams.get('tab') || 'received'
    const filtered = MOCK_VOUCHER_APPROVALS.filter((v) => v.status === tab)
    return { status: 200, data: mockStore.paginate(filtered, body) }
  }

  // --------------------------------------------------------------------------
  // BUDGET DOMAIN
  // --------------------------------------------------------------------------
  if (pathname.includes('/api/v1/heads/search')) {
    return { status: 200, data: mockStore.paginate(mockStore.budgetHeads, body) }
  }
  if (pathname.includes('/api/v1/heads/getHeadsById')) {
    const id = pathname.split('/').pop()
    return { status: 200, data: mockStore.findById('budgetHeads', id) || mockStore.budgetHeads[0] }
  }
  if (pathname.includes('/api/v1/budget-initiation/getBudgetYearList')) {
    return { status: 200, data: ['2025-2026', '2024-2025', '2023-2024', '2022-2023'] }
  }
  if (pathname.includes('/api/v1/budget-initiation/search')) {
    return { status: 200, data: mockStore.paginate(mockStore.budgetInitiations, body) }
  }
  if (pathname.includes('/api/v1/budget-preparation/search')) {
    return { status: 200, data: mockStore.paginate(mockStore.budgetPreparations, body) }
  }
  if (pathname.includes('/api/v1/budget-reappropriation/search')) {
    return { status: 200, data: mockStore.paginate(mockStore.budgetReappropriations, body) }
  }
  if (pathname.includes('/api/v1/budget-vs-actual/getBudgetVsActualList')) {
    return { status: 200, data: mockStore.budgetVsActual }
  }

  // --------------------------------------------------------------------------
  // FINANCIAL SANCTION & PAYMENT
  // --------------------------------------------------------------------------
  if (pathname.includes('/api/v1/financial-sanction/search')) {
    const list = searchParams.get('list') || 'sanction'
    const items = list === 'purchase' ? mockStore.purchaseSanctions : mockStore.financialSanctions
    return { status: 200, data: mockStore.paginate(items, body) }
  }
  if (pathname.includes('/api/v1/financial-sanction/getFinancialSanctionById')) {
    const id = pathname.split('/').pop()
    return { status: 200, data: mockStore.findById('financialSanctions', id) || mockStore.financialSanctions[0] }
  }
  if (pathname.includes('/api/v1/payment-sanction/search')) {
    return { status: 200, data: mockStore.paginate(mockStore.paymentSanctions, body) }
  }

  // --------------------------------------------------------------------------
  // STATUTORY PAYMENT
  // --------------------------------------------------------------------------
  if (pathname.includes('/api/v1/statutory-payment/search')) {
    const tab = searchParams.get('tab') || 'approved'
    const items = tab === 'approved' ? MOCK_STATUTORY_PAYMENTS : []
    return { status: 200, data: mockStore.paginate(items, body) }
  }
  if (pathname.includes('/api/v1/statutory-payment/getPendingStatutoryPaymentList')) {
    return {
      status: 200,
      data: [
        { id: 1, taxType: 'PF', taxPeriod: 'February 2026', pendingAmount: 512300.0, dueDate: '15-03-2026' },
        { id: 2, taxType: 'TDS', taxPeriod: 'February 2026', pendingAmount: 174054.0, dueDate: '07-03-2026' },
      ],
    }
  }

  // --------------------------------------------------------------------------
  // DEPOSITS
  // --------------------------------------------------------------------------
  if (pathname.includes('/api/v1/deposits/search')) {
    return { status: 200, data: mockStore.paginate(mockStore.deposits, body) }
  }
  if (pathname.includes('/api/v1/deposits/getDepositById')) {
    const id = pathname.split('/').pop()
    return { status: 200, data: mockStore.findById('deposits', id) || mockStore.deposits[0] }
  }

  // --------------------------------------------------------------------------
  // ASSET MANAGEMENT
  // --------------------------------------------------------------------------
  if (pathname.includes('/api/v1/fixed-asset-group/search')) {
    return { status: 200, data: mockStore.paginate(mockStore.faGroups, body) }
  }
  if (pathname.includes('/api/v1/fixed-asset-group/getFixedAssetGroupList')) {
    return { status: 200, data: mockStore.faGroups }
  }
  if (pathname.includes('/api/v1/fixed-asset-group/getAssetClassItList')) {
    return {
      status: 200,
      data: [
        { id: 1, name: 'Plant & Machinery', code: 'PM-01' },
        { id: 2, name: 'Office Equipment', code: 'OE-02' },
        { id: 3, name: 'Furniture & Fixtures', code: 'FF-03' },
        { id: 4, name: 'Building', code: 'BLD-04' },
        { id: 5, name: 'Computer & Peripherals', code: 'IT-05' },
        { id: 6, name: 'Vehicles', code: 'VEH-06' },
      ],
    }
  }
  if (pathname.includes('/api/v1/fixed-asset-group/saveFixedAssetGroup')) {
    const item = { ...body, idMask: body.idMask || `mock-fa-grp-${Date.now()}` }
    mockStore.insert('faGroups', item)
    return { status: 200, data: item }
  }
  if (pathname.includes('/api/v1/asset-information/search') || pathname.includes('/api/v1/asset-information/search-approved')) {
    return { status: 200, data: mockStore.paginate(mockStore.assetInformation, body) }
  }
  if (pathname.includes('/api/v1/asset-information/getAssetInformationById')) {
    const id = pathname.split('/').pop()
    return { status: 200, data: mockStore.findById('assetInformation', id) || mockStore.assetInformation[0] }
  }
  if (pathname.includes('/api/v1/asset-information/getCostCentreList')) {
    return { status: 200, data: mockStore.costCentres }
  }
  if (pathname.includes('/api/v1/asset-information/getHsnCodeList')) {
    return { status: 200, data: mockStore.hsnCodes }
  }
  if (pathname.includes('/api/v1/asset-information/getDistinctAssetLocationList')) {
    return {
      status: 200,
      data: ['Main Office - Trivandrum', 'Regional Office - Kochi', 'District Hub - Kozhikode', 'Data Centre', 'Store Room B'],
    }
  }
  if (pathname.includes('/api/v1/asset-information/saveAssetInformation')) {
    const item = { ...body, idMask: body.idMask || `mock-asset-info-${Date.now()}` }
    mockStore.insert('assetInformation', item)
    return { status: 200, data: item }
  }
  if (pathname.includes('/api/v1/asset-allocation/getAllocatableAssetInformationList')) {
    return { status: 200, data: mockStore.assetInformation }
  }
  if (pathname.includes('/api/v1/asset-allocation/allocateAsset') || pathname.includes('/api/v1/asset-allocation/returnAssetToStore')) {
    return { status: 200, data: { success: true, message: 'Allocation updated successfully' } }
  }
  if (pathname.includes('/api/v1/asset-depreciation/getDepreciationProcessDefaults')) {
    return {
      status: 200,
      data: {
        financialYear: '2025-2026',
        periodFrom: '2025-04-01',
        periodTo: '2026-03-31',
        depreciationFrequency: 'Yearly',
      },
    }
  }
  if (
    pathname.includes('/api/v1/asset-depreciation/getFixedAssetDepreciationList') ||
    pathname.includes('/api/v1/asset-depreciation/getDepreciationList')
  ) {
    return {
      status: 200,
      data: [
        { idMask: 'dep-1', assetId: 'AST-BLD-001', assetDescription: 'Administrative HQ Complex', assetType: 'BUILDING', openingWdv: 24500000, additionCost: 0, deductionValue: 0, depreciationRate: 10, depreciationAmount: 2450000, closingWdv: 22050000 },
        { idMask: 'dep-2', assetId: 'AST-SRV-002', assetDescription: 'Enterprise Database Server Cluster', assetType: 'IT EQUIPMENT', openingWdv: 1250000, additionCost: 350000, deductionValue: 0, depreciationRate: 40, depreciationAmount: 570000, closingWdv: 1030000 },
        { idMask: 'dep-3', assetId: 'AST-VEH-003', assetDescription: 'Heavy Inspection Vehicle KL-01-CB-4412', assetType: 'VEHICLES', openingWdv: 850000, additionCost: 0, deductionValue: 0, depreciationRate: 20, depreciationAmount: 170000, closingWdv: 680000 },
      ],
    }
  }
  if (pathname.includes('/api/v1/asset-depreciation/processDepreciation')) {
    return { status: 200, data: { success: true, message: 'Depreciation processed successfully' } }
  }
  if (pathname.includes('/api/v1/asset-disposal/getDisposalProcessDefaults')) {
    return {
      status: 200,
      data: {
        disposalTypes: ['Scrap Sale', 'Auction', 'Condemnation', 'Loss/Damage'],
        accountingDate: '2026-03-15',
      },
    }
  }
  if (
    pathname.includes('/api/v1/asset-disposal/searchAssetDisposal') ||
    pathname.includes('/api/v1/asset-disposal/getDisposalPreviewList')
  ) {
    return {
      status: 200,
      data: mockStore.paginate([
        { idMask: 'dsp-1', assetId: 'AST-OE-091', assetDescription: 'Obsolete Network Switchboards', assetType: 'IT EQUIPMENT', capitalisationDate: '2018-06-12', originalCost: 450000, bookValue: 22500, disposalType: 'Scrap Sale', realizedValue: 28000, profitLoss: 5500, status: 'Approved' },
        { idMask: 'dsp-2', assetId: 'AST-VEH-012', assetDescription: 'Scrapped Utility Van KL-01-A-1102', assetType: 'VEHICLES', capitalisationDate: '2012-02-18', originalCost: 650000, bookValue: 0, disposalType: 'Auction', realizedValue: 45000, profitLoss: 45000, status: 'Received' },
      ], body),
    }
  }
  if (pathname.includes('/api/v1/asset-disposal/processAssetDisposal') || pathname.includes('/api/v1/asset-disposal/updateAssetDisposal')) {
    return { status: 200, data: { success: true, message: 'Disposal workflow processed' } }
  }
  if (pathname.includes('/api/v1/asset-maintenance/listAssetsForMaintenance')) {
    return { status: 200, data: mockStore.assetInformation }
  }
  if (pathname.includes('/api/v1/asset-maintenance/listMaintenanceVendors')) {
    return { status: 200, data: mockStore.parties }
  }
  if (pathname.includes('/api/v1/asset-maintenance/searchAssetMaintenance')) {
    return {
      status: 200,
      data: mockStore.paginate([
        { idMask: 'mnt-1', maintenanceNo: 'MNT/2026/001', assetId: 'AST-BLD-001', assetDescription: 'HVAC Chiller Overhaul', vendorName: 'Voltas Engineering Services', maintenanceType: 'Periodic Preventive', serviceDate: '2026-02-10', cost: 185000, status: 'Approved' },
        { idMask: 'mnt-2', maintenanceNo: 'MNT/2026/002', assetId: 'AST-SRV-002', assetDescription: 'UPS Battery Bank Replacement', vendorName: 'Schneider Electric IT Ltd', maintenanceType: 'Component Replacement', serviceDate: '2026-03-01', cost: 92400, status: 'Received' },
      ], body),
    }
  }
  if (pathname.includes('/api/v1/asset-maintenance/saveAssetMaintenance') || pathname.includes('/api/v1/asset-maintenance/deleteAssetMaintenance')) {
    return { status: 200, data: { success: true, message: 'Maintenance record updated successfully' } }
  }
  if (pathname.includes('/api/v1/opening-fixed-asset/search')) {
    return { status: 200, data: mockStore.paginate(mockStore.openingAssets, body) }
  }


  // --------------------------------------------------------------------------
  // BANK INTEGRATION
  // --------------------------------------------------------------------------
  if (pathname.includes('/api/v1/bank-reconciliation/getBankHoaList')) {
    return { status: 200, data: mockStore.bankAccounts }
  }
  if (pathname.includes('/api/v1/bank-reconciliation/getManualReconciliationStatementDetails')) {
    return {
      status: 200,
      data: {
        statementDetails: [
          { date: '05-03-2026', chequeNo: 'CHQ-894102', description: 'Cheque Clearance to KSEB', debit: 125450, credit: 0, status: 'Reconciled' },
        ],
      },
    }
  }

  // --------------------------------------------------------------------------
  // REPORTING
  // --------------------------------------------------------------------------
  if (pathname.includes('/api/reporting/v1/day-book/getDayBookReportByDateRange')) {
    return { status: 200, data: MOCK_DAY_BOOK }
  }
  if (pathname.includes('/api/reporting/v1/cash-book/getCashBookReportByDateRange')) {
    return { status: 200, data: MOCK_CASH_BOOK }
  }
  if (pathname.includes('/api/reporting/v1/bank-book/getBankBookReportByDateRange')) {
    return { status: 200, data: MOCK_BANK_BOOK }
  }
  if (pathname.includes('/api/reporting/v1/trial-balance/getTrialBalanceByDateRange')) {
    return { status: 200, data: MOCK_TRIAL_BALANCE }
  }
  if (pathname.includes('/api/reporting/v1/balance-sheet-npo/getBalanceSheetNpoReportByDateRange')) {
    return { status: 200, data: MOCK_BALANCE_SHEET }
  }
  if (pathname.includes('/api/reporting/v1/fixed-asset-register/getFixedAssetRegisterReportByAsOnDate')) {
    return { status: 200, data: MOCK_FIXED_ASSET_REGISTER }
  }

  // --------------------------------------------------------------------------
  // ATTACHMENTS
  // --------------------------------------------------------------------------
  if (pathname.includes('/api/v1/attachment-details/getAttachmentDetailsListByContextRef')) {
    return { status: 200, data: [] }
  }
  if (pathname.includes('/api/v1/attachment-details/saveAttachmentDetails')) {
    return { status: 200, data: { success: true, idMask: `att-${Date.now()}` } }
  }

  // --------------------------------------------------------------------------
  // UNIVERSAL CATCH-ALL FOR ANY /search, /save*, /update*, /remove*
  // --------------------------------------------------------------------------
  if (pathname.endsWith('/search')) {
    return {
      status: 200,
      data: {
        draw: Number(body.draw || 1),
        recordsTotal: 0,
        recordsFiltered: 0,
        data: [],
        rows: [],
      },
    }
  }

  if (method === 'POST' || method === 'PUT') {
    return {
      status: 200,
      data: {
        success: true,
        message: 'Saved successfully',
        idMask: `mock-${Date.now()}`,
        ...body,
      },
    }
  }

  if (method === 'DELETE') {
    return { status: 200, data: { success: true } }
  }

  return { status: 200, data: [] }
}
