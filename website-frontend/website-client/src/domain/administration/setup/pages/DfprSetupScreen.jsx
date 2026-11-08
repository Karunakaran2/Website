import { useMemo } from 'react'
import SetupDataTable from '../components/SetupDataTable'
import DfprSetupForm from '../components/DfprSetupForm'
import { TABLE_ACTION_COLUMN_CLASS } from '@/shared/components/listing/listingTableStyles'
import SetupActionCell from '../components/SetupActionCell'
import SetupEditFormSkeleton from '../components/SetupEditFormSkeleton'
import SetupListPageHeaderActions from '../components/SetupListPageHeaderActions'
import SetupListScreen from '../components/SetupListScreen'
import SetupLoadErrorAlert from '../components/SetupLoadErrorAlert'
import { useSetupMaster } from '../hooks/useSetupMaster'
import { isSetupEditFormLoading } from '../utils/setupEditFormLoading'
import { setupFormModalTitle, setupFormSubmitLabel } from '../utils/setupFormModalTitle'
import { formatIndianAmountOrDash } from '@/shared/utils/probityFormat'
import {
  useGetDfprGroupByIdQuery,
  useGetDfprSeatUserListQuery,
  useSaveDfprListMutation,
} from '../services/setupApi'

export default function DfprSetupScreen({ master }) {
  const setup = useSetupMaster(master)
  const { data: seatResponse } = useGetDfprSeatUserListQuery()
  const [saveDfprList] = useSaveDfprListMutation()
  const {
    data: editingGroup,
    isFetching: isEditingRecordLoading,
    error: editingRecordError,
  } = useGetDfprGroupByIdQuery(setup.editingId, { skip: !setup.editingId })

  const columns = useMemo(
    () => [
      ...master.columns.map((column) => (
        column.id === 'fromAmount' || column.id === 'toAmount'
          ? { ...column, accessor: (row) => formatIndianAmountOrDash(row[column.id]) }
          : column
      )),
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

  const handleSave = async (body) => {
    const result = await saveDfprList(body)
    if (result.error) {
      return result
    }
    const editing = Boolean(setup.editingId)
    setup.closeForm()
    if (!editing) {
      setup.setPage(1)
    }
    setup.refetch()
    return result
  }

  const formLoading = isSetupEditFormLoading({
    editingId: setup.editingId,
    isFetching: isEditingRecordLoading,
    data: editingGroup,
    error: editingRecordError,
  })

  return (
    <>
      <SetupListPageHeaderActions onAdd={setup.openCreate} />
      <SetupListScreen
        formOpen={setup.formOpen}
        onCloseForm={setup.closeForm}
        modalTitle={setupFormModalTitle(master, setup.editingId)}
        modalSize="4xl"
        form={
          formLoading ? (
            <SetupEditFormSkeleton sections={[{ fields: 6, cols: 2 }]} />
          ) : (
            <DfprSetupForm
              key={setup.editingId || 'create'}
              group={setup.editingId ? editingGroup : null}
              seats={Array.isArray(seatResponse) ? seatResponse : []}
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
