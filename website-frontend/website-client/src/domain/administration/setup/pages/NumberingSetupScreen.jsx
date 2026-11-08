import { useMemo } from 'react'
import SetupDataTable from '../components/SetupDataTable'
import { TABLE_ACTION_COLUMN_CLASS } from '@/shared/components/listing/listingTableStyles'
import SetupActionCell from '../components/SetupActionCell'
import SetupEditFormSkeleton from '../components/SetupEditFormSkeleton'
import SetupForm from '../components/SetupForm'
import SetupListPageHeaderActions from '../components/SetupListPageHeaderActions'
import SetupListScreen from '../components/SetupListScreen'
import SetupLoadErrorAlert from '../components/SetupLoadErrorAlert'
import { useSetupMaster } from '../hooks/useSetupMaster'
import { useSetupRecordById } from '../hooks/useSetupRecordById'
import { isSetupEditFormLoading } from '../utils/setupEditFormLoading'
import { useGetVoucherSetupListQuery } from '../services/setupApi'
import { setupFormModalTitle, setupFormSubmitLabel } from '../utils/setupFormModalTitle'
function toOptionalNumber(value) {
  if (value == null || value === '') {
    return null
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : value
}

function isVoucherRow(item) {
  return Boolean(
    item
    && typeof item === 'object'
    && !Array.isArray(item)
    && (item.id != null || item.voucherId != null || item.idMask != null)
    && (item.name || item.voucherType || item.voucherName),
  )
}

function collectVoucherRows(node, acc = []) {
  if (Array.isArray(node)) {
    node.forEach((item) => collectVoucherRows(item, acc))
    return acc
  }
  if (node && typeof node === 'object') {
    if (isVoucherRow(node)) {
      acc.push(node)
      return acc
    }
    Object.values(node).forEach((value) => collectVoucherRows(value, acc))
  }
  return acc
}

function unwrapList(response) {
  return collectVoucherRows(response)
}

function resolveVoucherId(voucher) {
  const raw = voucher?.id ?? voucher?.voucherId ?? voucher?.idMask
  if (raw == null || raw === '') {
    return null
  }
  return raw
}

function resolveVoucherLabel(voucher) {
  const label = voucher?.name || voucher?.voucherType || voucher?.voucherName
  return typeof label === 'string' ? label.trim() : ''
}

function toSaveVoucherId(raw) {
  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : raw
}

export default function NumberingSetupScreen({ master }) {
  const setup = useSetupMaster(master)
  const {
    data: voucherResponse,
    error: voucherError,
    isFetching: voucherLoading,
  } = useGetVoucherSetupListQuery()

  const vouchers = useMemo(() => unwrapList(voucherResponse), [voucherResponse])

  const selectOptions = useMemo(
    () => [
      { value: '', label: 'Select Voucher Type' },
      ...vouchers
        .map((voucher) => {
          const id = resolveVoucherId(voucher)
          const label = resolveVoucherLabel(voucher)
          if (id == null || !label) {
            return null
          }
          return { value: String(id), label }
        })
        .filter(Boolean),
    ],
    [vouchers],
  )

  const {
    data: editingRecord,
    isFetching: isEditingRecordLoading,
    error: editingRecordError,
  } = useSetupRecordById(master, setup.editingId)

  const formValues = useMemo(() => {
    if (!setup.editingId) {
      return null
    }
    const record = editingRecord || { id: setup.editingId }
    return {
      ...record,
      voucherId: record.voucherId == null ? '' : String(record.voucherId),
      isDefault: record.isDefault === true || record.defaultStatus === 'Y' || record.defaultStatus === true,
    }
  }, [setup.editingId, editingRecord])

  const columns = useMemo(
    () => [
      ...master.columns,
      {
        id: 'action',
        header: 'Action',
        sortable: false,
        headerClassName: (master.actionHeaderClassName ?? TABLE_ACTION_COLUMN_CLASS).trim(),
        cellClassName: (master.actionCellClassName ?? TABLE_ACTION_COLUMN_CLASS).trim(),
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

  const handleSave = async (values) => {
    const rawVoucherId = values.voucherId && typeof values.voucherId === 'object'
      ? values.voucherId.value
      : values.voucherId
    if (rawVoucherId == null || rawVoucherId === '') {
      return
    }
    const voucherId = toSaveVoucherId(rawVoucherId)
    const selectedVoucher = vouchers.find((voucher) => (
      String(resolveVoucherId(voucher)) === String(rawVoucherId)
    ))
    return setup.handleSave({
      ...values,
      voucherId,
      voucherType: resolveVoucherLabel(selectedVoucher),
      suffix: values.suffix ?? values.sufix,
      numberLength: toOptionalNumber(values.numberLength ?? values.length),
      startNumber: toOptionalNumber(values.startNumber),
      endNumber: toOptionalNumber(values.endNumber),
      lastGeneratedNumber: toOptionalNumber(values.lastGeneratedNumber),
      isDefault: values.isDefault === true || values.defaultStatus === true || values.defaultStatus === 'Y',
    })
  }

  const formErrorMessage = setup.formError
    || (voucherError ? (voucherError.data || 'Unable to load Voucher Type options.') : null)
    || (!voucherLoading && selectOptions.length <= 1
      ? 'No voucher types are available. Add a Voucher Setup record first.'
      : null)

  return (
    <>
      <SetupListPageHeaderActions onAdd={setup.openCreate} />
      <SetupListScreen
        formOpen={setup.formOpen}
        onCloseForm={setup.closeForm}
        modalTitle={setupFormModalTitle(master, setup.editingId)}
        modalSize="4xl"
        form={
          isSetupEditFormLoading({
            editingId: setup.editingId,
            isFetching: isEditingRecordLoading,
            data: editingRecord,
            error: editingRecordError,
          }) ? (
            <SetupEditFormSkeleton sections={[{ fields: 10, cols: 3 }]} />
          ) : (
            <SetupForm
              master={master}
              initialValues={formValues}
              fieldErrors={setup.fieldErrors}
              formError={formErrorMessage}
              fieldOptions={{ voucherId: selectOptions }}
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
    </>
  )
}
