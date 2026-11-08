import { useMemo, useState } from 'react'
import { PortalModalShell } from '@/shared/components'
import { Building2, Layers } from 'lucide-react'
import { TABLE_ROW_ACTIONS_CLASS, TableActiveStatusAction } from '@/shared/components/buttons'
import { isSetupRowActive } from '@/shared/components/status/statusLabels'
import { FeaturedBasicSelect } from '@/shared/lib/tailwreck'
import { resolveSelectValue } from '@/shared/utils'
import { FormLabel } from '@/shared/components/forms'
import { tailwreckSelectTriggerClass } from '@/shared/components/forms/tailwreckFormShell'
import { confirmedActionFailure } from '@/shared/components/confirm/interpretActionResult'
import { useActionConfirm } from '@/shared/components/confirm'
import AllocationAllottedTable from '../components/AllocationAllottedTable'
import AllocationTargetTable from '../components/AllocationTargetTable'
import SetupLoadErrorAlert from '../components/SetupLoadErrorAlert'
import { SETUP_COLUMN_ACTIVE_STATUS } from '../constants/setupStatusColumns'
import { setupFormFieldClass } from '../constants/setupStyles'
import { buildLedgerAllocationSaveBody } from '../utils/allocationSaveBody'
import { formatSetupMutationError } from '../utils/setupApiError'
import { resolveSetupPublicId } from '../utils/setupRowId'
import {
  useGetHoaSetupListForCostCentreAllocationQuery,
  useGetHoaSetupListForOfficeAllocationQuery,
  useGetLedgerAllocationCostCentreListQuery,
  useGetLedgerAllocationListByCostCenterIdQuery,
  useGetLedgerAllocationListByOfficeIdQuery,
  useGetLedgerAllocationOfficeListQuery,
  useSaveSetupMutation,
  useUpdateSetupActiveStatusMutation,
} from '../services/setupApi'

function toList(response) {
  if (Array.isArray(response)) {
    return response
  }
  if (Array.isArray(response?.data)) {
    return response.data
  }
  return []
}

function toSelectValue(valueOrEvent) {
  const resolved = resolveSelectValue(valueOrEvent)
  if (resolved && typeof resolved === 'object' && 'value' in resolved) {
    return resolved.value ?? ''
  }
  return resolved ?? ''
}

function publicId(row, preferred) {
  return resolveSetupPublicId(row, { idField: preferred })
}

function resolveAllocationTargetPublicId(row, kind) {
  return resolveSetupPublicId(row, { idField: kind === 'office' ? 'officeId' : 'costCenterId' })
}

function isAllocationActive(row) {
  if (typeof row?.isActive === 'boolean') {
    return row.isActive
  }
  return row?.activeStatus !== 'N'
}

