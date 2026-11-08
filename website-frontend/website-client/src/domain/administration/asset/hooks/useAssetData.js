import { useState, useMemo, useCallback } from 'react'
import { MOCK_ASSET_RECORDS } from '../constants/assetConstants'
import { computeAssetMetrics } from '../utils/assetUtils'
import { appToast } from '@/shared/components/toast/appToast'

/**
 * Custom hook providing independent local React state for Asset Management domain.
 */
export function useAssetData() {
  const [records, setRecords] = useState(MOCK_ASSET_RECORDS)

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [formModalMode, setFormModalMode] = useState('create')
  const [selectedAsset, setSelectedAsset] = useState(null)

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const metrics = useMemo(() => computeAssetMetrics(records), [records])

  const openCreateModal = useCallback(() => {
    setFormModalMode('create')
    setSelectedAsset(null)
    setIsFormModalOpen(true)
  }, [])

  const openEditModal = useCallback((asset) => {
    setFormModalMode('edit')
    setSelectedAsset(asset)
    setIsFormModalOpen(true)
  }, [])

  const openDetailModal = useCallback((asset) => {
    setSelectedAsset(asset)
    setIsDetailModalOpen(true)
  }, [])

  const handleCreate = useCallback((assetData) => {
    const nextId = `ast-${String(Date.now()).slice(-4)}`
    const nextCode = `AST-2024-${String(Math.floor(Math.random() * 900) + 100)}`

    const newRecord = {
      ...assetData,
      id: nextId,
      code: assetData.code || nextCode,
      purchaseValue: Number(assetData.purchaseValue) || 0,
      updatedDate: new Date().toISOString().split('T')[0],
    }

    setRecords((prev) => [newRecord, ...prev])
    setIsFormModalOpen(false)
    appToast.success(`Asset "${newRecord.name}" (${newRecord.code}) created successfully.`, {
      action: 'save',
    })
  }, [])

  const handleUpdate = useCallback((assetData) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === assetData.id
          ? {
              ...r,
              ...assetData,
              purchaseValue: Number(assetData.purchaseValue) || 0,
              updatedDate: new Date().toISOString().split('T')[0],
            }
          : r,
      ),
    )
    setIsFormModalOpen(false)
    appToast.success(`Asset "${assetData.name}" updated successfully.`, {
      action: 'save',
    })
  }, [])

  const deleteRecord = useCallback((asset) => {
    if (!asset?.id) return false
    setRecords((prev) => prev.filter((r) => r.id !== asset.id))
    appToast.success(`Asset "${asset.name}" (${asset.code}) was deleted from register.`, {
      action: 'delete',
    })
    return true
  }, [])

  return {
    records,
    metrics,
    isFormModalOpen,
    setIsFormModalOpen,
    formModalMode,
    selectedAsset,
    isDetailModalOpen,
    setIsDetailModalOpen,
    openCreateModal,
    openEditModal,
    openDetailModal,
    handleCreate,
    handleUpdate,
    deleteRecord,
  }
}
