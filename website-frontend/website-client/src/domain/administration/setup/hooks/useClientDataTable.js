import { useEffect, useMemo, useState } from 'react'

function rowSearchBlob(row, searchFields) {
  return searchFields.map((field) => String(row?.[field] ?? '')).join(' ').toLowerCase()
}

function rowPrimaryKey(row) {
  const raw = row?.id ?? row?.costId ?? row?.cost_id
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : 0
}

function compareNewestFirst(a, b) {
  return rowPrimaryKey(b) - rowPrimaryKey(a)
}

function compareForSort(a, b, sortBy, sortDir) {
  const dir = sortDir === 'desc' ? -1 : 1
  let av = a?.[sortBy]
  let bv = b?.[sortBy]
  if (sortBy === 'allocatedCount') {
    av = Number(av) || 0
    bv = Number(bv) || 0
  } else {
    av = String(av ?? '').toLowerCase()
    bv = String(bv ?? '').toLowerCase()
  }
  if (av < bv) return -1 * dir
  if (av > bv) return 1 * dir
  return 0
}

/**
 * Client-side search, sort, and pagination for setup DataTable (full list already loaded).
 */
export function useClientDataTable(allRows, { searchFields = [], defaultPageSize = 10 } = {}) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [sort, setSort] = useState({ sortBy: null, sortDir: 'asc' })

  const filteredSorted = useMemo(() => {
    let rows = Array.isArray(allRows) ? allRows : []
    const query = search.trim().toLowerCase()
    if (query && searchFields.length) {
      rows = rows.filter((row) => rowSearchBlob(row, searchFields).includes(query))
    }
    if (sort.sortBy) {
      rows = [...rows].sort((a, b) => compareForSort(a, b, sort.sortBy, sort.sortDir))
    } else {
      rows = [...rows].sort(compareNewestFirst)
    }
    return rows
  }, [allRows, search, searchFields, sort.sortBy, sort.sortDir])

  const total = filteredSorted.length

  const rows = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredSorted.slice(start, start + pageSize)
  }, [filteredSorted, page, pageSize])

  useEffect(() => {
    setPage(1)
  }, [search, pageSize, sort.sortBy, sort.sortDir])

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(total / pageSize) || 1)
    if (page > maxPage) {
      setPage(maxPage)
    }
  }, [page, pageSize, total])

  return {
    rows,
    total,
    search,
    setSearch,
    page,
    setPage,
    pageSize,
    setPageSize,
    sort,
    setSort,
  }
}
