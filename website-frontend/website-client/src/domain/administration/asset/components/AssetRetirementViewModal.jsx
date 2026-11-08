import { useMemo } from 'react'
import { FormModal, OrgDataDisplay } from '@/shared/components'
import { PORTAL_MODAL_TITLE_CLASS } from '@/shared/components/modals/modalChrome'
import { formatRetirementMoney, retirementSalesValueLabel } from '../constants/assetRetirement'
import { formatAssetDisplayDate } from '../utils/assetDateFormat'

function displayValue(value) {
  if (value == null || value === '') {
    return '—'
  }
  return value
}

export default function AssetRetirementViewModal({ open, row, onClose }) {
  const title = row?.assetId
    ? `View Retirement — ${row.assetId}`
    : 'View Retirement'

  const items = useMemo(() => {
    if (!row) {
      return []
    }
    return [
      { label: 'Date', value: formatAssetDisplayDate(row.retirementDate) },
      { label: 'Asset Id', value: displayValue(row.assetId) },
      { label: 'Asset Description', value: displayValue(row.assetDescription) },
      { label: 'Book Value', value: formatRetirementMoney(row.bookValue) },
      { label: 'Retirement Type', value: displayValue(row.retirementType) },
      {
        label: retirementSalesValueLabel(row.retirementType),
        value: formatRetirementMoney(row.saleValue ?? row.salesValue),
      },
      { label: 'Customer', value: displayValue(row.customerName) },
      { label: 'Retirement Invoice', value: displayValue(row.retirementInvoice) },
      { label: 'Sales Invoice', value: displayValue(row.salesInvoice) },
      { label: 'Count Number', value: displayValue(row.countDisposalNumber) },
      { label: 'Gain / Loss', value: formatRetirementMoney(row.gainOrLoss) },
      { label: 'Status', value: displayValue(row.status === 'A' ? 'Approved' : row.status === 'N' ? 'Pending' : row.status) },
    ]
  }, [row])

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={title}
      titleClassName={PORTAL_MODAL_TITLE_CLASS}
      size="xl"
      bodyMaxHeightClass="max-h-[80vh]"
      showFooter={false}
    >
      {row ? (
        <OrgDataDisplay title="Retirement details" items={items} columns={3} />
      ) : null}
    </FormModal>
  )
}
