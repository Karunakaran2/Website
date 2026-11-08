/**
 * Party columns for asset approval workflow lists (received / forwarded / approved tab).
 * @param {string} workflowTab - 'received' | 'forwarded' | 'approved'
 * @returns {import('@/shared/components').DataTableColumn[]}
 */
export function assetApprovalWorkflowPartyColumns(workflowTab) {
  if (workflowTab === 'forwarded') {
    return [
      { id: 'forwardedTo', header: 'Forwarded To', accessor: 'forwardedTo', sortable: false },
      {
        id: 'forwardedOn',
        header: 'Forwarded On Date',
        accessor: 'forwardedOnDisplay',
        sortable: false,
      },
    ]
  }
  if (workflowTab === 'approved') {
    return [
      { id: 'approvedBy', header: 'Approved By', accessor: 'approvedBy', sortable: false },
      {
        id: 'approvedOn',
        header: 'Approved On',
        accessor: 'approvedOnDisplay',
        sortable: false,
      },
    ]
  }
  return [
    { id: 'receivedFrom', header: 'Received from', accessor: 'receivedFrom', sortable: false },
    {
      id: 'receivedOn',
      header: 'Received On',
      accessor: 'receivedOnDisplay',
      sortable: false,
    },
  ]
}
