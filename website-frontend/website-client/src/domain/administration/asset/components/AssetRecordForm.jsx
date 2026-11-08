import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import DomainFormFooter from '@/shared/components/domain/DomainFormFooter'
import {
  FieldGrid,
  InputField,
  SelectField,
  TextAreaField,
  IndianAmountField,
  OrgDateField,
} from '@/shared/components/forms'
import { scheduleFocusFirstFormError } from '@/shared/utils/formValidationFocus'
import {
  ASSET_CATEGORY_OPTIONS,
  ASSET_DEPARTMENT_OPTIONS,
  ASSET_LOCATION_OPTIONS,
  ASSET_STATUS_OPTIONS,
} from '../constants/assetConstants'
import { validateAssetRecord } from '../utils/assetUtils'
import useInlineFormSaveConfirm from '@/shared/components/domain/useInlineFormSaveConfirm'

const CATEGORY_OPTIONS = ASSET_CATEGORY_OPTIONS.filter((c) => c.value !== 'All')
const STATUS_OPTIONS = ASSET_STATUS_OPTIONS.filter((s) => s.value !== 'All')
const DEPARTMENT_OPTIONS = ASSET_DEPARTMENT_OPTIONS.filter((d) => d.value !== '')
const LOCATION_OPTIONS = ASSET_LOCATION_OPTIONS.filter((l) => l.value !== '')

export function assetRecordFormTitle(mode, formData = {}) {
  return mode === 'create'
    ? 'Register New Asset'
    : `Edit Asset — ${formData.code || formData.name || ''}`
}

export default function AssetRecordForm({
  mode = 'create',
  initialData = null,
  onCancel,
  onSave,
}) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'IT Hardware',
    department: 'Engineering',
    location: 'Technopark Campus, TVM',
    purchaseValue: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    assignedTo: '',
    custodian: 'IT Assets Desk',
    warrantyExpiry: '',
    serialNumber: '',
    status: 'Active',
    description: '',
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
        category: initialData.category || 'IT Hardware',
        department: initialData.department || 'Engineering',
        location: initialData.location || 'Technopark Campus, TVM',
        purchaseValue: initialData.purchaseValue ?? '',
        purchaseDate: initialData.purchaseDate || new Date().toISOString().split('T')[0],
        assignedTo: initialData.assignedTo || '',
        custodian: initialData.custodian || 'IT Assets Desk',
        warrantyExpiry: initialData.warrantyExpiry || '',
        serialNumber: initialData.serialNumber || '',
        status: initialData.status || 'Active',
        description: initialData.description || '',
      })
    } else {
      setFormData({
        name: '',
        code: '',
        category: 'IT Hardware',
        department: 'Engineering',
        location: 'Technopark Campus, TVM',
        purchaseValue: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        assignedTo: '',
        custodian: 'IT Assets Desk',
        warrantyExpiry: '',
        serialNumber: '',
        status: 'Active',
        description: '',
      })
    }
    setErrors({})
    setTouched({})
  }, [initialData, mode])

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const nextData = { ...prev, [field]: value }
      if (touched[field]) {
        setErrors(validateAssetRecord(nextData).errors)
      }
      return nextData
    })
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setFormData((current) => {
      setErrors(validateAssetRecord(current).errors)
      return current
    })
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    setTouched({
      name: true,
      category: true,
      department: true,
      location: true,
      purchaseValue: true,
      purchaseDate: true,
      status: true,
    })

    requestSave({
      isEditing: mode === 'edit',
      recordLabel: formData.name || formData.code,
      validate: () => {
        const validation = validateAssetRecord(formData)
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
      <InputField
        id="asset-name"
        name="name"
        label="Asset Name"
        required
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        onBlur={() => handleBlur('name')}
        placeholder='e.g. MacBook Pro 16" M3 Max (36GB/1TB)'
        error={errors.name}
      />

      <FieldGrid cols={2}>
        <SelectField
          id="asset-category"
          name="category"
          label="Asset Category"
          required
          options={CATEGORY_OPTIONS}
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          onBlur={() => handleBlur('category')}
          error={errors.category}
        />
        <SelectField
          id="asset-status"
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

      <FieldGrid cols={2}>
        <SelectField
          id="asset-dept"
          name="department"
          label="Department"
          required
          options={DEPARTMENT_OPTIONS}
          value={formData.department}
          onChange={(e) => handleChange('department', e.target.value)}
          onBlur={() => handleBlur('department')}
          error={errors.department}
        />
        <SelectField
          id="asset-loc"
          name="location"
          label="Physical Location"
          required
          options={LOCATION_OPTIONS}
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          onBlur={() => handleBlur('location')}
          error={errors.location}
        />
      </FieldGrid>

      <FieldGrid cols={2}>
        <IndianAmountField
          id="asset-value"
          name="purchaseValue"
          label="Purchase Value (INR)"
          required
          value={formData.purchaseValue}
          onChange={(e) => handleChange('purchaseValue', e.target.value)}
          onBlur={() => handleBlur('purchaseValue')}
          placeholder="e.g. 150000"
          error={errors.purchaseValue}
        />
        <OrgDateField
          id="asset-date"
          name="purchaseDate"
          label="Purchase Date"
          required
          value={formData.purchaseDate}
          onChange={(e) => handleChange('purchaseDate', e.target.value)}
          onBlur={() => handleBlur('purchaseDate')}
          error={errors.purchaseDate}
        />
      </FieldGrid>

      <FieldGrid cols={2}>
        <InputField
          id="asset-assignee"
          name="assignedTo"
          label="Assigned Employee"
          value={formData.assignedTo}
          onChange={(e) => handleChange('assignedTo', e.target.value)}
          placeholder="e.g. Vikram Menon"
        />
        <InputField
          id="asset-serial"
          name="serialNumber"
          label="Serial Number / Tag"
          value={formData.serialNumber}
          onChange={(e) => handleChange('serialNumber', e.target.value)}
          placeholder="e.g. SN-MBP-84920"
          className="font-mono"
        />
      </FieldGrid>

      <FieldGrid cols={2}>
        <OrgDateField
          id="asset-warranty"
          name="warrantyExpiry"
          label="Warranty Expiry Date"
          value={formData.warrantyExpiry}
          onChange={(e) => handleChange('warrantyExpiry', e.target.value)}
        />
        <InputField
          id="asset-custodian"
          name="custodian"
          label="Asset Custodian"
          value={formData.custodian}
          onChange={(e) => handleChange('custodian', e.target.value)}
          placeholder="e.g. IT Assets Desk"
        />
      </FieldGrid>

      <TextAreaField
        id="asset-desc"
        name="description"
        label="Description & Maintenance Notes"
        rows={3}
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="Operational specifications, hardware configurations, or maintenance history..."
      />

      <DomainFormFooter
        onCancel={onCancel}
        submitLabel={mode === 'create' ? 'Save Asset' : 'Update Asset'}
      />
    </form>
  )
}

AssetRecordForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  initialData: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}
