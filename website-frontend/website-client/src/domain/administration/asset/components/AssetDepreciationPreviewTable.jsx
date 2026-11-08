import ProbityDataTable from '@/shared/components/listing/ProbityDataTable'
import { formProfileSectionTitleClass } from '@/shared/components/forms/formProfileSectionStyles'
import { formatDepreciationAmount } from '../constants/assetDepreciation'

export default function AssetDepreciationPreviewTable({ lines, total, loading }) {
  const columns = [
    { header: 'Asset ID', key: 'assetId' },
    { header: 'Description', key: 'description' },
    {
      header: 'Put To Use',
      key: 'putToUseDate',
      render: (row) => row.putToUseDate || '—',
    },
    {
      header: 'Age of Asset',
      key: 'assetAge',
      render: (row) => row.assetAge || '—',
    },
    {
      header: 'Asset Value',
      key: 'assetCost',
      align: 'right',
      render: (row) => formatDepreciationAmount(row.assetCost),
    },
    {
      header: 'Book Value',
      key: 'bookValueIt',
      align: 'right',
      render: (row) => formatDepreciationAmount(row.bookValueIt),
    },
    {
      header: 'Depreciation Method',
      key: 'depreciationMethodLabel',
      render: (row) => row.depreciationMethodLabel || row.depreciationMethod || '—',
    },
    {
      header: 'Depreciation Amount',
      key: 'depreciationAmount',
      align: 'right',
      render: (row) => formatDepreciationAmount(row.depreciationAmount),
    },
  ]

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className={formProfileSectionTitleClass}>
        Depreciation preview
      </p>
      <ProbityDataTable
        columns={columns}
        data={lines}
        keyExtractor={(row) => row.idMask || row.assetId}
        loading={loading}
        loadingMessage="Loading depreciation preview…"
        emptyMessage="No assets eligible for depreciation."
        showRowNumbers
      />
      {lines.length > 0 ? (
        <div className="flex justify-end border-t border-slate-200 pt-3 dark:border-slate-700">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Total: {formatDepreciationAmount(total)}
          </span>
        </div>
      ) : null}
    </div>
  )
}
