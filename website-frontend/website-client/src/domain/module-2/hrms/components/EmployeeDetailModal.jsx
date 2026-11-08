import React from 'react'
import PropTypes from 'prop-types'
import { Mail, Phone, MapPin, Calendar, Briefcase, Building, ShieldCheck, User } from 'lucide-react'
import {
  PortalModalCancelButton,
  PortalModalPrimaryButton,
  PortalModalShell,
} from '@/shared/components/modals'
import { StatusChip } from '@/shared/components/status'

export default function EmployeeDetailModal({ isOpen, employee, onClose, onEdit }) {
  if (!isOpen || !employee) return null

  return (
    <PortalModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={employee.name}
      icon={User}
      size="lg"
      footer={
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Verified KRAN Employee Record</span>
          </div>
          <div className="flex items-center gap-2">
            <PortalModalCancelButton onClick={onClose}>
              Close
            </PortalModalCancelButton>
            {onEdit && (
              <PortalModalPrimaryButton
                onClick={() => {
                  onClose()
                  onEdit(employee)
                }}
              >
                Edit Profile
              </PortalModalPrimaryButton>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Profile Header Block */}
        <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sm font-bold text-[#01458e]">
              {employee.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">{employee.name}</div>
              <div className="text-xs text-slate-500">
                {employee.designation} • <span className="font-mono">{employee.id}</span>
              </div>
            </div>
          </div>
          <StatusChip label={employee.status} />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-2.5 rounded-md border border-slate-100 p-3">
            <Building className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-500">Department</p>
              <p className="font-semibold text-slate-800">{employee.department}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-md border border-slate-100 p-3">
            <Briefcase className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-500">Designation</p>
              <p className="font-semibold text-slate-800">{employee.designation}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-md border border-slate-100 p-3">
            <Mail className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-500">Corporate Email</p>
              <a
                href={`mailto:${employee.email}`}
                className="font-semibold text-[#01458e] hover:underline break-all"
              >
                {employee.email}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-md border border-slate-100 p-3">
            <Phone className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-500">Phone</p>
              <p className="font-semibold text-slate-800">{employee.phone || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-md border border-slate-100 p-3">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-500">Joining Date</p>
              <p className="font-semibold text-slate-800">{employee.joiningDate}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-md border border-slate-100 p-3">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-500">Location</p>
              <p className="font-semibold text-slate-800">{employee.location || 'Thiruvananthapuram'}</p>
            </div>
          </div>
        </div>
      </div>
    </PortalModalShell>
  )
}

EmployeeDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  employee: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
}
