import { useMemo } from 'react'
import SetupDataTable from '../components/SetupDataTable'
import SetupActionCell from '../components/SetupActionCell'
import SetupListPageHeaderActions from '../components/SetupListPageHeaderActions'
import SetupListScreen from '../components/SetupListScreen'
import SetupEditFormSkeleton from '../components/SetupEditFormSkeleton'
import SetupForm from '../components/SetupForm'
import SetupLoadErrorAlert from '../components/SetupLoadErrorAlert'
import { useSetupMaster } from '../hooks/useSetupMaster'
import { setupFormModalTitle } from '../utils/setupFormModalTitle'
import { isSetupEditFormLoading } from '../utils/setupEditFormLoading'
import {
  useGetAccountSetupByIdQuery,
  useGetAccountSetupGroupUnderListQuery,
} from '../services/setupApi'

function isSelfOrDescendant(option, editingId, options) {
  if (!editingId || !option) {
    return false
  }
  if (option.value === `GROUP-${editingId}`) {
    return true
  }
  const visited = new Set()
  let parentId = option.groupParentId
  while (parentId && !visited.has(parentId)) {
    if (parentId === editingId) {
      return true
    }
    visited.add(parentId)
    const parent = options.find((item) => item.value === `GROUP-${parentId}`)
    parentId = parent?.groupParentId
  }
  return false
}

export default function GroupSetupScreen({ master }) {
  const setup = useSetupMaster(master)
  const {
    data: groupUnderResponse,
    error: groupUnderError,
    isFetching: groupUnderLoading,
  } = useGetAccountSetupGroupUnderListQuery()
  const {
    data: editingGroup,
    isFetching: isEditingLoading,
    error: editingError,
  } = useGetAccountSetupByIdQuery(setup.editingId, {
    skip: !setup.editingId,
  })

  const groupUnderOptions = useMemo(() => {
    if (Array.isArray(groupUnderResponse)) {
      return groupUnderResponse
    }
    if (Array.isArray(groupUnderResponse?.data)) {
      return groupUnderResponse.data
    }
    return []
  }, [groupUnderResponse])

  const selectOptions = useMemo(
    () => [
      { value: '', label: 'Select Group Under' },
      ...groupUnderOptions
        .filter((option) => option?.value && option?.label)
        .filter((option) => !isSelfOrDescendant(option, setup.editingId, groupUnderOptions))
        .map((option) => ({
          value: String(option.value),
          label: option.label,
        })),
    ],
    [groupUnderOptions, setup.editingId],
  )

  const formMaster = useMemo(
    () => ({
      ...master,
      fields: master.fields.map((field) => (
        field.name === 'groupUnderValue'
          ? { ...field, disabled: Boolean(setup.editingId) }
          : field
      )),
    }),
    [master, setup.editingId],
  )

  const formValues = useMemo(() => {
    if (!setup.editingId) {
      return null
    }
    return editingGroup || { id: setup.editingId }
  }, [setup.editingId, editingGroup])

  const columns = useMemo(
    () => [
      ...master.columns,
      {
        id: 'action',
        header: 'Action',
        sortable: false,
        cell: (row) => (
          row.editableStatus === 'N' ? null : (
            <SetupActionCell
              row={row}
              master={master}
              onEdit={setup.openEdit}
              onRemove={setup.handleRemove}
              onToggleActive={setup.handleToggleActive}
              onSubmit={setup.handleSubmit}
            />
          )
        ),
      },
    ],
    [master, setup.openEdit, setup.handleRemove, setup.handleToggleActive, setup.handleSubmit],
  )

  const handleSave = async (values) => {
    const groupUnderValue = values.groupUnderValue && typeof values.groupUnderValue === 'object'
      ? values.groupUnderValue.value
      : values.groupUnderValue
    return setup.handleSave({
      accountName: values.accountName ? String(values.accountName).trim() : null,
      groupUnderValue: groupUnderValue || null,
    })
  }

  return (
    <>
      <SetupListPageHeaderActions onAdd={setup.openCreate} />
      <SetupListScreen
      formOpen={setup.formOpen}
      onCloseForm={setup.closeForm}
      modalTitle={setupFormModalTitle(master, setup.editingId)}
      modalSize="lg"
      form={
        isSetupEditFormLoading({
          editingId: setup.editingId,
          isFetching: isEditingLoading,
          data: editingGroup,
          error: editingError,
        }) ? (
          <SetupEditFormSkeleton sections={[{ fields: 2, cols: 1 }]} />
        ) : (
          <SetupForm
            master={formMaster}
            fieldGridCols={1}
            initialValues={formValues}
            fieldErrors={setup.fieldErrors}
            formError={setup.formError
              || (groupUnderError ? (groupUnderError.data || 'Unable to load Group Under options.') : null)
              || (!groupUnderLoading && selectOptions.length <= 1
                ? 'No Group Under options are available.'
                : null)}
            fieldOptions={{ groupUnderValue: selectOptions }}
            onSubmit={handleSave}
            onCancel={setup.closeForm}
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
