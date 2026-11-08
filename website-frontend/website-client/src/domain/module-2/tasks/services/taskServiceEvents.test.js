/** @vitest-environment happy-dom */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { notifyTasksChanged, subscribeTasksChanged, TASKS_CHANGED_EVENT } from './taskServiceEvents'

describe('taskServiceEvents', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('notifies subscribers when tasks change', () => {
    const handler = vi.fn()
    const unsubscribe = subscribeTasksChanged(handler)
    notifyTasksChanged()
    expect(handler).toHaveBeenCalledTimes(1)
    unsubscribe()
    notifyTasksChanged()
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('uses a stable event name', () => {
    expect(TASKS_CHANGED_EVENT).toBe('kran:tasks-changed')
  })
})
