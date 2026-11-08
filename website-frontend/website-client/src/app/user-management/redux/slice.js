import { createSlice } from '@reduxjs/toolkit'
import { DEFAULT_ACCOUNT_ID } from '../constants/accounts'

const initialState = {
  selectedAccountId: DEFAULT_ACCOUNT_ID,
}

const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {
    setSelectedAccountId(state, action) {
      state.selectedAccountId = action.payload
    },
    clearSelectedAccount(state) {
      state.selectedAccountId = null
    },
  },
})

export const { setSelectedAccountId, clearSelectedAccount } = userManagementSlice.actions
export const userManagementReducer = userManagementSlice.reducer