export default function LedgerAllocationScreen({ master }) {
  const requestConfirm = useActionConfirm()
  const [modalTarget, setModalTarget] = useState(null)
  const [selectedHoaId, setSelectedHoaId] = useState('')
  const [formError, setFormError] = useState('')

  const officeQuery = useGetLedgerAllocationOfficeListQuery()
  const costCentreQuery = useGetLedgerAllocationCostCentreListQuery()
  const [saveLedgerAllocation] = useSaveSetupMutation()
  const [updateActiveStatus] = useUpdateSetupActiveStatusMutation()

  const officeId = modalTarget?.kind === 'office' ? modalTarget.id : undefined
  const costCenterId = modalTarget?.kind === 'cost' ? modalTarget.id : undefined

  const officeHoaQuery = useGetHoaSetupListForOfficeAllocationQuery(officeId, { skip: !officeId })
  const costHoaQuery = useGetHoaSetupListForCostCentreAllocationQuery(costCenterId, { skip: !costCenterId })
  const officeAllocatedQuery = useGetLedgerAllocationListByOfficeIdQuery(officeId, { skip: !officeId })
  const costAllocatedQuery = useGetLedgerAllocationListByCostCenterIdQuery(costCenterId, { skip: !costCenterId })

  const offices = useMemo(() => toList(officeQuery.data), [officeQuery.data])
  const costCentres = useMemo(() => toList(costCentreQuery.data), [costCentreQuery.data])
  const hoaRows = useMemo(
    () => toList(officeId ? officeHoaQuery.data : costHoaQuery.data),
    [officeId, officeHoaQuery.data, costHoaQuery.data],
  )
  const hoaOptions = useMemo(() => [
    { value: '', label: '--Select ledger name--' },
    ...hoaRows.map((hoaSetup) => ({
      value: resolveSetupPublicId(hoaSetup, { idField: 'id' }),
      label: hoaSetup.hoaName || '',
    })).filter((option) => option.value),
  ], [hoaRows])
  const allottedRows = useMemo(
    () => toList(officeId ? officeAllocatedQuery.data : costAllocatedQuery.data),
    [officeId, officeAllocatedQuery.data, costAllocatedQuery.data],
  )

  const openOfficeModal = (row) => {
    const id = resolveAllocationTargetPublicId(row, 'office')
    if (!id) {
      return
    }
    setSelectedHoaId('')
    setFormError('')
    setModalTarget({ kind: 'office', id, name: row.officeName, targetRow: row })
  }

  const openCostModal = (row) => {
    const id = resolveAllocationTargetPublicId(row, 'cost')
    if (!id) {
      return
    }
    setSelectedHoaId('')
    setFormError('')
    setModalTarget({ kind: 'cost', id, name: row.costCenterName, targetRow: row })
  }

  const closeModal = () => {
    setModalTarget(null)
    setSelectedHoaId('')
    setFormError('')
    officeQuery.refetch()
    costCentreQuery.refetch()
  }

  const refreshModalLists = () => {
    if (officeId) {
      officeHoaQuery.refetch()
      officeAllocatedQuery.refetch()
    }
    if (costCenterId) {
      costHoaQuery.refetch()
      costAllocatedQuery.refetch()
    }
    officeQuery.refetch()
    costCentreQuery.refetch()
  }

  const handleAllocate = async (hoaId) => {
    if (!modalTarget) {
      return
    }
    if (!hoaId) {
      setFormError('Please select a ledger to allocate.')
      return
    }
    const runAllocate = async () => {
      setFormError('')
      const body = buildLedgerAllocationSaveBody(modalTarget, hoaId, hoaRows)
      if (!body) {
        const message = 'Unable to resolve ledger or office/cost unit. Refresh the page and try again.'
        setFormError(message)
        setSelectedHoaId('')
        return false
      }
      const result = await saveLedgerAllocation({
        resource: 'ledger-allocation',
        entityName: 'LedgerAllocation',
        body,
      })
      if (result.error) {
        const message = formatSetupMutationError(result.error, 'Unable to save ledger allocation')
        setFormError(message)
        setSelectedHoaId('')
        return confirmedActionFailure(message)
      }
      setSelectedHoaId('')
      refreshModalLists()
    }
    if (!requestConfirm) {
      await runAllocate()
      return
    }
    requestConfirm(runAllocate, {
      action: 'allocateLedger',
      stack: 'nested',
    })
  }

  const handleToggleActive = async (row) => {
    const id = publicId(row, 'idMask')
    if (!id) {
      return
    }
    const currentStatus = isAllocationActive(row) ? 'Y' : 'N'
    const runToggle = async () => {
      const result = await updateActiveStatus({
        resource: 'ledger-allocation',
        entityName: 'LedgerAllocation',
        id,
        activeStatus: currentStatus === 'Y' ? 'N' : 'Y',
      })
      if (result.error) {
        const message = formatSetupMutationError(result.error, 'Unable to update ledger allocation')
        setFormError(message)
        return confirmedActionFailure(message)
      }
      refreshModalLists()
    }
    if (!requestConfirm) {
      await runToggle()
      return
    }
    requestConfirm(runToggle, {
      action: currentStatus === 'Y' ? 'deactivate' : 'activate',
      recordLabel: row.hoaName,
      stack: 'nested',
    })
  }

  const allottedColumns = [
    {
      id: 'hoaName',
      header: 'Ledger Name',
      accessor: 'hoaName',
      sortable: true,
    },
    SETUP_COLUMN_ACTIVE_STATUS,
    {
      id: 'action',
      header: 'Action',
      cell: (row) => (
        <div className={`${TABLE_ROW_ACTIONS_CLASS} justify-start overflow-visible`}>
          <TableActiveStatusAction
            isActive={isSetupRowActive(row)}
            onActivate={() => handleToggleActive(row)}
            onDeactivate={() => handleToggleActive(row)}
            title={isSetupRowActive(row) ? 'Deactivate' : 'Activate'}
          />
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <SetupLoadErrorAlert error={officeQuery.error || costCentreQuery.error} />
      <div className="grid gap-4 xl:grid-cols-2">
        <AllocationTargetTable
          title="Offices"
          icon={Building2}
          nameHeader="Office Name"
          nameAccessor="officeName"
          countHeader="Number of allocated ledgers"
          allRows={offices}
          rowKey="officeId"
          loading={officeQuery.isFetching}
          onOpenRow={openOfficeModal}
          searchFields={['officeName']}
        />
        <AllocationTargetTable
          title="Cost Units"
          icon={Layers}
          nameHeader="Cost Unit Name"
          nameAccessor="costCenterName"
          countHeader="Number of allocated ledgers"
          allRows={costCentres}
          rowKey="costCenterId"
          loading={costCentreQuery.isFetching}
          onOpenRow={openCostModal}
          searchFields={['costCenterName']}
        />
      </div>

      <PortalModalShell
        isOpen={Boolean(modalTarget)}
        onClose={closeModal}
        title={modalTarget?.kind === 'office' ? 'Office wise ledger allocation' : 'Cost center wise ledger allocation'}
        size="lg"
      >
        <div className={`space-y-4 ${setupFormFieldClass}`}>
          {formError ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800" role="alert">
              {formError}
            </p>
          ) : null}
          <div>
            <FormLabel label="Ledger Name" required htmlFor="ledgerAllocationHoaId" />
            <FeaturedBasicSelect
              name="hoaId"
              options={hoaOptions}
              value={selectedHoaId}
              onChange={(value) => {
                const next = String(toSelectValue(value) || '')
                setSelectedHoaId(next)
                if (next) {
                  handleAllocate(next)
                }
              }}
              size="md"
              theme="primary"
              border="sm"
              className={tailwreckSelectTriggerClass}
            />
          </div>
          <AllocationAllottedTable
            columns={allottedColumns}
            allRows={allottedRows}
            rowKey="idMask"
            loading={officeId ? officeAllocatedQuery.isFetching : costAllocatedQuery.isFetching}
            searchFields={['hoaName']}
          />
        </div>
      </PortalModalShell>
    </div>
  )
}
