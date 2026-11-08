import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import DomainFormFooter from '@/shared/components/domain/DomainFormFooter'
import {
  InputField,
  SelectField,
  TextAreaField,
  OrgDateField,
  IndianAmountField,
} from '@/shared/components/forms'
import {
  SAMPLE_CATEGORY_OPTIONS,
  SAMPLE_DEPARTMENT_OPTIONS,
  SAMPLE_PRIORITY_OPTIONS,
  SAMPLE_STATUS_OPTIONS,
} from '../constants/sampleModuleConstants'
import { validateSampleRecord } from '../utils/sampleModuleUtils'
import useInlineFormSaveConfirm from '@/shared/components/domain/useInlineFormSaveConfirm'

const categoryOptions = SAMPLE_CATEGORY_OPTIONS.filter((c) => c.value !== 'All')
const statusOptions = SAMPLE_STATUS_OPTIONS.filter((s) => s.value !== 'All')
const priorityOptions = SAMPLE_PRIORITY_OPTIONS.filter((p) => p.value !== 'All')

export function sampleRecordFormTitle(mode) {
  return mode === 'edit' ? 'Edit Enterprise Project' : 'Create New Project Record'
}

export default function SampleRecordForm({
  mode = 'create',
  initialData = null,
  onCancel,
  onSave,
}) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Software Development',
    department: 'Engineering',
    amount: '',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    priority: 'Medium',
    assignee: 'Vikram Menon',
    description: '',
    progress: 25,
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const requestSave = useInlineFormSaveConfirm()

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        id: initialData.id,
        code: initialData.code,
        title: initialData.title || '',
        category: initialData.category || 'Software Development',
        department: initialData.department || 'Engineering',
        amount: initialData.amount || '',
        dueDate: initialData.dueDate || new Date().toISOString().split('T')[0],
        status: initialData.status || 'Active',
        priority: initialData.priority || 'Medium',
        assignee: initialData.assignee || 'Vikram Menon',
        description: initialData.description || '',
        progress: initialData.progress || 25,
      })
    } else {
      setFormData({
        title: '',
        category: 'Software Development',
        department: 'Engineering',
        amount: '',
        dueDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        priority: 'Medium',
        assignee: 'Vikram Menon',
        description: '',
        progress: 25,
      })
    }
    setErrors({})
    setTouched({})
  }, [initialData, mode])

  const showError = (field) => (touched[field] ? errors[field] : undefined)
  const isEdit = mode === 'edit'

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const nextData = { ...prev, [field]: value }
      if (touched[field]) {
        setErrors(validateSampleRecord(nextData).errors)
      }
      return nextData
    })
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setFormData((current) => {
      setErrors(validateSampleRecord(current).errors)
      return current
    })
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    setTouched({
      title: true,
      category: true,
      department: true,
      amount: true,
      dueDate: true,
    })

    requestSave({
      isEditing: isEdit,
      recordLabel: formData.title,
      validate: () => {
        const validation = validateSampleRecord(formData)
        if (!validation.isValid) {
          setErrors(validation.errors)
          return false
        }
        return true
      },
      runAction: () => {
        onSave({
          ...formData,
          amount: Number(formData.amount),
          progress: Number(formData.progress),
        })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex min-w-0 flex-col gap-4">
      <InputField
        id="sample-form-title"
        name="title"
        label="Project Title"
        required
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        onBlur={() => handleBlur('title')}
        placeholder="e.g. Core Switch Redundancy & Fiber Uplink Upgrade"
        error={showError('title')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField
          id="sample-form-category"
          name="category"
          label="Category"
          required
          value={formData.category}
          options={categoryOptions}
          onChange={(e) => handleChange('category', e.target.value)}
          onBlur={() => handleBlur('category')}
          error={showError('category')}
        />
        <SelectField
          id="sample-form-dept"
          name="department"
          label="Department"
          required
          value={formData.department}
          options={SAMPLE_DEPARTMENT_OPTIONS}
          onChange={(e) => handleChange('department', e.target.value)}
          onBlur={() => handleBlur('department')}
          error={showError('department')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <IndianAmountField
          id="sample-form-amount"
          name="amount"
          label="Sanctioned Budget (INR)"
          required
          value={formData.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
          onBlur={() => handleBlur('amount')}
          placeholder="e.g. 850000"
          error={showError('amount')}
        />
        <OrgDateField
          id="sample-form-date"
          name="dueDate"
          label="Target Due Date"
          required
          value={formData.dueDate}
          onChange={(e) => handleChange('dueDate', e.target.value)}
          onBlur={() => handleBlur('dueDate')}
          error={showError('dueDate')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField
          id="sample-form-status"
          name="status"
          label="Initial Status"
          value={formData.status}
          options={statusOptions}
          onChange={(e) => handleChange('status', e.target.value)}
        />
        <SelectField
          id="sample-form-priority"
          name="priority"
          label="Priority Level"
          value={formData.priority}
          options={priorityOptions}
          onChange={(e) => handleChange('priority', e.target.value)}
        />
      </div>

      <TextAreaField
        id="sample-form-desc"
        name="description"
        label="Project Description & Scope"
        rows={3}
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="Provide context, operational objectives, or external dependencies..."
      />

      <DomainFormFooter
        onCancel={onCancel}
        submitLabel={isEdit ? 'Save Changes' : 'Create Project'}
      />
    </form>
  )
}

SampleRecordForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  initialData: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}
