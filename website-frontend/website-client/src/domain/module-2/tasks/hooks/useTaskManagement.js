import { useState, useMemo, useCallback, useEffect } from 'react'
import { taskService } from '../services/taskService'
import { subscribeTasksChanged } from '../services/taskServiceEvents'
import { calculateTaskStats, filterTasks } from '../utils/taskUtils'

export function useTaskManagement() {
  const [tasks, setTasks] = useState(() => taskService.getAll())
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [priority, setPriority] = useState('All')
  const [assignee, setAssignee] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [formMode, setFormMode] = useState('create') // 'create' | 'edit'
  const [selectedTask, setSelectedTask] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [notification, setNotification] = useState(null)

  useEffect(
    () =>
      subscribeTasksChanged(() => {
        setTasks(taskService.getAll())
      }),
    [],
  )

  // Derived dashboard statistics
  const stats = useMemo(() => calculateTaskStats(tasks), [tasks])

  // Filtered task collection
  const filteredTasks = useMemo(() => {
    return filterTasks(tasks, { search, status, priority, assignee })
  }, [tasks, search, status, priority, assignee])

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / pageSize))
  const pagedTasks = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredTasks.slice(start, start + pageSize)
  }, [filteredTasks, currentPage, pageSize])

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 4000)
  }, [])

  // Action handlers
  const handleOpenCreate = useCallback(() => {
    setSelectedTask(null)
    setFormMode('create')
    setIsFormModalOpen(true)
  }, [])

  const handleOpenEdit = useCallback((task) => {
    setSelectedTask(task)
    setFormMode('edit')
    setIsFormModalOpen(true)
  }, [])

  const handleOpenDetail = useCallback((task) => {
    setSelectedTask(task)
    setIsDetailModalOpen(true)
  }, [])

  const handleCloseModals = useCallback(() => {
    setIsFormModalOpen(false)
    setIsDetailModalOpen(false)
    setSelectedTask(null)
  }, [])

  const handleSaveTask = useCallback(
    (formData) => {
      if (formMode === 'create') {
        const created = taskService.create(formData)
        setTasks(taskService.getAll())
        showNotification(`Task ${created.id} was created successfully.`)
      } else if (selectedTask) {
        const updated = taskService.update(selectedTask.id, formData)
        setTasks(taskService.getAll())
        showNotification(`Task ${updated.id} details updated.`)
      }
      handleCloseModals()
    },
    [formMode, selectedTask, showNotification, handleCloseModals]
  )

  const handleUpdateStatus = useCallback(
    (id, newStatus) => {
      taskService.updateStatus(id, newStatus)
      const all = taskService.getAll()
      setTasks(all)
      // If selectedTask is currently open in detail modal, update its local copy too
      setSelectedTask((prev) => (prev && prev.id === id ? { ...prev, status: newStatus } : prev))
      showNotification(`Task status changed to ${newStatus}.`)
    },
    [showNotification]
  )

  const handleDeleteTask = useCallback(
    (id) => {
      const t = tasks.find((item) => item.id === id)
      if (t) {
        taskService.delete(id)
        setTasks(taskService.getAll())
        showNotification(`Task ${t.id} was removed.`, 'info')
      }
    },
    [tasks, showNotification]
  )

  const handleResetFilters = useCallback(() => {
    setSearch('')
    setStatus('All')
    setPriority('All')
    setAssignee('All')
    setCurrentPage(1)
  }, [])

  return {
    tasks,
    filteredTasks,
    pagedTasks,
    stats,
    search,
    status,
    priority,
    assignee,
    currentPage,
    totalPages,
    pageSize,
    isFormModalOpen,
    isDetailModalOpen,
    formMode,
    selectedTask,
    notification,
    // Actions
    setSearch: (val) => {
      setSearch(val)
      setCurrentPage(1)
    },
    setStatus: (val) => {
      setStatus(val)
      setCurrentPage(1)
    },
    setPriority: (val) => {
      setPriority(val)
      setCurrentPage(1)
    },
    setAssignee: (val) => {
      setAssignee(val)
      setCurrentPage(1)
    },
    setCurrentPage,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleCloseModals,
    handleSaveTask,
    handleUpdateStatus,
    handleDeleteTask,
    handleResetFilters,
  }
}
