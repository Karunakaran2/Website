import { useEffect, useState } from 'react'
import { confirmBeforeAction, confirmedActionFailure, useActionConfirm } from '@/shared/components/confirm'
import {
  useGetHiddenDashboardWidgetListQuery,
  useSaveDashboardWidgetConfigListMutation,
  useUpdateDashboardWidgetColorMutation,
  useUpdateDashboardWidgetStatusMutation,
} from '../services/dashboardApi'

const EMPTY_WIDGETS = []

function cloneWidgets(list = []) {
  return list.map((item) => ({ ...item }))
}

function sameWidgets(left = [], right = []) {
  if (left === right) {
    return true
  }
  if (left.length !== right.length) {
    return false
  }
  return left.every((item, index) => {
    const other = right[index]
    return (
      item.widgetKey === other.widgetKey &&
      item.color === other.color &&
      item.status === other.status
    )
  })
}

function widgetErrorMessage(error, fallback) {
  const data = error?.data
  if (typeof data === 'string' && data.trim()) return data
  if (data && typeof data === 'object' && typeof data.message === 'string' && data.message.trim()) {
    return data.message
  }
  if (typeof error?.message === 'string' && error.message.trim()) return error.message
  return fallback
}

function reorderList(list, activeKey, overKey) {
  const oldIndex = list.findIndex((item) => item.widgetKey === activeKey)
  const newIndex = list.findIndex((item) => item.widgetKey === overKey)
  if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
    return list
  }
  const next = [...list]
  const [moved] = next.splice(oldIndex, 1)
  next.splice(newIndex, 0, moved)
  return next
}

export function useDashboardLayout({ cards = EMPTY_WIDGETS, charts = EMPTY_WIDGETS, refetch } = {}) {
  const requestConfirm = useActionConfirm()
  const [editMode, setEditMode] = useState(false)
  const [showHiddenPanel, setShowHiddenPanel] = useState(false)
  const [localCards, setLocalCards] = useState([])
  const [localCharts, setLocalCharts] = useState([])

  const {
    data: hiddenWidgets = EMPTY_WIDGETS,
    isFetching: isFetchingHidden,
    refetch: refetchHidden,
  } = useGetHiddenDashboardWidgetListQuery(undefined, {
    skip: !showHiddenPanel,
  })

  const [saveLayout, { isLoading: isSaving }] = useSaveDashboardWidgetConfigListMutation()
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateDashboardWidgetStatusMutation()
  const [updateColor, { isLoading: isUpdatingColor }] =
    useUpdateDashboardWidgetColorMutation()

  useEffect(() => {
    if (editMode) {
      return
    }
    setLocalCards((prev) => (sameWidgets(prev, cards) ? prev : cloneWidgets(cards)))
    setLocalCharts((prev) => (sameWidgets(prev, charts) ? prev : cloneWidgets(charts)))
  }, [cards, charts, editMode])

  const enterEditMode = () => {
    setLocalCards(cloneWidgets(cards))
    setLocalCharts(cloneWidgets(charts))
    setEditMode(true)
  }

  const exitEditModeAndSave = () => {
    const visiblePayload = [
      ...localCards.map((card, index) => ({
        widgetKey: card.widgetKey,
        widgetOrder: index + 1,
        status: 'Y',
      })),
      ...localCharts.map((chart, index) => ({
        widgetKey: chart.widgetKey,
        widgetOrder: index + 1,
        status: 'Y',
      })),
    ]

    confirmBeforeAction(requestConfirm, {
      action: 'save',
      stack: 'base',
      successMessage: 'Layout saved successfully.',
      runAction: async () => {
        const result = await saveLayout({ widgets: visiblePayload })
        if (result.error) {
          return confirmedActionFailure(widgetErrorMessage(result.error, 'Unable to save layout.'))
        }
        setEditMode(false)
        setShowHiddenPanel(false)
        refetch?.()
      },
    })
  }

  const toggleEditMode = () => {
    if (editMode) {
      exitEditModeAndSave()
      return
    }
    enterEditMode()
  }

  const refreshHiddenWidgets = () => {
    if (!showHiddenPanel) {
      return
    }
    refetchHidden()
  }

  const toggleHiddenPanel = () => {
    setShowHiddenPanel((prev) => !prev)
  }

  const hideWidget = (widgetKey) => {
    confirmBeforeAction(requestConfirm, {
      action: 'hide',
      stack: 'base',
      runAction: async () => {
        const result = await updateStatus({ widgetKey, status: 'N' })
        if (result.error) {
          return confirmedActionFailure(widgetErrorMessage(result.error, 'Unable to hide widget.'))
        }
        setLocalCards((prev) => prev.filter((item) => item.widgetKey !== widgetKey))
        setLocalCharts((prev) => prev.filter((item) => item.widgetKey !== widgetKey))
        refetch?.()
        refreshHiddenWidgets()
      },
    })
  }

  const restoreWidget = (widgetKey) => {
    confirmBeforeAction(requestConfirm, {
      action: 'restore',
      stack: 'base',
      runAction: async () => {
        const result = await updateStatus({ widgetKey, status: 'Y' })
        if (result.error) {
          return confirmedActionFailure(widgetErrorMessage(result.error, 'Unable to restore widget.'))
        }
        refetch?.()
        refreshHiddenWidgets()
      },
    })
  }

  const changeWidgetColor = (widgetKey, color) => {
    confirmBeforeAction(requestConfirm, {
      action: 'update',
      stack: 'base',
      successMessage: 'Widget color updated.',
      runAction: async () => {
        setLocalCards((prev) =>
          prev.map((item) => (item.widgetKey === widgetKey ? { ...item, color } : item)),
        )
        setLocalCharts((prev) =>
          prev.map((item) => (item.widgetKey === widgetKey ? { ...item, color } : item)),
        )
        const result = await updateColor({ widgetKey, color })
        if (result.error) {
          return confirmedActionFailure(widgetErrorMessage(result.error, 'Unable to update color.'))
        }
      },
    })
  }

  const reorderCards = (activeKey, overKey) => {
    setLocalCards((prev) => reorderList(prev, activeKey, overKey))
  }

  const reorderCharts = (activeKey, overKey) => {
    setLocalCharts((prev) => reorderList(prev, activeKey, overKey))
  }

  return {
    editMode,
    showHiddenPanel,
    localCards,
    localCharts,
    hiddenWidgets,
    isFetchingHidden,
    isSaving,
    isUpdatingStatus,
    isUpdatingColor,
    toggleEditMode,
    toggleHiddenPanel,
    closeHiddenPanel: () => setShowHiddenPanel(false),
    hideWidget,
    restoreWidget,
    changeWidgetColor,
    reorderCards,
    reorderCharts,
  }
}
