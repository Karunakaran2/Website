import { PortalModalShell } from '@/shared/components'
import SetupDetailsSkeleton from './SetupDetailsSkeleton'
import { isSetupDetailsLoading } from '../utils/setupEditFormLoading'
import { maskPartyBankAccountNumber, setupListCellText } from '../utils/partySetupDisplay'
import { partyDetailModalTitle, PARTY_DETAIL_KIND } from '../utils/partySetupDetailColumns'
import { useGetClientDetailsByIdQuery } from '../services/setupApi'

function DetailTable({ columns, rows, emptyMessage }) {
  if (!rows.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-10 text-center text-sm text-slate-500">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((row, index) => (
            <tr key={row.id ?? index}>
              {columns.map((column) => (
                <td key={column.id} className="whitespace-nowrap px-4 py-3 text-slate-700">
                  {column.cell(row, index)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function renderDetailContent(kind, party) {
  if (!party) {
    return null
  }

  if (kind === PARTY_DETAIL_KIND.ITEM_SERVICE) {
    const entries = party.itemServiceEntries || []
    return (
      <DetailTable
        columns={[{
          id: 'serviceType',
          header: 'Item/ Service Name',
          cell: (row) => setupListCellText(row.serviceType),
        }]}
        rows={entries}
        emptyMessage="No item/service details available."
      />
    )
  }

  if (kind === PARTY_DETAIL_KIND.LEDGER) {
    const entries = party.ledgerEntries || []
    return (
      <DetailTable
        columns={[{
          id: 'hoaName',
          header: 'Ledger Name',
          cell: (row) => setupListCellText(row.hoaName),
        }]}
        rows={entries}
        emptyMessage="No party ledger details available."
      />
    )
  }

  if (kind === PARTY_DETAIL_KIND.ADDRESS) {
    const entries = party.addressEntries || []
    return (
      <DetailTable
        columns={[
          { id: 'index', header: '#', cell: (_row, index) => index + 1 },
          { id: 'gstin', header: 'GSTIN', cell: (row) => setupListCellText(row.gstin) },
          { id: 'buildingName', header: 'Building Name', cell: (row) => setupListCellText(row.buildingName) },
          { id: 'firstLocation', header: 'Location', cell: (row) => setupListCellText(row.firstLocation) },
          { id: 'city', header: 'City', cell: (row) => setupListCellText(row.city) },
          { id: 'state', header: 'State', cell: (row) => setupListCellText(row.state) },
          { id: 'pincode', header: 'Pincode', cell: (row) => setupListCellText(row.pincode) },
          { id: 'phoneNo', header: 'Phone No.', cell: (row) => setupListCellText(row.phoneNo) },
          { id: 'mailId', header: 'Mail Id', cell: (row) => setupListCellText(row.mailId) },
          {
            id: 'authorizedPersonName',
            header: 'Authorized Person Name',
            cell: (row) => setupListCellText(row.authorizedPersonName),
          },
          {
            id: 'authorizedPersonDesignation',
            header: 'Authorized Person Designation',
            cell: (row) => setupListCellText(row.authorizedPersonDesignation),
          },
        ]}
        rows={entries}
        emptyMessage="No address details available."
      />
    )
  }

  if (kind === PARTY_DETAIL_KIND.BANK) {
    const entries = party.bankAccountEntries || []
    return (
      <DetailTable
        columns={[
          { id: 'bankName', header: 'Bank Name', cell: (row) => setupListCellText(row.bankName) },
          {
            id: 'accountNumber',
            header: 'Account Number',
            cell: (row) => maskPartyBankAccountNumber(row.accountNumber),
          },
          { id: 'accountName', header: 'Account Name', cell: (row) => setupListCellText(row.accountName) },
          { id: 'ifscCode', header: 'IFSC Code', cell: (row) => setupListCellText(row.ifscCode) },
        ]}
        rows={entries}
        emptyMessage="No bank details available."
      />
    )
  }

  return null
}

export default function PartySetupDetailsModal({
  partyId,
  kind,
  onClose,
  stack = 'base',
}) {
  const {
    data: party,
    isFetching,
    error,
  } = useGetClientDetailsByIdQuery(partyId, {
    skip: !partyId || !kind,
  })

  const loading = isSetupDetailsLoading({
    openId: partyId,
    isFetching,
    data: party,
    error,
  })

  return (
    <PortalModalShell
      isOpen={Boolean(partyId && kind)}
      onClose={onClose}
      title={partyDetailModalTitle(kind, party?.partyName)}
      size={kind === PARTY_DETAIL_KIND.ADDRESS ? '5xl' : '2xl'}
      stack={stack}
      footer={null}
    >
      {loading ? <SetupDetailsSkeleton sectionCount={1} fieldsPerSection={4} /> : null}
      {!isFetching && error ? (
        <p
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800"
          role="alert"
        >
          Unable to load details.
        </p>
      ) : null}
      {!loading && !error ? renderDetailContent(kind, party) : null}
    </PortalModalShell>
  )
}
