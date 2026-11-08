import { useCallback, useMemo, useState } from 'react'
import SampleModuleLayout from '../layouts/SampleModuleLayout'
import SampleRecordDetailModal from '../components/SampleRecordDetailModal'
import { useSampleModuleData } from '../hooks/useSampleModuleData'
import { formatINR } from '../utils/sampleModuleUtils'
import { buildApplicationApprovalRowActions } from '../utils/buildApplicationApprovalRowActions'
import StatusChip from '@/shared/components/status/StatusChip'
import DataTable from '@/shared/components/DataTable'
import TableRowActionsGroup from '@/shared/components/buttons/TableRowActionsGroup'
import { TableViewAction } from '@/shared/components/buttons'
import { dataTableActionColumn, dataTableColumn } from '@/shared/utils/buildDataTableColumn'
import { confirmBeforeAction } from '@/shared/components/confirm'
import { useActionConfirm } from '@/shared/components/confirm'
import { showAppToast } from '@/shared/components'
import { ActionConfirmProvider } from '@/shared/components/confirm'

export default function SampleApprovalsPage() {
  const requestConfirm = useActionConfirm()
  const {
    records,
    reviewApplication,
    openDetailModal,
    isDetailModalOpen,
    setIsDetailModalOpen,
    selectedRecord,
  } = useSampleModuleData()

  const queue = useMemo(
    () => records.filter((r) => ['Submitted', 'Under Review'].includes(r.applicationStatus)),
    [records],
  )

  const confirmReview = useCallback(
    (row, action, tone = 'primary') => {
      const labels = {
        approve: 'Approve application',
        reject: 'Reject application',
        return: 'Return for correction',
        startReview: 'Start review',
      }
      confirmBeforeAction(requestConfirm, {
        action,
        tone,
        title: labels[action] || 'Confirm',
        message: `${labels[action] || 'Proceed'} for "${row.title}"?`,
        runAction: async () => {
          reviewApplication(row.id, action)
          showAppToast('Application updated.', 'success', { action })
          return true
        },
      })
    },
    [requestConfirm, reviewApplication],
  )

  const columns = useMemo(
    () => [
      dataTableColumn({ id: 'code', header: 'Application No.', accessor: 'code', minWidth: 110 }),
      dataTableColumn({ id: 'title', header: 'Title', accessor: 'title', minWidth: 200 }),
      dataTableColumn({
        id: 'applicationStatus',
        header: 'Status',
        accessor: 'applicationStatus',
        align: 'center',
        cell: (row) => <StatusChip label={row.applicationStatus} />,
      }),
      dataTableColumn({
        id: 'amount',
        header: 'Amount',
        accessor: 'amount',
        align: 'right',
        cell: (row) => formatINR(row.amount),
      }),
      dataTableActionColumn({
        cell: (row) => {
          const canAct = ['Submitted', 'Under Review'].includes(row.applicationStatus)
          if (!canAct) {
            return (
              <TableViewAction
                onClick={() => openDetailModal(row)}
                ariaLabel={`View ${row.title}`}
              />
            )
          }
          return (
            <TableRowActionsGroup
              items={buildApplicationApprovalRowActions({
                row,
                onView: openDetailModal,
                onStartReview: (r) => confirmReview(r, 'startReview'),
                onApprove: (r) => confirmReview(r, 'approve', 'approve'),
                onReject: (r) => confirmReview(r, 'reject', 'danger'),
                onReturn: (r) => confirmReview(r, 'return'),
              })}
            />
          )
        },
      }),
    ],
    [confirmReview, openDetailModal],
  )

  return (
    <ActionConfirmProvider>
    <SampleModuleLayout>
      <DataTable
        columns={columns}
        rows={queue}
        rowKey="id"
        emptyMessage="No applications pending approval"
      />
      <SampleRecordDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        record={selectedRecord}
      />
    </SampleModuleLayout>
    </ActionConfirmProvider>
  )
}
