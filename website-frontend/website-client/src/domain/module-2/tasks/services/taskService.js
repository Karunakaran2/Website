/**
 * Task Management Local Service
 * Handles data persistence and manipulation for tasks.
 */

import { INITIAL_TASKS } from '../constants/taskConstants'
import { notifyTasksChanged } from './taskServiceEvents'

const STORAGE_KEY = 'kran_task_management_tasks_v1'

class TaskService {
  constructor() {
    this._init()
  }

  _init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TASKS))
      }
    } catch {
      // Fallback
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
    return [...INITIAL_TASKS]
  }

  getById(id) {
    const all = this.getAll()
    return all.find((t) => t.id === id) || null
  }

  create(taskData) {
    const all = this.getAll()
    const nextNum = 200 + all.length + 1
    const newTask = {
      id: `TSK-${nextNum}`,
      title: taskData.title.trim(),
      description: taskData.description?.trim() || '',
      assignee: taskData.assignee,
      priority: taskData.priority || 'Medium',
      status: taskData.status || 'To Do',
      dueDate: taskData.dueDate,
      category: taskData.category || 'General',
    }

    const updated = [newTask, ...all]
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Fallback
    }
    notifyTasksChanged()
    return newTask
  }

  update(id, updates) {
    const all = this.getAll()
    const index = all.findIndex((t) => t.id === id)
    if (index === -1) return null

    const updatedTask = {
      ...all[index],
      ...updates,
      id, // Preserve ID
    }

    all[index] = updatedTask
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
    } catch {
      // Fallback
    }
    notifyTasksChanged()
    return updatedTask
  }

  updateStatus(id, newStatus) {
    return this.update(id, { status: newStatus })
  }

  delete(id) {
    const all = this.getAll()
    const filtered = all.filter((t) => t.id !== id)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    } catch {
      // Fallback
    }
    notifyTasksChanged()
    return true
  }

  reset() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TASKS))
    } catch {
      // Fallback
    }
    notifyTasksChanged()
    return [...INITIAL_TASKS]
  }
}

export const taskService = new TaskService()
