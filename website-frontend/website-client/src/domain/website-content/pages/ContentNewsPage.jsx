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
import { fromDatetimeLocalValue, toDatetimeLocalValue } from '@/domain/website-cms/utils/cmsDateInput'
import { NEWS_ACTIVE_STATUS } from '../constants/newsRequest'
import ContentNewsForm from '../components/ContentNewsForm'
import {
  useCreateNewsMutation,
  useGetAdminNewsQuery,
  useUpdateNewsMutation,
} from '../services/contentApi'
import { useCmsFormPageHeaderBack } from '@/domain/website-cms/hooks/useCmsFormPageHeaderBack.jsx'

function ContentNewsPageInner() {
  const requestConfirm = useActionConfirm()
  const { data: rows = [], isLoading, isError, refetch } = useGetAdminNewsQuery()
  const [createNews] = useCreateNewsMutation()
  const [updateNews] = useUpdateNewsMutation()
  const [formOpen, setFormOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [formSeed, setFormSeed] = useState(null)
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const openCreate = useCallback(() => {
    setEditId(null)
    setFormSeed({
      title: '',
      newsDescription: '',
      publishDate: '',
      imagePath: '',
      newsLink: '',
      activeStatus: NEWS_ACTIVE_STATUS.YES,
    })
    setFormOpen(true)
  }, [])

  const openEdit = useCallback((row) => {
    setEditId(row.id)
    setFormSeed({
      title: row.title ?? '',
      newsDescription: row.newsDescription ?? '',
      publishDate: toDatetimeLocalValue(row.publishDate),
      imagePath: row.imagePath ?? '',
      newsLink: row.newsLink ?? '',
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
            title: values.title.trim(),
            newsDescription: values.newsDescription || undefined,
            publishDate: fromDatetimeLocalValue(values.publishDate),
            imagePath: values.imagePath || undefined,
            newsLink: values.newsLink || undefined,
            activeStatus: values.activeStatus,
          }
          try {
            if (editId) {
              await updateNews({ id: editId, ...body }).unwrap()
            } else {
              await createNews(body).unwrap()
            }
            showAppToast(editId ? 'News updated' : 'News saved', 'success', {
              action: editId ? 'update' : 'save',
            })
            closeForm()
            refetch()
          } catch {
            showAppToast('Could not save news', 'error')
          } finally {
            setSaving(false)
          }
        },
      })
    },
    [closeForm, createNews, editId, refetch, requestConfirm, updateNews],
  )

  const handleToggleActive = useCallback(
    (row) => {
      const nextActive = !isCmsRowActive(row)
      confirmBeforeAction(requestConfirm, {
        action: nextActive ? 'activate' : 'deactivate',
        runAction: async () => {
          try {
            await updateNews({
              id: row.id,
              title: row.title,
              newsDescription: row.newsDescription,
              publishDate: row.publishDate,
              imagePath: row.imagePath,
              newsLink: row.newsLink,
              activeStatus: nextCmsActiveStatus(row),
            }).unwrap()
            showAppToast(nextActive ? 'News activated' : 'News deactivated', 'success')
            if (editId === row.id) {
              closeForm()
            }
            refetch()
          } catch {
            showAppToast('Could not update news status', 'error')
          }
        },
      })
    },
    [closeForm, editId, refetch, requestConfirm, updateNews],
  )

  const columns = useMemo(
    () => [
      dataTableColumn({ id: 'id', header: 'ID', sortable: true, minWidth: 72 }),
      dataTableColumn({ id: 'title', sortable: true, minWidth: 200 }),
      dataTableColumn({
        id: 'publishDate',
        header: 'Published',
        minWidth: 160,
        cell: (row) => (row.publishDate ? new Date(row.publishDate).toLocaleString() : '—'),
      }),
      dataTableColumn({ id: 'activeStatus', header: 'Active', minWidth: 80 }),
      dataTableActionColumn({
        cell: (row) => (
          <TableRowActionsGroup
            items={[
              {
                key: 'edit',
                label: 'Edit',
                render: () => <TableEditAction onClick={() => openEdit(row)} title={`Edit news ${row.id}`} />,
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
      modalTitle={editId ? 'Edit news' : 'Add news'}
      form={
        formSeed ? (
          <ContentNewsForm
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
          <DomainListPageHeaderActions onAdd={openCreate} label="Add news" />
          {isError ? (
            <p className="text-sm text-rose-700" role="alert">
              Could not load news. Check that the gateway and content service are running.
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
            emptyMessage="No news articles yet. Use Add news to create one."
            enableColumnVisibility={false}
          />
        </div>
      }
    />
  )
}

export default function ContentNewsPage() {
  return (
    <ActionConfirmProvider>
      <ContentNewsPageInner />
    </ActionConfirmProvider>
  )
}