import { OrgDataDisplay } from '@/shared/components'
import { useGetFixedAssetGroupByIdQuery } from '../services/assetApi'
import { AssetOrgDataDisplaySkeleton } from './AssetModalSkeleton'

export default function AssetFaGroupSummaryPanel({ faGroupIdMask }) {
  const { data: group, isFetching } = useGetFixedAssetGroupByIdQuery(faGroupIdMask, {
    skip: !faGroupIdMask,
  })

  if (!faGroupIdMask) {
    return null
  }

  if (isFetching && !group) {
    return (
      <div className="px-0 pt-2">
        <AssetOrgDataDisplaySkeleton fields={5} cols={3} loadingMessage="Loading FA group details…" />
      </div>
    )
  }

  if (!group) {
    return null
  }

  const items = [
    { label: 'Asset class (IT)', value: group.assetClassLabel },
    { label: 'Depreciation rate (IT)', value: group.depreciationRateIt ?? '—' },
    { label: 'Depreciation method', value: group.depreciationMethodLabel ?? '—' },
    { label: 'Asset account', value: group.assetAccount ?? '—' },
    { label: 'Depreciation account', value: group.depreciationAccount ?? '—' },
  ]

  return (
    <div className="px-0 pt-2">
      <OrgDataDisplay title="FA group details" items={items} columns={3} className="!rounded-lg" />
    </div>
  )
}
