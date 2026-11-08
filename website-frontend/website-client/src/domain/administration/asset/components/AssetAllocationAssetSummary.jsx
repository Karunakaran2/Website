import { OrgDataDisplay } from '@/shared/components'
import { formatIndianAmountOrDash } from '@/shared/utils/probityFormat'
import { costCenterLabel, custodianLabel } from '../constants/assetInformation'
import { useGetAssetAllocationDetailQuery } from '../services/assetApi'
import { AssetOrgDataDisplaySkeleton } from './AssetModalSkeleton'

function displayValue(value) {
  if (value == null || value === '') {
    return '—'
  }
  return value
}

export default function AssetAllocationAssetSummary({ assetInformationIdMask }) {
  const { data: asset, isFetching } = useGetAssetAllocationDetailQuery(assetInformationIdMask, {
    skip: !assetInformationIdMask,
  })

  if (!assetInformationIdMask) {
    return null
  }

  if (isFetching && !asset) {
    return (
      <AssetOrgDataDisplaySkeleton fields={8} cols={3} loadingMessage="Loading asset details…" />
    )
  }

  if (!asset) {
    return null
  }

  const items = [
    { label: 'Asset Id', value: displayValue(asset.assetId) },
    { label: 'Description', value: displayValue(asset.assetDescription) },
    { label: 'Asset type', value: displayValue(asset.assetTypeLabel) },
    { label: 'Current location', value: displayValue(asset.location) },
    {
      label: 'Current custodian',
      value: asset.custodianName || custodianLabel(asset.custodianId),
    },
    { label: 'Serial no.', value: displayValue(asset.serialNumber) },
    { label: 'Asset cost', value: formatIndianAmountOrDash(asset.assetCost) },
    { label: 'Cost center', value: costCenterLabel(asset.costCenterId) },
  ]

  return (
    <OrgDataDisplay title="Asset details" items={items} columns={3} className="!rounded-lg" />
  )
}
