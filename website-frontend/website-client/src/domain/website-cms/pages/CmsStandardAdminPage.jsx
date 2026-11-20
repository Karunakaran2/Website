import { useCallback, useMemo, useState } from 'react'
import DataTable from '@/shared/components/DataTable'
import { DomainListWithFormModal } from '@/shared/components'
import DomainListPageHeaderActions from '@/shared/components/domain/DomainListPageHeaderActions'
import {
  ActionConfirmProvider,
  confirmBeforeAction,
  useActionConfirm,
} from '@/shared/components/confirm'
import { TableActiveStatusAction, TableEditAction, TableRowActionsGroup } from '@/shared/components/buttons'
import { isCmsRowActive, nextCmsActiveStatus } from '../utils/cmsRowActive'
import { showAppToast } from '@/shared/components'
import { dataTableActionColumn, dataTableColumn } from '@/shared/utils/buildDataTableColumn'
import { useDashboardRouteIds } from '@/app/shell/hooks/useDashboardRouteIds'
import { getKranAdminResourceConfig } from '../config/kranAdminResourceRegistry'
import { resolveKranAdminResourceKey } from '../constants/kranAdminNav'
import { CMS_ADMIN_HOOKS_BY_PRIMARY } from '../services/kranAdminApi'
import CmsGenericAdminForm from '../components/CmsGenericAdminForm'
import { useCmsFormPageHeaderBack } from '../hooks/useCmsFormPageHeaderBack.jsx'
import { useWebsiteAccess } from '@/domain/website-access/hooks/useWebsiteAccess'
import { cmsPrivilegesForResource } from '@/domain/website-access/constants/websitePrivileges'

function normalizeBody(values, fields) {
  const body = {}
  for (const field of fields) {
    const raw = values[field.id]
    if (raw === '' || raw === undefined || raw === null) {
      continue
    }
    if (field.type === 'number') {
      body[field.id] = Number(raw)
    } else if (typeof raw === 'string') {
      body[field.id] = raw.trim()
    } else {
      body[field.id] = raw
    }
  }
  return body
}

