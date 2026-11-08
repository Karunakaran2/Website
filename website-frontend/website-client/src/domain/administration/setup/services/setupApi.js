import { baseApi } from '@/shared/api/baseApi'
import { requestJson } from '@/shared/api/client'
/** Opaque path segment (e.g. idMask) — never send raw unencoded values in URLs. */
function pathId(value) {
  if (value == null || value === '') {
    return ''
  }
  return encodeURIComponent(String(value))
}

/** Optional lookup lists (HOA, UOM, tax codes) — avoid breaking forms when endpoint is not deployed yet. */
function softEmptyListOn404(result) {
  if (result.error?.status === 404) {
    return { data: [] }
  }
  return result
}

async function requestSetupList(path) {
  return softEmptyListOn404(await requestJson(path))
}

function toPagingRequest({ search, page, pageSize, sortBy, sortDir, inbox, sortFields }) {
  const start = Math.max(0, (page - 1) * pageSize)
  const fields = Array.isArray(sortFields) ? sortFields : []
  const sortIndex = sortBy ? fields.indexOf(sortBy) : -1
  return {
    draw: page,
    start,
    length: pageSize,
    search: {
      value: search || '',
      regexp: inbox || null,
    },
    order:
      sortIndex >= 0
        ? [{ column: sortIndex, dir: sortDir === 'desc' ? 'desc' : 'asc' }]
        : [],
  }
}

