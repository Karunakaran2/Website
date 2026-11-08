import { useState, useMemo, useCallback } from 'react'
import { showAppToast } from '@/shared/components'
import { hrmsService } from '../services/hrmsService'
import { calculateHrmsStats, filterEmployees } from '../utils/hrmsUtils'

export function useHrms() {
  const [employees, setEmployees] = useState(() => hrmsService.getAll())
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('All')
  const [status, setStatus] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [formMode, setFormMode] = useState('create') // 'create' | 'edit'
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  // Derived statistics (live calculation from employees list)
  const stats = useMemo(() => calculateHrmsStats(employees), [employees])

  // Filtered list
  const filteredEmployees = useMemo(() => {
    return filterEmployees(employees, { search, department, status })
  }, [employees, search, department, status])

  // Total pages and sliced employees
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize))
  const pagedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredEmployees.slice(start, start + pageSize)
  }, [filteredEmployees, currentPage, pageSize])

  const showNotification = useCallback((message, type = 'success') => {
    if (type === 'info') {
      showAppToast(message, 'info')
      return
    }
    showAppToast(message, 'success', { action: 'save' })
  }, [])

  // Actions
  const handleOpenCreate = useCallback(() => {
    setSelectedEmployee(null)
    setFormMode('create')
    setIsFormModalOpen(true)
  }, [])

  const handleOpenEdit = useCallback((emp) => {
    setSelectedEmployee(emp)
    setFormMode('edit')
    setIsFormModalOpen(true)
  }, [])

  const handleOpenDetail = useCallback((emp) => {
    setSelectedEmployee(emp)
    setIsDetailModalOpen(true)
  }, [])

  const handleCloseModals = useCallback(() => {
    setIsFormModalOpen(false)
    setIsDetailModalOpen(false)
    setSelectedEmployee(null)
  }, [])

  const handleSaveEmployee = useCallback(
    (formData) => {
      if (formMode === 'create') {
        const created = hrmsService.create(formData)
        setEmployees(hrmsService.getAll())
        showNotification(`Employee ${created.name} (${created.id}) was successfully added.`)
      } else if (selectedEmployee) {
        const updated = hrmsService.update(selectedEmployee.id, formData)
        setEmployees(hrmsService.getAll())
        showNotification(`Employee ${updated.name} profile was successfully updated.`)
      }
      handleCloseModals()
    },
    [formMode, selectedEmployee, showNotification, handleCloseModals]
  )

  const handleDeleteEmployee = useCallback(
    (id) => {
      const emp = employees.find((e) => e.id === id)
      if (emp) {
        hrmsService.delete(id)
        setEmployees(hrmsService.getAll())
        showNotification(`Employee ${emp.name} record was removed.`, 'info')
      }
    },
    [employees, showNotification]
  )

  const handleResetFilters = useCallback(() => {
    setSearch('')
    setDepartment('All')
    setStatus('All')
    setCurrentPage(1)
  }, [])

  return {
    employees,
    filteredEmployees,
    pagedEmployees,
    stats,
    search,
    department,
    status,
    currentPage,
    totalPages,
    pageSize,
    isFormModalOpen,
    isDetailModalOpen,
    formMode,
    selectedEmployee,
    // Actions
    setSearch: (val) => {
      setSearch(val)
      setCurrentPage(1)
    },
    setDepartment: (val) => {
      setDepartment(val)
      setCurrentPage(1)
    },
    setStatus: (val) => {
      setStatus(val)
      setCurrentPage(1)
    },
    setCurrentPage,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleCloseModals,
    handleSaveEmployee,
    handleDeleteEmployee,
    handleResetFilters,
  }
}
