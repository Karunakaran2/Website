import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import DomainFormFooter from '@/shared/components/domain/DomainFormFooter'
import { HRMS_DEPARTMENTS, HRMS_STATUS_OPTIONS, HRMS_LOCATIONS } from '../constants/hrmsConstants'
import { validateEmployee } from '../utils/hrmsUtils'
import { InputField, SelectField, OrgDateField } from '@/shared/components/forms'
import { scheduleFocusFirstFormError } from '@/shared/utils/formValidationFocus'
import { stringsToSelectOptions } from '@/shared/utils/selectOptionUtils'
import useInlineFormSaveConfirm from '@/shared/components/domain/useInlineFormSaveConfirm'

const departmentOptions = stringsToSelectOptions(HRMS_DEPARTMENTS, { exclude: ['All'] })
const statusOptions = stringsToSelectOptions(HRMS_STATUS_OPTIONS, { exclude: ['All'] })
const locationOptions = stringsToSelectOptions(HRMS_LOCATIONS)

export function employeeFormTitle(mode, initialData = null) {
  return mode === 'create' ? 'Add New Employee' : `Edit Employee (${initialData?.id ?? ''})`
}

export default function EmployeeForm({ mode = 'create', initialData = null, onCancel, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Engineering',
    designation: '',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    location: 'Thiruvananthapuram',
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const requestSave = useInlineFormSaveConfirm()

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        department: initialData.department || 'Engineering',
        designation: initialData.designation || '',
        joiningDate: initialData.joiningDate || new Date().toISOString().split('T')[0],
        status: initialData.status || 'Active',
        location: initialData.location || 'Thiruvananthapuram',
      })
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: 'Engineering',
        designation: '',
        joiningDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        location: 'Thiruvananthapuram',
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
        setErrors(validateEmployee(updated).errors)
      }
      return updated
    })
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setFormData((current) => {
      setErrors(validateEmployee(current).errors)
      return current
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({
      name: true,
      email: true,
      department: true,
      designation: true,
      joiningDate: true,
    })

    requestSave({
      isEditing: mode === 'edit',
      recordLabel: formData.name,
      validate: () => {
        const valResult = validateEmployee(formData)
        if (!valResult.isValid) {
          setErrors(valResult.errors)
          scheduleFocusFirstFormError(
            Object.fromEntries(
              Object.entries(valResult.errors).map(([key, message]) => [key, { message }]),
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
    <form onSubmit={handleSubmit} noValidate className="flex min-w-0 flex-col gap-4">
      <InputField
        id="emp-name"
        name="name"
        label="Full Name"
        required
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        onBlur={() => handleBlur('name')}
        placeholder="e.g. Sreejith Nair"
        error={showError('name')}
      />

      <InputField
        id="emp-email"
        name="email"
        type="email"
        label="Corporate Email"
        required
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        onBlur={() => handleBlur('email')}
        placeholder="e.g. sreejith.n@kran.co.in"
        error={showError('email')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField
          id="emp-dept"
          name="department"
          label="Department"
          required
          value={formData.department}
          options={departmentOptions}
          onChange={(e) => handleChange('department', e.target.value)}
          onBlur={() => handleBlur('department')}
          error={showError('department')}
        />
        <InputField
          id="emp-desig"
          name="designation"
          label="Designation"
          required
          value={formData.designation}
          onChange={(e) => handleChange('designation', e.target.value)}
          onBlur={() => handleBlur('designation')}
          placeholder="e.g. Senior Software Engineer"
          error={showError('designation')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          id="emp-phone"
          name="phone"
          label="Contact Phone"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+91 98470 xxxxx"
        />
        <SelectField
          id="emp-loc"
          name="location"
          label="Work Location"
          value={formData.location}
          options={locationOptions}
          onChange={(e) => handleChange('location', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <OrgDateField
          id="emp-date"
          name="joiningDate"
          label="Joining Date"
          required
          value={formData.joiningDate}
          onChange={(e) => handleChange('joiningDate', e.target.value)}
          onBlur={() => handleBlur('joiningDate')}
          error={showError('joiningDate')}
        />
        <SelectField
          id="emp-status"
          name="status"
          label="Employment Status"
          value={formData.status}
          options={statusOptions}
          onChange={(e) => handleChange('status', e.target.value)}
        />
      </div>

      <DomainFormFooter
        onCancel={onCancel}
        submitLabel={mode === 'create' ? 'Save Employee' : 'Update Changes'}
      />
    </form>
  )
}

EmployeeForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  initialData: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}
