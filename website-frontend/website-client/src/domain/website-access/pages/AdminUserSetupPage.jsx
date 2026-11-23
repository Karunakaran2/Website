import { useCallback, useMemo, useState } from 'react'
import DataTable from '@/shared/components/DataTable'
import { DomainListWithFormModal } from '@/shared/components'
import DomainListPageHeaderActions from '@/shared/components/domain/DomainListPageHeaderActions'
import { ActionConfirmProvider, confirmBeforeAction, useActionConfirm } from '@/shared/components/confirm'
import { TableActiveStatusAction, TableEditAction, TableRowActionsGroup } from '@/shared/components/buttons'
import { showAppToast } from '@/shared/components'
import { apiErrorMessage } from '@/shared/api/apiError'
import { dataTableActionColumn, dataTableColumn } from '@/shared/utils/buildDataTableColumn'
import {
  useCreateAdminUserMutation,
  useListAdminRolesQuery,
  useListAdminUsersQuery,
  useListPrivilegeCatalogQuery,
  useUpdateAdminUserMutation,
} from '../services/accessApi'
import { useWebsiteAccess } from '../hooks/useWebsiteAccess'
import { useWebsiteListQueryOptions } from '../hooks/useWebsiteListQueryOptions'
import { CMS_ADMIN } from '../constants/websitePrivileges'
import { useCmsFormPageHeaderBack } from '@/domain/website-cms/hooks/useCmsFormPageHeaderBack.jsx'

const EMPTY_FORM = {
  username: '',
  displayName: '',
  password: '',
  active: true,
  systemAdmin: false,
  useCustomPrivileges: false,
  roleId: '',
  privilegeCodes: [],
}

function AdminUserForm({ initial, roles, privileges, isEdit, saving, onCancel, onSubmit }) {
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

  const handleSubmit = (event) => {
    event.preventDefault()
    const username = form.username.trim()
    if (!username) {
      return
    }
    const password = form.password.trim()
    if (!isEdit && password.length < 8) {
      showAppToast({ variant: 'error', message: 'Password must be at least 8 characters.' })
      return
    }
    onSubmit({
      username,
      displayName: form.displayName?.trim() || null,
      active: form.active,
      systemAdmin: form.systemAdmin,
      useCustomPrivileges: form.useCustomPrivileges,
      roleId: form.roleId || null,
      privilegeCodes: form.privilegeCodes,
      password: password || undefined,
    })
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm">
        Username
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
          disabled={isEdit}
        />
      </label>
      <label className="block text-sm">
        Display name
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          value={form.displayName}
          onChange={(e) => setForm({ ...form, displayName: e.target.value })}
        />
      </label>
      <label className="block text-sm">
        Password {isEdit ? '(leave blank to keep)' : ''}
        <input
          type="password"
          className="mt-1 w-full rounded border px-3 py-2"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required={!isEdit}
          minLength={isEdit ? 0 : 8}
        />
      </label>
      <label className="block text-sm">
        Role
        <select
          className="mt-1 w-full rounded border px-3 py-2"
          value={form.roleId}
          onChange={(e) => setForm({ ...form, roleId: e.target.value })}
        >
          <option value="">— Select role —</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name} ({role.code})
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => setForm({ ...form, active: e.target.checked })}
        />
        Active
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.systemAdmin}
          onChange={(e) => setForm({ ...form, systemAdmin: e.target.checked })}
        />
        System administrator (full access)
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.useCustomPrivileges}
          onChange={(e) => setForm({ ...form, useCustomPrivileges: e.target.checked })}
        />
        Custom privileges (override role)
      </label>
      {form.useCustomPrivileges ? (
        <div className="max-h-64 overflow-y-auto rounded border p-3 text-sm">
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
      ) : null}
      <div className="flex justify-end gap-2">
        <button type="button" className="rounded border px-4 py-2" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="rounded bg-[#01458e] px-4 py-2 text-white" disabled={saving}>
          {saving ? 'Saving…' : 'Save user'}
        </button>
      </div>
    </form>
  )
}

