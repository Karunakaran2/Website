import React from 'react'
import { Building2, Phone, Mail, CheckCircle2, FileText, Users } from 'lucide-react'
import SampleModuleLayout from '../layouts/SampleModuleLayout'
import { OrgDataDisplay } from '@/shared/components/display'
import StatusChip from '@/shared/components/status/StatusChip'
import ModuleInnerCard from '@/shared/layouts/ModuleInnerCard'

export default function SampleLayoutTypographyPage() {
  const departmentMeta = [
    { label: 'Department Name', value: 'Department of Public Works & State Infrastructure' },
    { label: 'Treasury Code', value: 'KL-TVM-0084 (State Central)' },
    { label: 'Sanction Authority', value: 'Principal Secretary (Finance & Works)' },
    { label: 'Current Financial Year', value: 'FY 2026-27 (Quarter 3 Active)' },
    { label: 'Active DDO Code', value: 'DDO-KL-TVM-8821' },
    { label: 'System Compliance', value: 'GIGW 3.0 / WCAG 2.2 AA Certified' },
  ]

  const keyOfficials = [
    { name: 'Er. K. Suresh Kumar', designation: 'Chief Engineer (Buildings)', phone: '+91 471 232 4091', email: 'ce.buildings@pwd.kerala.gov.in', status: 'Active' },
    { name: 'Smt. R. Lakshmi Nair, IAS', designation: 'Special Secretary (Finance)', phone: '+91 471 232 5112', email: 'sec.fin-scrutiny@kerala.gov.in', status: 'Active' },
    { name: 'Er. Jacob V. Thomas', designation: 'Superintending Engineer (IT Cell)', phone: '+91 471 232 8902', email: 'se.itcell@pwd.kerala.gov.in', status: 'Active' },
  ]

  return (
    <SampleModuleLayout activeTab="layout">
      <div className="space-y-6 w-full">
        <ModuleInnerCard
          title="Administrative Organization Profile"
          icon={Building2}
          headerTrailing={<StatusChip label="Active" />}
        >
          <p className="mb-4 text-[13px] leading-relaxed text-slate-600">
            Authoritative organizational master details synced with Kerala State Treasury Gateway.
          </p>
          <OrgDataDisplay data={departmentMeta} columns={3} />
        </ModuleInnerCard>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ModuleInnerCard
            title="Capital Works Strategic Mandate FY 2026-27"
            icon={FileText}
            className="lg:col-span-2"
          >
            <p className="mb-4 text-[13px] leading-relaxed text-slate-600">
              The Department of Public Works and State Infrastructure is responsible for planning, design, execution, and quality assurance of major capital works across the state. Under the current fiscal budget, priority has been designated for climate-resilient road corridors, state data center redundancy, and public healthcare building modernizations.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block mb-1">Electronic Sanctioning Workflow</span>
                <p className="text-slate-500 leading-normal">100% of administrative and technical sanctions are initiated and endorsed through the paperless electronic portal.</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block mb-1">Real-Time Contractor Settlement</span>
                <p className="text-slate-500 leading-normal">Direct Treasury integration facilitates automated tax deduction at source (TDS) and direct bank disbursement.</p>
              </div>
            </div>
          </ModuleInnerCard>

          <ModuleInnerCard title="Statutory Governance" icon={CheckCircle2} className="flex flex-col">
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Public Works Department (PWD) Code 2024</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Kerala Financial Code (KFC) Vol. 1 & 2</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>GIGW 3.0 & WCAG 2.2 AA Accessibility Mandate</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>GeM Procurement Guidelines 2026</span>
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Last statutory audit: 12-Oct-2026</span>
              <StatusChip label="Verified" />
            </div>
          </ModuleInnerCard>
        </div>

        <ModuleInnerCard title="Nodal Officials & Sanction Custodians" icon={Users}>
          <p className="mb-4 text-[13px] leading-relaxed text-slate-600">
            Key departmental signatories authorized for technical and financial endorsements.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {keyOfficials.map((officer) => (
              <div key={officer.name} className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{officer.name}</h4>
                    <p className="text-[11px] text-[#01458e] font-semibold">{officer.designation}</p>
                  </div>
                  <StatusChip label={officer.status} />
                </div>
                <div className="pt-2 border-t border-slate-200/60 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Phone size={12} className="text-slate-400 shrink-0" />
                    <span>{officer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={12} className="text-slate-400 shrink-0" />
                    <span className="truncate">{officer.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ModuleInnerCard>
      </div>
    </SampleModuleLayout>
  )
}
