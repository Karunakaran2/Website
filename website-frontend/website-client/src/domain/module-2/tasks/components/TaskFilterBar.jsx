import React from 'react'
import PropTypes from 'prop-types'
import { RotateCcw } from 'lucide-react'
import {
  TASK_STATUS_OPTIONS,
  TASK_PRIORITY_OPTIONS,
  TASK_ASSIGNEES,
} from '../constants/taskConstants'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { InputField, SelectField } from '@/shared/components/forms'
import { stringsToSelectOptions } from '@/shared/utils/selectOptionUtils'

const statusOptions = stringsToSelectOptions(TASK_STATUS_OPTIONS)
const priorityOptions = stringsToSelectOptions(TASK_PRIORITY_OPTIONS)
const assigneeOptions = stringsToSelectOptions(TASK_ASSIGNEES)

export default function TaskFilterBar({
  search,
  status,
  priority,
  assignee,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onAssigneeChange,
  onReset,
  totalResults,
}) {
  const isFiltered = Boolean(
    search ||
      (status && status !== 'All') ||
      (priority && priority !== 'All') ||
      (assignee && assignee !== 'All'),
  )

  return (
    <div className="ds-card mb-6 p-4">
      <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-12">
        <div className="md:col-span-4">
          <InputField
            id="task-search"
            name="taskSearch"
            label="Search Tasks"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, ID, or keywords..."
          />
        </div>

        <div className="md:col-span-2">
          <SelectField
            id="task-status-filter"
            name="taskStatusFilter"
            label="Status"
            value={status}
            options={statusOptions}
            onChange={(e) => onStatusChange(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <SelectField
            id="task-priority-filter"
            name="taskPriorityFilter"
            label="Priority"
            value={priority}
            options={priorityOptions}
            onChange={(e) => onPriorityChange(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <SelectField
            id="task-assignee-filter"
            name="taskAssigneeFilter"
            label="Assignee"
            value={assignee}
            options={assigneeOptions}
            onChange={(e) => onAssigneeChange(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between gap-2 md:col-span-2 md:justify-end">
          {isFiltered ? (
            <GigwButton
              type="button"
              variant="outline"
              icon={RotateCcw}
              onClick={onReset}
              aria-label="Reset all filters"
            >
              Reset
            </GigwButton>
          ) : null}
          <span className="text-xs text-muted-foreground">
            <strong>{totalResults}</strong> tasks
          </span>
        </div>
      </div>
    </div>
  )
}

TaskFilterBar.propTypes = {
  search: PropTypes.string,
  status: PropTypes.string,
  priority: PropTypes.string,
  assignee: PropTypes.string,
  onSearchChange: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onPriorityChange: PropTypes.func.isRequired,
  onAssigneeChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  totalResults: PropTypes.number.isRequired,
}
