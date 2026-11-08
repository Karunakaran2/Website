import { useMemo } from 'react'
import { FormModal, OrgDataDisplay } from '@/shared/components'
import { formProfileSectionTitleClass } from '@/shared/components/forms/formProfileSectionStyles'
import ProbityDataTable from '@/shared/components/listing/ProbityDataTable'
import { formatDepreciationAmount } from '../constants/assetDepreciation'
import { useGetAssetDepreciationLineDetailQuery } from '../services/assetApi'
import { mergeDepreciationLineDetail } from '../utils/mergeDepreciationLineDetail'
import { AssetOrgDataDisplaySkeleton } from './AssetModalSkeleton'

function displayValue(value) {
  if (value == null || value === '') {
    return '—'
  }
  return value
}

function formatDepreciationRate(rate) {
  if (rate == null || rate === '') {
    return '—'
  }
  const numeric = Number(rate)
  if (!Number.isFinite(numeric)) {
    return '—'
  }
  return `${numeric}%`
}

const JOURNAL_COLUMNS = [
  { header: 'Type', key: 'entryType', align: 'center' },
  { header: 'Head Of Accounts', key: 'hoaName', align: 'center' },
  {
    header: 'Amount',
    key: 'amount',
    align: 'right',
    render: (line) => formatDepreciationAmount(line.amount),
  },
]

export default function AssetDepreciationLineDetailModal({
  open,
  lineIdMask,
  lineContext,
  runSummary,
  depreciationNumber,
  onClose,
}) {
  const { data: apiDetail, isFetching } = useGetAssetDepreciationLineDetailQuery(lineIdMask, {
    skip: !open || !lineIdMask,
    refetchOnMountOrArgChange: true,
  })

  const detail = useMemo(
    () => mergeDepreciationLineDetail(apiDetail, lineContext, runSummary),
    [apiDetail, lineContext, runSummary],
  )

  const title = depreciationNumber
    ? `Depreciation — ${depreciationNumber}`
    : detail?.depreciationNumber
      ? `Depreciation — ${detail.depreciationNumber}`
      : 'Depreciation detail'

  const summaryItems = useMemo(() => {
    if (!detail) {
      return []
    }
    const methodLabel =
      detail.depreciationMethodLabel || detail.depreciationMethod || '—'
    return [
      { label: 'Depreciation Number', value: displayValue(detail.depreciationNumber) },
      { label: 'Financial Year', value: displayValue(detail.financialYear) },
      { label: 'Asset ID', value: displayValue(detail.assetId) },
      { label: 'Description', value: displayValue(detail.description) },
      { label: 'Depreciation Method', value: displayValue(methodLabel) },
      { label: 'Depreciation Rate', value: formatDepreciationRate(detail.depreciationRateIt) },
      {
        label: 'Depreciation Start Date',
        value: displayValue(detail.depreciationStartDate),
      },
      { label: 'Put To Use Date', value: displayValue(detail.putToUseDate) },
      { label: 'Age of Asset', value: displayValue(detail.assetAge) },
      { label: 'Depreciation Date', value: displayValue(detail.depreciationDate) },
      { label: 'Process Upto', value: displayValue(detail.processUpto) },
      { label: 'Approved By', value: displayValue(detail.approvedByName) },
      { label: 'Approved On', value: displayValue(detail.approvedOn) },
      {
        label: 'Asset Value',
        value: formatDepreciationAmount(detail.assetCost),
      },
      {
        label: 'Book Value',
        value: formatDepreciationAmount(detail.bookValueIt),
      },
      {
        label: 'Accumulated Depreciation',
        value: formatDepreciationAmount(detail.accmDepreciationIt),
      },
      {
        label: 'Depreciated Value',
        value: formatDepreciationAmount(detail.depreciatedValue),
      },
    ]
  }, [detail])

  const journalLines = detail?.journalLines ?? []

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={title}
      size="4xl"
      bodyMaxHeightClass="max-h-[80vh]"
      showFooter={false}
    >
      <div className="flex min-w-0 flex-col gap-4">
        {isFetching && !detail && !lineContext ? (
          <AssetOrgDataDisplaySkeleton
            fields={9}
            cols={3}
            loadingMessage="Loading depreciation detail…"
          />
        ) : null}
        {detail ? (
          <>
            <OrgDataDisplay title="Asset depreciation" items={summaryItems} columns={3} />
            <div className="flex min-w-0 flex-col gap-2">
              <p className={formProfileSectionTitleClass}>Accounting entries</p>
              <ProbityDataTable
                columns={JOURNAL_COLUMNS}
                data={journalLines}
                loading={isFetching && journalLines.length === 0}
                loadingMessage="Loading journal entries…"
                keyExtractor={(line, index) =>
                  `${line.entryType}-${line.hoaName}-${line.amount}-${index}`
                }
                emptyMessage="No accounting data found for this depreciation entry."
              />
            </div>
          </>
        ) : null}
      </div>
    </FormModal>
  )
}
