import { useMemo } from 'react'
import SetupDataTable from './SetupDataTable'
import ModuleInnerCard from '@/shared/layouts/ModuleInnerCard'
import SetupDetailsLinkButton from './SetupDetailsLinkButton'
import { useClientDataTable } from '../hooks/useClientDataTable'

/**
 * Office / cost-unit picker tables on ledger & user allocation pages (matches setup approval section chrome).
 */
export default function AllocationTargetTable({
  title,
  icon,
  nameHeader,
  nameAccessor,
  countHeader,
  allRows,
  rowKey,
  loading,
  onOpenRow,
  searchFields,
}) {
  const table = useClientDataTable(allRows, { searchFields })

  const columns = useMemo(
    () => [
      {
        id: nameAccessor,
        header: nameHeader,
        accessor: nameAccessor,
        format: 'text',
        sortable: true,
        cell: (row) => (
          <SetupDetailsLinkButton onClick={() => onOpenRow(row)}>
            {row[nameAccessor] || '-'}
          </SetupDetailsLinkButton>
        ),
      },
      {
        id: 'allocatedCount',
        header: countHeader,
        accessor: 'allocatedCount',
        format: 'plain',
        sortable: true,
        headerClassName: '!text-center',
        cellClassName: '!text-center',
      },
    ],
    [countHeader, nameAccessor, nameHeader, onOpenRow],
  )

  return (
    <ModuleInnerCard title={title} icon={icon}>
      <SetupDataTable
        columns={columns}
        rows={table.rows}
        rowKey={rowKey}
        search={table.search}
        onSearchChange={table.setSearch}
        page={table.page}
        pageSize={table.pageSize}
        total={table.total}
        onPageChange={table.setPage}
        onPageSizeChange={table.setPageSize}
        sort={table.sort}
        onSortChange={table.setSort}
        loading={loading}
        emptyMessage="No data available in table"
      />
    </ModuleInnerCard>
  )
}
