import { useCallback, useEffect, useMemo, useState } from 'react'
import { useProbityForm } from '@/shared/utils/useProbityForm'
import { validateTriggerForm } from '@/shared/components/confirm'
import { useSetupFormSaveRequest } from '../hooks/useSetupFormSaveRequest'
import { FeaturedBasicSelect } from '@/shared/lib/tailwreck'
import { resolveSelectValue } from '@/shared/utils'
import {
  FieldGrid,
  FieldError,
  InputField,
  FormLabel,
  IndianAmountInput,
  TextAreaField,
  formFieldCellClass,
  formGridCellClass,
  inputFieldClass,
} from '@/shared/components/forms'
import {
  orgProbityControlSlotClass,
  orgProbitySelectTriggerClass,
} from '@/shared/components/forms/tailwreckFormShell'
import SetupFormFooter from './SetupFormFooter'
import SetupFormShell from './SetupFormShell'
import { SetupLinkButton } from './setupGigwButtons'
import {
  ITEM_SERVICE_CATEGORY_OPTIONS,
  ITEM_SERVICE_EXPENSE_BASE_ACCOUNT_TYPE_ID,
  ITEM_SERVICE_GST_RATE_OPTIONS,
  ITEM_SERVICE_INCOME_BASE_ACCOUNT_TYPE_ID,
  ITEM_SERVICE_NATURE_OPTIONS,
  ITEM_SERVICE_RCM_OPTIONS,
  ITEM_SERVICE_TYPE_OPTIONS,
  ITEM_SERVICE_YES_NO_OPTIONS,
  filterHoaLedgersByBaseAccountType,
  getItemServiceLedgerGroupOptions,
  isDuplicateItemServiceCode,
  resolveTcsRate,
  formatItemServiceFormPrice,
  toCodeSelectOptions,
  toSelectOptions,
  unwrapSetupList,
} from '../constants/itemServiceOptions'
import {
  useGetAccountSetupListQuery,
  useGetHoaSetupListQuery,
  useGetHsnCodeListQuery,
  useGetSacCodeListQuery,
  useGetServiceTypeSetupListQuery,
  useGetTcsTypeListQuery,
  useGetMasterTdsTypeListQuery,
  useGetUnitOfMeasureListQuery,
  useSavePurchaseLedgerMutation,
  useSaveSalesLedgerMutation,
} from '../services/setupApi'
import AddItemServiceLedgerModal from './AddItemServiceLedgerModal'
import { validatePositiveDecimalAmount } from '@/shared/utils/probityFormat'

function toSelectValue(valueOrEvent) {
  const resolved = resolveSelectValue(valueOrEvent)
  if (resolved && typeof resolved === 'object' && 'value' in resolved) {
    return resolved.value ?? ''
  }
  return resolved ?? ''
}

