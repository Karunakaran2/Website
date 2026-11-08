import { useState } from 'react'
import { useProbityForm } from '@/shared/utils/useProbityForm'
import {
  ActionConfirmProvider,
  useActionConfirm,
  confirmBeforeAction,
} from '@/shared/components/confirm'
import DomainListWithFormModal from '@/shared/components/modals/ListWithFormModal'
import DomainListPageHeaderActions from '@/shared/components/domain/DomainListPageHeaderActions'
import DomainFormFooter from '@/shared/components/domain/DomainFormFooter'
import FormModal from '@/shared/components/modals/FormModal'
import DataTable from '@/shared/components/DataTable'
import { InputField } from '@/shared/components/forms'
import { TABLE_ACTION_COLUMN_CLASS } from '@/shared/components/listing/listingTableStyles'
import { TableRowActionsGroup, TableEditAction, TableDeleteAction } from '@/shared/components/buttons'
import { showAppToast } from '@/shared/components/toast/appToast'
import WorkbenchDemoSection from '../components/WorkbenchDemoSection'

const SEED = [
  { id: 'WB-01', name: 'Cost centre — Administration' },
  { id: 'WB-02', name: 'Cost centre — IT infrastructure' },
]

function InlineCrudDemo() {
  const requestConfirm = useActionConfirm()
  const [rows, setRows] = useState(SEED)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const { register, handleSubmit, reset, formState: { errors } } = useProbityForm({
    defaultValues: { name: '' },
  })

  const openAdd = () => {
    setEditingId(null)
    reset({ name: '' })
    setFormOpen(true)
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    reset({ name: row.name })
    setFormOpen(true)
  }

  const onSave = handleSubmit((values) => {
    confirmBeforeAction(requestConfirm, {
      action: editingId ? 'update' : 'save',
      stack: 'base',
      runAction: async () => {
        if (editingId) {
          setRows((prev) => prev.map((r) => (r.id === editingId ? { ...r, name: values.name } : r)))
        } else {
          setRows((prev) => [...prev, { id: `WB-${String(prev.length + 1).padStart(2, '0')}`, name: values.name }])
        }
        setFormOpen(false)
        showAppToast('Demo record saved (no API).', 'success', { action: 'save' })
      },
    })
  })

  const columns = [
    { id: 'id', header: 'Code', accessor: 'id', sortable: true },
    { id: 'name', header: 'Name', accessor: 'name', sortable: true },
    {
      id: 'actions',
      header: 'Action',
      headerClassName: TABLE_ACTION_COLUMN_CLASS,
      cellClassName: TABLE_ACTION_COLUMN_CLASS,
      cell: (row) => (
        <TableRowActionsGroup
          items={[
            { key: 'edit', label: 'Edit', render: () => <TableEditAction onClick={() => openEdit(row)} /> },
            {
              key: 'delete',
              label: 'Delete',
              render: () => (
                <TableDeleteAction
                  onClick={() =>
                    confirmBeforeAction(requestConfirm, {
                      action: 'delete',
                      runAction: async () => {
                        setRows((prev) => prev.filter((r) => r.id !== row.id))
                        showAppToast('Demo record removed.', 'success', { action: 'delete' })
                      },
                    })
                  }
                />
              ),
            },
          ]}
        />
      ),
    },
  ]

  return (
    <DomainListWithFormModal
      formOpen={formOpen}
      onCloseForm={() => setFormOpen(false)}
      modalTitle={editingId ? 'Edit cost centre' : 'Add cost centre'}
      list={
        <div className="space-y-4">
          <DomainListPageHeaderActions onAdd={openAdd} label="Add cost centre" />
          <DataTable
            rowKey="id"
            columns={columns}
            rows={rows}
            total={rows.length}
            page={1}
            pageSize={Math.max(rows.length, 5)}
            emptyMessage="No data available in table"
            enableColumnVisibility={false}
          />
        </div>
      }
      form={
        <form className="flex min-w-0 flex-col gap-4" noValidate onSubmit={onSave}>
          <InputField
            label="Name"
            required
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />
          <DomainFormFooter
            onCancel={() => setFormOpen(false)}
            submitLabel={editingId ? 'Update' : 'Save'}
          />
        </form>
      }
    />
  )
}

function ModalCrudDemo() {
  const requestConfirm = useActionConfirm()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  return (
    <>
      <DomainListPageHeaderActions onAdd={() => setOpen(true)} label="Open modal form" />
      <FormModal
        open={open}
        onClose={() => setOpen(false)}
        title="Add via FormModal"
        size="4xl"
        showFooter={false}
      >
        <form
          className="flex flex-col gap-4"
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            if (!name.trim()) return
            confirmBeforeAction(requestConfirm, {
              action: 'save',
              stack: 'nested',
              runAction: async () => {
                setOpen(false)
                setName('')
                showAppToast('Modal demo saved.', 'success', { action: 'save' })
              },
            })
          }}
        >
          <InputField label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <DomainFormFooter onCancel={() => setOpen(false)} submitLabel="Save" />
        </form>
      </FormModal>
    </>
  )
}

export default function DomainCrudPatternPage() {
  return (
    <ActionConfirmProvider>
      <div className="space-y-6 pb-12 w-full min-w-0">
        <WorkbenchDemoSection
          title="Domain list + form patterns"
          description="Production CRUD wiring: DomainListWithFormModal, DomainListPageHeaderActions, DomainFormFooter, and confirmBeforeAction. No backend calls — confirms and toasts only."
        />

        <WorkbenchDemoSection title="Inline list + form (default)">
          <InlineCrudDemo />
        </WorkbenchDemoSection>

        <WorkbenchDemoSection title="Classic FormModal variant">
          <ModalCrudDemo />
        </WorkbenchDemoSection>
      </div>
    </ActionConfirmProvider>
  )
}
