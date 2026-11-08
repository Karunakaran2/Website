import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import DomainFormFooter from '@/shared/components/domain/DomainFormFooter'
import {
  TASK_STATUS_OPTIONS,
  TASK_PRIORITY_OPTIONS,
  TASK_ASSIGNEES,
} from '../constants/taskConstants'
import { validateTask } from '../utils/taskUtils'
import { InputField, SelectField, TextAreaField, OrgDateField } from '@/shared/components/forms'
import { scheduleFocusFirstFormError } from '@/shared/utils/formValidationFocus'
import { stringsToSelectOptions } from '@/shared/utils/selectOptionUtils'
import useInlineFormSaveConfirm from '@/shared/components/domain/useInlineFormSaveConfirm'

const assigneeOptions = stringsToSelectOptions(TASK_ASSIGNEES, { exclude: ['All'] })
const priorityOptions = stringsToSelectOptions(TASK_PRIORITY_OPTIONS, { exclude: ['All'] })
const statusOptions = stringsToSelectOptions(TASK_STATUS_OPTIONS, { exclude: ['All'] })

export function taskFormTitle(mode, initialData = null) {
  return mode === 'create' ? 'Create New Task' : `Edit Task (${initialData?.id ?? ''})`
}

export default function TaskForm({ mode = 'create', initialData = null, onCancel, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: 'Ananya Sharma',
    priority: 'Medium',
    status: 'To Do',
    dueDate: new Date().toISOString().split('T')[0],
    category: 'Design System',
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const requestSave = useInlineFormSaveConfirm()

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        assignee: initialData.assignee || 'Ananya Sharma',
        priority: initialData.priority || 'Medium',
        status: initialData.status || 'To Do',
        dueDate: initialData.dueDate || new Date().toISOString().split('T')[0],
        category: initialData.category || 'Design System',
      })
    } else {
      setFormData({
        title: '',
        description: '',
        assignee: 'Ananya Sharma',
        priority: 'Medium',
        status: 'To Do',
        dueDate: new Date().toISOString().split('T')[0],
        category: 'Design System',
      })
    }
    setErrors({})
    setTouched({})
  }, [initialData, mode])

  const showError = (field) => (touched[field] ? errors[field] : undefined)

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      if (touched[field]) {
        setErrors(validateTask(updated).errors)
      }
      return updated
    })
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setFormData((current) => {
      setErrors(validateTask(current).errors)
      return current
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({
      title: true,
      assignee: true,
      priority: true,
      status: true,
      dueDate: true,
    })

    requestSave({
      isEditing: mode === 'edit',
      recordLabel: formData.title,
      validate: () => {
        const val = validateTask(formData)
        if (!val.isValid) {
          setErrors(val.errors)
          scheduleFocusFirstFormError(
            Object.fromEntries(Object.entries(val.errors).map(([key, message]) => [key, { message }])),
          )
          return false
        }
        return true
      },
      runAction: () => {
        onSave(formData)
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex min-w-0 flex-col gap-4">
      <InputField
        id="task-title"
        name="title"
        label="Task Title"
        required
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        onBlur={() => handleBlur('title')}
        placeholder="e.g. Audit keyboard accessibility on table controls"
        error={showError('title')}
      />

      <TextAreaField
        id="task-desc"
        name="description"
        label="Description & Acceptance Criteria"
        rows={3}
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="Provide details, scope, or link to design system ticket..."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField
          id="task-assignee"
          name="assignee"
          label="Assignee"
          required
          value={formData.assignee}
          options={assigneeOptions}
          onChange={(e) => handleChange('assignee', e.target.value)}
          onBlur={() => handleBlur('assignee')}
          error={showError('assignee')}
        />
        <InputField
          id="task-cat"
          name="category"
          label="Module / Category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          placeholder="e.g. Design System"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField
          id="task-priority"
          name="priority"
          label="Priority Level"
          required
          value={formData.priority}
          options={priorityOptions}
          onChange={(e) => handleChange('priority', e.target.value)}
          onBlur={() => handleBlur('priority')}
          error={showError('priority')}
        />
        <SelectField
          id="task-status"
          name="status"
          label="Task Status"
          required
          value={formData.status}
          options={statusOptions}
          onChange={(e) => handleChange('status', e.target.value)}
          onBlur={() => handleBlur('status')}
          error={showError('status')}
        />
      </div>

      <OrgDateField
        id="task-due"
        name="dueDate"
        label="Due Date"
        required
        value={formData.dueDate}
        onChange={(e) => handleChange('dueDate', e.target.value)}
        onBlur={() => handleBlur('dueDate')}
        error={showError('dueDate')}
      />

      <DomainFormFooter
        onCancel={onCancel}
        submitLabel={mode === 'create' ? 'Create Task' : 'Save Changes'}
      />
    </form>
  )
}

TaskForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  initialData: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}