function toId(value) {
  if (value == null || value === '') {
    return null
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

function extractLedgerErrorMessage(error) {
  const payload = error?.payload || error?.data
  if (payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    const messages = Object.values(payload.data).filter(Boolean)
    if (messages.length) {
      return messages.join(' ')
    }
  }
  if (typeof payload?.message === 'string' && payload.message.trim()) {
    return payload.message
  }
  if (typeof payload === 'string' && payload.trim()) {
    return payload
  }
  return 'Unable to save ledger'
}

const emptyValues = {
  category: '',
  serviceType: '',
  description: '',
  natureName: '',
  unitName: '',
  itemType: '',
  salesPrice: '',
  salesAccountLedger: '',
  purchasePrice: '',
  purchaseAccountLedger: '',
  hsnOrSacCode: '',
  gstRate: '',
  rcmApplicable: 'N',
  itcEligibility: 'Yes',
  tdsType: '',
  tdsRate: '',
  tcsType: '',
  tcsRate: '0',
}

function GridSelect({
  label,
  required = false,
  name,
  options,
  value,
  onChange,
  error,
  hiddenInput = null,
  footer = null,
}) {
  return (
    <div className={formGridCellClass}>
      {hiddenInput}
      <div className={formFieldCellClass}>
        <FormLabel label={label} required={required} />
        <div className={orgProbityControlSlotClass}>
          <FeaturedBasicSelect
            name={name}
            options={options}
            value={value ?? ''}
            onChange={onChange}
            size="md"
            theme="primary"
            border="sm"
            className={orgProbitySelectTriggerClass}
          />
        </div>
        <FieldError message={error} />
      </div>
      {footer ? <div className="mt-1 min-h-7 shrink-0">{footer}</div> : null}
    </div>
  )
}

export default function ItemServiceForm({
  initialValues,
  fieldErrors = {},
  formError,
  onSubmit,
  onCancel,
  isEditing = false,
}) {
  const requestSave = useSetupFormSaveRequest(isEditing)
  const { register, reset, watch, setValue, control, getValues, trigger, formState } =
    useProbityForm({ defaultValues: emptyValues })
  const [localFieldErrors, setLocalFieldErrors] = useState({})
  const [ledgerModalKind, setLedgerModalKind] = useState(null)
  const [ledgerError, setLedgerError] = useState('')

  const { data: unitsOfMeasure = [] } = useGetUnitOfMeasureListQuery()
  const { data: tdsTypes = [] } = useGetMasterTdsTypeListQuery()
  const { data: tcsTypes = [] } = useGetTcsTypeListQuery()
  const { data: hsnCodes = [] } = useGetHsnCodeListQuery()
  const { data: sacCodes = [] } = useGetSacCodeListQuery()
  const { data: hoaLedgersResponse, refetch: refetchHoaLedgers } = useGetHoaSetupListQuery()
  const { data: accountSetupResponse } = useGetAccountSetupListQuery()
  const { data: serviceTypeSetupList = [] } = useGetServiceTypeSetupListQuery()
  const [saveSalesLedger, { isLoading: isSavingSalesLedger }] = useSaveSalesLedgerMutation()
  const [savePurchaseLedger, { isLoading: isSavingPurchaseLedger }] = useSavePurchaseLedgerMutation()

  const hoaLedgers = useMemo(() => unwrapSetupList(hoaLedgersResponse), [hoaLedgersResponse])
  const accountSetups = useMemo(() => unwrapSetupList(accountSetupResponse), [accountSetupResponse])

  const unitOptions = useMemo(
    () => toSelectOptions(unitsOfMeasure, 'id', 'name'),
    [unitsOfMeasure],
  )
  const tdsOptions = useMemo(
    () => toSelectOptions(tdsTypes, 'id', 'tdsName'),
    [tdsTypes],
  )
  const tcsOptions = useMemo(
    () => toSelectOptions(tcsTypes, 'id', 'tcsName'),
    [tcsTypes],
  )
  const hsnOptions = useMemo(
    () => toCodeSelectOptions(hsnCodes, 'id', 'hsnCode', 'hsnDescription'),
    [hsnCodes],
  )
  const sacOptions = useMemo(
    () => toCodeSelectOptions(sacCodes, 'id', 'sacCode', 'sacDescription'),
    [sacCodes],
  )
  const salesLedgerOptions = useMemo(
    () => toSelectOptions(
      filterHoaLedgersByBaseAccountType(
        hoaLedgers,
        accountSetups,
        ITEM_SERVICE_INCOME_BASE_ACCOUNT_TYPE_ID,
      ),
      'id',
      'hoaName',
    ),
    [hoaLedgers, accountSetups],
  )
  const purchaseLedgerOptions = useMemo(
    () => toSelectOptions(
      filterHoaLedgersByBaseAccountType(
        hoaLedgers,
        accountSetups,
        ITEM_SERVICE_EXPENSE_BASE_ACCOUNT_TYPE_ID,
      ),
      'id',
      'hoaName',
    ),
    [hoaLedgers, accountSetups],
  )
  const salesGroupOptions = useMemo(
    () => getItemServiceLedgerGroupOptions(accountSetups, ITEM_SERVICE_INCOME_BASE_ACCOUNT_TYPE_ID),
    [accountSetups],
  )
  const purchaseGroupOptions = useMemo(
    () => getItemServiceLedgerGroupOptions(accountSetups, ITEM_SERVICE_EXPENSE_BASE_ACCOUNT_TYPE_ID),
    [accountSetups],
  )

  const recordKey = `item-service:${initialValues?.id ?? 'new'}`
  const mergedFieldErrors = { ...fieldErrors, ...localFieldErrors }
  const itemType = watch('itemType')
  const category = watch('category')
  const tcsType = watch('tcsType')
  const showSales = itemType === 'S' || itemType === 'B'
  const showPurchase = itemType === 'P' || itemType === 'B'
  const hsnSacLabel = category === 'S' ? 'SAC Code' : 'HSN Code'
  const hsnSacOptions = category === 'S' ? sacOptions : hsnOptions

  const applyInitialValues = () => {
    reset({
      ...emptyValues,
      category: initialValues?.category ?? '',
      serviceType: initialValues?.serviceType ?? '',
      description: initialValues?.description ?? '',
      natureName: initialValues?.natureName ?? '',
      unitName: initialValues?.unitName != null ? String(initialValues.unitName) : '',
      itemType: initialValues?.itemType ?? '',
      salesPrice: formatItemServiceFormPrice(
        initialValues?.salesPrice,
        initialValues?.itemType,
        'sales',
      ),
      salesAccountLedger: initialValues?.salesAccountLedger != null ? String(initialValues.salesAccountLedger) : '',
      purchasePrice: formatItemServiceFormPrice(
        initialValues?.purchasePrice,
        initialValues?.itemType,
        'purchase',
      ),
      purchaseAccountLedger:
        initialValues?.purchaseAccountLedger != null ? String(initialValues.purchaseAccountLedger) : '',
      hsnOrSacCode: initialValues?.hsnOrSacCode != null ? String(initialValues.hsnOrSacCode) : '',
      gstRate: initialValues?.gstRate ?? '',
      rcmApplicable: initialValues?.rcmApplicable ?? 'N',
      itcEligibility: initialValues?.itcEligibility ?? 'Yes',
      tdsType: initialValues?.tdsType != null ? String(initialValues.tdsType) : '',
      tdsRate: initialValues?.tdsRate ?? '',
      tcsType: initialValues?.tcsType != null ? String(initialValues.tcsType) : '',
      tcsRate: initialValues?.tcsRate != null ? String(initialValues.tcsRate) : '0',
    })
  }

  useEffect(() => {
    setLocalFieldErrors({})
    applyInitialValues()
  }, [recordKey, reset, initialValues])

  useEffect(() => {
    setValue('tcsRate', resolveTcsRate(tcsType, tcsTypes), { shouldValidate: false })
  }, [tcsType, tcsTypes, setValue])

  const setSelect = (name, value) => {
    setValue(name, toSelectValue(value), { shouldValidate: true })
    setLocalFieldErrors((prev) => {
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  const handleSaveLedger = async ({ hoaName, accountTypeId }) => {
    setLedgerError('')
    const isSales = ledgerModalKind === 'sales'
    const saveFn = isSales ? saveSalesLedger : savePurchaseLedger
    const result = await saveFn({ hoaName, accountTypeId })
    if (result.error) {
      setLedgerError(extractLedgerErrorMessage(result.error))
      return false
    }
    const saved = result.data
    const refreshed = await refetchHoaLedgers()
    const list = unwrapSetupList(refreshed.data || hoaLedgers)
    const match = list.find((item) => item.id === saved?.id)
      || list.find((item) => item.hoaName === hoaName)
    if (match?.id) {
      setSelect(isSales ? 'salesAccountLedger' : 'purchaseAccountLedger', String(match.id))
    }
    return true
  }

  const mapValuesToPayload = useCallback(
    (values) => ({
      category: values.category || null,
      serviceType: values.serviceType?.trim() || null,
      description: values.description?.trim() || null,
      natureName: values.natureName || null,
      unitName: toId(values.unitName),
      itemType: values.itemType || null,
      salesPrice: showSales
        ? (values.salesPrice?.trim()
          ? String(values.salesPrice).trim().replace(/,/g, '')
          : null)
        : null,
      salesAccountLedger: showSales ? toId(values.salesAccountLedger) : null,
      purchasePrice: showPurchase
        ? (values.purchasePrice?.trim()
          ? String(values.purchasePrice).trim().replace(/,/g, '')
          : null)
        : null,
      purchaseAccountLedger: showPurchase ? toId(values.purchaseAccountLedger) : null,
      hsnOrSacCode: toId(values.hsnOrSacCode),
      gstRate: values.gstRate || null,
      rcmApplicable: values.rcmApplicable || 'N',
      itcEligibility: values.itcEligibility || 'Yes',
      tdsType: toId(values.tdsType),
      tdsRate: values.tdsRate?.trim() || null,
      tcsType: toId(values.tcsType),
      tcsRate: values.tcsRate === '' || values.tcsRate == null ? 0 : Number(values.tcsRate),
    }),
    [showPurchase, showSales, hsnSacLabel],
  )

  const validateClient = useCallback(
    async (values) => {
      const rhfValid = await validateTriggerForm(trigger)
      if (!rhfValid) {
        return false
      }
      const nextErrors = {}
      if (!values.category) {
        nextErrors.category = 'Please select category.'
      }
      if (!values.serviceType?.trim()) {
        nextErrors.serviceType = 'Please enter item/service code.'
      } else if (isDuplicateItemServiceCode(values.serviceType, serviceTypeSetupList, initialValues)) {
        nextErrors.serviceType = 'Item/service code already exists.'
      }
      if (!values.description?.trim()) {
        nextErrors.description = 'Please enter description.'
      }
      if (!values.natureName) {
        nextErrors.natureName = 'Please select nature.'
      }
      if (!toId(values.unitName)) {
        nextErrors.unitName = 'Please select unit of measure.'
      }
      if (!values.itemType) {
        nextErrors.itemType = 'Please select type.'
      }
      if (!toId(values.hsnOrSacCode)) {
        nextErrors.hsnOrSacCode = `Please select ${hsnSacLabel}.`
      }
      if (!toId(values.tcsType)) {
        nextErrors.tcsType = 'Please select TCS type.'
      }
      const type = values.itemType
      if (type === 'S' || type === 'B') {
        const salesPriceError = validatePositiveDecimalAmount(values.salesPrice, {
          required: type === 'S',
          fieldLabel: 'Sales price',
        })
        if (salesPriceError) {
          nextErrors.salesPrice = salesPriceError
        }
        if (type === 'S' && !toId(values.salesAccountLedger)) {
          nextErrors.salesAccountLedger = 'Please select sales ledger.'
        }
      }
      if (type === 'P' || type === 'B') {
        const purchasePriceError = validatePositiveDecimalAmount(values.purchasePrice, {
          required: type === 'P',
          fieldLabel: 'Purchase price',
        })
        if (purchasePriceError) {
          nextErrors.purchasePrice = purchasePriceError
        }
        if (type === 'P' && !toId(values.purchaseAccountLedger)) {
          nextErrors.purchaseAccountLedger = 'Please select purchase ledger.'
        }
      }
      if (Object.keys(nextErrors).length) {
        setLocalFieldErrors(nextErrors)
        return false
      }
      setLocalFieldErrors({})
      return true
    },
    [hsnSacLabel, initialValues, serviceTypeSetupList, trigger],
  )

  const handleFormSubmit = useCallback(
    (event) => {
      event.preventDefault()
      const values = getValues()
      requestSave(
        () => onSubmit(mapValuesToPayload(values)),
        () => validateClient(values),
      )
    },
    [getValues, mapValuesToPayload, onSubmit, requestSave, validateClient],
  )

  return (
    <>
      <form onSubmit={handleFormSubmit} className="flex min-w-0 flex-col gap-4" noValidate>
        <SetupFormShell formError={formError}>
        <FieldGrid cols={3}>
          <GridSelect
            label="Select Category"
            required
            name="category"
            options={ITEM_SERVICE_CATEGORY_OPTIONS}
            value={watch('category')}
            onChange={(value) => {
              setSelect('category', value)
              setSelect('hsnOrSacCode', '')
            }}
            error={mergedFieldErrors.category}
            hiddenInput={<input type="hidden" {...register('category')} />}
          />

          <div className={formGridCellClass}>
            <div className={formFieldCellClass}>
              <InputField
                label="Item/Service Code"
                required
                type="text"
                className={inputFieldClass}
                wrapperClassName="min-w-0"
                error={mergedFieldErrors.serviceType}
                {...register('serviceType')}
              />
            </div>
          </div>

          <div className={formGridCellClass}>
            <div className={formFieldCellClass}>
              <TextAreaField
                label="Description"
                required
                rows={4}
                className={inputFieldClass}
                wrapperClassName="min-w-0"
                error={mergedFieldErrors.description}
                {...register('description')}
              />
            </div>
          </div>

          <GridSelect
            label="Nature"
            required
            name="natureName"
            options={ITEM_SERVICE_NATURE_OPTIONS}
            value={watch('natureName')}
            onChange={(value) => setSelect('natureName', value)}
            error={mergedFieldErrors.natureName}
            hiddenInput={<input type="hidden" {...register('natureName')} />}
          />

          <GridSelect
            label="Unit Of Measure"
            required
            name="unitName"
            options={unitOptions}
            value={watch('unitName')}
            onChange={(value) => setSelect('unitName', value)}
            error={mergedFieldErrors.unitName}
            hiddenInput={<input type="hidden" {...register('unitName')} />}
          />

          <GridSelect
            label="Select Type"
            required
            name="itemType"
            options={ITEM_SERVICE_TYPE_OPTIONS}
            value={watch('itemType')}
            onChange={(value) => setSelect('itemType', value)}
            error={mergedFieldErrors.itemType}
            hiddenInput={<input type="hidden" {...register('itemType')} />}
          />

          {showSales ? (
            <>
              <div className={formGridCellClass}>
                <div className={formFieldCellClass}>
                  <FormLabel label="Sale Price" required={itemType === 'S'} htmlFor="salesPrice" />
                  <IndianAmountInput
                    control={control}
                    name="salesPrice"
                    sanitizeInput
                    emptyAsZero={false}
                    className={`${inputFieldClass} !text-right tabular-nums`}
                    rules={{
                      validate: (value) => {
                        const message = validatePositiveDecimalAmount(value, {
                          required: itemType === 'S',
                          fieldLabel: 'Sales price',
                        })
                        return message || true
                      },
                    }}
                  />
                  <FieldError message={mergedFieldErrors.salesPrice} />
                </div>
              </div>
              <GridSelect
                label="Sales Ledger"
                required={itemType === 'S'}
                name="salesAccountLedger"
                options={salesLedgerOptions}
                value={watch('salesAccountLedger')}
                onChange={(value) => setSelect('salesAccountLedger', value)}
                error={mergedFieldErrors.salesAccountLedger}
                hiddenInput={<input type="hidden" {...register('salesAccountLedger')} />}
                footer={
                  <SetupLinkButton
                    type="button"
                    onClick={() => {
                      setLedgerError('')
                      setLedgerModalKind('sales')
                    }}
                  >
                    [Add New Sales Ledger]
                  </SetupLinkButton>
                }
              />
            </>
          ) : null}

          {showPurchase ? (
            <>
              <div className={formGridCellClass}>
                <div className={formFieldCellClass}>
                  <FormLabel label="Purchase Price" required={itemType === 'P'} htmlFor="purchasePrice" />
                  <IndianAmountInput
                    control={control}
                    name="purchasePrice"
                    sanitizeInput
                    emptyAsZero={false}
                    className={`${inputFieldClass} !text-right tabular-nums`}
                    rules={{
                      validate: (value) => {
                        const message = validatePositiveDecimalAmount(value, {
                          required: itemType === 'P',
                          fieldLabel: 'Purchase price',
                        })
                        return message || true
                      },
                    }}
                  />
                  <FieldError message={mergedFieldErrors.purchasePrice} />
                </div>
              </div>
              <GridSelect
                label="Purchase Ledger"
                required={itemType === 'P'}
                name="purchaseAccountLedger"
                options={purchaseLedgerOptions}
                value={watch('purchaseAccountLedger')}
                onChange={(value) => setSelect('purchaseAccountLedger', value)}
                error={mergedFieldErrors.purchaseAccountLedger}
                hiddenInput={<input type="hidden" {...register('purchaseAccountLedger')} />}
                footer={
                  <SetupLinkButton
                    type="button"
                    onClick={() => {
                      setLedgerError('')
                      setLedgerModalKind('purchase')
                    }}
                  >
                    [Add New Purchase Ledger]
                  </SetupLinkButton>
                }
              />
            </>
          ) : null}

          <GridSelect
            label={hsnSacLabel}
            required
            name="hsnOrSacCode"
            options={hsnSacOptions}
            value={watch('hsnOrSacCode')}
            onChange={(value) => setSelect('hsnOrSacCode', value)}
            error={mergedFieldErrors.hsnOrSacCode}
            hiddenInput={<input type="hidden" {...register('hsnOrSacCode')} />}
          />

          <GridSelect
            label="GST Rate"
            name="gstRate"
            options={ITEM_SERVICE_GST_RATE_OPTIONS}
            value={watch('gstRate')}
            onChange={(value) => setSelect('gstRate', value)}
            error={mergedFieldErrors.gstRate}
            hiddenInput={<input type="hidden" {...register('gstRate')} />}
          />

          <GridSelect
            label="RCM Applicable"
            name="rcmApplicable"
            options={ITEM_SERVICE_RCM_OPTIONS}
            value={watch('rcmApplicable')}
            onChange={(value) => setSelect('rcmApplicable', value)}
            hiddenInput={<input type="hidden" {...register('rcmApplicable')} />}
          />

          <GridSelect
            label="ITC eligibility"
            name="itcEligibility"
            options={ITEM_SERVICE_YES_NO_OPTIONS}
            value={watch('itcEligibility')}
            onChange={(value) => setSelect('itcEligibility', value)}
            hiddenInput={<input type="hidden" {...register('itcEligibility')} />}
          />

          <GridSelect
            label="TDS Type"
            name="tdsType"
            options={tdsOptions}
            value={watch('tdsType')}
            onChange={(value) => setSelect('tdsType', value)}
            error={mergedFieldErrors.tdsType}
            hiddenInput={<input type="hidden" {...register('tdsType')} />}
          />

          <div className={formGridCellClass}>
            <div className={formFieldCellClass}>
              <InputField
                label="TDS Rate(%)"
                type="text"
                className={inputFieldClass}
                wrapperClassName="min-w-0"
                error={mergedFieldErrors.tdsRate}
                {...register('tdsRate')}
              />
            </div>
          </div>

          <GridSelect
            label="TCS Type"
            required
            name="tcsType"
            options={tcsOptions}
            value={watch('tcsType')}
            onChange={(value) => setSelect('tcsType', value)}
            error={mergedFieldErrors.tcsType}
            hiddenInput={<input type="hidden" {...register('tcsType')} />}
          />

          <div className={formGridCellClass}>
            <div className={formFieldCellClass}>
              <InputField
                label="TCS Rate(%)"
                type="text"
                disabled
                className={inputFieldClass}
                wrapperClassName="min-w-0"
                error={mergedFieldErrors.tcsRate}
                {...register('tcsRate')}
              />
            </div>
          </div>
        </FieldGrid>
        </SetupFormShell>

        <SetupFormFooter
          onReset={() => {
            setLocalFieldErrors({})
            applyInitialValues()
          }}
          onCancel={onCancel}
          submitLabel={isEditing ? 'Update' : 'Save'}
        />
      </form>

      <AddItemServiceLedgerModal
        open={Boolean(ledgerModalKind)}
        kind={ledgerModalKind || 'sales'}
        groupOptions={ledgerModalKind === 'purchase' ? purchaseGroupOptions : salesGroupOptions}
        onClose={() => {
          setLedgerError('')
          setLedgerModalKind(null)
        }}
        onSave={handleSaveLedger}
        saving={isSavingSalesLedger || isSavingPurchaseLedger}
        errorMessage={ledgerError}
      />
    </>
  )
}
