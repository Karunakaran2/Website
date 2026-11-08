import { useState, useMemo, useCallback } from 'react'
import { computeSampleMetrics } from '../utils/sampleModuleUtils'
import { showAppToast } from '@/shared/components'
import {
  DEMO_CURRENT_USER,
  sampleModuleService,
} from '../services/sampleModuleService'

export function useSampleModuleData() {
  const [records, setRecords] = useState(() => sampleModuleService.getRecords())
  const [activityLogs, setActivityLogs] = useState(() => sampleModuleService.getActivityLogs())

  const syncFromService = useCallback(() => {
    setRecords(sampleModuleService.getRecords())
    setActivityLogs(sampleModuleService.getActivityLogs())
  }, [])

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPriority, setSelectedPriority] = useState('All')

  // Pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [formModalMode, setFormModalMode] = useState('create') // 'create' | 'edit'
  const [selectedRecord, setSelectedRecord] = useState(null)

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // UI state toggles for demoing
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.assignee.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        selectedStatus === 'All' ||
        item.status === selectedStatus ||
        item.applicationStatus === selectedStatus

      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory

      const matchesPriority =
        selectedPriority === 'All' || item.priority === selectedPriority

      return matchesSearch && matchesStatus && matchesCategory && matchesPriority
    })
  }, [records, searchQuery, selectedStatus, selectedCategory, selectedPriority])

  // Paginated records
  const paginatedRecords = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredRecords.slice(start, start + pageSize)
  }, [filteredRecords, page, pageSize])

  // Summary Metrics (always derived dynamically from the dataset)
  const metrics = useMemo(() => computeSampleMetrics(records), [records])

  // CRUD Operations
  const handleCreate = useCallback((newRecordData) => {
    const id = `REC-${1000 + records.length + 1}`
    const code = `MOD-${String(records.length + 1).padStart(2, '0')}`
    const fullRecord = {
      ...newRecordData,
      id,
      code,
      applicationStatus: 'Draft',
      status: newRecordData.status || 'Draft',
      assignee: newRecordData.assignee || DEMO_CURRENT_USER,
      createdDate: new Date().toISOString().split('T')[0],
      progress: newRecordData.progress || 10,
      tags: newRecordData.tags || ['Enterprise'],
    }

    sampleModuleService.saveRecords([fullRecord, ...sampleModuleService.getRecords()])
    sampleModuleService.appendActivity({
      action: 'Created Record',
      details: `Created new project "${fullRecord.title}"`,
      type: 'success',
    })
    syncFromService()
    setIsFormModalOpen(false)
  }, [records.length, syncFromService])

  const handleUpdate = useCallback(
    (updatedData) => {
      const existing = records.find((r) => r.id === updatedData.id)
      if (
        existing &&
        ['Approved', 'Rejected'].includes(existing.applicationStatus)
      ) {
        showAppToast('Approved or rejected applications cannot be edited.', 'error')
        return
      }
      sampleModuleService.saveRecords(
        records.map((r) => (r.id === updatedData.id ? { ...r, ...updatedData } : r)),
      )
      sampleModuleService.appendActivity({
        action: 'Updated Record',
        details: `Updated details for "${updatedData.title}"`,
        type: 'info',
      })
      syncFromService()
      setIsFormModalOpen(false)
    },
    [records, syncFromService],
  )

  const deleteRecord = useCallback(
    (record) => {
      if (!record?.id) return false
      const targetTitle = record.title
      sampleModuleService.saveRecords(records.filter((r) => r.id !== record.id))
      sampleModuleService.appendActivity({
        action: 'Deleted Record',
        details: `Deleted "${targetTitle}"`,
        type: 'warning',
      })
      syncFromService()
      showAppToast(`Record "${targetTitle}" deleted successfully.`, 'success', { action: 'delete' })
      return true
    },
    [records, syncFromService],
  )

  const submitApplication = useCallback(
    (id) => {
      const result = sampleModuleService.submitApplication(id)
      if (!result.ok) {
        showAppToast(result.message, 'error')
        return
      }
      syncFromService()
      showAppToast('Application submitted for review.', 'success', { action: 'submit' })
    },
    [syncFromService],
  )

  const reviewApplication = useCallback(
    (id, decision) => {
      const result = sampleModuleService.reviewApplication(id, decision)
      if (!result.ok) {
        showAppToast(result.message, 'error')
        return false
      }
      syncFromService()
      showAppToast('Application status updated.', 'success', { action: 'approve' })
      return true
    },
    [syncFromService],
  )

  const openCreateModal = useCallback(() => {
    setSelectedRecord(null)
    setFormModalMode('create')
    setIsFormModalOpen(true)
  }, [])

  const openEditModal = useCallback((record) => {
    setSelectedRecord(record)
    setFormModalMode('edit')
    setIsFormModalOpen(true)
  }, [])

  const openDetailModal = useCallback((record) => {
    setSelectedRecord(record)
    setIsDetailModalOpen(true)
  }, [])

  const resetFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedStatus('All')
    setSelectedCategory('All')
    setSelectedPriority('All')
    setPage(1)
  }, [])

  return {
    records,
    activityLogs,
    filteredRecords,
    paginatedRecords,
    metrics,
    // Filter controls
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    selectedCategory,
    setSelectedCategory,
    selectedPriority,
    setSelectedPriority,
    resetFilters,
    // Pagination controls
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages: Math.ceil(filteredRecords.length / pageSize) || 1,
    // Modal states & controls
    isFormModalOpen,
    setIsFormModalOpen,
    formModalMode,
    selectedRecord,
    isDetailModalOpen,
    setIsDetailModalOpen,
    openCreateModal,
    openEditModal,
    openDetailModal,
    handleCreate,
    handleUpdate,
    deleteRecord,
    submitApplication,
    reviewApplication,
    syncFromService,
    demoCurrentUser: DEMO_CURRENT_USER,
    // Demo toggles
    isLoading,
    setIsLoading,
    hasError,
    setHasError,
  }
}
