import { useMemo, useState } from 'react'
import SetupDataTable from '../components/SetupDataTable'
import SetupListPageHeaderActions from '../components/SetupListPageHeaderActions'
import SetupListScreen from '../components/SetupListScreen'
import AddCostCategoryModal from '../components/AddCostCategoryModal'
import CostUnitForm from '../components/CostUnitForm'
import SetupEditFormSkeleton from '../components/SetupEditFormSkeleton'
import SetupActionCell from '../components/SetupActionCell'
import SetupLoadErrorAlert from '../components/SetupLoadErrorAlert'
import { useSetupMaster } from '../hooks/useSetupMaster'
import { setupFormModalTitle } from '../utils/setupFormModalTitle'
import { isSetupEditFormLoading } from '../utils/setupEditFormLoading'
import {
  useGetCostCategoryListQuery,
  useGetCostCentreByIdQuery,
  useSaveSetupMutation,
} from '../services/setupApi'

function extractErrorMessage(error) {
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
  return 'Unable to save cost category'
}

export default function CostUnitScreen({ master }) {
  const setup = useSetupMaster(master)
  const { data: categories = [], refetch: refetchCategories } = useGetCostCategoryListQuery()
  const {
    data: editingCostCentre,
    isFetching: isEditingLoading,
    error: editingError,
  } = useGetCostCentreByIdQuery(setup.editingId, {
    skip: !setup.editingId,
  })
  const [saveCostCategory, { isLoading: isSavingCategory }] = useSaveSetupMutation()
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [categoryError, setCategoryError] = useState('')
  const [pendingGroupUnder, setPendingGroupUnder] = useState(null)

  const groupUnderOptions = useMemo(
    () => (categories || []).map((item) => ({
      value: item.id,
      label: item.costCategoryName,
    })),
    [categories],
  )

  const formValues = useMemo(() => {
    if (!setup.editingId) {
      return pendingGroupUnder != null ? { costCategoryId: pendingGroupUnder } : null
    }
    if (!editingCostCentre) {
      return null
    }
    return pendingGroupUnder != null
      ? { ...editingCostCentre, costCategoryId: pendingGroupUnder }
      : editingCostCentre
  }, [setup.editingId, editingCostCentre, pendingGroupUnder])

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

  const handleSave = async (values) => {
    setPendingGroupUnder(null)
    return setup.handleSave({
      costCentreName: values.costCentreName,
      costCategoryId: values.costCategoryId,
      parentAccountId: null,
    })
  }

  const handleSaveCategory = async (costCategoryName) => {
    setCategoryError('')
    const result = await saveCostCategory({
      resource: 'cost-category',
      entityName: 'CostCategory',
      body: { costCategoryName },
    })
    if (result.error) {
      setCategoryError(extractErrorMessage(result.error))
      return false
    }
    const saved = result.data
    const refreshed = await refetchCategories()
    const list = refreshed.data || categories || []
    const match = list.find((item) => item.id === saved?.id)
      || list.find((item) => item.costCategoryName === costCategoryName)
    if (match?.id) {
      setPendingGroupUnder(match.id)
    }
    return true
  }

  const openCreateCostUnit = () => {
    setPendingGroupUnder(null)
    setup.openCreate()
  }

  const closeCostUnitForm = () => {
    setPendingGroupUnder(null)
    setup.closeForm()
  }

  return (
    <>
      <SetupListPageHeaderActions onAdd={openCreateCostUnit} />
      <SetupListScreen
        formOpen={setup.formOpen}
        onCloseForm={closeCostUnitForm}
        modalTitle={setupFormModalTitle(master, setup.editingId)}
        modalSize="lg"
        form={
          isSetupEditFormLoading({
            editingId: setup.editingId,
            isFetching: isEditingLoading,
            data: editingCostCentre,
            error: editingError,
          }) ? (
            <SetupEditFormSkeleton sections={[{ fields: 6, cols: 1 }]} />
          ) : (
            <CostUnitForm
              initialValues={formValues}
              groupUnderOptions={groupUnderOptions}
              fieldErrors={setup.fieldErrors}
              formError={setup.formError}
              onSubmit={handleSave}
              onCancel={closeCostUnitForm}
              onOpenAddCategory={() => {
                setCategoryError('')
                setCategoryModalOpen(true)
              }}
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

      <AddCostCategoryModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        saving={isSavingCategory}
        errorMessage={categoryError}
      />
    </>
  )
}
