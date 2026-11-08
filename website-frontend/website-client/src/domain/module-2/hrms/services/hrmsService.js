/**
 * HRMS Local Service
 * Handles data manipulation and persistence for fictional employee records.
 */

import { INITIAL_EMPLOYEES } from '../constants/hrmsConstants'

const STORAGE_KEY = 'kran_hrms_employees_v1'

class HrmsService {
  constructor() {
    this._init()
  }

  _init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EMPLOYEES))
      }
    } catch {
      // In SSR or storage-restricted contexts, fallback gracefully
    }
  }

  getAll() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch {
      // Fallback
    }
    return [...INITIAL_EMPLOYEES]
  }

  getById(id) {
    const all = this.getAll()
    return all.find((e) => e.id === id) || null
  }

  create(employeeData) {
    const all = this.getAll()
    const nextNumber = 1000 + all.length + 1
    const newEmployee = {
      id: `EMP-${nextNumber}`,
      name: employeeData.name.trim(),
      email: employeeData.email.trim(),
      phone: employeeData.phone?.trim() || '+91 98470 00000',
      department: employeeData.department,
      designation: employeeData.designation.trim(),
      joiningDate: employeeData.joiningDate,
      status: employeeData.status || 'Active',
      location: employeeData.location || 'Thiruvananthapuram',
      avatarColor: 'bg-primary/10 text-primary',
    }

    const updated = [newEmployee, ...all]
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Ignore
    }
    return newEmployee
  }

  update(id, updates) {
    const all = this.getAll()
    const index = all.findIndex((e) => e.id === id)
    if (index === -1) return null

    const updatedEmployee = {
      ...all[index],
      ...updates,
      id, // Preserve ID
    }

    all[index] = updatedEmployee
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
    } catch {
      // Ignore
    }
    return updatedEmployee
  }

  delete(id) {
    const all = this.getAll()
    const filtered = all.filter((e) => e.id !== id)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    } catch {
      // Ignore
    }
    return true
  }

  reset() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EMPLOYEES))
    } catch {
      // Ignore
    }
    return [...INITIAL_EMPLOYEES]
  }
}

export const hrmsService = new HrmsService()
