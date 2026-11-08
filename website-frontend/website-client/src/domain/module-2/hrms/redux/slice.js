/**
 * HRMS Redux Slice
 * Maintains consistency with standard domain module architecture.
 */

import { INITIAL_EMPLOYEES } from '../constants/hrmsConstants'

const initialState = {
  employees: INITIAL_EMPLOYEES,
  selectedId: null,
  filter: {
    search: '',
    department: 'All',
    status: 'All',
  },
  loading: false,
  error: null,
}

export const hrmsReducer = (state = initialState, action) => {
  switch (action?.type) {
    case 'hrms/setEmployees':
      return { ...state, employees: action.payload }
    case 'hrms/setSelectedId':
      return { ...state, selectedId: action.payload }
    case 'hrms/setFilter':
      return { ...state, filter: { ...state.filter, ...action.payload } }
    default:
      return state
  }
}

export default hrmsReducer
