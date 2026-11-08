import { useCallback, useEffect, useMemo, useState } from 'react'
import { subscribeTasksChanged } from '../tasks/services/taskServiceEvents'
import { useDashboardNav } from '@/app/shell/hooks/useDashboardNav'
import { module2PortalService } from '../services/module2PortalService'
import { hrmsService } from '../hrms/services/hrmsService'
import { taskService } from '../tasks/services/taskService'
import { workforceCaseService } from '../services/workforceCaseService'

function resolveDataset(primaryId, secondaryId) {
  if (primaryId === 'm2-attendance') return 'attendance'
  if (primaryId === 'm2-leave' && !['apply', 'pending'].includes(secondaryId)) return 'leave'
  if (primaryId === 'm2-collaboration') return 'collaboration'
  if (primaryId === 'm2-reports') return 'reports'
  if (primaryId === 'm2-config') return 'config'
  if (primaryId === 'm2-people' && ['designations', 'teams', 'reporting'].includes(secondaryId)) {
    return 'people-meta'
  }
  if (primaryId === 'm2-tasks' && ['all-tasks', 'team-tasks', 'calendar', 'projects'].includes(secondaryId)) {
    return 'tasks'
  }
  if (primaryId === 'm2-cases' && secondaryId !== 'queue') return 'cases'
  if (primaryId === 'm2-overview' && ['team', 'feed'].includes(secondaryId)) return 'activity'
  return 'generic'
}

export function useModule2PortalScreen() {
  const { activePrimaryId, activeSecondaryId } = useDashboardNav()
  const dataset = resolveDataset(activePrimaryId, activeSecondaryId)
  const [tick, setTick] = useState(0)

  const refresh = useCallback(() => setTick((n) => n + 1), [])

  useEffect(() => {
    if (dataset !== 'tasks') return undefined
    return subscribeTasksChanged(refresh)
  }, [dataset, refresh])

  const rows = useMemo(() => {
    void tick
    switch (dataset) {
      case 'attendance':
        return module2PortalService.getDataset('attendance')
      case 'leave':
        return module2PortalService.getDataset('leave')
      case 'collaboration':
        return module2PortalService.getDataset('collaboration')
      case 'reports':
        return module2PortalService.getDataset('reports')
      case 'config':
        return module2PortalService.getDataset('config')
      case 'people-meta':
        return hrmsService.getAll().map((e) => ({
          id: e.id,
          name: e.name,
          department: e.department,
          designation: e.designation,
          manager: e.department === 'Engineering' ? 'Rajesh Nair' : 'Siddharth Varma',
          team: `${e.department} Team`,
        }))
      case 'tasks':
        return taskService.getAll()
      case 'cases':
        return workforceCaseService.getAll()
      case 'activity':
        return module2PortalService.getDataset('collaboration')
      default:
        return taskService.getAll().slice(0, 6)
    }
  }, [dataset, tick])

  return {
    activePrimaryId,
    activeSecondaryId,
    dataset,
    rows,
    refresh,
    updatePortalRow: (name, id, patch) => {
      module2PortalService.updateRow(name, id, patch)
      refresh()
    },
  }
}
