import React from 'react'
import PropTypes from 'prop-types'
import {
  Tag,
  Building,
  MapPin,
  Calendar,
  IndianRupee,
  User,
  ShieldCheck,
  Wrench,
  FileText,
  Edit3,
} from 'lucide-react'
import PortalModalShell from '@/shared/components/modals/PortalModalShell'
import { PortalModalCancelButton } from '@/shared/components/modals/PortalModalButtons'
import ActionButton from '@/shared/components/buttons/ActionButton'
import StatusChip from '@/shared/components/status/StatusChip'
import { formatINR, formatDate } from '../utils/assetUtils'

export default function AssetDetailModal({
  isOpen,
  asset,
  onClose,
  onEdit = null,
}) {
  if (!asset) return null

  const footerActions = (
    <div className="flex items-center justify-end gap-2 w-full">
      <PortalModalCancelButton onClick={onClose} label="Close" />
      {onEdit && (
        <ActionButton
          variant="primary"
          onClick={() => {
            onClose()
            onEdit(asset)
          }}
          className="text-xs"
        >
          <Edit3 className="w-3.5 h-3.5 mr-1" />
          Edit Asset
        </ActionButton>
      )}
    </div>
  )

  return (
    <PortalModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={`Asset Details — ${asset.code}`}
      footer={footerActions}
      size="lg"
    >
      <div className="space-y-5 text-xs sm:text-sm">
        {/* Top Header Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-[#01458e]">
                {asset.code}
              </span>
              <span className="text-xs font-medium text-slate-600">
                {asset.category}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">{asset.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <StatusChip label={asset.status} />
          </div>
        </div>

        {/* Section 1: General & Purchase Information */}
        <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#01458e]" />
            General & Purchase Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                Purchase Value
              </span>
              <span className="text-sm font-bold text-slate-900">
                {formatINR(asset.purchaseValue)}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                Purchase Date
              </span>
              <span className="text-xs font-medium text-slate-800">
                {formatDate(asset.purchaseDate)}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                Serial Number
              </span>
              <span className="text-xs font-mono font-medium text-slate-800">
                {asset.serialNumber || '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Assignment & Physical Location */}
        <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-[#01458e]" />
            Assignment & Location
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                Department
              </span>
              <span className="text-xs font-medium text-slate-800">
                {asset.department}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                Location
              </span>
              <span className="text-xs font-medium text-slate-800">
                {asset.location}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                Assigned Employee / User
              </span>
              <span className="text-xs font-medium text-slate-800">
                {asset.assignedTo || 'Unassigned / General Pool'}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                Custodian
              </span>
              <span className="text-xs font-medium text-slate-800">
                {asset.custodian || 'IT Asset Cell'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Warranty & Maintenance Information */}
        <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#01458e]" />
            Warranty & Operational Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                Warranty Expiry
              </span>
              <span className="text-xs font-medium text-slate-800">
                {formatDate(asset.warrantyExpiry)}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                Last Record Audit
              </span>
              <span className="text-xs font-medium text-slate-800">
                {formatDate(asset.updatedDate)}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
              Description & Notes
            </span>
            <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200 leading-relaxed">
              {asset.description || 'No maintenance notes or description recorded.'}
            </p>
          </div>
        </div>
      </div>
    </PortalModalShell>
  )
}

AssetDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  asset: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
}
