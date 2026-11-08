import { useMemo, useState } from 'react'
import { FormModal, OrgDataDisplay } from '@/shared/components'
import { PORTAL_MODAL_TITLE_CLASS } from '@/shared/components/modals/modalChrome'
import ProbityDataTable from '@/shared/components/listing/ProbityDataTable'
import { activeInactiveLabelFromRow } from '@/shared/components/status/statusLabels'
import {
  costCenterLabel,
  custodianLabel,
  documentTypeLabel,
} from '../constants/assetInformation'
import { formatDepreciationAmount } from '../constants/assetDepreciation'
import { assetInformationDocumentsFromRow } from '../services/assetDtoMappers'
import {
  useGetApprovedDepreciationLinesByAssetInformationQuery,
} from '../services/assetApi'
import { formatAssetDisplayDate } from '../utils/assetDateFormat'
import { formatIndianAmountOrDash } from '@/shared/utils/probityFormat'
import { assetInformationWorkflowStatusLabel } from '../utils/assetInformationStatus'
import { AssetInformationViewSkeleton } from './AssetModalSkeleton'
import AssetDepreciationLineDetailModal from './AssetDepreciationLineDetailModal'

function displayValue(value) {
  if (value == null || value === '') {
    return '—'
  }
  return value
}

const documentTableColumns = [
  {
    header: 'Document type',
    render: (doc) => documentTypeLabel(doc.documentType),
  },
  {
    header: 'Document number',
    render: (doc) => displayValue(doc.documentNumber),
  },
  {
    header: 'Document amount',
    render: (doc) => formatIndianAmountOrDash(doc.documentAmount),
  },
  {
    header: 'Open amount',
    render: (doc) => formatIndianAmountOrDash(doc.openAmount),
  },
  {
    header: 'Capitalization amount',
    render: (doc) => formatIndianAmountOrDash(doc.capitalizationAmount),
  },
]

export default function AssetInformationViewModal({
  open,
  row,
  loading = false,
  showValuationSummary = false,
  onClose,
}) {
  const [selectedDepreciationLine, setSelectedDepreciationLine] = useState(null)
  const assetIdMask = row?.idMask ?? ''
  const { data: depreciationLines = [], isFetching: depreciationLoading } =
    useGetApprovedDepreciationLinesByAssetInformationQuery(assetIdMask, {
      skip: !open || !showValuationSummary || !assetIdMask,
    })

  const documentLines = row ? assetInformationDocumentsFromRow(row) : []

  const detailItems = row
    ? [
        { label: 'Asset Id', value: displayValue(row.assetId), required: true },
        { label: 'Asset Description', value: displayValue(row.assetDescription), required: true },
        { label: 'Asset Type', value: displayValue(row.assetTypeLabel), required: true },
        {
          label: 'Capitalisation Date',
          value: formatAssetDisplayDate(row.capitalisationDate),
          required: true,
        },
        {
          label: 'Put to Use Date',
          value: formatAssetDisplayDate(row.putToUseDate),
          required: true,
        },
        {
          label: 'Status',
          value: assetInformationWorkflowStatusLabel(row.status),
        },
        { label: 'HSN Code', value: displayValue(row.hsnCodeLabel) },
        {
          label: 'Cost Center',
          value: displayValue(row.costCentreName) || costCenterLabel(row.costCenterId),
        },
        { label: 'Asset Qty', value: displayValue(row.assetQty), required: true },
        { label: 'Asset Cost', value: formatIndianAmountOrDash(row.assetCost), required: true },
        ...(showValuationSummary
          ? [
              {
                label: 'Asset Value',
                value: formatIndianAmountOrDash(row.assetCost),
              },
              {
                label: 'Book Value',
                value: formatIndianAmountOrDash(row.bookValueIt),
              },
              {
                label: 'Acc Value',
                value: formatIndianAmountOrDash(row.accmDepreciationIt),
              },
            ]
          : []),
        { label: 'Serial Number', value: displayValue(row.serialNumber) },
        {
          label: 'Custodian',
          value: displayValue(row.custodianName) || custodianLabel(row.custodianId),
        },
        { label: 'Barcode', value: displayValue(row.barcode) },
        { label: 'Location', value: displayValue(row.location) },
        {
          label: 'Attachment',
          value: row.attachmentFileName?.trim() ? row.attachmentFileName : '—',
        },
        { label: 'Active Status', value: activeInactiveLabelFromRow(row) },
      ]
    : []

  const depreciationHistoryColumns = useMemo(
    () => [
      { header: 'Financial Year', key: 'financialYear' },
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
              onClick={() => setSelectedDepreciationLine(line)}
            >
              {number}
            </button>
          )
        },
      },
      {
        header: 'Approved By',
        key: 'approvedByName',
        render: (line) => displayValue(line.approvedByName),
      },
      { header: 'Approved On', key: 'approvedOn' },
      {
        header: 'Depreciation Amount',
        key: 'amount',
        align: 'right',
        render: (line) => formatDepreciationAmount(line.amount),
      },
      {
        header: 'Book Value',
        key: 'bookValueIt',
        align: 'right',
        render: (line) => formatDepreciationAmount(line.bookValueIt),
      },
    ],
    [],
  )

  return (
    <>
      <FormModal
        open={open}
        onClose={onClose}
        title="View Asset Information"
        titleClassName={PORTAL_MODAL_TITLE_CLASS}
        size="4xl"
        bodyMaxHeightClass="max-h-[80vh]"
        showFooter={false}
      >
        {loading && !row ? (
          <AssetInformationViewSkeleton />
        ) : row ? (
          <div className="space-y-4">
            <OrgDataDisplay title="Fixed Asset Capitalisation" items={detailItems} columns={3} />
            <ProbityDataTable
              caption="Document Info"
              columns={documentTableColumns}
              data={documentLines}
              keyExtractor={(doc, index) => doc.id || `doc-${index}`}
              emptyMessage="No data available in table"
            />
            {showValuationSummary ? (
              <ProbityDataTable
                caption="Depreciation history"
                columns={depreciationHistoryColumns}
                data={depreciationLines}
                keyExtractor={(line, index) => line.idMask || `dep-${index}`}
                emptyMessage="No data available in table"
                loading={depreciationLoading}
              />
            ) : null}
          </div>
        ) : null}
      </FormModal>
      <AssetDepreciationLineDetailModal
        open={Boolean(selectedDepreciationLine?.idMask)}
        lineIdMask={selectedDepreciationLine?.idMask}
        lineContext={selectedDepreciationLine}
        onClose={() => setSelectedDepreciationLine(null)}
      />
    </>
  )
}
