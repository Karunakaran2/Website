import { useMemo, useState } from 'react'
import { FileSpreadsheet, FileText } from 'lucide-react'
import DashboardPageHeaderActions from '@/app/shell/components/DashboardPageHeaderActions'
import { GIGW_ADD_ICON, GigwButton } from '@/shared/components/buttons/gigw'
import { showAppToast } from '@/shared/components'
import SetupDataTable from '../components/SetupDataTable'
import SetupActionCell from '../components/SetupActionCell'
import SetupEditFormSkeleton from '../components/SetupEditFormSkeleton'
import SetupForm from '../components/SetupForm'
import SetupListScreen from '../components/SetupListScreen'
import SetupLoadErrorAlert from '../components/SetupLoadErrorAlert'
import { useSetupMaster } from '../hooks/useSetupMaster'
import { resolveSetupServerSortFields } from '../constants/setupServerSortFields'
import { setupFormModalTitle, setupFormSubmitLabel } from '../utils/setupFormModalTitle'
import { isSetupEditFormLoading } from '../utils/setupEditFormLoading'
import {
  chartOfAccountsExportErrorMessage,
  downloadChartOfAccountsExcel,
  downloadChartOfAccountsPdf,
  fetchAllChartOfAccountsRows,
  mapChartOfAccountsExportRows,
} from '../utils/chartOfAccountsExport'
import {
  useGetAccountSetupListQuery,
  useGetHoaSetupByIdQuery,
  useLazySearchSetupQuery,
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

export default function ChartOfAccountsScreen({ master }) {
  const setup = useSetupMaster(master)
  const [exporting, setExporting] = useState(null)
  const [triggerSearch] = useLazySearchSetupQuery()
  const {
    data: groupResponse,
    error: groupError,
    isFetching: groupLoading,
  } = useGetAccountSetupListQuery()
  const {
    data: editingHoa,
    isFetching: isEditingLoading,
    error: editingError,
  } = useGetHoaSetupByIdQuery(setup.editingId, {
    skip: !setup.editingId,
  })

  const groups = useMemo(() => unwrapList(groupResponse), [groupResponse])

  const selectOptions = useMemo(
    () => [
      { value: '', label: 'Select Group' },
      ...groups
        .filter((group) => group?.id && group?.accountName)
        .map((group) => ({
          value: String(group.id),
          label: group.accountName,
        })),
    ],
    [groups],
  )

  const formValues = useMemo(() => {
    if (!setup.editingId) {
      return null
    }
    const record = editingHoa || { id: setup.editingId }
    return {
      ...record,
      accountTypeId: record.accountTypeId == null ? '' : String(record.accountTypeId),
    }
  }, [setup.editingId, editingHoa])

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
    const accountTypeId = values.accountTypeId && typeof values.accountTypeId === 'object'
      ? values.accountTypeId.value
      : values.accountTypeId
    return setup.handleSave({
      hoaName: values.hoaName ? String(values.hoaName).trim() : null,
      accountTypeId: accountTypeId ? Number(accountTypeId) : null,
    })
  }

  const handleExport = async (kind) => {
    setExporting(kind)
    try {
      const sourceRows = await fetchAllChartOfAccountsRows(triggerSearch, {
        search: setup.search,
        sortBy: setup.sort.sortBy,
        sortDir: setup.sort.sortDir,
        sortFields: resolveSetupServerSortFields(master.resource, master),
      })
      const rows = mapChartOfAccountsExportRows(sourceRows)
      const payload = { rows, search: setup.search }
      if (kind === 'pdf') {
        await downloadChartOfAccountsPdf(payload)
      } else {
        await downloadChartOfAccountsExcel(payload)
      }
    } catch (error) {
      showAppToast(chartOfAccountsExportErrorMessage(error), 'error')
    } finally {
      setExporting(null)
    }
  }

  const formErrorMessage = setup.formError
    || (groupError ? (groupError.data || 'Unable to load Group options.') : null)
    || (!groupLoading && selectOptions.length <= 1
      ? 'No groups are available. Add a Group Setup record first.'
      : null)

  return (
    <>
      <DashboardPageHeaderActions>
        <GigwButton
          type="button"
          variant="outlineDanger"
          icon={FileText}
          loading={exporting === 'pdf'}
          disabled={Boolean(exporting)}
          onClick={() => handleExport('pdf')}
        >
          Export PDF
        </GigwButton>
        <GigwButton
          type="button"
          variant="outlineSuccess"
          icon={FileSpreadsheet}
          loading={exporting === 'excel'}
          disabled={Boolean(exporting)}
          onClick={() => handleExport('excel')}
        >
          Export Excel
        </GigwButton>
        <GigwButton type="button" variant="primary" icon={GIGW_ADD_ICON} onClick={setup.openCreate}>
          Add
        </GigwButton>
      </DashboardPageHeaderActions>
      <SetupListScreen
        formOpen={setup.formOpen}
        onCloseForm={setup.closeForm}
        modalTitle={setupFormModalTitle(master, setup.editingId)}
        modalSize="lg"
        form={
          isSetupEditFormLoading({
            editingId: setup.editingId,
            isFetching: isEditingLoading,
            data: editingHoa,
            error: editingError,
          }) ? (
            <SetupEditFormSkeleton sections={[{ fields: 2, cols: 1 }]} />
          ) : (
            <SetupForm
              master={master}
              fieldGridCols={1}
              initialValues={formValues}
              fieldErrors={setup.fieldErrors}
              formError={formErrorMessage}
              fieldOptions={{ accountTypeId: selectOptions }}
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
