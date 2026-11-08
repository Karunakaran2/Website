import { FormModal, OrgDataDisplay } from '@/shared/components'
import { PORTAL_MODAL_TITLE_CLASS } from '@/shared/components/modals/modalChrome'
import { activeInactiveLabelFromRow, yesNoLabel } from '@/shared/components/status/statusLabels'

function numberingGroupDisplay(row) {
  const name = String(row?.numberingGroupName ?? '').trim()
  if (name) {
    return name
  }
  const idOnly = String(row?.assetNumber ?? row?.numberingGroupId ?? '').trim()
  if (idOnly && /^\d+$/.test(idOnly)) {
    return `Numbering ${idOnly}`
  }
  return idOnly || '—'
}

function displayValue(value) {
  if (value == null || value === '' || value === '--') {
    return '—'
  }
  return value
}

export default function FaGroupViewModal({ open, row, onClose }) {
  if (!row) {
    return null
  }

  const assetDetailItems = [
    { label: 'Asset Type', value: displayValue(row.assetType), required: true },
    { label: 'Asset Class (IT)', value: displayValue(row.assetClassLabel), required: true },
    { label: 'Numbering Group', value: numberingGroupDisplay(row) },
    { label: 'Depreciable', value: yesNoLabel(row.depreciable), required: true },
    { label: 'Depreciation Rate (IT)', value: displayValue(row.depreciationRateIt) },
    { label: 'Depreciation Method', value: displayValue(row.depreciationMethodLabel) },
    { label: 'Active Status', value: activeInactiveLabelFromRow(row) },
  ]

  const glAccountItems = [
    { label: 'Asset Account', value: displayValue(row.assetAccount) },
    { label: 'Depreciation Account', value: displayValue(row.depreciationAccount) },
    { label: 'Accumulated Depreciation', value: displayValue(row.cumDepreciationAccount) },
    { label: 'CWIP Account', value: displayValue(row.cwipAccount) },
  ]

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="View FA Group"
      titleClassName={PORTAL_MODAL_TITLE_CLASS}
      size="4xl"
      bodyMaxHeightClass="max-h-[80vh]"
      showFooter={false}
    >
      <div className="space-y-4">
        <OrgDataDisplay title="Asset Details" items={assetDetailItems} columns={3} />
        <OrgDataDisplay title="GL Accounts" items={glAccountItems} columns={2} />
      </div>
    </FormModal>
  )
}
