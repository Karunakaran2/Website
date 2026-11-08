import React from 'react'
import PropTypes from 'prop-types'
import { Tag, Calendar, Layers, ShieldCheck, User, Edit3 } from 'lucide-react'
import PortalModalShell from '@/shared/components/modals/PortalModalShell'
import { PortalModalCancelButton } from '@/shared/components/modals/PortalModalButtons'
import ActionButton from '@/shared/components/buttons/ActionButton'
import StatusChip from '@/shared/components/status/StatusChip'
import { formatDate } from '../utils/setupUtils'

export default function SetupRecordDetailModal({
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
        <ActionButton
          variant="primary"
          onClick={() => {
            onClose()
            onEdit(record)
          }}
          className="text-xs"
        >
          <Edit3 className="w-3.5 h-3.5 mr-1" />
          Edit Record
        </ActionButton>
      )}
    </div>
  )

  return (
    <PortalModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={`Configuration Details — ${record.code}`}
      footer={footerActions}
      size="md"
    >
      <div className="space-y-4 text-xs sm:text-sm">
        {/* Banner with Status & Category */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-[#01458e]">
                {record.code}
              </span>
              <span className="text-xs font-medium text-slate-600">
                {record.category}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">{record.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <StatusChip label={record.status} />
          </div>
        </div>

        {/* Configuration Properties */}
        <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#01458e]" />
            Master Record Attributes
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                Primary Category
              </span>
              <span className="text-xs font-medium text-slate-900">
                {record.category}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                Responsible Head / Officer
              </span>
              <span className="text-xs font-medium text-slate-900">
                {record.head || '—'}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                System Reference / Accounting Code
              </span>
              <span className="text-xs font-mono font-medium text-slate-900">
                {record.budgetCode || '—'}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                Last Synchronized / Updated
              </span>
              <span className="text-xs font-medium text-slate-900">
                {formatDate(record.updatedDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Description & Operational Rules */}
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
            Description & System Scope
          </span>
          <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
            {record.description || 'No specific operational description registered.'}
          </p>
        </div>
      </div>
    </PortalModalShell>
  )
}

SetupRecordDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  record: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
}
