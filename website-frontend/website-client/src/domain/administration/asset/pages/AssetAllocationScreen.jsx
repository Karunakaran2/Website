import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { showAppToast } from '@/shared/components'
import { confirmBeforeAction, useActionConfirm } from '@/shared/components/confirm'
import { MODULE_PAGE_CONTENT_CLASS } from '@/shared/constants/moduleLayoutStyles'
import { createEmptyAssetAllocationForm } from '../constants/assetAllocation'
import AssetAllocationForm from '../components/AssetAllocationForm'
import AssetAllocationHistoryModal from '../components/AssetAllocationHistoryModal'
import {
  useAllocateAssetMutation,
  useListAllocationCustodiansQuery,
  useListAssetsForAllocationQuery,
  useReturnAssetToStoreMutation,
} from '../services/assetApi'
import { validateAssetAllocationForm } from '../utils/assetAllocationValidation'

export default function AssetAllocationScreen() {
  const location = useLocation()
  const navigate = useNavigate()
  const requestConfirm = useActionConfirm()
  const [values, setValues] = useState(createEmptyAssetAllocationForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [historyOpen, setHistoryOpen] = useState(false)

  const { data: assetOptions = [] } = useListAssetsForAllocationQuery()
  const { data: custodianOptions = [] } = useListAllocationCustodiansQuery()
  const [allocateAsset, { isLoading: allocating }] = useAllocateAssetMutation()
  const [returnToStore, { isLoading: returning }] = useReturnAssetToStoreMutation()

  useEffect(() => {
    const idMask = location.state?.assetInformationIdMask
    if (!idMask) {
      return
    }
    setValues({
      ...createEmptyAssetAllocationForm(),
      assetInformationIdMask: String(idMask),
    })
    setFieldErrors({})
    setFormError('')
    navigate(location.pathname, { replace: true, state: null })
  }, [location.pathname, location.state, navigate])

  const selectedAsset = assetOptions.find((opt) => opt.idMask === values.assetInformationIdMask)

  const handleChange = useCallback((field, value) => {
    setValues((previous) => ({ ...previous, [field]: value }))
    setFieldErrors((previous) => {
      if (!previous[field]) {
        return previous
      }
      const next = { ...previous }
      delete next[field]
      return next
    })
    setFormError('')
  }, [])

  const runAllocate = useCallback(async () => {
    try {
      const result = await allocateAsset(values).unwrap()
      showAppToast(
        result.message || `Asset ${selectedAsset?.assetId ?? ''} allocated.`,
        'success',
      )
      setFieldErrors({})
      setFormError('')
    } catch (error) {
      const message =
        error?.data?.message || error?.message || 'Unable to allocate asset.'
      setFormError(message)
      showAppToast(message, 'error')
    }
  }, [allocateAsset, selectedAsset?.assetId, values])

  const runReturnToStore = useCallback(async () => {
    try {
      const result = await returnToStore(values).unwrap()
      showAppToast(
        result.message || `Asset ${selectedAsset?.assetId ?? ''} returned to store.`,
        'success',
      )
      setFieldErrors({})
      setFormError('')
    } catch (error) {
      const message =
        error?.data?.message || error?.message || 'Unable to return asset to store.'
      setFormError(message)
      showAppToast(message, 'error')
    }
  }, [returnToStore, selectedAsset?.assetId, values])

  const handleAllocateRequest = useCallback(() => {
    confirmBeforeAction(requestConfirm, {
      action: 'assetAllocate',
      recordLabel: selectedAsset?.assetId,
      stack: 'base',
      showSuccessToast: false,
      validate: () => {
        const errors = validateAssetAllocationForm(values, { requireCustodian: true })
        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors)
          return false
        }
        return true
      },
      runAction: runAllocate,
    })
  }, [requestConfirm, runAllocate, selectedAsset?.assetId, values])

  const handleReturnRequest = useCallback(() => {
    confirmBeforeAction(requestConfirm, {
      action: 'assetReturnToStore',
      recordLabel: selectedAsset?.assetId,
      stack: 'base',
      showSuccessToast: false,
      validate: () => {
        const errors = validateAssetAllocationForm(values, { requireCustodian: false })
        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors)
          return false
        }
        return true
      },
      runAction: runReturnToStore,
    })
  }, [requestConfirm, runReturnToStore, selectedAsset?.assetId, values])

  return (
    <div className={MODULE_PAGE_CONTENT_CLASS}>
      <AssetAllocationForm
        values={values}
        fieldErrors={fieldErrors}
        formError={formError}
        assetOptions={assetOptions}
        custodianOptions={custodianOptions}
        allocating={allocating}
        returning={returning}
        onChange={handleChange}
        onAllocate={handleAllocateRequest}
        onReturnToStore={handleReturnRequest}
        onOpenHistory={() => setHistoryOpen(true)}
        historyDisabled={!values.assetInformationIdMask}
      />

      <AssetAllocationHistoryModal
        open={historyOpen}
        assetInformationIdMask={values.assetInformationIdMask}
        assetId={selectedAsset?.assetId}
        onClose={() => setHistoryOpen(false)}
      />
    </div>
  )
}
