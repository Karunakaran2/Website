import { useMemo, useState } from 'react'
import { PortalModalShell } from '@/shared/components'
import SetupDataTable from '../components/SetupDataTable'
import SetupListPageHeaderActions from '../components/SetupListPageHeaderActions'
import SetupActionCell from '../components/SetupActionCell'
import SetupDetailsLinkButton from '../components/SetupDetailsLinkButton'
import SetupListScreen from '../components/SetupListScreen'
import OfficeSetupForm from '../components/OfficeSetupForm'
import SetupEditFormSkeleton from '../components/SetupEditFormSkeleton'
import SetupGstAddressDetailsView from '../components/SetupGstAddressDetailsView'
import SetupGstDetailsSkeleton from '../components/SetupGstDetailsSkeleton'
import SetupLoadErrorAlert from '../components/SetupLoadErrorAlert'
import { useSetupMaster } from '../hooks/useSetupMaster'
import { setupFormModalTitle } from '../utils/setupFormModalTitle'
import { isSetupDetailsLoading, isSetupEditFormLoading } from '../utils/setupEditFormLoading'
import { resolveSetupPublicId } from '../utils/setupRowId'
import { gstinFieldErrorKey, isExistingOfficeGstin, normalizeGstin } from '../utils/officeGstin'
import {
  useGetCompanySetupQuery,
  useGetOfficeSetupByIdQuery,
  useLazyGetGstDetailsQuery,
} from '../services/setupApi'

