import { Receipt } from 'lucide-react'
import { OrgDataDisplay } from '@/shared/components'
import SetupFormSection from './SetupFormSection'

function displayValue(value) {
  if (value == null || value === '') {
    return '—'
  }
  return value
}

/** Same labels as `OfficeSetupForm` gstAddressFields. */
function gstAddressEntryItems(entry) {
  return [
    {
      id: 'gstNumber',
      label: 'GSTIN',
      value: displayValue(entry.gstNumber),
      valueClassName: 'font-mono uppercase tracking-wide',
    },
    { id: 'buildingName', label: 'Building Name', value: displayValue(entry.buildingName) },
    { id: 'firstLocation', label: 'Location', value: displayValue(entry.firstLocation) },
    { id: 'city', label: 'City', value: displayValue(entry.city) },
    { id: 'state', label: 'State', value: displayValue(entry.state) },
    { id: 'pincode', label: 'Pincode', value: displayValue(entry.pincode) },
    { id: 'phoneNo', label: 'Phone No', value: displayValue(entry.phoneNo) },
    { id: 'mailId', label: 'Email', value: displayValue(entry.mailId) },
    {
      id: 'authorizedPersonName',
      label: 'Authorized Person Name',
      value: displayValue(entry.authorizedPersonName),
    },
    {
      id: 'authorizedPersonDesignation',
      label: 'Authorized Person Designation',
      value: displayValue(entry.authorizedPersonDesignation),
    },
  ]
}

function sectionTitle(entry, index, total) {
  if (entry.gstNumber) {
    return total > 1 ? `GST — ${entry.gstNumber}` : 'GST Registration'
  }
  return total > 1 ? `GST Registration ${index + 1}` : 'GST Registration'
}

/**
 * Read-only GST address blocks — Org UI profile sections + label/value grid.
 */
export default function SetupGstAddressDetailsView({ entries = [] }) {
  if (!entries.length) {
    return null
  }

  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <SetupFormSection
          key={entry.id ?? `gst-${index}`}
          title={sectionTitle(entry, index, entries.length)}
          icon={Receipt}
          bodyClassName="!p-0 sm:!p-0"
        >
          <OrgDataDisplay
            columns={3}
            items={gstAddressEntryItems(entry)}
            className="!rounded-none !border-0"
          />
        </SetupFormSection>
      ))}
    </div>
  )
}
