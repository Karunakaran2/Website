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
import { isCmsRowActive, nextCmsActiveStatus } from '@/domain/website-cms/utils/cmsRowActive'
import { showAppToast } from '@/shared/components'
import { dataTableActionColumn, dataTableColumn } from '@/shared/utils/buildDataTableColumn'
import { NEWS_ACTIVE_STATUS } from '../constants/newsRequest'
import ContentBannerForm from '../components/ContentBannerForm'
import {
  useCreateBannerMutation,
  useGetAdminBannersQuery,
  useUpdateBannerMutation,
} from '../services/contentApi'
import { useCmsFormPageHeaderBack } from '@/domain/website-cms/hooks/useCmsFormPageHeaderBack.jsx'

function ContentBannersPageInner() {
  const requestConfirm = useActionConfirm()
  const { data: rows = [], isLoading, isError, refetch } = useGetAdminBannersQuery()
  const [createBanner] = useCreateBannerMutation()
  const [updateBanner] = useUpdateBannerMutation()
  const [formOpen, setFormOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [formSeed, setFormSeed] = useState(null)
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const openCreate = useCallback(() => {
    setEditId(null)
    setFormSeed({
      heading: '',
      title: '',
      imagePath: '',
      link: '',
      orderNo: '',
      activeStatus: NEWS_ACTIVE_STATUS.YES,
    })
    setFormOpen(true)
  }, [])

  const openEdit = useCallback((row) => {
    setEditId(row.id)
    setFormSeed({
      heading: row.heading ?? '',
      title: row.title ?? '',
      imagePath: row.imagePath ?? '',
      link: row.link ?? '',
      orderNo: row.orderNo != null ? String(row.orderNo) : '',
      activeStatus: row.activeStatus ?? NEWS_ACTIVE_STATUS.YES,
    })
    setFormOpen(true)
  }, [])

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
          const body = {
            heading: values.heading || undefined,
            title: values.title.trim(),
            imagePath: values.imagePath || undefined,
            link: values.link || undefined,
            orderNo: values.orderNo ? Number(values.orderNo) : undefined,
            activeStatus: values.activeStatus,
          }
          try {
            if (editId) {
              await updateBanner({ id: editId, ...body }).unwrap()
            } else {
              await createBanner(body).unwrap()
            }
            showAppToast(editId ? 'Banner updated' : 'Banner saved', 'success', {
              action: editId ? 'update' : 'save',
            })
            closeForm()
            refetch()
          } catch {
            showAppToast('Could not save banner', 'error')
          } finally {
            setSaving(false)
          }
        },
      })
    },
    [closeForm, createBanner, editId, refetch, requestConfirm, updateBanner],
  )

  const handleToggleActive = useCallback(
    (row) => {
      const nextActive = !isCmsRowActive(row)
      confirmBeforeAction(requestConfirm, {
        action: nextActive ? 'activate' : 'deactivate',
        runAction: async () => {
          try {
            await updateBanner({
              id: row.id,
              title: row.title,
              heading: row.heading,
              label: row.label,
              orderNo: row.orderNo,
              imagePath: row.imagePath,
              bannerLink: row.bannerLink,
              activeStatus: nextCmsActiveStatus(row),
            }).unwrap()
            showAppToast(nextActive ? 'Banner activated' : 'Banner deactivated', 'success')
            if (editId === row.id) {
              closeForm()
            }
            refetch()
          } catch {
            showAppToast('Could not update banner status', 'error')
          }
        },
      })
    },
    [closeForm, editId, refetch, requestConfirm, updateBanner],
  )

  const columns = useMemo(
    () => [
      dataTableColumn({ id: 'id', header: 'ID', sortable: true, minWidth: 72 }),
      dataTableColumn({ id: 'title', sortable: true, minWidth: 160 }),
      dataTableColumn({ id: 'heading', minWidth: 140 }),
      dataTableColumn({ id: 'orderNo', header: 'Order', minWidth: 80 }),
      dataTableColumn({ id: 'activeStatus', header: 'Active', minWidth: 80 }),
      dataTableActionColumn({
        cell: (row) => (
          <TableRowActionsGroup
            items={[
              {
                key: 'edit',
                label: 'Edit',
                render: () => (
                  <TableEditAction onClick={() => openEdit(row)} title={`Edit banner ${row.id}`} />
                ),
              },
              {
                key: 'active',
                label: isCmsRowActive(row) ? 'Deactivate' : 'Activate',
                render: () => (
                  <TableActiveStatusAction
                    isActive={isCmsRowActive(row)}
                    onActivate={() => handleToggleActive(row)}
                    onDeactivate={() => handleToggleActive(row)}
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

  const total = rows.length
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize
    return rows.slice(start, start + pageSize)
  }, [rows, page, pageSize])

  return (
    <DomainListWithFormModal
      formOpen={formOpen}
      onCloseForm={closeForm}
      formBackInPageHeader
      modalTitle={editId ? 'Edit banner' : 'Add banner'}
      form={
        formSeed ? (
          <ContentBannerForm
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
          <DomainListPageHeaderActions onAdd={openCreate} label="Add banner" />
          {isError ? (
            <p className="text-sm text-rose-700" role="alert">
              Could not load banners. Check that the gateway and content service are running.
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
            emptyMessage="No banners yet. Use Add banner to create one."
            enableColumnVisibility={false}
          />
        </div>
      }
    />
  )
}

export default function ContentBannersPage() {
  return (
    <ActionConfirmProvider>
      <ContentBannersPageInner />
    </ActionConfirmProvider>
  )
}