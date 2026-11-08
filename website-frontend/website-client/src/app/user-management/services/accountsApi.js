import { baseApi } from '@/shared/api/baseApi'
import { ACCOUNTS, getAccountById } from '../constants/accounts'

export const accountsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAccounts: builder.query({
      queryFn: async () => ({ data: ACCOUNTS }),
      providesTags: ['Account'],
    }),
    getAccountById: builder.query({
      queryFn: async (accountId) => {
        const account = getAccountById(accountId)
        if (!account) {
          return { error: { status: 404, data: 'Account not found' } }
        }
        return { data: account }
      },
      providesTags: (_result, _error, accountId) => [{ type: 'Account', id: accountId }],
    }),
  }),
})

export const { useGetAccountsQuery, useGetAccountByIdQuery } = accountsApi