export const setupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchSetup: builder.query({
      async queryFn({ resource, search, page, pageSize, sortBy, sortDir, inbox, sortFields }) {
        return requestJson(`/api/v1/${resource}/search`, {
          method: 'POST',
          body: JSON.stringify(
            toPagingRequest({ search, page, pageSize, sortBy, sortDir, inbox, sortFields }),
          ),
        })
      },
      providesTags: (_result, _error, arg) => [{ type: 'Setup', id: arg.resource }],
    }),
    searchSetupApproval: builder.query({
      async queryFn({ kind, inbox, search, page, pageSize, sortBy, sortDir }) {
        const path = kind === 'party'
          ? '/api/v1/setup-approval/searchClientDetails'
          : '/api/v1/setup-approval/searchBankAccountSetup'
        return requestJson(`${path}?inbox=${encodeURIComponent(inbox || 'received')}`, {
          method: 'POST',
          body: JSON.stringify(toPagingRequest({ search, page, pageSize, sortBy, sortDir, inbox })),
        })
      },
      providesTags: ['Setup'],
    }),
    getCompanySetup: builder.query({
      async queryFn() {
        return requestJson('/api/v1/company-setup/getCompanySetup')
      },
      providesTags: [{ type: 'Setup', id: 'company-setup' }],
    }),
    getOfficeSetupList: builder.query({
      async queryFn() {
        return requestSetupList('/api/v1/office-setup/getOfficeSetupList')
      },
      providesTags: [{ type: 'Setup', id: 'office-setup-list' }],
    }),
    getOfficeSetupById: builder.query({
      async queryFn(id) {
        return requestJson(`/api/v1/office-setup/getOfficeSetupById/${pathId(id)}`)
      },
      providesTags: (_result, _error, id) => [{ type: 'Setup', id: `office-setup-${id}` }],
    }),
    getOwnTaxInfoById: builder.query({
      async queryFn(id) {
        return requestJson(`/api/v1/own-tax-info/getOwnTaxInfoById/${pathId(id)}`)
      },
      providesTags: (_result, _error, id) => [{ type: 'Setup', id: `own-tax-info-${id}` }],
    }),
    getOwnTaxInfoList: builder.query({
      async queryFn() {
        return requestSetupList('/api/v1/own-tax-info/getOwnTaxInfoList')
      },
      providesTags: [{ type: 'Setup', id: 'own-tax-info' }],
    }),
    getCostCentreById: builder.query({
      async queryFn(id) {
        return requestJson(`/api/v1/cost-centre/getCostCentreById/${pathId(id)}`)
      },
      providesTags: (_result, _error, id) => [{ type: 'Setup', id: `cost-centre-${id}` }],
    }),
    getServiceTypeSetupById: builder.query({
      async queryFn(id) {
        return requestJson(`/api/v1/service-type-setup/getServiceTypeSetupById/${pathId(id)}`)
      },
      providesTags: (_result, _error, id) => [{ type: 'Setup', id: `service-type-setup-${id}` }],
    }),
    getClientDetailsById: builder.query({
      async queryFn(id) {
        return requestJson(`/api/v1/client-details/getClientDetailsById/${pathId(id)}`)
      },
      providesTags: (_result, _error, id) => [{ type: 'Setup', id: `client-details-${id}` }],
    }),
    getSetupById: builder.query({
      async queryFn({ resource, entityName, id }) {
        if (!resource || !entityName || id == null || id === '') {
          return { error: { status: 400, data: 'Missing setup id' } }
        }
        return requestJson(`/api/v1/${resource}/get${entityName}ById/${pathId(id)}`)
      },
      providesTags: (_result, _error, arg) => [
        { type: 'Setup', id: `${arg.resource}-${arg.id}` },
      ],
    }),
    getNumberingSetupListByVoucherType: builder.query({
      async queryFn(voucherType) {
        if (!voucherType) {
          return { data: [] }
        }
        return requestSetupList(
          `/api/v1/numbering-setup/getNumberingSetupListByVoucherType/${pathId(voucherType)}`,
        )
      },
      providesTags: (_result, _error, voucherType) => [
        { type: 'Setup', id: `numbering-setup-voucher-${voucherType}` },
      ],
    }),
    getClientDetailsList: builder.query({
      async queryFn() {
        return requestSetupList('/api/v1/client-details/getClientDetailsList')
      },
      providesTags: [{ type: 'Setup', id: 'client-details-list' }],
    }),
    getClientDetailsListByPartyType: builder.query({
      async queryFn(partyType) {
        if (!partyType) {
          return { data: [] }
        }
        return requestSetupList(
          `/api/v1/client-details/getClientDetailsListByPartyType/${pathId(partyType)}`,
        )
      },
      providesTags: (_result, _error, partyType) => [
        { type: 'Setup', id: `client-details-party-${partyType}` },
      ],
    }),
    getServiceTypeSetupList: builder.query({
      async queryFn() {
        return requestSetupList('/api/v1/service-type-setup/getServiceTypeSetupList')
      },
      providesTags: [{ type: 'Setup', id: 'service-type-setup' }],
    }),
    getServiceTypeSetupByStatus: builder.query({
      async queryFn() {
        return requestJson('/api/v1/service-type-setup/getServiceTypeSetupByStatus')
      },
      providesTags: [{ type: 'Setup', id: 'service-type-setup-active' }],
    }),
    getCostCategoryList: builder.query({
      async queryFn() {
        return requestJson('/api/v1/cost-category/getCostCategoryList')
      },
      providesTags: [{ type: 'Setup', id: 'cost-category' }],
    }),
    getCostCentreList: builder.query({
      async queryFn() {
        return requestJson('/api/v1/cost-centre/getCostCentreList')
      },
      providesTags: [{ type: 'Setup', id: 'cost-centre' }],
    }),
    getCostCentreListByCategoryId: builder.query({
      async queryFn(costCategoryId) {
        return requestJson(`/api/v1/cost-centre/getCostCentreListByCategoryId/${pathId(costCategoryId)}`)
      },
      providesTags: (_result, _error, costCategoryId) => [
        { type: 'Setup', id: `cost-centre-category-${costCategoryId}` },
      ],
    }),
    getGstDetails: builder.query({
      async queryFn(gstNum) {
        return requestJson(`/api/v1/office-setup/getGstDetails?gstNum=${encodeURIComponent(gstNum || '')}`)
      },
    }),
    getAccountSetupById: builder.query({
      async queryFn(id) {
        return requestJson(`/api/v1/account-setup/getAccountSetupById/${pathId(id)}`)
      },
      providesTags: (_result, _error, id) => [{ type: 'Setup', id: `account-setup-${id}` }],
    }),
    getAccountSetupGroupUnderList: builder.query({
      async queryFn() {
        return requestJson('/api/v1/account-setup/getAccountSetupGroupUnderList')
      },
      providesTags: [{ type: 'Setup', id: 'account-setup' }],
    }),
    getUserAllocationList: builder.query({
      async queryFn() {
        return requestJson('/api/v1/user-allocation/getUserAllocationList')
      },
      providesTags: [{ type: 'Setup', id: 'user-allocation' }],
    }),
    getUserAllocationOfficeList: builder.query({
      async queryFn() {
        return requestJson('/api/v1/user-allocation/getUserAllocationOfficeList')
      },
      providesTags: [{ type: 'Setup', id: 'user-allocation-office' }],
    }),
    getUserAllocationCostCentreList: builder.query({
      async queryFn() {
        return requestJson('/api/v1/user-allocation/getUserAllocationCostCentreList')
      },
      providesTags: [{ type: 'Setup', id: 'user-allocation-cost-centre' }],
    }),
    getActiveSeatUserAllotedList: builder.query({
      async queryFn() {
        return requestSetupList('/api/v1/user-allocation/getActiveSeatUserAllotedList')
      },
      providesTags: [{ type: 'Setup', id: 'user-allocation-active-seat-users' }],
    }),
    getSeatUserAllotedListForOfficeAllocation: builder.query({
      async queryFn(officeId) {
        return requestJson(`/api/v1/user-allocation/getSeatUserAllotedListForOfficeAllocation/${pathId(officeId)}`)
      },
      providesTags: (_result, _error, officeId) => [
        { type: 'Setup', id: `user-allocation-seat-office-${officeId}` },
      ],
    }),
    getSeatUserAllotedListForCostCentreAllocation: builder.query({
      async queryFn(costCenterId) {
        return requestJson(
          `/api/v1/user-allocation/getSeatUserAllotedListForCostCentreAllocation/${pathId(costCenterId)}`,
        )
      },
      providesTags: (_result, _error, costCenterId) => [
        { type: 'Setup', id: `user-allocation-seat-cost-${costCenterId}` },
      ],
    }),
    getUserAllocationListByOfficeId: builder.query({
      async queryFn(officeId) {
        return requestJson(`/api/v1/user-allocation/getUserAllocationListByOfficeId/${pathId(officeId)}`)
      },
      providesTags: (_result, _error, officeId) => [
        { type: 'Setup', id: `user-allocation-list-office-${officeId}` },
      ],
    }),
    getUserAllocationListByCostCenterId: builder.query({
      async queryFn(costCenterId) {
        return requestJson(`/api/v1/user-allocation/getUserAllocationListByCostCenterId/${pathId(costCenterId)}`)
      },
      providesTags: (_result, _error, costCenterId) => [
        { type: 'Setup', id: `user-allocation-list-cost-${costCenterId}` },
      ],
    }),
    getLedgerAllocationOfficeList: builder.query({
      async queryFn() {
        return requestJson('/api/v1/ledger-allocation/getLedgerAllocationOfficeList')
      },
      providesTags: [{ type: 'Setup', id: 'ledger-allocation-office' }],
    }),
    getLedgerAllocationCostCentreList: builder.query({
      async queryFn() {
        return requestJson('/api/v1/ledger-allocation/getLedgerAllocationCostCentreList')
      },
      providesTags: [{ type: 'Setup', id: 'ledger-allocation-cost-centre' }],
    }),
    getHoaSetupListForOfficeAllocation: builder.query({
      async queryFn(officeId) {
        return requestJson(`/api/v1/ledger-allocation/getHoaSetupListForOfficeAllocation/${pathId(officeId)}`)
      },
      providesTags: (_result, _error, officeId) => [
        { type: 'Setup', id: `ledger-allocation-hoa-office-${officeId}` },
      ],
    }),
    getHoaSetupListForCostCentreAllocation: builder.query({
      async queryFn(costCenterId) {
        return requestJson(`/api/v1/ledger-allocation/getHoaSetupListForCostCentreAllocation/${pathId(costCenterId)}`)
      },
      providesTags: (_result, _error, costCenterId) => [
        { type: 'Setup', id: `ledger-allocation-hoa-cost-${costCenterId}` },
      ],
    }),
    getLedgerAllocationListByOfficeId: builder.query({
      async queryFn(officeId) {
        return requestJson(`/api/v1/ledger-allocation/getLedgerAllocationListByOfficeId/${pathId(officeId)}`)
      },
      providesTags: (_result, _error, officeId) => [
        { type: 'Setup', id: `ledger-allocation-list-office-${officeId}` },
      ],
    }),
    getLedgerAllocationListByCostCenterId: builder.query({
      async queryFn(costCenterId) {
        return requestJson(`/api/v1/ledger-allocation/getLedgerAllocationListByCostCenterId/${pathId(costCenterId)}`)
      },
      providesTags: (_result, _error, costCenterId) => [
        { type: 'Setup', id: `ledger-allocation-list-cost-${costCenterId}` },
      ],
    }),
    getAccountSetupList: builder.query({
      async queryFn() {
        return requestJson('/api/v1/account-setup/getAccountSetupList')
      },
      providesTags: [{ type: 'Setup', id: 'account-setup' }],
    }),
    getAccountSetupListByBaseAccountTypeId: builder.query({
      async queryFn(baseAccountTypeId) {
        return requestJson(
          `/api/v1/account-setup/getAccountSetupListByBaseAccountTypeId?baseAccountTypeId=${encodeURIComponent(baseAccountTypeId)}`,
        )
      },
      providesTags: (_result, _error, baseAccountTypeId) => [
        { type: 'Setup', id: `account-setup-base-${baseAccountTypeId}` },
      ],
    }),
    getBankSetupList: builder.query({
      async queryFn() {
        return requestJson('/api/v1/bank-setup/getBankSetupList')
      },
      providesTags: [{ type: 'Setup', id: 'bank-setup' }],
    }),
    getBankAccountSetupList: builder.query({
      async queryFn() {
        return requestSetupList('/api/v1/bank-account-setup/getBankAccountSetupList')
      },
      providesTags: [{ type: 'Setup', id: 'bank-account-setup' }],
    }),
    getCashSetupList: builder.query({
      async queryFn() {
        return requestSetupList('/api/v1/cash-setup/getCashSetupList')
      },
      providesTags: [{ type: 'Setup', id: 'cash-setup' }],
    }),
    getAllBankBranchSetupByRefId: builder.query({
      async queryFn(bankId) {
        return requestJson(`/api/v1/bank-branch-setup/getAllBankBranchSetupByRefId/${pathId(bankId)}`)
      },
      providesTags: (_result, _error, bankId) => [{ type: 'Setup', id: `bank-branch-setup-${bankId}` }],
    }),
    getIfscDetailsByIfscNo: builder.query({
      async queryFn(ifscNo) {
        return requestJson(`/api/v1/bank-account-setup/getIfscDetailsByIfscNo/${encodeURIComponent(ifscNo)}`)
      },
    }),
    getHoaSetupById: builder.query({
      async queryFn(id) {
        return requestJson(`/api/v1/hoa-setup/getHoaSetupById/${pathId(id)}`)
      },
      providesTags: (_result, _error, id) => [{ type: 'Setup', id: `hoa-setup-${id}` }],
    }),
    getHoaSetupList: builder.query({
      async queryFn() {
        return requestSetupList('/api/v1/hoa-setup/getHoaSetupList')
      },
      providesTags: [{ type: 'Setup', id: 'hoa-setup' }],
    }),
    getHoaSetupListByBaseAccountTypeId: builder.query({
      async queryFn(baseAccountTypeId) {
        return requestJson(
          `/api/v1/hoa-setup/getHoaSetupListByBaseAccountTypeId?baseAccountTypeId=${encodeURIComponent(baseAccountTypeId)}`,
        )
      },
      providesTags: (_result, _error, baseAccountTypeId) => [
        { type: 'Setup', id: `hoa-setup-base-${baseAccountTypeId}` },
      ],
    }),
    saveSalesLedger: builder.mutation({
      async queryFn(body) {
        return requestJson('/api/v1/hoa-setup/saveSalesLedger', {
          method: 'POST',
          body: JSON.stringify(body),
        })
      },
      invalidatesTags: (_result, error) => (error ? [] : [
        { type: 'Setup', id: 'hoa-setup' },
        { type: 'Setup', id: 'hoa-setup-base-3' },
      ]),
    }),
    savePurchaseLedger: builder.mutation({
      async queryFn(body) {
        return requestJson('/api/v1/hoa-setup/savePurchaseLedger', {
          method: 'POST',
          body: JSON.stringify(body),
        })
      },
      invalidatesTags: (_result, error) => (error ? [] : [
        { type: 'Setup', id: 'hoa-setup' },
        { type: 'Setup', id: 'hoa-setup-base-4' },
      ]),
    }),
    getServiceNatureList: builder.query({
      async queryFn() {
        return requestJson('/api/v1/service-nature/getServiceNatureList')
      },
      providesTags: [{ type: 'Setup', id: 'service-nature' }],
    }),
    getVoucherSetupList: builder.query({
      async queryFn() {
        return requestJson('/api/v1/voucher-setup/getVoucherSetupList')
      },
      providesTags: [{ type: 'Setup', id: 'voucher-setup' }],
    }),
    getUnitOfMeasureList: builder.query({
      async queryFn() {
        return requestSetupList('/api/v1/unit-of-measure/getUnitOfMeasureList')
      },
      providesTags: [{ type: 'Setup', id: 'unit-of-measure' }],
    }),
    getMasterTdsTypeList: builder.query({
      async queryFn() {
        return requestSetupList('/api/v1/tds-type/getTdsTypeList')
      },
      providesTags: [{ type: 'Setup', id: 'tds-type' }],
    }),
    getTcsTypeList: builder.query({
      async queryFn() {
        return requestSetupList('/api/v1/tcs-type/getTcsTypeList')
      },
      providesTags: [{ type: 'Setup', id: 'tcs-type' }],
    }),
    getHsnCodeList: builder.query({
      async queryFn() {
        return requestSetupList('/api/v1/hsn-code/getHsnCodeList')
      },
      providesTags: [{ type: 'Setup', id: 'hsn-code' }],
    }),
    getSacCodeList: builder.query({
      async queryFn() {
        return requestSetupList('/api/v1/sac-code/getSacCodeList')
      },
      providesTags: [{ type: 'Setup', id: 'sac-code' }],
    }),
    getOwnTaxTdsTypeList: builder.query({
      async queryFn() {
        return requestJson('/api/v1/own-tax-info/getTdsTypeList')
      },
      providesTags: [{ type: 'Setup', id: 'own-tax-tds-type' }],
    }),
    saveSetup: builder.mutation({
      async queryFn({ resource, entityName, body }) {
        return requestJson(`/api/v1/${resource}/save${entityName}`, {
          method: 'POST',
          body: JSON.stringify(body),
        })
      },
      invalidatesTags: (_result, error, arg) => (error ? [] : [{ type: 'Setup', id: arg.resource }]),
    }),
    savePartyCustomLedgerList: builder.mutation({
      async queryFn(body) {
        return requestJson('/api/v1/client-details/savePartyCustomLedgerList', {
          method: 'POST',
          body: JSON.stringify(body),
        })
      },
      invalidatesTags: (_result, error) => (error ? [] : [
        { type: 'Setup', id: 'client-details' },
        { type: 'Setup', id: 'hoa-setup' },
      ]),
    }),
    updateSetup: builder.mutation({
      async queryFn({ resource, entityName, id, body }) {
        return requestJson(`/api/v1/${resource}/update${entityName}/${pathId(id)}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        })
      },
      invalidatesTags: (_result, error, arg) => (error ? [] : [
        { type: 'Setup', id: arg.resource },
        { type: 'Setup', id: `${arg.resource}-${arg.id}` },
      ]),
    }),
    removeSetup: builder.mutation({
      async queryFn({ resource, entityName, id }) {
        return requestJson(`/api/v1/${resource}/remove${entityName}/${pathId(id)}`, {
          method: 'POST',
        })
      },
      invalidatesTags: (_result, error, arg) => (error ? [] : [{ type: 'Setup', id: arg.resource }]),
    }),
    updateSetupActiveStatus: builder.mutation({
      async queryFn({ resource, entityName, id, activeStatus }) {
        return requestJson(
          `/api/v1/${resource}/update${entityName}ActiveStatus/${pathId(id)}?activeStatus=${encodeURIComponent(activeStatus)}`,
          { method: 'POST' },
        )
      },
      invalidatesTags: (_result, error, arg) => (error ? [] : [{ type: 'Setup', id: arg.resource }]),
    }),
    updateSetupDefaultStatus: builder.mutation({
      async queryFn({ resource, entityName, id, defaultStatus }) {
        const query = defaultStatus
          ? `?defaultStatus=${encodeURIComponent(defaultStatus)}`
          : ''
        return requestJson(`/api/v1/${resource}/update${entityName}DefaultStatus/${pathId(id)}${query}`, {
          method: 'POST',
        })
      },
      invalidatesTags: (_result, _error, arg) => [{ type: 'Setup', id: arg.resource }],
    }),
    getDfprSeatUserList: builder.query({
      async queryFn() {
        return requestJson('/api/v1/dfpr-setup/getDfprSeatUserList')
      },
      providesTags: [{ type: 'Setup', id: 'dfpr-seat-users' }],
    }),
    getDfprGroupById: builder.query({
      async queryFn(id) {
        return requestJson(`/api/v1/dfpr-setup/getDfprGroupById/${pathId(id)}`)
      },
      providesTags: (_result, _error, id) => [{ type: 'Setup', id: `dfpr-setup-${id}` }],
    }),
    saveDfprList: builder.mutation({
      async queryFn(body) {
        return requestJson('/api/v1/dfpr-setup/saveDfprList', {
          method: 'POST',
          body: JSON.stringify(body),
        })
      },
      invalidatesTags: (_result, error) => (error ? [] : [{ type: 'Setup', id: 'dfpr-setup' }]),
    }),
    getFinancialYearMonthList: builder.query({
      async queryFn(financialYearId) {
        const params = new URLSearchParams({ financialYearId })
        return requestJson(
          `/api/v1/audit-closure/financial-year-month/getFinancialYearMonthList?${params.toString()}`,
        )
      },
      providesTags: [{ type: 'Setup', id: 'audit-financial-year-month' }],
    }),
    freezeFinancialYearMonth: builder.mutation({
      async queryFn(idMask) {
        return requestJson(
          `/api/v1/audit-closure/financial-year-month/freezeFinancialYearMonth/${pathId(idMask)}`,
          { method: 'POST' },
        )
      },
      invalidatesTags: (_result, error) => (
        error ? [] : [{ type: 'Setup', id: 'audit-financial-year-month' }]
      ),
    }),
    getFinancialYearClosureList: builder.query({
      async queryFn({ financialYearId, frequency, financialYearMonthId }) {
        const params = new URLSearchParams({
          financialYearId,
          frequency,
        })
        if (frequency === 'M' && financialYearMonthId) {
          params.set('financialYearMonthId', financialYearMonthId)
        }
        return requestJson(
          `/api/v1/audit-closure/financial-year-closure/getFinancialYearClosureList?${params.toString()}`,
        )
      },
      providesTags: [{ type: 'Setup', id: 'audit-financial-year-closure' }],
    }),
    saveFinancialYearClosure: builder.mutation({
      async queryFn(body) {
        return requestJson('/api/v1/audit-closure/financial-year-closure/saveFinancialYearClosure', {
          method: 'POST',
          body: JSON.stringify(body),
        })
      },
      invalidatesTags: (_result, error) => (
        error ? [] : [{ type: 'Setup', id: 'audit-financial-year-closure' }]
      ),
    }),
    completeFinancialYearClosure: builder.mutation({
      async queryFn(idMask) {
        return requestJson(
          `/api/v1/audit-closure/financial-year-closure/completeFinancialYearClosure/${pathId(idMask)}`,
          { method: 'POST' },
        )
      },
      invalidatesTags: (_result, error) => (
        error ? [] : [{ type: 'Setup', id: 'audit-financial-year-closure' }]
      ),
    }),
    getFinancialYearSetupList: builder.query({
      async queryFn() {
        return requestJson('/api/v1/audit-closure/financial-year-setup/getFinancialYearSetupList')
      },
      providesTags: [{ type: 'Setup', id: 'audit-financial-year' }],
    }),
    saveFinancialYearSetup: builder.mutation({
      async queryFn(body) {
        return requestJson('/api/v1/audit-closure/financial-year-setup/saveFinancialYearSetup', {
          method: 'POST',
          body: JSON.stringify(body),
        })
      },
      invalidatesTags: (_result, error) => (error ? [] : [
        { type: 'Setup', id: 'audit-financial-year' },
        { type: 'Setup', id: 'audit-financial-year-month' },
      ]),
    }),
    freezeFinancialYearSetup: builder.mutation({
      async queryFn(idMask) {
        return requestJson(
          `/api/v1/audit-closure/financial-year-setup/freezeFinancialYearSetup/${pathId(idMask)}`,
          { method: 'POST' },
        )
      },
      invalidatesTags: (_result, error) => (error ? [] : [
        { type: 'Setup', id: 'audit-financial-year' },
        { type: 'Setup', id: 'audit-financial-year-month' },
      ]),
    }),
    deactivateFinancialYearSetup: builder.mutation({
      async queryFn(idMask) {
        return requestJson(
          `/api/v1/audit-closure/financial-year-setup/deactivateFinancialYearSetup/${pathId(idMask)}`,
          { method: 'POST' },
        )
      },
      invalidatesTags: (_result, error) => (error ? [] : [{ type: 'Setup', id: 'audit-financial-year' }]),
    }),
    activateFinancialYearSetup: builder.mutation({
      async queryFn(idMask) {
        return requestJson(
          `/api/v1/audit-closure/financial-year-setup/activateFinancialYearSetup/${pathId(idMask)}`,
          { method: 'POST' },
        )
      },
      invalidatesTags: (_result, error) => (error ? [] : [{ type: 'Setup', id: 'audit-financial-year' }]),
    }),
    updateFinancialYearSetup: builder.mutation({
      async queryFn({ idMask, fromDate, toDate }) {
        return requestJson(
          `/api/v1/audit-closure/financial-year-setup/updateFinancialYearSetup/${pathId(idMask)}`,
          {
            method: 'PUT',
            body: JSON.stringify({ fromDate, toDate }),
          },
        )
      },
      invalidatesTags: (_result, error) => (error ? [] : [
        { type: 'Setup', id: 'audit-financial-year' },
        { type: 'Setup', id: 'audit-financial-year-month' },
      ]),
    }),
    submitSetup: builder.mutation({
      async queryFn({ resource, entityName, id }) {
        return requestJson(`/api/v1/${resource}/submit${entityName}/${pathId(id)}`, {
          method: 'POST',
        })
      },
      invalidatesTags: (_result, _error, arg) => [{ type: 'Setup', id: arg.resource }],
    }),
  }),
})

export const {
  useSearchSetupQuery,
  useLazySearchSetupQuery,
  useGetCompanySetupQuery,
  useGetOfficeSetupListQuery,
  useGetOfficeSetupByIdQuery,
  useGetAccountSetupByIdQuery,
  useGetAccountSetupGroupUnderListQuery,
  useGetUserAllocationListQuery,
  useGetUserAllocationOfficeListQuery,
  useGetUserAllocationCostCentreListQuery,
  useGetActiveSeatUserAllotedListQuery,
  useGetSeatUserAllotedListForOfficeAllocationQuery,
  useGetSeatUserAllotedListForCostCentreAllocationQuery,
  useGetUserAllocationListByOfficeIdQuery,
  useGetUserAllocationListByCostCenterIdQuery,
  useGetLedgerAllocationOfficeListQuery,
  useGetLedgerAllocationCostCentreListQuery,
  useGetHoaSetupListForOfficeAllocationQuery,
  useGetHoaSetupListForCostCentreAllocationQuery,
  useGetLedgerAllocationListByOfficeIdQuery,
  useGetLedgerAllocationListByCostCenterIdQuery,
  useGetAccountSetupListQuery,
  useGetAccountSetupListByBaseAccountTypeIdQuery,
  useGetHoaSetupByIdQuery,
  useGetHoaSetupListQuery,
  useGetHoaSetupListByBaseAccountTypeIdQuery,
  useSaveSalesLedgerMutation,
  useSavePurchaseLedgerMutation,
  useGetServiceNatureListQuery,
  useGetVoucherSetupListQuery,
  useGetUnitOfMeasureListQuery,
  useGetMasterTdsTypeListQuery,
  useGetOwnTaxTdsTypeListQuery,
  useGetTcsTypeListQuery,
  useGetHsnCodeListQuery,
  useGetSacCodeListQuery,
  useGetBankSetupListQuery,
  useGetBankAccountSetupListQuery,
  useGetCashSetupListQuery,
  useLazyGetAllBankBranchSetupByRefIdQuery,
  useLazyGetIfscDetailsByIfscNoQuery,
  useGetOwnTaxInfoByIdQuery,
  useGetOwnTaxInfoListQuery,
  useGetCostCentreByIdQuery,
  useGetServiceTypeSetupListQuery,
  useGetServiceTypeSetupByIdQuery,
  useGetClientDetailsByIdQuery,
  useGetSetupByIdQuery,
  useLazyGetClientDetailsByIdQuery,
  useGetNumberingSetupListByVoucherTypeQuery,
  useGetClientDetailsListQuery,
  useGetClientDetailsListByPartyTypeQuery,
  useGetServiceTypeSetupByStatusQuery,
  useGetCostCategoryListQuery,
  useGetCostCentreListQuery,
  useGetCostCentreListByCategoryIdQuery,
  useLazyGetCostCentreListByCategoryIdQuery,
  useLazyGetGstDetailsQuery,
  useSearchSetupApprovalQuery,
  useGetDfprSeatUserListQuery,
  useGetDfprGroupByIdQuery,
  useSaveDfprListMutation,
  useSaveSetupMutation,
  useSavePartyCustomLedgerListMutation,
  useUpdateSetupMutation,
  useRemoveSetupMutation,
  useUpdateSetupActiveStatusMutation,
  useUpdateSetupDefaultStatusMutation,
  useSubmitSetupMutation,
  useGetFinancialYearMonthListQuery,
  useFreezeFinancialYearMonthMutation,
  useGetFinancialYearClosureListQuery,
  useSaveFinancialYearClosureMutation,
  useCompleteFinancialYearClosureMutation,
  useGetFinancialYearSetupListQuery,
  useSaveFinancialYearSetupMutation,
  useUpdateFinancialYearSetupMutation,
  useActivateFinancialYearSetupMutation,
  useDeactivateFinancialYearSetupMutation,
  useFreezeFinancialYearSetupMutation,
} = setupApi
