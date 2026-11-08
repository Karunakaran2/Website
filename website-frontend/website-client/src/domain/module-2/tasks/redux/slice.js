/**
 * Task Management Redux Slice
 * Maintains consistency with standard domain module architecture.
 */

import { INITIAL_TASKS } from '../constants/taskConstants'

const initialState = {
  tasks: INITIAL_TASKS,
  selectedTaskId: null,
  filters: {
    search: '',
    status: 'All',
    priority: 'All',
    assignee: 'All',
  },
  loading: false,
}

export const taskReducer = (state = initialState, action) => {
  switch (action?.type) {
    case 'task/setTasks':
      return { ...state, tasks: action.payload }
    case 'task/setSelectedTaskId':
      return { ...state, selectedTaskId: action.payload }
    case 'task/setFilters':
      return { ...state, filters: { ...state.filters, ...action.payload } }
    default:
      return state
  }
}

export default taskReducer
