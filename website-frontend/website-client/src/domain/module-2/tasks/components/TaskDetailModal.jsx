import React from 'react'
import PropTypes from 'prop-types'
import { Calendar, User, CheckSquare } from 'lucide-react'
import {
  PortalModalCancelButton,
  PortalModalPrimaryButton,
  PortalModalShell,
} from '@/shared/components/modals'
import { StatusChip } from '@/shared/components/status'
import { TASK_STATUS_OPTIONS } from '../constants/taskConstants'

export default function TaskDetailModal({
  isOpen,
  task,
  onClose,
  onEdit,
  onStatusChange,
}) {
  if (!isOpen || !task) return null

  return (
    <PortalModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={task.title}
      icon={CheckSquare}
      size="lg"
      footer={
        <div className="flex w-full items-center justify-between">
          <span className="font-mono text-xs text-slate-400">{task.id}</span>
          <div className="flex items-center gap-2">
            <PortalModalCancelButton onClick={onClose}>
              Close
            </PortalModalCancelButton>
            {onEdit && (
              <PortalModalPrimaryButton
                onClick={() => {
                  onClose()
                  onEdit(task)
                }}
              >
                Edit Task
              </PortalModalPrimaryButton>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Title and description */}
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="font-mono text-xs font-bold text-[#01458e]">{task.id}</span>
            <div className="flex items-center gap-2">
              <StatusChip label={task.priority} />
              <StatusChip label={task.status} />
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {task.description || 'No additional description provided.'}
          </p>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2.5 rounded-md border border-slate-100 p-3">
            <User size={16} className="text-slate-400" />
            <div>
              <span className="text-slate-500 block">Assignee</span>
              <strong className="text-slate-900">{task.assignee}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-md border border-slate-100 p-3">
            <Calendar size={16} className="text-slate-400" />
            <div>
              <span className="text-slate-500 block">Due Date</span>
              <strong className="text-slate-900">{task.dueDate}</strong>
            </div>
          </div>
        </div>

        {/* Quick status change controls */}
        {onStatusChange && (
          <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-2 border border-slate-100">
            <span className="font-medium text-slate-600 block">Quick Move Workflow:</span>
            <div className="flex flex-wrap gap-1.5">
              {TASK_STATUS_OPTIONS.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => onStatusChange(task.id, st)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                    task.status === st
                      ? 'bg-[#01458e] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </PortalModalShell>
  )
}

TaskDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  task: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onStatusChange: PropTypes.func,
}
