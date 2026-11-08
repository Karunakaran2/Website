import React from 'react'
import PropTypes from 'prop-types'
import { Calendar, Tag, User, Building, Clock, IndianRupee } from 'lucide-react'
import PortalModalShell from '@/shared/components/modals/PortalModalShell'
import { PortalModalCancelButton } from '@/shared/components/modals/PortalModalButtons'
import { GigwButton, GIGW_EDIT_ICON } from '@/shared/components/buttons/gigw'
import StatusChip from '@/shared/components/status/StatusChip'
import { formatINR, formatDate } from '../utils/sampleModuleUtils'

/**
 * SampleRecordDetailModal
 * Implements Section 12: View Record Details Modal pattern.
 * Composes PortalModalShell to display comprehensive read-only enterprise information.
 */
export default function SampleRecordDetailModal({
  isOpen,
  record,
  onClose,
  onEdit = null,
}) {
  if (!record) return null

  const footerActions = (
    <div className="flex items-center justify-end gap-2 w-full">
      <PortalModalCancelButton onClick={onClose} label="Close" />
      {onEdit && (
        <GigwButton
          type="button"
          variant="primary"
          size="sm"
          icon={GIGW_EDIT_ICON}
          onClick={() => {
            onClose()
            onEdit(record)
          }}
          className="text-xs"
        >
          Edit Record
        </GigwButton>
      )}
    </div>
  )

  return (
    <PortalModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={record.title}
      footer={footerActions}
      size="lg"
    >
      <div className="space-y-5 text-xs sm:text-sm">
        {/* Banner with Status & Category */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-muted/40 rounded-xl border border-border">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
              {record.code}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              {record.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Status:</span>
            <StatusChip label={record.status} />
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            Overview and Description
          </h4>
          <p className="text-foreground leading-relaxed p-3 rounded-lg border border-border/80 bg-background">
            {record.description || 'No detailed description provided.'}
          </p>
        </div>

        {/* 2-Column Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-border bg-card">
            <IndianRupee className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                Sanctioned Amount
              </span>
              <p className="text-base font-bold text-foreground">
                {formatINR(record.amount)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-border bg-card">
            <Building className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                Department
              </span>
              <p className="font-semibold text-foreground">
                {record.department || 'Not Assigned'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-border bg-card">
            <User className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                Project Lead / Assignee
              </span>
              <p className="font-semibold text-foreground">
                {record.assignee || 'Unassigned'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-border bg-card">
            <Calendar className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                Target Due Date
              </span>
              <p className="font-semibold text-foreground">
                {formatDate(record.dueDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1 font-semibold">
            <span className="text-muted-foreground">Execution Progress</span>
            <span className="text-foreground">{record.progress || 0}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${record.progress || 0}%` }}
            />
          </div>
        </div>

        {/* Tags */}
        {record.tags && record.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-border">
            <Tag className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium mr-1">Tags:</span>
            {record.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-muted text-muted-foreground border border-border/80"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </PortalModalShell>
  )
}

SampleRecordDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  record: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
}
