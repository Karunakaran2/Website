import { useMemo } from 'react'
import { FormModal, OrgDataDisplay } from '@/shared/components'
import { PORTAL_MODAL_TITLE_CLASS } from '@/shared/components/modals/modalChrome'
import AssetMaintenancePurchaseJournalTable from './AssetMaintenancePurchaseJournalTable'
import {
  formatMaintenanceCost,
  maintenanceWorkflowLabel,
} from '../constants/assetMaintenance'
import { formatAssetDisplayDate } from '../utils/assetDateFormat'

function displayValue(value) {
  if (value == null || value === '') {
    return '—'
  }
  return value
}

export default function AssetMaintenanceViewModal({ open, row, loading = false, onClose }) {
  const title = row?.assetId
    ? `View Maintenance — ${row.assetId}`
    : 'View Maintenance'

  const items = useMemo(() => {
    if (!row) {
      return []
    }
    return [
      { label: 'Asset ID', value: displayValue(row.assetId) },
      { label: 'Asset Description', value: displayValue(row.assetDescription) },
      { label: 'Maintenance Description', value: displayValue(row.description) },
      { label: 'Maintenance Date', value: formatAssetDisplayDate(row.maintenanceDate) },
      { label: 'Vendor Name', value: displayValue(row.vendorName) },
      { label: 'Purchase Invoice', value: displayValue(row.purchaseInvoice ?? row.purchaseInvoiceIdMask) },
      { label: 'Cost', value: formatMaintenanceCost(row.cost) },
      {
        label: 'Workflow Status',
        value: maintenanceWorkflowLabel(row.approve, row.workflowStatus),
      },
      { label: 'Next Due Date', value: formatAssetDisplayDate(row.nextDueDate) },
    ]
  }, [row])

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={title}
      titleClassName={PORTAL_MODAL_TITLE_CLASS}
      size="4xl"
      bodyMaxHeightClass="max-h-[80vh]"
      showFooter={false}
    >
      <div className="space-y-4">
        {loading ? (
          <p className="text-[13px] text-slate-600">Loading maintenance details…</p>
        ) : (
          <>
            <OrgDataDisplay title="Maintenance Details" items={items} columns={3} />
            <AssetMaintenancePurchaseJournalTable
              purchaseInvoiceIdMask={row?.purchaseInvoiceIdMask}
            />
          </>
        )}
      </div>
    </FormModal>
  )
}
