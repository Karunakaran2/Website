import { useCallback, useMemo, useState } from 'react'
import SetupDataTable from '../components/SetupDataTable'
import PartySetupDetailsModal from '../components/PartySetupDetailsModal'
import PartySetupForm, { buildPartyPayload } from '../components/PartySetupForm'
import SetupEditFormSkeleton from '../components/SetupEditFormSkeleton'
import SetupActionCell from '../components/SetupActionCell'
import SetupListPageHeaderActions from '../components/SetupListPageHeaderActions'
import SetupListScreen from '../components/SetupListScreen'
import SetupLoadErrorAlert from '../components/SetupLoadErrorAlert'
import { useSetupMaster } from '../hooks/useSetupMaster'
import { setupFormModalTitle } from '../utils/setupFormModalTitle'
import { isSetupEditFormLoading } from '../utils/setupEditFormLoading'
import {
  useGetAccountSetupListQuery,
  useGetClientDetailsByIdQuery,
  useGetServiceTypeSetupByStatusQuery,
} from '../services/setupApi'
import {
  createPartyDetailColumns,
  PARTY_ADD_NEW_DETAIL_KINDS,
} from '../utils/partySetupDetailColumns'

function responseList(response) {
  if (Array.isArray(response)) {
    return response
  }
  if (Array.isArray(response?.data)) {
    return response.data
  }
  if (Array.isArray(response?.response)) {
    return response.response
  }
  return []
}

function queryErrorMessage(error, fallback) {
  if (!error) {
    return ''
  }
  if (typeof error.data === 'string' && error.data.trim()) {
    return error.data
  }
  if (typeof error.data?.message === 'string' && error.data.message.trim()) {
    return error.data.message
  }
  return fallback
}

export default function PartySetupScreen({ master }) {
  const setup = useSetupMaster(master)
  const [detailsPartyId, setDetailsPartyId] = useState(null)
  const [detailsKind, setDetailsKind] = useState(null)
  const openDetails = useCallback((partyId, kind) => {
    setDetailsPartyId(partyId)
    setDetailsKind(kind)
  }, [])
  const closeDetails = useCallback(() => {
    setDetailsPartyId(null)
    setDetailsKind(null)
  }, [])
  const {
    data: editingParty,
    error: editingError,
    isFetching: isEditingLoading,
  } = useGetClientDetailsByIdQuery(setup.editingId, {
    skip: !setup.editingId,
  })
  const {
    data: serviceTypeResponse,
    error: serviceTypeError,
    isFetching: isServiceTypeLoading,
  } = useGetServiceTypeSetupByStatusQuery()
  const {
    data: accountGroupResponse,
    error: accountGroupError,
    isFetching: isAccountGroupLoading,
  } = useGetAccountSetupListQuery()

  const serviceTypes = useMemo(
    () => responseList(serviceTypeResponse),
    [serviceTypeResponse],
  )
  const accountGroups = useMemo(
    () => responseList(accountGroupResponse),
    [accountGroupResponse],
  )

  const detailColumns = useMemo(
    () => createPartyDetailColumns({
      master,
      kinds: PARTY_ADD_NEW_DETAIL_KINDS,
      onOpenDetails: openDetails,
    }),
    [master, openDetails],
  )

  const columns = useMemo(
    () => [
      ...master.columns,
      ...detailColumns,
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
    [master, detailColumns, setup.openEdit, setup.handleRemove, setup.handleToggleActive, setup.handleSubmit],
  )

  const handleSave = (values) => setup.handleSave(buildPartyPayload(values, serviceTypes))

  const partyFormError = useMemo(() => {
    if (setup.formError?.trim()) {
      return setup.formError
    }
    const fieldMessages = Object.values(setup.fieldErrors || {}).filter(Boolean)
    if (fieldMessages.length) {
      return fieldMessages.join(' ')
    }
    return ''
  }, [setup.formError, setup.fieldErrors])

  const editingLoadError = queryErrorMessage(editingError, 'Unable to load Party details.')
  const serviceTypeLoadError = queryErrorMessage(
    serviceTypeError,
    'Unable to load Item/Service options.',
  )
  const accountGroupLoadError = queryErrorMessage(
    accountGroupError,
    'Unable to load Extra Ledger groups.',
  )

  return (
    <>
      <SetupListPageHeaderActions onAdd={setup.openCreate} label="Add New" />
      <SetupListScreen
        formOpen={setup.formOpen}
        onCloseForm={setup.closeForm}
        modalTitle={setupFormModalTitle(master, setup.editingId)}
        modalSize="5xl"
        form={
          isSetupEditFormLoading({
            editingId: setup.editingId,
            isFetching: isEditingLoading,
            data: editingParty,
            error: editingError,
          }) ? (
            <SetupEditFormSkeleton sections={[{ fields: 12, cols: 3 }, { fields: 9, cols: 3 }]} />
          ) : (
            <PartySetupForm
              key={setup.editingId || 'party-new'}
              initialValues={setup.editingId ? editingParty : null}
              serviceTypes={serviceTypes}
              accountGroups={accountGroups}
              fieldErrors={setup.fieldErrors}
              formError={partyFormError || editingLoadError || serviceTypeLoadError || accountGroupLoadError}
              onSubmit={handleSave}
              onCancel={setup.closeForm}
              isEditing={Boolean(setup.editingId)}
              optionsLoading={isServiceTypeLoading || isAccountGroupLoading}
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
      <PartySetupDetailsModal
        partyId={detailsPartyId}
        kind={detailsKind}
        onClose={closeDetails}
        stack={setup.formOpen ? 'nested' : 'base'}
      />
    </>
  )
}
