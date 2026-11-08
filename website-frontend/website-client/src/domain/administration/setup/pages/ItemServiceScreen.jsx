import { useMemo } from 'react'
import SetupDataTable from '../components/SetupDataTable'
import { TABLE_ACTION_COLUMN_CLASS } from '@/shared/components/listing/listingTableStyles'
import ItemServiceForm from '../components/ItemServiceForm'
import SetupActionCell from '../components/SetupActionCell'
import SetupListPageHeaderActions from '../components/SetupListPageHeaderActions'
import SetupEditFormSkeleton from '../components/SetupEditFormSkeleton'
import SetupListScreen from '../components/SetupListScreen'
import {
  ITEM_SERVICE_CATEGORY_OPTIONS,
  ITEM_SERVICE_TYPE_OPTIONS,
  formatItemServiceListPrice,
} from '../constants/itemServiceOptions'
import SetupLoadErrorAlert from '../components/SetupLoadErrorAlert'
import { useSetupMaster } from '../hooks/useSetupMaster'
import { setupFormModalTitle } from '../utils/setupFormModalTitle'
import { isSetupEditFormLoading } from '../utils/setupEditFormLoading'
import {
  useGetHoaSetupListQuery,
  useGetHsnCodeListQuery,
  useGetSacCodeListQuery,
  useGetServiceTypeSetupByIdQuery,
  useGetTcsTypeListQuery,
  useGetMasterTdsTypeListQuery,
  useGetUnitOfMeasureListQuery,
} from '../services/setupApi'

const CATEGORY_LABELS = Object.fromEntries(
  ITEM_SERVICE_CATEGORY_OPTIONS.map((option) => [option.value, option.label.replace(' Code', '')]),
)

const ITEM_TYPE_LABELS = Object.fromEntries(
  ITEM_SERVICE_TYPE_OPTIONS.map((option) => [option.value, option.label]),
)

const RCM_LABELS = { Y: 'Yes', N: 'No', Yes: 'Yes', No: 'No' }

function toLabelMap(items, idKey, labelKey) {
  return Object.fromEntries(
    (items || [])
      .filter((item) => item?.[idKey] != null && item?.[labelKey])
      .map((item) => [String(item[idKey]), String(item[labelKey])]),
  )
}

function formatRate(value) {
  if (value == null || value === '') {
    return ''
  }
  const text = String(value)
  return text.includes('%') ? text : `${text}%`
}

function resolveLabel(value, labels) {
  if (value == null || value === '') {
    return ''
  }
  return labels[String(value)] || String(value)
}

