import { useMemo } from 'react'
import { normalizeSetupRows } from '../utils/setupRowId'
import { Building2, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import SetupDataTable from '../components/SetupDataTable'
import ModuleInnerCard from '@/shared/layouts/ModuleInnerCard'
import SetupLoadErrorAlert from '../components/SetupLoadErrorAlert'
import { useSearchSetupApprovalQuery } from '../services/setupApi'
import { formatSetupLoadError } from '../utils/setupApiError'
import { setupYesNoStatusColumn } from '../constants/setupStatusColumns.jsx'
import {
  partyListGstin,
  partyTypeListLabel,
  setupListCellText,
} from '../utils/partySetupDisplay'

const BANK_COLUMNS = [
  { id: 'accountName', header: 'Account Name', accessor: 'accountName', sortable: true },
  { id: 'accountNumber', header: 'Account Number', accessor: 'accountNumber' },
  { id: 'ifscNo', header: 'IFSC', accessor: 'ifscNo' },
  setupYesNoStatusColumn('submittedStatus', 'Submitted', (row) => row.submittedStatus === 'Y'),
  setupYesNoStatusColumn('forwardStatus', 'Forwarded', (row) => row.forwardStatus === 'Y'),
]

const PARTY_COLUMNS = [
  {
    id: 'partyType',
    header: 'Party Type',
    accessor: (row) => partyTypeListLabel(row.partyType),
  },
  { id: 'partyName', header: 'Party Name', accessor: 'partyName', sortable: true },
  { id: 'panNo', header: 'PAN', accessor: (row) => setupListCellText(row.panNo) },
  { id: 'gstin', header: 'GSTIN', accessor: partyListGstin },
  setupYesNoStatusColumn('submittedStatus', 'Submitted', (row) => row.submittedStatus === 'Y'),
]

function ApprovalTable({ title, icon, kind, inbox, columns }) {
  const { data, isFetching, error } = useSearchSetupApprovalQuery({
    kind,
    inbox,
    search: '',
    page: 1,
    pageSize: 10,
  })

  const tableColumns = useMemo(() => columns, [columns])
  const tableRows = useMemo(
    () => normalizeSetupRows(data?.data ?? [], { idField: 'idMask' }),
    [data],
  )

  return (
    <ModuleInnerCard title={title} icon={icon}>
      <SetupLoadErrorAlert error={formatSetupLoadError(error)} />
      <SetupDataTable
        columns={tableColumns}
        rows={tableRows}
        rowKey="idMask"
        page={1}
        pageSize={10}
        total={data?.recordsFiltered ?? 0}
        loading={isFetching}
        emptyMessage="No data available in table"
      />
    </ModuleInnerCard>
  )
}

export default function SetupApprovalScreen({ inbox }) {
  const { t } = useTranslation()

  return (
    <>
      <ApprovalTable
        title={t('form.pageSections.bankAccounts')}
        icon={Building2}
        kind="bank"
        inbox={inbox}
        columns={BANK_COLUMNS}
      />
      <ApprovalTable
        title={t('form.pageSections.parties')}
        icon={Users}
        kind="party"
        inbox={inbox}
        columns={PARTY_COLUMNS}
      />
    </>
  )
}
