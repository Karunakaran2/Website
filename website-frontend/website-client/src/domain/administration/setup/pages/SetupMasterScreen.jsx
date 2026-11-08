import { useMemo } from 'react'
import SetupDataTable from '../components/SetupDataTable'
import { TABLE_ACTION_COLUMN_CLASS } from '@/shared/components/listing/listingTableStyles'
import SetupActionCell from '../components/SetupActionCell'
import SetupEditFormSkeleton from '../components/SetupEditFormSkeleton'
import SetupListPageHeaderActions from '../components/SetupListPageHeaderActions'
import SetupForm from '../components/SetupForm'
import SetupListScreen from '../components/SetupListScreen'
import SetupLoadErrorAlert from '../components/SetupLoadErrorAlert'
import { useSetupMaster } from '../hooks/useSetupMaster'
import { useSetupRecordById } from '../hooks/useSetupRecordById'
import { setupFormModalTitle, setupFormSubmitLabel } from '../utils/setupFormModalTitle'
import { isSetupEditFormLoading } from '../utils/setupEditFormLoading'

export default function SetupMasterScreen({ master }) {
  const {
    rows,
    total,
    isFetching,
    loadError,
    search,
    page,
    pageSize,
    sort,
    formOpen,
    editingId,
    formError,
    fieldErrors,
    setSearch,
    setPage,
    setPageSize,
    setSort,
    openCreate,
    openEdit,
    closeForm,
    handleSave,
    handleRemove,
    handleToggleActive,
    handleSubmit,
    handleSetDefault,
  } = useSetupMaster(master)

  const {
    data: editingRecord,
    isFetching: isEditingRecordLoading,
    error: editingRecordError,
  } = useSetupRecordById(master, editingId)

  const editSkeletonSections = master.editSkeletonSections ?? [{ fields: 9, cols: 3 }]

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
            onEdit={openEdit}
            onRemove={handleRemove}
            onToggleActive={handleToggleActive}
            onSubmit={handleSubmit}
            onSetDefault={handleSetDefault}
          />
        ),
      },
    ],
    [master, openEdit, handleRemove, handleToggleActive, handleSubmit, handleSetDefault],
  )

  return (
    <>
      <SetupListPageHeaderActions onAdd={openCreate} />
      <SetupListScreen
      formOpen={formOpen}
      onCloseForm={closeForm}
      modalTitle={setupFormModalTitle(master, editingId)}
      modalSize={master.formModalSize || '4xl'}
      form={
        isSetupEditFormLoading({
          editingId,
          isFetching: isEditingRecordLoading,
          data: editingRecord,
          error: editingRecordError,
        }) ? (
          <SetupEditFormSkeleton sections={editSkeletonSections} />
        ) : (
          <SetupForm
            master={master}
            initialValues={editingId ? editingRecord : null}
            fieldErrors={fieldErrors}
            formError={formError}
            onSubmit={handleSave}
            onCancel={closeForm}
            submitLabel={setupFormSubmitLabel(master, editingId)}
          />
        )
      }
      list={
        <>
          <SetupLoadErrorAlert error={loadError} />

          <SetupDataTable
            columns={columns}
            rows={rows}
            rowKey={master.idField}
            search={search}
            onSearchChange={setSearch}
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            sort={sort}
            onSortChange={setSort}
            loading={isFetching}
            emptyMessage="No data available in table"
          />
        </>
      }
    />
    </>
  )
}
