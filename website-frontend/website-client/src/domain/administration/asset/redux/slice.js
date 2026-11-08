import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  /** Client UI state for Asset (extend when features land). */
  ready: true,
}

const assetSlice = createSlice({
  name: 'asset',
  initialState,
  reducers: {
    resetAssetUiState() {
      return initialState
    },
  },
})

export const { resetAssetUiState } = assetSlice.actions
export const assetReducer = assetSlice.reducer
