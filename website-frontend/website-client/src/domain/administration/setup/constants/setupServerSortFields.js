/**
 * Sort column order must match each controller's pagingRequest.setColumns(...) whitelist
 * in master-setup-service (DataTables column index → entity field name).
 */
export const SETUP_SERVER_SORT_FIELDS = {
  'service-type-setup': [
    'category',
    'serviceType',
    'description',
    'natureName',
    'unitName',
    'salesPrice',
    'salesAccountLedger',
    'purchasePrice',
    'purchaseAccountLedger',
    'gstRate',
    'tdsType',
    'tdsRate',
    'tcsType',
    'tcsRate',
    'itemType',
  ],
  'company-setup': ['companyName', 'mailId', 'gstNumber', 'panNumber', 'contactNumber'],
  'office-setup': ['officeName', 'emailId', 'gstNumber', 'contactNumber'],
  'dfpr-setup': ['fromAmount', 'toAmount', 'designationName'],
  'account-setup': ['accountName', 'groupParentName'],
  'hoa-setup': ['hoaName'],
  'bank-account-setup': ['accountName', 'accountNumber', 'ifscNo', 'panNo', 'gstinNo'],
  'cash-setup': ['cashType', 'pettyCashCodeOrCashCode', 'description', 'isDefault'],
  'client-details': ['partyType', 'partyName', 'panNo'],
  'cost-centre': ['costCentreName', 'parentName', 'costParentName'],
  'numbering-setup': ['setupName', 'prefix', 'suffix', 'voucherId'],
  'own-tax-info': ['gstin', 'tdsType', 'gstAddress', 'companyId'],
  'ledger-allocation': ['allocatedFor', 'hoaId', 'officeId', 'costCenterId'],
  'user-allocation': ['allocatedFor', 'seatUserId', 'officeId', 'costCenterId'],
  'opening-balance': ['hoaName', 'creditOrDebit'],
  'sub-ledger-opening-balance': ['partyType', 'partyName', 'documentNumber', 'hoaName'],
  'financial-year-setup': ['exceptionalUser'],
  'tally-port': ['tallyName', 'mappingType', 'mappedAccountName', 'importStatus'],
}

export function resolveSetupServerSortFields(resource, master) {
  if (master?.serverSortFields?.length) {
    return master.serverSortFields
  }
  return SETUP_SERVER_SORT_FIELDS[resource] ?? []
}
