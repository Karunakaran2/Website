import {
  INITIAL_ATTENDANCE_ROWS,
  INITIAL_COLLABORATION_ROWS,
  INITIAL_CONFIG_ROWS,
  INITIAL_LEAVE_ROWS,
  INITIAL_REPORT_ROWS,
} from '../constants/module2PortalMockData'

const KEY = 'kran_module2_portal_v1'

const DEFAULT_STATE = {
  attendance: INITIAL_ATTENDANCE_ROWS,
  leave: INITIAL_LEAVE_ROWS,
  collaboration: INITIAL_COLLABORATION_ROWS,
  reports: INITIAL_REPORT_ROWS,
  config: INITIAL_CONFIG_ROWS,
}

function readState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {
    // ignore
  }
  return { ...DEFAULT_STATE }
}

function writeState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
  return readState()
}

class Module2PortalService {
  getDataset(name) {
    const state = readState()
    return [...(state[name] ?? DEFAULT_STATE[name] ?? [])]
  }

  updateRow(dataset, id, patch) {
    const state = readState()
    const list = state[dataset] ?? []
    state[dataset] = list.map((row) => (row.id === id ? { ...row, ...patch } : row))
    return writeState(state)[dataset]
  }

  resetDemo() {
    writeState(DEFAULT_STATE)
    return readState()
  }
}

export const module2PortalService = new Module2PortalService()
