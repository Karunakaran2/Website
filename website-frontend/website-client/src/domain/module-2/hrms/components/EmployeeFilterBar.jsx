import React from 'react'
import PropTypes from 'prop-types'
import { RotateCcw } from 'lucide-react'
import { HRMS_DEPARTMENTS, HRMS_STATUS_OPTIONS } from '../constants/hrmsConstants'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { InputField, SelectField } from '@/shared/components/forms'
import { stringsToSelectOptions } from '@/shared/utils/selectOptionUtils'

const departmentOptions = stringsToSelectOptions(HRMS_DEPARTMENTS)
const statusOptions = stringsToSelectOptions(HRMS_STATUS_OPTIONS)

export default function EmployeeFilterBar({
  search,
  department,
  status,
  onSearchChange,
  onDepartmentChange,
  onStatusChange,
  onReset,
  totalResults,
}) {
  const isFiltered = Boolean(search || (department && department !== 'All') || (status && status !== 'All'))

  return (
    <div className="ds-card mb-6 p-4">
      <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-12">
        <div className="md:col-span-5">
          <InputField
            id="hrms-search"
            name="hrmsSearch"
            label="Search Employee"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, ID, email, or role..."
          />
        </div>

        <div className="md:col-span-3">
          <SelectField
            id="hrms-dept"
            name="hrmsDepartment"
            label="Department"
            value={department}
            options={departmentOptions}
            onChange={(e) => onDepartmentChange(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <SelectField
            id="hrms-status"
            name="hrmsStatus"
            label="Status"
            value={status}
            options={statusOptions}
            onChange={(e) => onStatusChange(e.target.value)}
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
            <strong>{totalResults}</strong> found
          </span>
        </div>
      </div>
    </div>
  )
}

EmployeeFilterBar.propTypes = {
  search: PropTypes.string,
  department: PropTypes.string,
  status: PropTypes.string,
  onSearchChange: PropTypes.func.isRequired,
  onDepartmentChange: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  totalResults: PropTypes.number.isRequired,
}