function AdminUserSetupPageInner() {
  const { can } = useWebsiteAccess()
  const canManage = can(CMS_ADMIN.USERS_MANAGE)
  const listQueryOptions = useWebsiteListQueryOptions(canManage)
  const requestConfirm = useActionConfirm()
  const { data: users = [], isLoading, refetch, isError } = useListAdminUsersQuery(undefined, listQueryOptions)
  const { data: roles = [] } = useListAdminRolesQuery(undefined, listQueryOptions)
  const { data: privileges = [] } = useListPrivilegeCatalogQuery(undefined, listQueryOptions)
  const [createUser] = useCreateAdminUserMutation()
  const [updateUser] = useUpdateAdminUserMutation()

  const [formOpen, setFormOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [formSeed, setFormSeed] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const openCreate = useCallback(() => {
    setEditId(null)
    setFormSeed({ ...EMPTY_FORM, privilegeCodes: [] })
    setFormOpen(true)
  }, [])

  const openEdit = useCallback((row) => {
    setEditId(row.id)
    setFormSeed({
      username: row.username,
      displayName: row.displayName || '',
      password: '',
      active: row.active,
      systemAdmin: row.systemAdmin,
      useCustomPrivileges: row.useCustomPrivileges,
      roleId: row.roleId || '',
      privilegeCodes: row.privilegeCodes || [],
    })
    setFormOpen(true)
  }, [])

  const closeForm = useCallback(() => {
    setFormOpen(false)
    setEditId(null)
  }, [])

  useCmsFormPageHeaderBack(formOpen, closeForm)

  const handleSave = useCallback(
    (values) => {
      confirmBeforeAction(requestConfirm, {
        action: editId ? 'update' : 'save',
        runAction: async () => {
          setSaving(true)
          try {
            if (editId) {
              await updateUser({ id: editId, ...values }).unwrap()
            } else {
              await createUser(values).unwrap()
            }
            showAppToast({ variant: 'success', message: 'User saved.' })
            closeForm()
            refetch()
          } catch (err) {
            showAppToast({
              variant: 'error',
              message: apiErrorMessage(err, 'Could not save user.'),
            })
          } finally {
            setSaving(false)
          }
        },
      })
    },
    [closeForm, createUser, editId, refetch, requestConfirm, updateUser],
  )

  const handleToggleActive = useCallback(
    (row, nextActive) => {
      confirmBeforeAction(requestConfirm, {
        action: nextActive ? 'activate' : 'deactivate',
        runAction: async () => {
          try {
            await updateUser({
              id: row.id,
              username: row.username,
              displayName: row.displayName,
              active: nextActive,
              systemAdmin: row.systemAdmin,
              useCustomPrivileges: row.useCustomPrivileges,
              roleId: row.roleId || null,
              privilegeCodes: row.privilegeCodes || [],
            }).unwrap()
            showAppToast({
              variant: 'success',
              message: nextActive ? 'User activated.' : 'User deactivated.',
            })
            refetch()
          } catch (err) {
            showAppToast({
              variant: 'error',
              message: apiErrorMessage(err, 'Could not update user status.'),
            })
          }
        },
      })
    },
    [refetch, requestConfirm, updateUser],
  )

  const columns = useMemo(
    () => [
      dataTableColumn({ id: 'username', header: 'Username', minWidth: 140 }),
      dataTableColumn({ id: 'displayName', header: 'Name', minWidth: 160 }),
      dataTableColumn({
        id: 'roleName',
        header: 'Role',
        minWidth: 140,
        cell: (row) => row.roleName || (row.systemAdmin ? 'System admin' : '—'),
      }),
      dataTableColumn({
        id: 'active',
        header: 'Active',
        minWidth: 80,
        cell: (row) => (row.active ? 'Yes' : 'No'),
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
              {
                key: 'active',
                label: row.active ? 'Deactivate' : 'Activate',
                render: () => (
                  <TableActiveStatusAction
                    isActive={row.active}
                    onActivate={() => handleToggleActive(row, true)}
                    onDeactivate={() => handleToggleActive(row, false)}
                  />
                ),
              },
            ]}
          />
        ),
      }),
    ],
    [handleToggleActive, openEdit],
  )

  if (!canManage) {
    return (
      <p className="text-sm text-rose-700" role="alert">
        You do not have permission to manage users. Ask a system administrator.
      </p>
    )
  }

  return (
    <DomainListWithFormModal
      formOpen={formOpen}
      onCloseForm={closeForm}
      formBackInPageHeader
      modalTitle={editId ? 'Edit user' : 'Create user'}
      form={
        <AdminUserForm
          initial={formSeed}
          roles={roles}
          privileges={privileges}
          isEdit={Boolean(editId)}
          saving={saving}
          onCancel={closeForm}
          onSubmit={handleSave}
        />
      }
      list={
        <div className="space-y-4">
          <DomainListPageHeaderActions onAdd={openCreate} label="Add user" />
          {isError ? (
            <p className="text-sm text-rose-700" role="alert">
              Could not load users. Restart auth-service after Flyway V003.
            </p>
          ) : null}
          <DataTable
            rowKey="id"
            columns={columns}
            rows={users}
            total={users.length}
            loading={isLoading}
            emptyMessage="No CMS users yet."
            enableColumnVisibility={false}
          />
        </div>
      }
    />
  )
}

export default function AdminUserSetupPage() {
  return (
    <ActionConfirmProvider>
      <AdminUserSetupPageInner />
    </ActionConfirmProvider>
  )
}