import { useCallback, useMemo, useState } from 'react'
import DataTable from '@/shared/components/DataTable'
import { DomainListWithFormModal } from '@/shared/components'
import DomainListPageHeaderActions from '@/shared/components/domain/DomainListPageHeaderActions'
import { ActionConfirmProvider, confirmBeforeAction, useActionConfirm } from '@/shared/components/confirm'
import { TableEditAction, TableRowActionsGroup } from '@/shared/components/buttons'
import { showAppToast } from '@/shared/components'
import { dataTableActionColumn, dataTableColumn } from '@/shared/utils/buildDataTableColumn'
import {
  useCreateAdminRoleMutation,
  useListAdminRolesQuery,
  useListPrivilegeCatalogQuery,
  useUpdateAdminRoleMutation,
} from '../services/accessApi'
import { useWebsiteAccess } from '../hooks/useWebsiteAccess'
import { useWebsiteListQueryOptions } from '../hooks/useWebsiteListQueryOptions'
import { CMS_ADMIN } from '../constants/websitePrivileges'
import { useCmsFormPageHeaderBack } from '@/domain/website-cms/hooks/useCmsFormPageHeaderBack.jsx'

function AdminRoleForm({ initial, privileges, isBuiltIn, saving, onCancel, onSubmit }) {
  const [form, setForm] = useState(initial)

  const groupedPrivileges = useMemo(() => {
    const groups = {}
    for (const item of privileges) {
      const key = item.moduleKey || 'other'
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(item)
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [privileges])

  const togglePrivilege = (code) => {
    setForm((prev) => {
      const set = new Set(prev.privilegeCodes)
      if (set.has(code)) {
        set.delete(code)
      } else {
        set.add(code)
      }
      return { ...prev, privilegeCodes: [...set] }
    })
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(form)
      }}
    >
      <label className="block text-sm">
        Code
        <input
          className="mt-1 w-full rounded border px-3 py-2 uppercase"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          required
          disabled={isBuiltIn}
        />
      </label>
      <label className="block text-sm">
        Name
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </label>
      <label className="block text-sm">
        Description
        <textarea
          className="mt-1 w-full rounded border px-3 py-2"
          rows={2}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </label>
      <div className="max-h-72 overflow-y-auto rounded border p-3 text-sm">
        {groupedPrivileges.map(([moduleKey, items]) => (
          <div key={moduleKey} className="mb-3">
            <p className="mb-1 font-medium capitalize">{moduleKey.replace(/_/g, ' ')}</p>
            <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
              {items.map((priv) => (
                <label key={priv.code} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.privilegeCodes.includes(priv.code)}
                    onChange={() => togglePrivilege(priv.code)}
                  />
                  {priv.name}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" className="rounded border px-4 py-2" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="rounded bg-[#01458e] px-4 py-2 text-white" disabled={saving}>
          {saving ? 'Saving…' : 'Save role'}
        </button>
      </div>
    </form>
  )
}

function AdminRoleSetupPageInner() {
  const { can } = useWebsiteAccess()
  const canManage = can(CMS_ADMIN.ROLES_MANAGE)
  const listQueryOptions = useWebsiteListQueryOptions(canManage)
  const requestConfirm = useActionConfirm()
  const { data: roles = [], isLoading, refetch } = useListAdminRolesQuery(undefined, listQueryOptions)
  const { data: privileges = [] } = useListPrivilegeCatalogQuery(undefined, listQueryOptions)
  const [createRole] = useCreateAdminRoleMutation()
  const [updateRole] = useUpdateAdminRoleMutation()

  const [formOpen, setFormOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [formSeed, setFormSeed] = useState({ code: '', name: '', description: '', privilegeCodes: [] })
  const [saving, setSaving] = useState(false)

  const openCreate = useCallback(() => {
    setEditRow(null)
    setFormSeed({ code: '', name: '', description: '', privilegeCodes: [] })
    setFormOpen(true)
  }, [])

  const openEdit = useCallback((row) => {
    setEditRow(row)
    setFormSeed({
      code: row.code,
      name: row.name,
      description: row.description || '',
      privilegeCodes: row.privilegeCodes || [],
    })
    setFormOpen(true)
  }, [])

  const closeForm = useCallback(() => setFormOpen(false), [])

  useCmsFormPageHeaderBack(formOpen, closeForm)

  const handleSave = useCallback(
    (values) => {
      confirmBeforeAction(requestConfirm, {
        action: editRow ? 'update' : 'save',
        runAction: async () => {
          setSaving(true)
          try {
            if (editRow) {
              await updateRole({ id: editRow.id, ...values }).unwrap()
            } else {
              await createRole(values).unwrap()
            }
            showAppToast({ variant: 'success', message: 'Role saved.' })
            closeForm()
            refetch()
          } catch {
            showAppToast({ variant: 'error', message: 'Could not save role.' })
          } finally {
            setSaving(false)
          }
        },
      })
    },
    [closeForm, createRole, editRow, refetch, requestConfirm, updateRole],
  )

  const columns = useMemo(
    () => [
      dataTableColumn({ id: 'code', header: 'Code', minWidth: 120 }),
      dataTableColumn({ id: 'name', header: 'Role', minWidth: 160 }),
      dataTableColumn({
        id: 'privilegeCount',
        header: 'Privileges',
        minWidth: 100,
        cell: (row) => String((row.privilegeCodes || []).length),
      }),
      dataTableActionColumn({
        cell: (row) => (
          <TableRowActionsGroup
            items={[
              {
                key: 'edit',
                label: 'Edit',
                render: () => <TableEditAction onClick={() => openEdit(row)} />,
              },
            ]}
          />
        ),
      }),
    ],
    [openEdit],
  )

  if (!canManage) {
    return (
      <p className="text-sm text-rose-700" role="alert">
        You do not have permission to manage roles.
      </p>
    )
  }

  return (
    <DomainListWithFormModal
      formOpen={formOpen}
      onCloseForm={closeForm}
      formBackInPageHeader
      modalTitle={editRow ? 'Edit role' : 'Create role'}
      form={
        <AdminRoleForm
          key={editRow?.id || 'new'}
          initial={formSeed}
          privileges={privileges}
          isBuiltIn={Boolean(editRow?.builtIn)}
          saving={saving}
          onCancel={closeForm}
          onSubmit={handleSave}
        />
      }
      list={
        <div className="space-y-4">
          <DomainListPageHeaderActions onAdd={openCreate} label="Add role" />
          <p className="text-sm text-slate-600">
            Built-in templates: Content creator, Content viewer (view/download only), HR manager, System
            administrator.
          </p>
          <DataTable
            rowKey="id"
            columns={columns}
            rows={roles}
            total={roles.length}
            loading={isLoading}
            emptyMessage="No roles defined."
            enableColumnVisibility={false}
          />
        </div>
      }
    />
  )
}

export default function AdminRoleSetupPage() {
  return (
    <ActionConfirmProvider>
      <AdminRoleSetupPageInner />
    </ActionConfirmProvider>
  )
}