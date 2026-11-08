import { useEffect, useMemo, useState } from 'react'
import SetupDataTable from '../components/SetupDataTable'
import AddBankModal from '../components/AddBankModal'
import AddBranchModal from '../components/AddBranchModal'
import SetupActionCell from '../components/SetupActionCell'
import SetupEditFormSkeleton from '../components/SetupEditFormSkeleton'
import SetupForm from '../components/SetupForm'
import SetupListPageHeaderActions from '../components/SetupListPageHeaderActions'
import SetupListScreen from '../components/SetupListScreen'
import SetupLoadErrorAlert from '../components/SetupLoadErrorAlert'
import { useSetupMaster } from '../hooks/useSetupMaster'
import { useSetupRecordById } from '../hooks/useSetupRecordById'
import { isSetupEditFormLoading } from '../utils/setupEditFormLoading'
import { setupFormModalTitle, setupFormSubmitLabel } from '../utils/setupFormModalTitle'
import { resolveSetupPublicId } from '../utils/setupRowId'
import {
  useGetBankSetupListQuery,
  useLazyGetAllBankBranchSetupByRefIdQuery,
  useLazyGetIfscDetailsByIfscNoQuery,
  useSaveSetupMutation,
} from '../services/setupApi'

import { resolveSelectValue } from '@/shared/utils'
import { IFSC_PATTERN, validateGstinMatchesPan } from '@/shared/utils/fieldValidationRules'
import { resolveSetupNumericId } from '../utils/setupRowId'

function toList(response) {
  if (Array.isArray(response)) {
    return response
  }
  if (Array.isArray(response?.data)) {
    return response.data
  }
  return []
}

function resolveBankId(value, banks) {
  if (value == null || value === '') {
    return ''
  }
  const asString = String(value)
  if (banks.some((bank) => String(bank.id) === asString)) {
    return asString
  }
  const bankByName = banks.find((bank) => (
    bank.bankName && bank.bankName.toLowerCase() === asString.toLowerCase()
  ))
  if (bankByName?.id != null) {
    return String(bankByName.id)
  }
  return Number.isNaN(Number(asString)) ? '' : asString
}

function resolveBranchId(value, branches) {
  if (value == null || value === '') {
    return ''
  }
  const asString = String(value)
  if (branches.some((branch) => String(branch.branchId) === asString)) {
    return asString
  }
  const branchByName = branches.find((branch) => (
    branch.branchName && branch.branchName.toLowerCase() === asString.toLowerCase()
  ))
  if (branchByName?.branchId != null) {
    return String(branchByName.branchId)
  }
  return Number.isNaN(Number(asString)) ? '' : asString
}

/** Backend and client validation use bankName/branchName keys; form fields are bankId/branchId. */
function mapBankAccountFieldErrors(fieldErrors) {
  if (!fieldErrors) {
    return {}
  }
  const next = { ...fieldErrors }
  if (next.bankName && !next.bankId) {
    next.bankId = next.bankName
  }
  if (next.branchName && !next.branchId) {
    next.branchId = next.branchName
  }
  return next
}

function buildHoaName(bankName, branchName, accountNumber) {
  const bank = String(bankName || '').trim()
  const branch = String(branchName || '').trim()
  const digits = String(accountNumber || '').replace(/\s/g, '')
  if (!bank || !branch || digits.length < 4) {
    return ''
  }
  return `${bank}-${branch}-${digits.slice(-4)}`
}

function extractErrorMessage(error, fallback) {
  const payload = error?.payload || error?.data
  if (payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    const messages = Object.values(payload.data).filter(Boolean)
    if (messages.length) {
      return messages.join(' ')
    }
  }
  if (typeof payload === 'string' && payload.trim()) {
    return payload
  }
  return fallback
}

