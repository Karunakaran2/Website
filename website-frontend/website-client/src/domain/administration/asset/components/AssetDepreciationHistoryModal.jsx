import { useMemo, useState } from 'react'
import { FormModal, OrgDataDisplay } from '@/shared/components'
import ProbityDataTable from '@/shared/components/listing/ProbityDataTable'
import { formatDepreciationAmount } from '../constants/assetDepreciation'
import { useGetDepreciationHistoryQuery } from '../services/assetApi'
import AssetDepreciationLineDetailModal from './AssetDepreciationLineDetailModal'

function displayValue(value) {
  if (value == null || value === '') {
    return '—'
  }
  return value
}

export default function AssetDepreciationHistoryModal({ open, row, onClose }) {
  const [selectedLine, setSelectedLine] = useState(null)
  const idMask = row?.idMask ?? ''
  const { data: viewPayload, isFetching } = useGetDepreciationHistoryQuery(idMask, {
    skip: !open || !idMask,
  })
  const lines = viewPayload?.lines ?? []
  const summarySource = viewPayload?.summary
    ? { ...row, ...viewPayload.summary }
    : row

  const title = summarySource?.depreciationNumber
    ? `View Depreciation — ${summarySource.depreciationNumber}`
    : 'View Depreciation'

  const handleClose = () => {
    setSelectedLine(null)
    onClose?.()
  }

  const runFinancialYear = useMemo(() => {
    const fromLine = lines.find((line) => line.financialYear)?.financialYear
    return fromLine ?? ''
  }, [lines])

  const summaryItems = useMemo(() => {
    if (!summarySource) {
      return []
    }
    return [
      { label: 'Depreciation Number', value: displayValue(summarySource.depreciationNumber) },
      { label: 'Financial Year', value: displayValue(runFinancialYear) },
      { label: 'Date', value: displayValue(summarySource.depreciationDate) },
      { label: 'Process Upto', value: displayValue(summarySource.processUpTo) },
      {
        label: 'Depreciation Amount',
        value: formatDepreciationAmount(summarySource.depreciationAmount),
      },
    ]
  }, [summarySource, runFinancialYear])

  const columns = useMemo(
    () => [
      {
        header: 'Depreciation Number',
        key: 'depreciationNumber',
        render: (line) => {
          const number = line.depreciationNumber || '—'
          if (!line.idMask) {
            return number
          }
          return (
            <button
              type="button"
              className="cursor-pointer whitespace-normal text-left text-sm font-medium text-probity-brand underline decoration-probity-brand/70 underline-offset-2 transition-colors hover:text-probity-action hover:decoration-probity-brand focus:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-probity-brand focus-visible:ring-offset-1"
              onClick={() => setSelectedLine(line)}
            >
              {number}
            </button>
          )
        },
      },
      { header: 'Financial Year', key: 'financialYear' },
      {
        header: 'Approved By',
        key: 'approvedByName',
        render: (line) => displayValue(line.approvedByName),
      },
      { header: 'Approved On', key: 'approvedOn' },
      { header: 'Asset ID', key: 'assetId' },
      {
        header: 'Age of Asset',
        key: 'assetAge',
        render: (line) => displayValue(line.assetAge),
      },
      { header: 'Description', key: 'description' },
      {
        header: 'Asset Value',
        key: 'assetCost',
        align: 'right',
        render: (line) => formatDepreciationAmount(line.assetCost),
      },
      {
        header: 'Book Value',
        key: 'bookValueIt',
        align: 'right',
        render: (line) => formatDepreciationAmount(line.bookValueIt),
      },
      {
        header: 'Depreciation Amount',
        key: 'amount',
        align: 'right',
        render: (line) => formatDepreciationAmount(line.amount),
      },
    ],
    [],
  )

  return (
    <>
      <FormModal
        open={open}
        onClose={handleClose}
        title={title}
        size="3xl"
        bodyMaxHeightClass="max-h-[80vh]"
        showFooter={false}
      >
        <div className="flex min-w-0 flex-col gap-4">
          {summarySource ? (
            <OrgDataDisplay title="Depreciation run" items={summaryItems} columns={3} />
          ) : null}
          <ProbityDataTable
            columns={columns}
            data={lines}
            keyExtractor={(line, index) =>
              line.idMask || `${line.depreciationNumber}-${line.assetId}-${line.amount}-${index}`
            }
            loading={isFetching}
            loadingMessage="Loading asset lines…"
            emptyMessage="No asset lines for this run."
            showRowNumbers
          />
        </div>
      </FormModal>
      <AssetDepreciationLineDetailModal
        open={Boolean(selectedLine?.idMask)}
        lineIdMask={selectedLine?.idMask ?? ''}
        lineContext={selectedLine}
        runSummary={summarySource}
        depreciationNumber={selectedLine?.depreciationNumber}
        onClose={() => setSelectedLine(null)}
      />
    </>
  )
}
