import React from 'react'
import PropTypes from 'prop-types'
import { RotateCcw, Filter } from 'lucide-react'
import {
  SAMPLE_STATUS_OPTIONS,
  SAMPLE_CATEGORY_OPTIONS,
  SAMPLE_PRIORITY_OPTIONS,
} from '../constants/sampleModuleConstants'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { PageToolbarSearchInput, PageToolbarSelect } from '@/shared/components/page'

export default function SampleFilterPanel({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  selectedPriority,
  onPriorityChange,
  onReset,
  totalResults = null,
  className = '',
}) {
  return (
    <div
      className={`mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-xs ${className}`.trim()}
    >
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <PageToolbarSearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search by code, title, or assignee..."
          className="min-w-[220px] flex-1"
        />

        <div className="flex flex-wrap items-center gap-2.5">
          <PageToolbarSelect
            label="Status"
            name="sampleStatusFilter"
            value={selectedStatus}
            options={SAMPLE_STATUS_OPTIONS}
            onChange={onStatusChange}
            minWidth="min-w-[100px]"
          />

          {onCategoryChange ? (
            <PageToolbarSelect
              label="Category"
              name="sampleCategoryFilter"
              value={selectedCategory}
              options={SAMPLE_CATEGORY_OPTIONS}
              onChange={onCategoryChange}
            />
          ) : null}

          {onPriorityChange ? (
            <PageToolbarSelect
              label="Priority"
              name="samplePriorityFilter"
              value={selectedPriority}
              options={SAMPLE_PRIORITY_OPTIONS}
              onChange={onPriorityChange}
              minWidth="min-w-[100px]"
            />
          ) : null}

          <GigwButton
            type="button"
            variant="outline"
            icon={RotateCcw}
            onClick={onReset}
            aria-label="Reset all filters"
          >
            Reset
          </GigwButton>
        </div>
      </div>

      {totalResults !== null ? (
        <div className="mt-2.5 flex items-center justify-between border-t border-slate-200/60 pt-2 text-[11px] text-slate-600">
          <span>
            Showing <strong className="font-semibold text-slate-900">{totalResults}</strong> records
            matching criteria
          </span>
          <span className="flex items-center gap-1 text-[#01458e]">
            <Filter className="h-3 w-3" aria-hidden /> Filtered view
          </span>
        </div>
      ) : null}
    </div>
  )
}

SampleFilterPanel.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  selectedStatus: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string,
  onCategoryChange: PropTypes.func,
  selectedPriority: PropTypes.string,
  onPriorityChange: PropTypes.func,
  onReset: PropTypes.func.isRequired,
  totalResults: PropTypes.number,
  className: PropTypes.string,
}
