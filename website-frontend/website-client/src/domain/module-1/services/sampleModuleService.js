/**
 * Module 1 demo persistence — localStorage-backed records and workflow (not production API).
 */

import {
  INITIAL_ACTIVITY_LOGS,
  INITIAL_SAMPLE_RECORDS,
} from '../constants/sampleModuleConstants'

const RECORDS_KEY = 'kran_demo_module1_records_v1'
const ACTIVITY_KEY = 'kran_demo_module1_activity_v1'

/** In-memory fallback when localStorage is unavailable (unit tests, SSR). */
let memoryRecords = null
let memoryActivity = null

export const DEMO_CURRENT_USER = 'Current User'

const STATUS_FROM_LEGACY = {
  Draft: 'Draft',
  Pending: 'Submitted',
  Active: 'Under Review',
  Approved: 'Approved',
  Completed: 'Approved',
  Rejected: 'Rejected',
}

export const APPLICATION_STATUS_OPTIONS = [
  'Draft',
  'Submitted',
  'Under Review',
  'Returned',
  'Approved',
  'Rejected',
  'Archived',
]

function normalizeRecord(record) {
  if (!record) return record
  const applicationStatus =
    record.applicationStatus ||
    STATUS_FROM_LEGACY[record.status] ||
    'Draft'
  return { ...record, applicationStatus }
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return fallback
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore
  }
}

class SampleModuleService {
  getRecords() {
    if (memoryRecords) {
      return memoryRecords.map(normalizeRecord)
    }
    const stored = readJson(RECORDS_KEY, null)
    const list = stored ?? INITIAL_SAMPLE_RECORDS
    memoryRecords = list.map(normalizeRecord)
    return [...memoryRecords]
  }

  saveRecords(records) {
    memoryRecords = records.map(normalizeRecord)
    writeJson(RECORDS_KEY, memoryRecords)
    return this.getRecords()
  }

  getActivityLogs() {
    if (memoryActivity) {
      return [...memoryActivity]
    }
    memoryActivity = readJson(ACTIVITY_KEY, INITIAL_ACTIVITY_LOGS)
    return [...memoryActivity]
  }

  saveActivityLogs(logs) {
    memoryActivity = [...logs]
    writeJson(ACTIVITY_KEY, memoryActivity)
    return this.getActivityLogs()
  }

  appendActivity(entry) {
    const logs = this.getActivityLogs()
    const next = [
      {
        id: `ACT-${Date.now()}`,
        timestamp: 'Just now',
        user: DEMO_CURRENT_USER,
        ...entry,
      },
      ...logs,
    ]
    return this.saveActivityLogs(next)
  }

  updateRecord(id, patch) {
    const records = this.getRecords().map((r) =>
      r.id === id ? normalizeRecord({ ...r, ...patch }) : r,
    )
    return this.saveRecords(records)
  }

  submitApplication(id) {
    const record = this.getRecords().find((r) => r.id === id)
    if (
      !record ||
      (record.applicationStatus !== 'Draft' && record.applicationStatus !== 'Returned')
    ) {
      return { ok: false, message: 'Only draft or returned applications can be submitted.' }
    }
    this.updateRecord(id, {
      applicationStatus: 'Submitted',
      status: 'Pending',
    })
    this.appendActivity({
      action: 'Submitted Application',
      details: `Application "${record.title}" submitted for review.`,
      type: 'info',
    })
    return { ok: true }
  }

  reviewApplication(id, decision) {
    const record = this.getRecords().find((r) => r.id === id)
    if (!record) return { ok: false, message: 'Record not found.' }
    if (!['Submitted', 'Under Review'].includes(record.applicationStatus)) {
      return { ok: false, message: 'Record is not in the approval queue.' }
    }
    const map = {
      approve: { applicationStatus: 'Approved', status: 'Approved' },
      reject: { applicationStatus: 'Rejected', status: 'Rejected' },
      return: { applicationStatus: 'Returned', status: 'Draft' },
      startReview: { applicationStatus: 'Under Review', status: 'Active' },
    }
    const next = map[decision]
    if (!next) return { ok: false, message: 'Invalid decision.' }
    this.updateRecord(id, next)
    this.appendActivity({
      action: `Review: ${decision}`,
      details: `Application "${record.title}" marked as ${next.applicationStatus}.`,
      type: decision === 'reject' ? 'warning' : 'success',
    })
    return { ok: true }
  }

  resetDemoData() {
    memoryRecords = INITIAL_SAMPLE_RECORDS.map(normalizeRecord)
    memoryActivity = [...INITIAL_ACTIVITY_LOGS]
    writeJson(RECORDS_KEY, memoryRecords)
    writeJson(ACTIVITY_KEY, memoryActivity)
  }
}

export const sampleModuleService = new SampleModuleService()
