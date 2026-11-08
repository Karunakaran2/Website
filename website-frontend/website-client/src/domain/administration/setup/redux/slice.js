import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  search: '',
  page: 1,
  pageSize: 10,
  sortBy: null,
  sortDir: 'asc',
  formOpen: false,
  editingId: null,
  formError: '',
  fieldErrors: {},
}

const setupSlice = createSlice({
  name: 'setup',
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload
      state.page = 1
    },
    setPage(state, action) {
      state.page = action.payload
    },
    setPageSize(state, action) {
      state.pageSize = action.payload
      state.page = 1
    },
    setSort(state, action) {
      state.sortBy = action.payload.sortBy
      state.sortDir = action.payload.sortDir
      state.page = 1
    },
    openCreateForm(state) {
      state.formOpen = true
      state.editingId = null
      state.formError = ''
      state.fieldErrors = {}
    },
    openEditForm(state, action) {
      state.formOpen = true
      state.editingId = action.payload
      state.formError = ''
      state.fieldErrors = {}
    },
    closeForm(state) {
      state.formOpen = false
      state.editingId = null
      state.formError = ''
      state.fieldErrors = {}
    },
    setFormErrors(state, action) {
      state.formError = action.payload.message || ''
      state.fieldErrors = action.payload.fieldErrors || {}
    },
    resetSetupState() {
      return initialState
    },
  },
})

export const {
  setSearch,
  setPage,
  setPageSize,
  setSort,
  openCreateForm,
  openEditForm,
  closeForm,
  setFormErrors,
  resetSetupState,
} = setupSlice.actions

export const setupReducer = setupSlice.reducer
