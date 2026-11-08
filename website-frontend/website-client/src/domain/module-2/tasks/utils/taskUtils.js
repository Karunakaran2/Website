/**
 * Utility functions for Task Management domain.
 */

export function calculateTaskStats(tasks = []) {
  const total = tasks.length
  const todo = tasks.filter((t) => t.status === 'To Do').length
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length
  const completed = tasks.filter((t) => t.status === 'Completed').length

  return {
    total,
    todo,
    inProgress,
    completed,
  }
}

export function validateTask(formData = {}) {
  const errors = {}

  if (!formData.title?.trim()) {
    errors.title = 'Task title is required.'
  } else if (formData.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters long.'
  }

  if (!formData.assignee?.trim() || formData.assignee === 'All') {
    errors.assignee = 'Please assign this task to a team member.'
  }

  if (!formData.priority?.trim() || formData.priority === 'All') {
    errors.priority = 'Please specify priority level.'
  }

  if (!formData.status?.trim() || formData.status === 'All') {
    errors.status = 'Please select a valid initial status.'
  }

  if (!formData.dueDate?.trim()) {
    errors.dueDate = 'Due date is required.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function filterTasks(
  tasks = [],
  { search = '', status = 'All', priority = 'All', assignee = 'All' } = {}
) {
  const q = String(search).trim().toLowerCase()

  return tasks.filter((t) => {
    // Search in ID, title, or description
    const matchesSearch =
      !q ||
      t.title?.toLowerCase().includes(q) ||
      t.id?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q)

    // Status filter
    const matchesStatus = !status || status === 'All' || t.status === status

    // Priority filter
    const matchesPriority = !priority || priority === 'All' || t.priority === priority

    // Assignee filter
    const matchesAssignee = !assignee || assignee === 'All' || t.assignee === assignee

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
  })
}

export function getPriorityBadgeVariant(priority) {
  switch (priority) {
    case 'High':
      return {
        classes: 'bg-rose-100 text-rose-800 border-rose-200',
        dot: 'bg-rose-500',
      }
    case 'Medium':
      return {
        classes: 'bg-amber-100 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
      }
    case 'Low':
      return {
        classes: 'bg-slate-100 text-slate-800 border-slate-200',
        dot: 'bg-slate-400',
      }
    default:
      return {
        classes: 'bg-slate-100 text-slate-800 border-slate-200',
        dot: 'bg-slate-400',
      }
  }
}

export function getStatusBadgeVariant(status) {
  switch (status) {
    case 'Completed':
      return {
        classes: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-500',
      }
    case 'In Progress':
      return {
        classes: 'bg-blue-100 text-blue-800 border-blue-200',
        dot: 'bg-blue-500',
      }
    case 'To Do':
      return {
        classes: 'bg-slate-100 text-slate-800 border-slate-200',
        dot: 'bg-slate-400',
      }
    default:
      return {
        classes: 'bg-slate-100 text-slate-800 border-slate-200',
        dot: 'bg-slate-400',
      }
  }
}
