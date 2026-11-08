import { useCallback, useMemo, useRef } from 'react'
import { useRegisterDashboardPageHeaderActions } from '@/app/shell/context/DashboardPageHeaderActionsContext'
import ListPageHeaderActions from '@/shared/components/page/ListPageHeaderActions'
import { confirmExportAction, useActionConfirm } from '@/shared/components/confirm'

/** Registers shell page header: optional filter and export. Table search uses DataTable toolbar. */
export function useListPageHeaderActions(props) {
  const requestConfirm = useActionConfirm()
  const propsRef = useRef(props)
  propsRef.current = props

  const {
    filterLabel,
    filterValue,
    filterOptions,
    onFilterChange,
    onExport,
    exportLabel,
    enabled = true,
    confirmExport = true,
  } = props ?? {}

  const handleFilterChange = useCallback((value) => {
    propsRef.current?.onFilterChange?.(value)
  }, [])

  const handleExport = useCallback(() => {
    const run = propsRef.current?.onExport
    if (!run) return

    const shouldConfirm = propsRef.current?.confirmExport !== false
    if (!shouldConfirm) {
      run()
      return
    }

    confirmExportAction(requestConfirm, run, {
      validate: propsRef.current?.validateExport,
    })
  }, [requestConfirm])

  const hasFilterHandler = Boolean(onFilterChange)
  const hasExportHandler = Boolean(onExport)

  const actions = useMemo(() => {
    if (!enabled) return null
    return (
      <ListPageHeaderActions
        filterLabel={filterLabel}
        filterValue={filterValue}
        filterOptions={filterOptions}
        onFilterChange={hasFilterHandler ? handleFilterChange : undefined}
        onExport={hasExportHandler ? handleExport : undefined}
        exportLabel={exportLabel}
      />
    )
  }, [
    enabled,
    filterLabel,
    filterValue,
    filterOptions,
    hasFilterHandler,
    handleFilterChange,
    hasExportHandler,
    handleExport,
    exportLabel,
  ])

  useRegisterDashboardPageHeaderActions(actions)
}