export default function BankAccountSetupScreen({ master }) {
  const setup = useSetupMaster(master)
  const { data: bankResponse, refetch: refetchBanks } = useGetBankSetupListQuery()
  const [fetchBranches] = useLazyGetAllBankBranchSetupByRefIdQuery()
  const [fetchIfsc] = useLazyGetIfscDetailsByIfscNoQuery()
  const [saveSetup, { isLoading: isSavingMaster }] = useSaveSetupMutation()

  const [selectedBankId, setSelectedBankId] = useState('')
  const [branches, setBranches] = useState([])
  const [externalValues, setExternalValues] = useState(null)
  const [bankModalOpen, setBankModalOpen] = useState(false)
  const [branchModalOpen, setBranchModalOpen] = useState(false)
  const [bankModalError, setBankModalError] = useState('')
  const [branchModalError, setBranchModalError] = useState('')
  const [pendingIfsc, setPendingIfsc] = useState('')
  const [branchParentBankId, setBranchParentBankId] = useState('')
  const [branchesLoading, setBranchesLoading] = useState(false)

  const banks = useMemo(() => toList(bankResponse), [bankResponse])
  const {
    data: editingRecord,
    isFetching: isEditingRecordLoading,
    error: editingRecordError,
  } = useSetupRecordById(master, setup.editingId)
  const editingRow = editingRecord
    || setup.rows.find((row) => resolveSetupPublicId(row, master) === setup.editingId)
    || null

  useEffect(() => {
    if (!setup.formOpen) {
      setSelectedBankId('')
      setBranches([])
      setExternalValues(null)
      setPendingIfsc('')
      setBranchParentBankId('')
      setBranchesLoading(false)
      return
    }
    const nextBankId = editingRow?.bankId != null ? String(editingRow.bankId) : ''
    setSelectedBankId(nextBankId)
    setExternalValues(null)
  }, [setup.formOpen, setup.editingId, editingRow?.bankId])

  useEffect(() => {
    if (!selectedBankId) {
      setBranches([])
      setBranchesLoading(false)
      return
    }
    let cancelled = false
    setBranchesLoading(true)
    fetchBranches(selectedBankId).then((result) => {
      if (cancelled) {
        return
      }
      setBranches(toList(result.data))
      setBranchesLoading(false)
    }).catch(() => {
      if (!cancelled) {
        setBranchesLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [selectedBankId, fetchBranches])

  useEffect(() => {
    if (!pendingIfsc || !branches.length) {
      return
    }
    const matchedBranch = branches.find((branch) => (
      branch.ifsc && branch.ifsc.toUpperCase() === pendingIfsc.toUpperCase()
    ))
    if (matchedBranch?.branchId != null) {
      setExternalValues((current) => ({
        ...(current || {}),
        branchId: String(matchedBranch.branchId),
        ifscNo: matchedBranch.ifsc || pendingIfsc,
      }))
      setPendingIfsc('')
    }
  }, [branches, pendingIfsc])

  const bankOptions = useMemo(
    () => [
      { value: '', label: 'Select Bank' },
      ...banks.map((bank) => ({
        value: String(bank.id),
        label: bank.bankName,
      })),
    ],
    [banks],
  )

  const branchOptions = useMemo(
    () => [
      { value: '', label: selectedBankId ? 'Select Branch' : 'Select Bank first' },
      ...branches.map((branch) => ({
        value: String(branch.branchId),
        label: branch.branchName,
      })),
    ],
    [branches, selectedBankId],
  )

  const formMaster = useMemo(
    () => ({
      ...master,
      fields: master.fields.map((field) => {
        if (field.name === 'branchId') {
          return { ...field, disabled: !selectedBankId }
        }
        if (field.name === 'hoaName') {
          return { ...field, disabled: true }
        }
        return field
      }),
    }),
    [master, selectedBankId],
  )

  const formValues = useMemo(() => {
    if (!setup.editingId) {
      return null
    }
    if (!editingRow) {
      return null
    }
    return {
      ...editingRow,
      bankId: editingRow.bankId != null ? String(editingRow.bankId) : '',
      branchId: editingRow.branchId != null ? String(editingRow.branchId) : '',
      marginPercentage: editingRow.marginPercentage != null ? String(editingRow.marginPercentage) : '',
      bgAmount: editingRow.bgAmount != null ? String(editingRow.bgAmount) : '',
    }
  }, [setup.editingId, editingRow])

  const isBankEditLoading = isSetupEditFormLoading({
    editingId: setup.editingId,
    isFetching: isEditingRecordLoading,
    data: editingRecord,
    error: editingRecordError,
  }) || (Boolean(setup.editingId) && Boolean(selectedBankId) && branchesLoading)

  const columns = useMemo(
    () => [
      ...master.columns,
      {
        id: 'action',
        header: 'Action',
        sortable: false,
        cell: (row) => (
          <SetupActionCell
            row={row}
            master={master}
            onEdit={setup.openEdit}
            onRemove={setup.handleRemove}
            onToggleActive={setup.handleToggleActive}
            onSubmit={setup.handleSubmit}
          />
        ),
      },
    ],
    [master, setup.openEdit, setup.handleRemove, setup.handleToggleActive, setup.handleSubmit],
  )

  const lookupIfsc = async (ifscNo) => {
    const result = await fetchIfsc(ifscNo)
    if (result.error) {
      return null
    }
    return result.data
  }

  const applyIfscDetails = (ifscDetails) => {
    if (!ifscDetails) {
      return
    }
    const matchedBank = banks.find((bank) => (
      bank.bankName && ifscDetails.bankName
      && bank.bankName.toLowerCase() === ifscDetails.bankName.toLowerCase()
    ))
    const nextValues = {
      ifscNo: ifscDetails.ifscNo || '',
      bankAddress: ifscDetails.bankAddress || '',
      contactDetails: ifscDetails.contactDetails || '',
    }
    if (matchedBank?.id != null) {
      const nextBankId = String(matchedBank.id)
      setSelectedBankId(nextBankId)
      nextValues.bankId = nextBankId
    }
    if (ifscDetails.ifscNo) {
      setPendingIfsc(ifscDetails.ifscNo)
    }
    setExternalValues(nextValues)
  }

  const previewHoaName = (values, nextBankId, nextBranchId) => {
    const bankId = nextBankId || resolveBankId(values?.bankId, banks)
    const branchId = nextBranchId || values?.branchId
    const selectedBank = banks.find((bank) => String(bank.id) === String(bankId))
    const selectedBranch = branches.find((branch) => String(branch.branchId) === String(branchId))
    return buildHoaName(selectedBank?.bankName, selectedBranch?.branchName, values?.accountNumber)
  }

  const handleFieldChange = async (name, value, values) => {
    if (name === 'bankId') {
      const nextBankId = resolveBankId(resolveSelectValue(value), banks)
      setSelectedBankId(nextBankId)
      setBranchParentBankId(nextBankId)
      setup.setFormErrors({ message: '', fieldErrors: {} })
      setExternalValues({
        bankId: nextBankId,
        branchId: '',
        ifscNo: '',
        hoaName: '',
      })
      return
    }
    if (name === 'branchId') {
      const branchId = resolveBranchId(resolveSelectValue(value), branches)
      const selectedBranch = branches.find((branch) => String(branch.branchId) === String(branchId))
      setExternalValues({
        branchId: branchId != null && branchId !== '' ? String(branchId) : '',
        ifscNo: selectedBranch?.ifsc || '',
        hoaName: previewHoaName({ ...values, branchId }, selectedBankId, branchId),
      })
      return
    }
    if (name === 'accountNumber') {
      setExternalValues({
        hoaName: previewHoaName({ ...values, accountNumber: value }, selectedBankId, values?.branchId),
      })
      return
    }
    if (name === 'ifscNo') {
      const ifscNo = String(value || '').trim().toUpperCase()
      if (!IFSC_PATTERN.test(ifscNo)) {
        return
      }
      const ifscDetails = await lookupIfsc(ifscNo)
      applyIfscDetails(ifscDetails)
      return
    }
    if (name === 'panNo' || name === 'gstinNo') {
      const pan = name === 'panNo' ? value : values?.panNo
      const gstin = name === 'gstinNo' ? value : values?.gstinNo
      const gstinPanError = validateGstinMatchesPan(pan, gstin)
      if (gstinPanError !== true) {
        setup.setFormErrors({
          message: '',
          fieldErrors: { gstinNo: gstinPanError },
        })
        return
      }
      if (Object.keys(setup.fieldErrors || {}).length) {
        setup.setFormErrors({ message: '', fieldErrors: {} })
      }
    }
  }

  const handleLinkClick = (field, values) => {
    if (field.name === 'bankId') {
      setBankModalError('')
      setBankModalOpen(true)
      return
    }
    if (field.name === 'branchId') {
      const bankId = resolveBankId(values?.bankId || selectedBankId, banks)
      if (!bankId) {
        setup.setFormErrors({
          fieldErrors: { bankId: 'Please select bank.' },
        })
        return
      }
      setSelectedBankId(bankId)
      setBranchParentBankId(bankId)
      setBranchModalError('')
      setBranchModalOpen(true)
    }
  }

  const handleSaveBank = async (bankName) => {
    setBankModalError('')
    const result = await saveSetup({
      resource: 'bank-setup',
      entityName: 'BankSetup',
      body: { bankName },
    })
    if (result.error) {
      setBankModalError(extractErrorMessage(result.error, 'Unable to save bank'))
      return false
    }
    const refreshed = await refetchBanks()
    const list = toList(refreshed.data)
    const savedBank = result.data
    const match = list.find((item) => String(item.id) === String(savedBank?.id))
      || list.find((item) => item.bankName === bankName)
    if (match?.id != null) {
      const nextBankId = String(match.id)
      setSelectedBankId(nextBankId)
      setExternalValues({
        bankId: nextBankId,
        branchId: '',
        ifscNo: '',
      })
    }
    return true
  }

  const handleSaveBranch = async ({ branchName, ifsc }) => {
    const bankId = resolveBankId(branchParentBankId || selectedBankId, banks)
    if (!bankId) {
      setBranchModalError('Please select bank.')
      return false
    }
    setBranchModalError('')
    const result = await saveSetup({
      resource: 'bank-branch-setup',
      entityName: 'BankBranchSetup',
      body: {
        bankId: Number(bankId),
        branchName,
        ifsc,
      },
    })
    if (result.error) {
      setBranchModalError(extractErrorMessage(result.error, 'Unable to save branch'))
      return false
    }
    const savedBranch = result.data
    const refreshed = await fetchBranches(bankId, false)
    const list = toList(refreshed.data)
    const alreadyPresent = list.some((item) => String(item.branchId) === String(savedBranch?.branchId))
    const nextBranches = alreadyPresent || !savedBranch
      ? list
      : [...list, savedBranch]
    setSelectedBankId(bankId)
    setBranches(nextBranches)
    if (savedBranch?.branchId != null) {
      setExternalValues({
        bankId,
        branchId: String(savedBranch.branchId),
        ifscNo: savedBranch.ifsc || ifsc || '',
      })
    }
    return true
  }

  const handleSave = (values) => {
    const gstinPanError = validateGstinMatchesPan(values.panNo, values.gstinNo)
    if (gstinPanError !== true) {
      setup.setFormErrors({
        message: '',
        fieldErrors: { gstinNo: gstinPanError },
      })
      return Promise.resolve(false)
    }

    const bankIdRaw = resolveBankId(resolveSelectValue(values.bankId), banks) || selectedBankId
    const branchIdRaw = resolveBranchId(resolveSelectValue(values.branchId), branches)
    const bankId = resolveSetupNumericId(bankIdRaw)
    const branchId = resolveSetupNumericId(branchIdRaw)
    const selectedBank = banks.find((bank) => String(bank.id) === String(bankId))
    const selectedBranch = branches.find((branch) => String(branch.branchId) === String(branchId))

    const fieldErrors = {}
    if (!bankId) {
      fieldErrors.bankId = 'Please select bank.'
    }
    if (!branchId) {
      fieldErrors.branchId = 'Please select branch.'
    }
    if (Object.keys(fieldErrors).length > 0) {
      setup.setFormErrors({ message: '', fieldErrors })
      return Promise.resolve(false)
    }

    return setup.handleSave({
      ...values,
      bankId,
      branchId,
      bankName: selectedBank?.bankName || null,
      branchName: selectedBranch?.branchName || null,
      ifscNo: values.ifscNo
        ? String(values.ifscNo).trim().toUpperCase()
        : selectedBranch?.ifsc || null,
    })
  }

  const selectedBankName = banks.find((bank) => (
    String(bank.id) === String(branchParentBankId || selectedBankId)
  ))?.bankName || ''

  const bankAccountFieldErrors = useMemo(
    () => mapBankAccountFieldErrors(setup.fieldErrors),
    [setup.fieldErrors],
  )
  const bankAccountFormError = useMemo(() => {
    if (setup.formError?.trim()) {
      return setup.formError
    }
    const messages = Object.values(bankAccountFieldErrors).filter(Boolean)
    return messages.length ? messages.join(' ') : ''
  }, [setup.formError, bankAccountFieldErrors])

  return (
    <>
      <SetupListPageHeaderActions onAdd={setup.openCreate} />
      <SetupListScreen
        formOpen={setup.formOpen}
        onCloseForm={setup.closeForm}
        modalTitle={setupFormModalTitle(master, setup.editingId)}
        modalSize="5xl"
        form={
          isBankEditLoading ? (
            <SetupEditFormSkeleton sections={[{ fields: 10, cols: 3 }]} />
          ) : (
            <SetupForm
              master={formMaster}
              initialValues={formValues}
              fieldErrors={bankAccountFieldErrors}
              formError={bankAccountFormError}
              fieldOptions={{
                bankId: bankOptions,
                branchId: branchOptions,
              }}
              externalValues={externalValues}
              onFieldChange={handleFieldChange}
              onLinkClick={handleLinkClick}
              onSubmit={handleSave}
              onCancel={setup.closeForm}
              submitLabel={setupFormSubmitLabel(master, setup.editingId)}
            />
          )
        }
        list={
          <>
            <SetupLoadErrorAlert error={setup.loadError} />

            <SetupDataTable
              columns={columns}
              rows={setup.rows}
              rowKey={master.idField}
              search={setup.search}
              onSearchChange={setup.setSearch}
              page={setup.page}
              pageSize={setup.pageSize}
              total={setup.total}
              onPageChange={setup.setPage}
              onPageSizeChange={setup.setPageSize}
              sort={setup.sort}
              onSortChange={setup.setSort}
              loading={setup.isFetching}
              emptyMessage="No data available in table"
            />
          </>
        }
      />

      <AddBankModal
        open={bankModalOpen}
        onClose={() => setBankModalOpen(false)}
        onSave={handleSaveBank}
        saving={isSavingMaster}
        errorMessage={bankModalError}
      />
      <AddBranchModal
        open={branchModalOpen}
        bankName={selectedBankName}
        onClose={() => setBranchModalOpen(false)}
        onSave={handleSaveBranch}
        onLookupIfsc={lookupIfsc}
        saving={isSavingMaster}
        errorMessage={branchModalError}
      />
    </>
  )
}