function CmsStandardAdminPageInner({ resourceKey }) {
  const config = getKranAdminResourceConfig(resourceKey)
  const hooks = CMS_ADMIN_HOOKS_BY_PRIMARY[resourceKey]
  const requestConfirm = useActionConfirm()
  const { can } = useWebsiteAccess()
  const resourcePrivileges = cmsPrivilegesForResource(resourceKey)
  const canView = can(resourcePrivileges.view)
  const canCreate = can(resourcePrivileges.create)
  const canEdit = can(resourcePrivileges.edit)

  const { data: rowData, isLoading, isError, refetch } = hooks.useList()
  const rows = Array.isArray(rowData) ? rowData : []
  const [createRow] = hooks.useCreate()
  const [updateRow] = hooks.useUpdate()
  const supportsActiveFlag = config.fields.some(
    (field) => field.id === 'activeStatus' || field.type === 'active',
  )

  const [formOpen, setFormOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [formSeed, setFormSeed] = useState(null)
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const defaultSeed = useMemo(
    () =>
      config.fields.reduce((acc, field) => {
        acc[field.id] = field.defaultValue ?? ''
        return acc
      }, {}),
    [config.fields],
  )

  const openCreate = useCallback(() => {
    setEditId(null)
    setFormSeed(defaultSeed)
    setFormOpen(true)
  }, [defaultSeed])

  const openEdit = useCallback(
    (row) => {
      setEditId(row.id)
      const seed = { ...defaultSeed }
      for (const field of config.fields) {
        seed[field.id] = row[field.id] ?? seed[field.id] ?? ''
      }
      setFormSeed(seed)
      setFormOpen(true)
    },
    [config.fields, defaultSeed],
  )

  const closeForm = useCallback(() => {
    setFormOpen(false)
    setEditId(null)
    setFormSeed(null)
  }, [])

  useCmsFormPageHeaderBack(formOpen, closeForm)

  const handleSave = useCallback(
    (values) => {
      confirmBeforeAction(requestConfirm, {
        action: editId ? 'update' : 'save',
        runAction: async () => {
          setSaving(true)
          const body = normalizeBody(values, config.fields)
          try {
            if (editId) {
              await updateRow({ id: editId, ...body }).unwrap()
              showAppToast({ variant: 'success', message: 'Updated successfully.' })
            } else {
              await createRow(body).unwrap()
              showAppToast({ variant: 'success', message: 'Saved successfully.' })
            }
            closeForm()
            refetch()
          } catch {
            showAppToast({ variant: 'error', message: 'Save failed. Check the API and try again.' })
          } finally {
            setSaving(false)
          }
        },
      })
    },
    [closeForm, config.fields, createRow, editId, refetch, requestConfirm, updateRow],
  )

  const handleToggleActive = useCallback(
    (row) => {
      const nextActive = !isCmsRowActive(row)
      confirmBeforeAction(requestConfirm, {
        action: nextActive ? 'activate' : 'deactivate',
        runAction: async () => {
          const values = {}
          for (const field of config.fields) {
            values[field.id] = row[field.id] ?? ''
          }
          values.activeStatus = nextCmsActiveStatus(row)
          const body = normalizeBody(values, config.fields)
          try {
            await updateRow({ id: row.id, ...body }).unwrap()
            showAppToast({
              variant: 'success',
              message: nextActive ? 'Record activated.' : 'Record deactivated.',
            })
            refetch()
          } catch {
            showAppToast({ variant: 'error', message: 'Could not update status.' })
          }
        },
      })
    },
    [config.fields, refetch, requestConfirm, updateRow],
  )

  const columns = useMemo(
    () => [
      ...config.columns.map((col) =>
        dataTableColumn({
          id: col.id,
          header: col.label,
          minWidth: col.minWidth,
          cell: (row) => String(row[col.id] ?? ''),
        }),
      ),
      ...(canEdit
        ? [
            dataTableActionColumn({
              cell: (row) => {
                const items = [
                  {
                    key: 'edit',
                    label: 'Edit',
                    render: () => <TableEditAction onClick={() => openEdit(row)} />,
                  },
                ]
                if (supportsActiveFlag) {
                  items.push({
                    key: 'active',
                    label: isCmsRowActive(row) ? 'Deactivate' : 'Activate',
                    render: () => (
                      <TableActiveStatusAction
                        isActive={isCmsRowActive(row)}
                        onActivate={() => handleToggleActive(row)}
                        onDeactivate={() => handleToggleActive(row)}
                      />
                    ),
                  })
                }
                return <TableRowActionsGroup items={items} />
              },
            }),
          ]
        : []),
    ],
    [canEdit, config.columns, handleToggleActive, openEdit, supportsActiveFlag],
  )

  const total = rows.length
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize
    return rows.slice(start, start + pageSize)
  }, [rows, page, pageSize])

  if (!canView) {
    return (
      <p className="text-sm text-rose-700" role="alert">
        You do not have permission to view this screen.
      </p>
    )
  }

  return (
    <DomainListWithFormModal
      formOpen={formOpen}
      onCloseForm={closeForm}
      formBackInPageHeader
      modalTitle={editId ? 'Edit record' : 'Add record'}
      form={
        formSeed ? (
          <CmsGenericAdminForm
            fields={config.fields}
            initialValues={formSeed}
            isEdit={Boolean(editId)}
            saving={saving}
            onCancel={closeForm}
            onSubmit={handleSave}
          />
        ) : null
      }
      list={
        <div className="space-y-4">
          {canCreate ? <DomainListPageHeaderActions onAdd={openCreate} label="Add new" /> : null}
          {isError ? (
            <p className="text-sm text-rose-700" role="alert">
              Could not load data from the website backend.{' '}
              <button
                type="button"
                className="font-medium text-[#01458e] underline"
                onClick={() => refetch()}
              >
                Retry
              </button>
            </p>
          ) : null}
          <DataTable
            rowKey="id"
            columns={columns}
            rows={pageRows}
            total={total}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setPage(1)
            }}
            pageSizeOptions={[5, 10, 20, 50]}
            loading={isLoading}
            emptyMessage="No records yet."
            enableColumnVisibility={false}
          />
        </div>
      }
    />
  )
}

export default function CmsStandardAdminPage() {
  const routeIds = useDashboardRouteIds()
  const primaryId = routeIds?.primaryId
  const secondaryId = routeIds?.secondaryId
  const resourceKey = resolveKranAdminResourceKey(primaryId, secondaryId)
  const config = resourceKey ? getKranAdminResourceConfig(resourceKey) : null
  const hooks = resourceKey ? CMS_ADMIN_HOOKS_BY_PRIMARY[resourceKey] : null

  if (!primaryId || !resourceKey || !config || !hooks) {
    return null
  }

  return (
    <ActionConfirmProvider>
      <CmsStandardAdminPageInner resourceKey={resourceKey} />
    </ActionConfirmProvider>
  )
}