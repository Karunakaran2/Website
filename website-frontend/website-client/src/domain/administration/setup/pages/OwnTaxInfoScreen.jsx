import { useMemo, useState } from 'react'
import SetupDataTable from '../components/SetupDataTable'
import { GigwButton } from '@/shared/components/buttons/gigw'
import SetupDetailsLinkButton from '../components/SetupDetailsLinkButton'
import SetupListPageHeaderActions from '../components/SetupListPageHeaderActions'
import SetupListScreen from '../components/SetupListScreen'
import SetupActionCell from '../components/SetupActionCell'
import OwnTaxInfoForm from '../components/OwnTaxInfoForm'
import SetupDetailsSkeleton from '../components/SetupDetailsSkeleton'
import SetupEditFormSkeleton from '../components/SetupEditFormSkeleton'
import SetupLoadErrorAlert from '../components/SetupLoadErrorAlert'
import { useSetupMaster } from '../hooks/useSetupMaster'
import { setupFormModalTitle } from '../utils/setupFormModalTitle'
import { isSetupDetailsLoading, isSetupEditFormLoading } from '../utils/setupEditFormLoading'
import { resolveSetupPublicId } from '../utils/setupRowId'
import {
  useGetCompanySetupQuery,
  useGetHoaSetupListQuery,
  useGetOwnTaxInfoByIdQuery,
  useGetOwnTaxTdsTypeListQuery,
  useLazyGetGstDetailsQuery,
} from '../services/setupApi'

function unwrapList(response) {
  if (Array.isArray(response)) {
    return response
  }
  if (Array.isArray(response?.data)) {
    return response.data
  }
  return []
}