export default function OfficeSetupScreen({ master }) {
  const setup = useSetupMaster(master)
  const { data: company } = useGetCompanySetupQuery()
  const {
    data: editingOffice,
    isFetching: isEditingLoading,
    error: editingError,
  } = useGetOfficeSetupByIdQuery(setup.editingId, {
    skip: !setup.editingId,
  })
  const [checkGstDetails] = useLazyGetGstDetailsQuery()
  const [gstDetailsOfficeId, setGstDetailsOfficeId] = useState(null)
  const {
    data: gstDetailsOffice,
    isFetching: gstDetailsLoading,
    error: gstDetailsError,
  } = useGetOfficeSetupByIdQuery(gstDetailsOfficeId, {
    skip: !gstDetailsOfficeId,
  })

  const closeGstDetailsModal = () => setGstDetailsOfficeId(null)

  const companyOptions = company
    ? [{ value: company.id, label: company.companyName }]
    : []

  const formValues = setup.editingId
    ? editingOffice
    : (company ? { companyId: company.id } : null)

  const columns = useMemo(
    () => [
      ...master.columns.map((column) => {
        if (column.id !== 'gstNumber') {
          return column
        }
        return {
          ...column,
          cell: (row) => {
            const gstin = row.gstNumber
            if (gstin == null || String(gstin).trim() === '') {
              return '—'
            }
            const label = String(gstin).trim()
            return (
              <SetupDetailsLinkButton
                onClick={() => setGstDetailsOfficeId(resolveSetupPublicId(row, master))}
                title="View GST details"
                aria-label={`View GST details for ${label}`}
              >
                {label}
              </SetupDetailsLinkButton>
            )
          },
        }
      }),
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

  const handleGstNumberBlur = async (gstNumber, index) => {
    const value = normalizeGstin(gstNumber)
    if (!value) {
      return
    }
    const errorKey = gstinFieldErrorKey(index)
    // Existing GSTIN on the record being edited is expected to already exist.
    if (setup.editingId && isExistingOfficeGstin(value, editingOffice, index)) {
      if (setup.fieldErrors[errorKey]) {
        const nextFieldErrors = { ...setup.fieldErrors }
        delete nextFieldErrors[errorKey]
        setup.setFormErrors({
          message: setup.formError,
          fieldErrors: nextFieldErrors,
        })
      }
      return
    }
    const result = await checkGstDetails(value)
    if (result.data === true) {
      setup.setFormErrors({
        fieldErrors: {
          [errorKey]: 'GSTIN Number Already Exists.',
        },
      })
    }
  }

  const handleSave = async (values) => {
    const companyIdValue = values.companyId && typeof values.companyId === 'object'
      ? values.companyId.value
      : values.companyId
    const body = {
      ...Object.fromEntries(
        Object.entries(values)
          .filter(([key]) => key !== 'gstAddressEntries')
          .map(([key, value]) => [key, value === '' ? null : value]),
      ),
      companyId: companyIdValue ? Number(companyIdValue) : null,
      tanNumber: values.tanNumber ? String(values.tanNumber).trim().toUpperCase() : null,
      panNumber: values.panNumber ? String(values.panNumber).trim().toUpperCase() : null,
      epfNumber: values.epfNumber ? String(values.epfNumber).trim() : null,
      esiNumber: values.esiNumber ? String(values.esiNumber).trim() : null,
      emailId: values.emailId ? String(values.emailId).trim() : null,
      gstAddressEntries: (values.gstAddressEntries || []).map((entry) => ({
        ...Object.fromEntries(Object.entries(entry).map(([key, value]) => [key, value === '' ? null : value])),
        gstNumber: entry.gstNumber ? String(entry.gstNumber).trim().toUpperCase() : null,
        mailId: entry.mailId ? String(entry.mailId).trim() : null,
      })),
    }
    delete body.isDeleted
    delete body.deleted
    delete body.isActive
    delete body.active
    return setup.handleSave(body)
  }

  return (
    <>
      <SetupListPageHeaderActions onAdd={setup.openCreate} />
      <SetupListScreen
      formOpen={setup.formOpen}
      onCloseForm={setup.closeForm}
      modalTitle={setupFormModalTitle(master, setup.editingId)}
      modalSize="5xl"
      form={
        isSetupEditFormLoading({
          editingId: setup.editingId,
          isFetching: isEditingLoading,
          data: editingOffice,
          error: editingError,
        }) ? (
          <SetupEditFormSkeleton
            sections={[
              { fields: 8, cols: 3 },
              { fields: 10, cols: 3 },
            ]}
          />
        ) : (
          <OfficeSetupForm
            master={master}
            initialValues={formValues}
            companyOptions={companyOptions}
            fieldErrors={setup.fieldErrors}
            formError={setup.formError}
            onSubmit={handleSave}
            onCancel={setup.closeForm}
            onGstNumberBlur={handleGstNumberBlur}
            isEditing={Boolean(setup.editingId)}
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

      <PortalModalShell
        isOpen={Boolean(gstDetailsOfficeId)}
        onClose={closeGstDetailsModal}
        title={
          gstDetailsOffice?.officeName
            ? `GST Details — ${gstDetailsOffice.officeName}`
            : 'GST Details'
        }
        size="2xl"
        stack={setup.formOpen ? 'nested' : 'base'}
        footer={null}
      >
        {isSetupDetailsLoading({
          openId: gstDetailsOfficeId,
          isFetching: gstDetailsLoading,
          data: gstDetailsOffice,
          error: gstDetailsError,
        }) ? (
          <SetupGstDetailsSkeleton />
        ) : null}
        {!gstDetailsLoading && gstDetailsError ? (
          <p
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800"
            role="alert"
          >
            Unable to load GST details.
          </p>
        ) : null}
        {!gstDetailsLoading && !gstDetailsError && (gstDetailsOffice?.gstAddressEntries || []).length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-10 text-center text-sm text-slate-500">
            No GST details available.
          </div>
        ) : null}
        {!isSetupDetailsLoading({
          openId: gstDetailsOfficeId,
          isFetching: gstDetailsLoading,
          data: gstDetailsOffice,
          error: gstDetailsError,
        }) && !gstDetailsError ? (
          <SetupGstAddressDetailsView entries={gstDetailsOffice?.gstAddressEntries} />
        ) : null}
      </PortalModalShell>
    </>
  )
}
