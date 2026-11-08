import { useMemo } from 'react'
import { FormModal } from '@/shared/components'
import ProbityDataTable from '@/shared/components/listing/ProbityDataTable'
import { useGetAssetAllocationHistoryQuery } from '../services/assetApi'
import { formatAssetDisplayDate } from '../utils/assetDateFormat'

export default function AssetAllocationHistoryModal({
  open,
  assetInformationIdMask,
  assetId,
  onClose,
}) {
  const { data: rows = [], isFetching } = useGetAssetAllocationHistoryQuery(
    assetInformationIdMask,
    {
      skip: !open || !assetInformationIdMask,
    },
  )

  const title = assetId ? `Allocation History — ${assetId}` : 'Allocation History'

  const columns = useMemo(
    () => [
      {
        header: 'Date',
        key: 'allocationDate',
        render: (row) => formatAssetDisplayDate(row.allocationDate),
      },
      { header: 'Action', key: 'action' },
      { header: 'Location', key: 'location' },
      { header: 'Custodian', key: 'custodianName' },
      { header: 'Comments', key: 'comments' },
    ],
    [],
  )

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={title}
      size="xl"
      bodyMaxHeightClass="max-h-[80vh]"
      showFooter={false}
    >
      <ProbityDataTable
        columns={columns}
        data={rows}
        keyExtractor={(row, index) => `${row.allocationDate}-${row.action}-${index}`}
        loading={isFetching}
        loadingMessage="Loading allocation history…"
        emptyMessage="No allocation history for this asset."
        showRowNumbers
      />
    </FormModal>
  )
}
