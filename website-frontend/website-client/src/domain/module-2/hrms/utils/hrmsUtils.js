/**
 * Utility functions for HRMS domain.
 */

export function calculateHrmsStats(employees = []) {
  const total = employees.length
  const active = employees.filter((e) => e.status === 'Active').length
  const onLeave = employees.filter((e) => e.status === 'On Leave').length
  const uniqueDepts = new Set(employees.map((e) => e.department).filter(Boolean))

  return {
    total,
    active,
    onLeave,
    departmentsCount: uniqueDepts.size,
  }
}

export function validateEmployee(formData = {}) {
  const errors = {}

  if (!formData.name?.trim()) {
    errors.name = 'Employee name is required.'
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.'
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.email?.trim()) {
    errors.email = 'Corporate email address is required.'
  } else if (!emailPattern.test(formData.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!formData.department?.trim() || formData.department === 'All') {
    errors.department = 'Please select a valid department.'
  }

  if (!formData.designation?.trim()) {
    errors.designation = 'Designation is required.'
  }

  if (!formData.joiningDate?.trim()) {
    errors.joiningDate = 'Joining date is required.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function filterEmployees(employees = [], { search = '', department = 'All', status = 'All' } = {}) {
  const q = String(search).trim().toLowerCase()

  return employees.filter((emp) => {
    // Search query matches name, ID, or email
    const matchesSearch =
      !q ||
      emp.name?.toLowerCase().includes(q) ||
      emp.id?.toLowerCase().includes(q) ||
      emp.email?.toLowerCase().includes(q) ||
      emp.designation?.toLowerCase().includes(q)

    // Department match
    const matchesDept = !department || department === 'All' || emp.department === department

    // Status match
    const matchesStatus = !status || status === 'All' || emp.status === status

    return matchesSearch && matchesDept && matchesStatus
  })
}

export function getStatusBadgeVariant(status) {
  switch (status) {
    case 'Active':
      return 'success'
    case 'On Leave':
      return 'warning'
    case 'Inactive':
      return 'neutral'
    default:
      return 'neutral'
  }
}
