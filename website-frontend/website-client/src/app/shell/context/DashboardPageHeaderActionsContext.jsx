import { createContext, useContext, useLayoutEffect, useState } from 'react'

const DashboardPageHeaderActionsStateContext = createContext(undefined)
const DashboardPageHeaderActionsSetContext = createContext(undefined)

export function DashboardPageHeaderActionsProvider({ children }) {
  const [actions, setActions] = useState(null)

  return (
    <DashboardPageHeaderActionsSetContext.Provider value={setActions}>
      <DashboardPageHeaderActionsStateContext.Provider value={actions}>
        {children}
      </DashboardPageHeaderActionsStateContext.Provider>
    </DashboardPageHeaderActionsSetContext.Provider>
  )
}

function useDashboardPageHeaderActionsSetContext() {
  const setActions = useContext(DashboardPageHeaderActionsSetContext)
  if (setActions === undefined) {
    throw new Error('DashboardPageHeaderActionsProvider is missing')
  }
  return setActions
}

/** Read registered page header actions (shell header only — avoids re-rendering registering pages). */
export function useDashboardPageHeaderActionsState() {
  const actions = useContext(DashboardPageHeaderActionsStateContext)
  useDashboardPageHeaderActionsSetContext()
  return { actions }
}

/** Mount page-level header actions (right side of PageSectionHeaderBar). Pass `null` to clear. */
export function useRegisterDashboardPageHeaderActions(actions) {
  const setActions = useDashboardPageHeaderActionsSetContext()
  useLayoutEffect(() => {
    setActions(actions ?? null)
    return () => setActions(null)
  }, [actions, setActions])
}
