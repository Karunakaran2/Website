import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'

/**
 * Shared RTK Query API. Domains inject endpoints via `baseApi.injectEndpoints`.
 * Mock workflows use `fakeBaseQuery`.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  tagTypes: [
    'Auth',
    'Account',
    'Voucher',
    'StatutoryPayment',
    'Report',
    'Settings',
    'Setup',
    'Budget',
    'Dashboard',
    'Asset',
    'BankIntegration',
    'Deposits',
    'ExternalIntegration',
    'FinancialSanction',
    'Payment',
  ],
  endpoints: () => ({}),
})
