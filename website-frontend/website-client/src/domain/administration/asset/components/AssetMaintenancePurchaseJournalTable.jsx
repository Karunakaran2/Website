import ProbityDataTable from '@/shared/components/listing/ProbityDataTable'
import { formProfileSectionTitleClass } from '@/shared/components/forms/formProfileSectionStyles'
import { formatMaintenanceCost } from '../constants/assetMaintenance'
import { useGetPurchaseInvoiceJournalLinesQuery } from '../services/assetApi'

const JOURNAL_COLUMNS = [
  { header: 'Type', key: 'entryType', align: 'center' },
  { header: 'Head Of Accounts', key: 'hoaName', align: 'center' },
  {
    header: 'Amount',
    key: 'amount',
    align: 'right',
    render: (line) => formatMaintenanceCost(line.amount),
  },
]

export default function AssetMaintenancePurchaseJournalTable({ purchaseInvoiceIdMask }) {
  const { data: journalLines = [], isFetching } = useGetPurchaseInvoiceJournalLinesQuery(
    purchaseInvoiceIdMask,
    { skip: !purchaseInvoiceIdMask },
  )

  if (!purchaseInvoiceIdMask) {
    return null
  }

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className={formProfileSectionTitleClass}>Purchase invoice accounting entries</p>
      <ProbityDataTable
        columns={JOURNAL_COLUMNS}
        data={journalLines}
        loading={isFetching && journalLines.length === 0}
        loadingMessage="Loading journal entries…"
        keyExtractor={(line, index) => `${line.entryType}-${line.hoaName}-${index}`}
        emptyMessage="No accounting data found for this invoice."
      />
    </div>
  )
}