export default function OwnTaxInfoScreen({ master }) {
  const setup = useSetupMaster(master)
  const { data: company } = useGetCompanySetupQuery()
  const { data: hoaResponse } = useGetHoaSetupListQuery()
  const { data: tdsTypeResponse } = useGetOwnTaxTdsTypeListQuery()
  const hoaOptions = useMemo(() => {
    const hoas = unwrapList(hoaResponse)
    return [
      { value: '', label: 'Select HOA Name' },
      ...hoas
        .filter((hoa) => hoa?.id && hoa?.hoaName)
        .map((hoa) => ({ value: String(hoa.id), label: hoa.hoaName })),
    ]
  }, [hoaResponse])
  const tdsTypeOptions = useMemo(() => {
    const tdsTypes = unwrapList(tdsTypeResponse)
    return [
      { value: '', label: 'Select TDS Type' },
      ...tdsTypes
        .filter((tdsType) => tdsType?.id && tdsType?.tdsName)
        .map((tdsType) => ({ value: String(tdsType.id), label: tdsType.tdsName })),
    ]
  }, [tdsTypeResponse])
  const {
    data: editingOwnTaxInfo,
    isFetching: isEditingOwnTaxLoading,
    error: editingOwnTaxError,
  } = useGetOwnTaxInfoByIdQuery(setup.editingId, {
    skip: !setup.editingId,
  })
  const [checkGstDetails] = useLazyGetGstDetailsQuery()
  const [detailsOwnTaxId, setDetailsOwnTaxId] = useState(null)
  const [detailsKind, setDetailsKind] = useState(null)
  const {
    data: detailsOwnTaxInfo,
    isFetching: isDetailsLoading,
    error: detailsError,
  } = useGetOwnTaxInfoByIdQuery(detailsOwnTaxId, {
    skip: !detailsOwnTaxId,
  })

  const companyDetails = useMemo(
    () => (company
      ? {
          companyId: company.id,
          companyName: company.companyName || '',
          registeredOfficeAddress: company.registeredOfficeAddress || '',
          contactNumber: company.contactNumber || '',
          mailId: company.mailId || '',
          panNumber: company.panNumber || '',
          tanNumber: company.tanNumber || '',
        }
      : null),
    [company],
  )

  const formValues = setup.editingId
    ? editingOwnTaxInfo
    : companyDetails

  const columns = useMemo(
    () => [
      ...master.columns,
      {
        id: 'gstAddressDetails',
        header: 'GST Address Details',
        sortable: false,
        cell: (row) => (
          <SetupDetailsLinkButton
            onClick={() => {
              setDetailsOwnTaxId(resolveSetupPublicId(row, master))
              setDetailsKind('gstAddress')
            }}
          />
        ),
      },
      {
        id: 'gstLedgerDetails',
        header: 'GST Ledger Details',
        sortable: false,
        cell: (row) => (
          <SetupDetailsLinkButton
            onClick={() => {
              setDetailsOwnTaxId(resolveSetupPublicId(row, master))
              setDetailsKind('gstLedger')
            }}
          />
        ),
      },
      {
        id: 'tdsDetails',
        header: 'TDS Info',
        sortable: false,
        cell: (row) => (
          <SetupDetailsLinkButton
            onClick={() => {
              setDetailsOwnTaxId(resolveSetupPublicId(row, master))
              setDetailsKind('tds')
            }}
          />
        ),
      },
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
    const value = (gstNumber || '').trim().toUpperCase()
    if (!value) {
      return
    }
    // Existing GSTIN on the record being edited is expected to already exist.
    if (setup.editingId) {
      const currentGstin = String(editingOwnTaxInfo?.gstin || '').trim().toUpperCase()
      const currentEntryGstin = String(
        editingOwnTaxInfo?.gstAddressEntries?.[index]?.gstNumber || '',
      ).trim().toUpperCase()
      if (value === currentGstin || value === currentEntryGstin) {
        return
      }
    }
    const result = await checkGstDetails(value)
    if (result.data === true) {
      setup.setFormErrors({
        fieldErrors: {
          [index === 0 ? 'gstNumber' : `gstNumber[${index}]`]: 'GSTIN Number Already Exists.',
        },
      })
    }
  }

  const handleSave = async (values) => {
    const companyIdValue = values.companyId && typeof values.companyId === 'object'
      ? values.companyId.value
      : (values.companyId || company?.id)

    const toNullableString = (value) => {
      if (value === undefined || value === null || value === '') {
        return null
      }
      return String(value).trim()
    }

    const toBackendId = (value) => {
      if (value === undefined || value === null || value === '') {
        return null
      }
      // react-hook-form useFieldArray injects a string row id — never send that to the API
      if (typeof value === 'string' && !/^\d+$/.test(value)) {
        return null
      }
      const numericId = Number(value)
      return Number.isFinite(numericId) ? numericId : null
    }

    const resolvedCompanyId = (() => {
      if (companyIdValue === undefined || companyIdValue === null || companyIdValue === '') {
        return null
      }
      if (typeof companyIdValue === 'string' && !/^\d+$/.test(companyIdValue)) {
        return null
      }
      const numericId = Number(companyIdValue)
      return Number.isFinite(numericId) ? numericId : null
    })()

    const body = {
      companyId: resolvedCompanyId,
      gstin: values.gstAddressEntries?.[0]?.gstNumber
        ? String(values.gstAddressEntries[0].gstNumber).trim().toUpperCase()
        : null,
      gstAddress: [
        values.gstAddressEntries?.[0]?.buildingName,
        values.gstAddressEntries?.[0]?.firstLocation,
        values.gstAddressEntries?.[0]?.city,
        values.gstAddressEntries?.[0]?.state,
        values.gstAddressEntries?.[0]?.pincode,
      ].filter(Boolean).join(', ') || null,
      tdsType: tdsTypeOptions.find((option) => option.value === String(values.tdsLedgerEntries?.[0]?.tdsTypeId))?.label
        || null,
      tdsPayableLedger: hoaOptions.find((option) => option.value === String(values.tdsLedgerEntries?.[0]?.tdsPayableLedgerId))?.label
        || null,
      tdsReceivableLedger: hoaOptions.find((option) => option.value === String(values.tdsLedgerEntries?.[0]?.tdsReceivableLedgerId))?.label
        || null,
      gstAddressEntries: (values.gstAddressEntries || []).map((entry) => ({
        id: toBackendId(entry.id),
        gstDetailsId: toBackendId(entry.gstDetailsId),
        gstNumber: entry.gstNumber ? String(entry.gstNumber).trim().toUpperCase() : null,
        buildingName: toNullableString(entry.buildingName),
        firstLocation: toNullableString(entry.firstLocation),
        secondLocation: toNullableString(entry.secondLocation),
        city: toNullableString(entry.city),
        state: toNullableString(entry.state),
        pincode: toNullableString(entry.pincode),
        phoneNo: toNullableString(entry.phoneNo),
        mailId: toNullableString(entry.mailId),
        authorizedPersonName: toNullableString(entry.authorizedPersonName),
        authorizedPersonDesignation: toNullableString(entry.authorizedPersonDesignation),
        defaultStatus: Boolean(entry.defaultStatus),
      })),
      companyLedgerEntries: (values.companyLedgerEntries || []).map((entry, index) => ({
        id: toBackendId(entry.id),
        gstDetailsId: toBackendId(entry.gstDetailsId),
        gstNumber: (entry.gstNumber || values.gstAddressEntries?.[index]?.gstNumber || '')
          .toString()
          .trim()
          .toUpperCase() || null,
        sgstInputLedgerId: toBackendId(entry.sgstInputLedgerId),
        cgstInputLedgerId: toBackendId(entry.cgstInputLedgerId),
        igstInputLedgerId: toBackendId(entry.igstInputLedgerId),
        sgstPayableLedgerId: toBackendId(entry.sgstPayableLedgerId),
        cgstPayableLedgerId: toBackendId(entry.cgstPayableLedgerId),
        igstPayableLedgerId: toBackendId(entry.igstPayableLedgerId),
        sgstInputLedger: hoaOptions.find((option) => option.value === String(entry.sgstInputLedgerId))?.label || null,
        cgstInputLedger: hoaOptions.find((option) => option.value === String(entry.cgstInputLedgerId))?.label || null,
        igstInputLedger: hoaOptions.find((option) => option.value === String(entry.igstInputLedgerId))?.label || null,
        sgstPayableLedger: hoaOptions.find((option) => option.value === String(entry.sgstPayableLedgerId))?.label || null,
        cgstPayableLedger: hoaOptions.find((option) => option.value === String(entry.cgstPayableLedgerId))?.label || null,
        igstPayableLedger: hoaOptions.find((option) => option.value === String(entry.igstPayableLedgerId))?.label || null,
      })),
      tdsLedgerEntries: (values.tdsLedgerEntries || []).map((entry) => ({
        id: toBackendId(entry.id),
        tdsTypeId: toBackendId(entry.tdsTypeId),
        tdsPayableLedgerId: toBackendId(entry.tdsPayableLedgerId),
        tdsReceivableLedgerId: toBackendId(entry.tdsReceivableLedgerId),
        tdsType: tdsTypeOptions.find((option) => option.value === String(entry.tdsTypeId))?.label
          || toNullableString(entry.tdsType),
        tdsPayableLedger: hoaOptions.find((option) => option.value === String(entry.tdsPayableLedgerId))?.label || null,
        tdsReceivableLedger: hoaOptions.find((option) => option.value === String(entry.tdsReceivableLedgerId))?.label || null,
      })),
    }
    return setup.handleSave(body)
  }

  const closeDetails = () => {
    setDetailsOwnTaxId(null)
    setDetailsKind(null)
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
          isFetching: isEditingOwnTaxLoading,
          data: editingOwnTaxInfo,
          error: editingOwnTaxError,
        }) ? (
          <SetupEditFormSkeleton
            sections={[
              { fields: 10, cols: 3 },
              { fields: 8, cols: 3 },
              { fields: 6, cols: 3 },
            ]}
          />
        ) : (
          <OwnTaxInfoForm
            initialValues={formValues}
            fieldErrors={setup.fieldErrors}
            formError={setup.formError}
            onSubmit={handleSave}
            onCancel={setup.closeForm}
            onGstNumberBlur={handleGstNumberBlur}
            isEditing={Boolean(setup.editingId)}
            hoaOptions={hoaOptions}
            tdsTypeOptions={tdsTypeOptions}
          />
        )
      }
      list={
        <>
        <SetupLoadErrorAlert error={setup.loadError} />

        {detailsOwnTaxId && detailsKind ? (
          <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-dashboard-header">
                {detailsKind === 'gstAddress' && 'GST Address Details'}
                {detailsKind === 'gstLedger' && 'GST Ledger Details'}
                {detailsKind === 'tds' && 'TDS Details'}
              </h3>
              <GigwButton type="button" size="sm" variant="secondary" hideIcon onClick={closeDetails}>
                Close
              </GigwButton>
            </div>

            {isSetupDetailsLoading({
              openId: detailsOwnTaxId,
              isFetching: isDetailsLoading,
              data: detailsOwnTaxInfo,
              error: detailsError,
            }) ? (
              <SetupDetailsSkeleton sectionCount={2} fieldsPerSection={6} />
            ) : null}

            {!isDetailsLoading && detailsError ? (
              <p
                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800"
                role="alert"
              >
                Unable to load details.
              </p>
            ) : null}

            {!isSetupDetailsLoading({
              openId: detailsOwnTaxId,
              isFetching: isDetailsLoading,
              data: detailsOwnTaxInfo,
              error: detailsError,
            }) && !detailsError && detailsKind === 'gstAddress' ? (
              (detailsOwnTaxInfo?.gstAddressEntries || []).length === 0 ? (
                <p className="text-sm text-slate-500">No GST address details available.</p>
              ) : (
                <div className="space-y-3">
                  {detailsOwnTaxInfo.gstAddressEntries.map((entry, index) => (
                    <div key={entry.id || index} className="rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-700">
                      <p><span className="font-medium">GSTIN:</span> {entry.gstNumber || '-'}</p>
                      <p><span className="font-medium">Building:</span> {entry.buildingName || '-'}</p>
                      <p><span className="font-medium">Location:</span> {[entry.firstLocation, entry.secondLocation].filter(Boolean).join(', ') || '-'}</p>
                      <p><span className="font-medium">City / State / PIN:</span> {[entry.city, entry.state, entry.pincode].filter(Boolean).join(', ') || '-'}</p>
                      <p><span className="font-medium">Phone / Email:</span> {[entry.phoneNo, entry.mailId].filter(Boolean).join(' / ') || '-'}</p>
                      <p><span className="font-medium">Authorized Person:</span> {[entry.authorizedPersonName, entry.authorizedPersonDesignation].filter(Boolean).join(' — ') || '-'}</p>
                    </div>
                  ))}
                </div>
              )
            ) : null}

            {!isSetupDetailsLoading({
              openId: detailsOwnTaxId,
              isFetching: isDetailsLoading,
              data: detailsOwnTaxInfo,
              error: detailsError,
            }) && !detailsError && detailsKind === 'gstLedger' ? (
              (detailsOwnTaxInfo?.companyLedgerEntries || []).length === 0 ? (
                <p className="text-sm text-slate-500">No GST ledger details available.</p>
              ) : (
                <div className="space-y-3">
                  {detailsOwnTaxInfo.companyLedgerEntries.map((entry, index) => (
                    <div key={entry.id || index} className="rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-700">
                      <p><span className="font-medium">GSTIN:</span> {entry.gstNumber || '-'}</p>
                      <p><span className="font-medium">SGST / CGST / IGST Input:</span> {[entry.sgstInputLedger, entry.cgstInputLedger, entry.igstInputLedger].filter(Boolean).join(' / ') || '-'}</p>
                      <p><span className="font-medium">SGST / CGST / IGST Payable:</span> {[entry.sgstPayableLedger, entry.cgstPayableLedger, entry.igstPayableLedger].filter(Boolean).join(' / ') || '-'}</p>
                    </div>
                  ))}
                </div>
              )
            ) : null}

            {!isSetupDetailsLoading({
              openId: detailsOwnTaxId,
              isFetching: isDetailsLoading,
              data: detailsOwnTaxInfo,
              error: detailsError,
            }) && !detailsError && detailsKind === 'tds' ? (
              (detailsOwnTaxInfo?.tdsLedgerEntries || []).length === 0 ? (
                <p className="text-sm text-slate-500">No TDS details available.</p>
              ) : (
                <div className="space-y-3">
                  {detailsOwnTaxInfo.tdsLedgerEntries.map((entry, index) => (
                    <div key={entry.id || index} className="rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-700">
                      <p><span className="font-medium">TDS Type:</span> {entry.tdsType || '-'}</p>
                      <p><span className="font-medium">Payable Ledger:</span> {entry.tdsPayableLedger || '-'}</p>
                      <p><span className="font-medium">Receivable Ledger:</span> {entry.tdsReceivableLedger || '-'}</p>
                    </div>
                  ))}
                </div>
              )
            ) : null}
          </div>
        ) : null}

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
