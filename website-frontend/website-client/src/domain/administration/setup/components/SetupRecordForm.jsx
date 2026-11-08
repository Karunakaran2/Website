import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import DomainFormFooter from '@/shared/components/domain/DomainFormFooter'
import {
  FieldGrid,
  InputField,
  SelectField,
  TextAreaField,
} from '@/shared/components/forms'
import { scheduleFocusFirstFormError } from '@/shared/utils/formValidationFocus'
import {
  MASTER_CATEGORY_OPTIONS,
  MASTER_STATUS_OPTIONS,
} from '../constants/setupConstants'
import { validateMasterRecord } from '../utils/setupUtils'
import useInlineFormSaveConfirm from '@/shared/components/domain/useInlineFormSaveConfirm'

const CATEGORY_OPTIONS = MASTER_CATEGORY_OPTIONS.filter((c) => c.value !== 'All')
const STATUS_OPTIONS = MASTER_STATUS_OPTIONS.filter((s) => s.value !== 'All')

export function setupRecordFormTitle(mode, formData = {}) {
  return mode === 'create'
    ? 'Add Master Configuration Record'
    : `Edit Record — ${formData.code || formData.name || ''}`
}

export default function SetupRecordForm({
  mode = 'create',
  initialData = null,
  existingRecords = [],
  onCancel,
  onSave,
}) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: 'Departments',
    status: 'Active',
    description: '',
    head: '',
    budgetCode: '',
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const requestSave = useInlineFormSaveConfirm()

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        id: initialData.id,
        code: initialData.code || '',
        name: initialData.name || '',
        category: initialData.category || 'Departments',
        status: initialData.status || 'Active',
        description: initialData.description || '',
        head: initialData.head || '',
        budgetCode: initialData.budgetCode || '',
      })
    } else {
      setFormData({
        code: '',
        name: '',
        category: initialData?.category || 'Departments',
        status: 'Active',
        description: '',
        head: '',
        budgetCode: '',
      })
    }
    setErrors({})
    setTouched({})
  }, [initialData, mode])

  const runValidation = (data) =>
    validateMasterRecord(data, existingRecords, mode === 'edit' ? initialData?.id : null)

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const nextData = { ...prev, [field]: value }
      if (touched[field]) {
        setErrors(runValidation(nextData).errors)
      }
      return nextData
    })
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setFormData((current) => {
      setErrors(runValidation(current).errors)
      return current
    })
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    setTouched({
      code: true,
      name: true,
      category: true,
      status: true,
    })

    requestSave({
      isEditing: mode === 'edit',
      recordLabel: formData.name || formData.code,
      validate: () => {
        const validation = runValidation(formData)
        if (!validation.isValid) {
          setErrors(validation.errors)
          scheduleFocusFirstFormError(
            Object.fromEntries(
              Object.entries(validation.errors).map(([key, message]) => [key, { message }]),
            ),
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
    <form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-4" noValidate>
      <FieldGrid cols={2}>
        <SelectField
          id="master-cat"
          name="category"
          label="Configuration Category"
          required
          options={CATEGORY_OPTIONS}
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          onBlur={() => handleBlur('category')}
          error={errors.category}
        />
        <SelectField
          id="master-status"
          name="status"
          label="Status"
          required
          options={STATUS_OPTIONS}
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          onBlur={() => handleBlur('status')}
          error={errors.status}
        />
      </FieldGrid>

      <FieldGrid cols={3}>
        <InputField
          id="master-code"
          name="code"
          label="Code"
          required
          value={formData.code}
          onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
          onBlur={() => handleBlur('code')}
          placeholder="e.g. DEPT-ENG"
          className="font-mono"
          error={errors.code}
        />
        <div className="sm:col-span-2">
          <InputField
            id="master-name"
            name="name"
            label="Configuration Name"
            required
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            placeholder="e.g. Software Engineering & Cloud Platforms"
            error={errors.name}
          />
        </div>
      </FieldGrid>

      <FieldGrid cols={2}>
        <InputField
          id="master-head"
          name="head"
          label="Designated Head / Custodian"
          value={formData.head}
          onChange={(e) => handleChange('head', e.target.value)}
          placeholder="e.g. Director (Technology)"
        />
        <InputField
          id="master-ref"
          name="budgetCode"
          label="System / Accounting Reference Code"
          value={formData.budgetCode}
          onChange={(e) => handleChange('budgetCode', e.target.value)}
          placeholder="e.g. HOA-1001-001"
          className="font-mono"
        />
      </FieldGrid>

      <TextAreaField
        id="master-desc"
        name="description"
        label="Description & Operational Rules"
        rows={3}
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="Operational purpose, policy references, or linked domain usage rules..."
      />

      <DomainFormFooter
        onCancel={onCancel}
        submitLabel={mode === 'create' ? 'Save Record' : 'Update Record'}
      />
    </form>
  )
}

SetupRecordForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  initialData: PropTypes.object,
  existingRecords: PropTypes.array,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}
