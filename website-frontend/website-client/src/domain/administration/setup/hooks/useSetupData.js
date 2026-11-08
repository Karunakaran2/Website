import { useState, useMemo, useCallback } from 'react'
import { MOCK_MASTER_DATA } from '../constants/setupConstants'
import { computeSetupMetrics } from '../utils/setupUtils'
import { appToast } from '@/shared/components/toast/appToast'

export function useSetupData() {
  const [records, setRecords] = useState(MOCK_MASTER_DATA)

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [formModalMode, setFormModalMode] = useState('create')
  const [selectedRecord, setSelectedRecord] = useState(null)

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const metrics = useMemo(() => computeSetupMetrics(records), [records])

  const openCreateModal = useCallback((defaultCategory = 'Departments') => {
    setFormModalMode('create')
    setSelectedRecord({ category: defaultCategory })
    setIsFormModalOpen(true)
  }, [])

  const openEditModal = useCallback((record) => {
    setFormModalMode('edit')
    setSelectedRecord(record)
    setIsFormModalOpen(true)
  }, [])

  const openDetailModal = useCallback((record) => {
    setSelectedRecord(record)
    setIsDetailModalOpen(true)
  }, [])

  const handleCreate = useCallback((data) => {
    const nextId = `set-custom-${Date.now()}`
    const newRecord = {
      ...data,
      id: nextId,
      code: data.code.trim().toUpperCase(),
      updatedDate: new Date().toISOString().split('T')[0],
    }

    setRecords((prev) => [newRecord, ...prev])
    setIsFormModalOpen(false)
    appToast.success(`Master record "${newRecord.name}" (${newRecord.code}) created successfully.`, {
      action: 'save',
    })
  }, [])

  const handleUpdate = useCallback((data) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === data.id
          ? {
              ...r,
              ...data,
              code: data.code.trim().toUpperCase(),
              updatedDate: new Date().toISOString().split('T')[0],
            }
          : r,
      ),
    )
    setIsFormModalOpen(false)
    appToast.success(`Record "${data.name}" updated successfully.`, {
      action: 'save',
    })
  }, [])

  const deleteRecord = useCallback((record) => {
    if (!record?.id) return false
    setRecords((prev) => prev.filter((r) => r.id !== record.id))
    appToast.success(`Record "${record.name}" (${record.code}) was deleted from setup.`, {
      action: 'delete',
    })
    return true
  }, [])

  const toggleRecordStatus = useCallback((record) => {
    if (!record?.id) return false
    const newStatus = record.status === 'Active' ? 'Inactive' : 'Active'
    setRecords((prev) =>
      prev.map((r) =>
        r.id === record.id
          ? {
              ...r,
              status: newStatus,
              updatedDate: new Date().toISOString().split('T')[0],
            }
          : r,
      ),
    )
    appToast.success(`Record "${record.name}" has been marked as ${newStatus}.`, {
      action: 'update',
    })
    return true
  }, [])

  return {
    records,
    metrics,
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
    toggleRecordStatus,
  }
}
