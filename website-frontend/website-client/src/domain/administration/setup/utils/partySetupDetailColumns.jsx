import SetupDetailsLinkButton from '../components/SetupDetailsLinkButton'
import { resolveSetupPublicId } from './setupRowId'

export const PARTY_DETAIL_KIND = {
  ITEM_SERVICE: 'itemService',
  LEDGER: 'ledger',
  ADDRESS: 'address',
  BANK: 'bank',
}

const PARTY_DETAIL_HEADERS = {
  [PARTY_DETAIL_KIND.ITEM_SERVICE]: 'Item/ Service Type Details',
  [PARTY_DETAIL_KIND.LEDGER]: 'Party Ledger Details',
  [PARTY_DETAIL_KIND.ADDRESS]: 'Address Details',
  [PARTY_DETAIL_KIND.BANK]: 'Bank Details',
}

export const PARTY_ADD_NEW_DETAIL_KINDS = [
  PARTY_DETAIL_KIND.ITEM_SERVICE,
  PARTY_DETAIL_KIND.LEDGER,
  PARTY_DETAIL_KIND.ADDRESS,
  PARTY_DETAIL_KIND.BANK,
]

export const PARTY_CUSTOM_LEDGER_DETAIL_KINDS = [
  PARTY_DETAIL_KIND.LEDGER,
  PARTY_DETAIL_KIND.ADDRESS,
  PARTY_DETAIL_KIND.BANK,
]

/** Party list detail columns — text link (not row action view icon). */
export const PARTY_DETAIL_LINK_LABEL = 'Click to see details'

export function partyDetailModalTitle(kind, partyName) {
  const label = PARTY_DETAIL_HEADERS[kind] || 'Details'
  if (partyName?.trim()) {
    return `${label} — ${partyName.trim()}`
  }
  return label
}

export function createPartyDetailColumns({ master, kinds, onOpenDetails }) {
  return kinds.map((kind) => ({
    id: kind,
    header: PARTY_DETAIL_HEADERS[kind],
    sortable: false,
    cell: (row) => (
      <SetupDetailsLinkButton
        onClick={() => onOpenDetails(resolveSetupPublicId(row, master), kind)}
      >
        {PARTY_DETAIL_LINK_LABEL}
      </SetupDetailsLinkButton>
    ),
  }))
}