export default function ItemServiceScreen({ master }) {
  const setup = useSetupMaster(master)
  const {
    data: editingServiceTypeSetup,
    isFetching: isEditingLoading,
    error: editingError,
  } = useGetServiceTypeSetupByIdQuery(setup.editingId, {
    skip: !setup.editingId,
  })
  const { data: unitsOfMeasure = [] } = useGetUnitOfMeasureListQuery()
  const { data: tdsTypes = [] } = useGetMasterTdsTypeListQuery()
  const { data: tcsTypes = [] } = useGetTcsTypeListQuery()
  const { data: hsnCodes = [] } = useGetHsnCodeListQuery()
  const { data: sacCodes = [] } = useGetSacCodeListQuery()
  const { data: hoaLedgers = [] } = useGetHoaSetupListQuery()

  const unitLabels = useMemo(() => toLabelMap(unitsOfMeasure, 'id', 'name'), [unitsOfMeasure])
  const tdsLabels = useMemo(() => toLabelMap(tdsTypes, 'id', 'tdsName'), [tdsTypes])
  const tcsLabels = useMemo(() => toLabelMap(tcsTypes, 'id', 'tcsName'), [tcsTypes])
  const hoaLabels = useMemo(() => toLabelMap(hoaLedgers, 'id', 'hoaName'), [hoaLedgers])
  const hsnLabels = useMemo(() => toLabelMap(hsnCodes, 'id', 'hsnCode'), [hsnCodes])
  const sacLabels = useMemo(() => toLabelMap(sacCodes, 'id', 'sacCode'), [sacCodes])

  const columns = useMemo(
    () => [
      ...master.columns.map((column) => {
        if (column.id === 'category') {
          return {
            ...column,
            accessor: (row) => CATEGORY_LABELS[row.category] || row.category || '',
          }
        }
        if (column.id === 'itemType') {
          return {
            ...column,
            accessor: (row) => ITEM_TYPE_LABELS[row.itemType] || row.itemType || '',
          }
        }
        if (column.id === 'unitName') {
          return {
            ...column,
            accessor: (row) => resolveLabel(row.unitName, unitLabels),
          }
        }
        if (column.id === 'salesAccountLedger') {
          return {
            ...column,
            accessor: (row) => resolveLabel(row.salesAccountLedger, hoaLabels),
          }
        }
        if (column.id === 'purchaseAccountLedger') {
          return {
            ...column,
            accessor: (row) => resolveLabel(row.purchaseAccountLedger, hoaLabels),
          }
        }
        if (column.id === 'hsnOrSacCode') {
          return {
            ...column,
            accessor: (row) => {
              if (row.hsnOrSacCode == null || row.hsnOrSacCode === '') {
                return ''
              }
              const key = String(row.hsnOrSacCode)
              if (row.category === 'S') {
                return sacLabels[key] || key
              }
              return hsnLabels[key] || sacLabels[key] || key
            },
          }
        }
        if (column.id === 'tdsType') {
          return {
            ...column,
            format: 'plain',
            accessor: (row) => resolveLabel(row.tdsType, tdsLabels),
          }
        }
        if (column.id === 'tcsType') {
          return {
            ...column,
            format: 'plain',
            accessor: (row) => resolveLabel(row.tcsType, tcsLabels),
          }
        }
        if (column.id === 'salesPrice') {
          return {
            ...column,
            format: 'plain',
            accessor: (row) => formatItemServiceListPrice(row.salesPrice, row.itemType, 'sales'),
          }
        }
        if (column.id === 'purchasePrice') {
          return {
            ...column,
            format: 'plain',
            accessor: (row) => formatItemServiceListPrice(row.purchasePrice, row.itemType, 'purchase'),
          }
        }
        if (column.id === 'gstRate' || column.id === 'tdsRate' || column.id === 'tcsRate') {
          return {
            ...column,
            format: 'plain',
            accessor: (row) => formatRate(row[column.id]),
          }
        }
        if (column.id === 'rcmApplicable') {
          return {
            ...column,
            accessor: (row) => RCM_LABELS[row.rcmApplicable] || row.rcmApplicable || '',
          }
        }
        return column
      }),
      {
        id: 'action',
        header: 'Action',
        sortable: false,
        headerClassName: TABLE_ACTION_COLUMN_CLASS,
        cellClassName: TABLE_ACTION_COLUMN_CLASS,
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
    [
      master,
      setup.openEdit,
      setup.handleRemove,
      setup.handleToggleActive,
      setup.handleSubmit,
      unitLabels,
      hoaLabels,
      hsnLabels,
      sacLabels,
      tdsLabels,
      tcsLabels,
    ],
  )

  const handleSave = async (values) => setup.handleSave(values)

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
            data: editingServiceTypeSetup,
            error: editingError,
          }) ? (
            <SetupEditFormSkeleton sections={[{ fields: 15, cols: 3 }, { fields: 6, cols: 3 }]} />
          ) : (
            <ItemServiceForm
              initialValues={setup.editingId ? editingServiceTypeSetup : null}
              fieldErrors={setup.fieldErrors}
              formError={setup.formError}
              onSubmit={handleSave}
              onCancel={setup.closeForm}
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
    </>
  )
}
