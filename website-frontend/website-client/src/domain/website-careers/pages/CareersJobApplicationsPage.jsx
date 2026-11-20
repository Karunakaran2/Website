import { useMemo, useState } from 'react'
import DataTable from '@/shared/components/DataTable'
import { dataTableColumn } from '@/shared/utils/buildDataTableColumn'
import { ModuleSectionTitle } from '@/shared/components/typography'
import { PAGE_SECTION_BODY_CLASS, PAGE_SECTION_SHELL_CLASS } from '@/shared/components/page/pageHeaderStyles'
import {
  useGetAdminJobApplicationsQuery,
  useGetAdminSubmittedResumesQuery,
} from '@/domain/website-cms/services/kranAdminApi'

const APPLICATION_COLUMNS = [
  { id: 'id', label: 'ID', minWidth: 72 },
  { id: 'careerTitle', label: 'Role', minWidth: 160 },
  { id: 'name', label: 'Name', minWidth: 140 },
  { id: 'email', label: 'Email', minWidth: 180 },
  { id: 'mobile', label: 'Mobile', minWidth: 120 },
]

const RESUME_COLUMNS = [
  { id: 'id', label: 'ID', minWidth: 72 },
  { id: 'name', label: 'Name', minWidth: 140 },
  { id: 'email', label: 'Email', minWidth: 180 },
  { id: 'role', label: 'Role', minWidth: 120 },
  { id: 'exp', label: 'Experience', minWidth: 120 },
]

function useTableColumns(columnDefs) {
  return useMemo(
    () =>
      columnDefs.map((col) =>
        dataTableColumn({
          id: col.id,
          header: col.label,
          minWidth: col.minWidth,
          cell: (row) => String(row[col.id] ?? ''),
        }),
      ),
    [columnDefs],
  )
}

function AdminReadOnlyTable({ columns, rows, loading, isError, emptyMessage, errorMessage }) {
  const [page, setPage] = useState(1)
  const pageSize = 10
  const safeRows = Array.isArray(rows) ? rows : []
  const total = safeRows.length
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize
    return safeRows.slice(start, start + pageSize)
  }, [safeRows, page, pageSize])

  return (
    <div className="space-y-4">
      {isError ? (
        <p className="text-sm text-rose-700" role="alert">
          {errorMessage}
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
        loading={loading}
        emptyMessage={emptyMessage}
        enableColumnVisibility={false}
      />
    </div>
  )
}

export default function CareersJobApplicationsPage() {
  const { data: appData, isLoading: appsLoading, isError: appsError } = useGetAdminJobApplicationsQuery()
  const { data: resumeData, isLoading: resumesLoading, isError: resumesError } =
    useGetAdminSubmittedResumesQuery()
  const applications = Array.isArray(appData) ? appData : []
  const resumes = Array.isArray(resumeData) ? resumeData : []

  const appColumns = useTableColumns(APPLICATION_COLUMNS)
  const resumeColumns = useTableColumns(RESUME_COLUMNS)

  return (
    <section className={`${PAGE_SECTION_SHELL_CLASS} min-w-0 w-full space-y-8`}>
      <div className={PAGE_SECTION_BODY_CLASS}>
        <ModuleSectionTitle className="mb-3">Applications against vacancies</ModuleSectionTitle>
        <AdminReadOnlyTable
          columns={appColumns}
          rows={applications}
          loading={appsLoading}
          isError={appsError}
          emptyMessage="No job applications received yet."
          errorMessage="Could not load job applications."
        />
      </div>
      <div className={PAGE_SECTION_BODY_CLASS}>
        <ModuleSectionTitle className="mb-3">Submitted resumes (no vacancy)</ModuleSectionTitle>
        <AdminReadOnlyTable
          columns={resumeColumns}
          rows={resumes}
          loading={resumesLoading}
          isError={resumesError}
          emptyMessage="No general resume submissions yet."
          errorMessage="Could not load submitted resumes."
        />
      </div>
    </section>
  )
}