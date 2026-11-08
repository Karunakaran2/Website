import React, { useCallback, useMemo, useState } from 'react'
import { Mail, CheckCircle2 } from 'lucide-react'
import HrmsLayout from '../layouts/HrmsLayout'
import { useHrms } from '../hooks/useHrms'
import { useListPageHeaderActions } from '@/shared/hooks/useListPageHeaderActions'
import { PageContentToolbar, PageToolbarSearchInput } from '@/shared/components/page'
import { exportSimpleCsv } from '@/shared/utils/exportSimpleCsv'
import { showAppToast } from '@/shared/components'

export default function HrmsLeavePage() {
  const { employees } = useHrms()
  const [search, setSearch] = useState('')
  const onLeaveEmployees = employees.filter((e) => e.status === 'On Leave')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return onLeaveEmployees
    return onLeaveEmployees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q),
    )
  }, [onLeaveEmployees, search])

  const handleExport = useCallback(() => {
    const ok = exportSimpleCsv(
      filtered.map((e) => ({
        id: e.id,
        name: e.name,
        department: e.department,
        designation: e.designation,
        email: e.email,
      })),
      [
        { key: 'id', header: 'Employee ID' },
        { key: 'name', header: 'Name' },
        { key: 'department', header: 'Department' },
        { key: 'designation', header: 'Designation' },
        { key: 'email', header: 'Email' },
      ],
      'on-leave.csv',
    )
    if (ok) showAppToast('Export prepared successfully.', 'success', { action: 'export' })
    else showAppToast('No records to export.', 'warning')
  }, [filtered])

  useListPageHeaderActions({
    onExport: handleExport,
  })

  return (
    <HrmsLayout>
      <PageContentToolbar>
        <PageToolbarSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search on leave…"
          className="min-w-[200px] flex-1 sm:max-w-[280px]"
        />
      </PageContentToolbar>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full rounded-lg border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-none">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-600 mb-2" />
            <h2 className="text-base font-bold text-slate-900 mb-1">Full Attendance</h2>
            <p className="text-sm">There are currently no staff members on leave.</p>
          </div>
        ) : (
          filtered.map((emp) => (
            <div
              key={emp.id}
              className="flex flex-col justify-between rounded-lg border border-slate-200 border-l-4 border-l-amber-500 bg-white p-5 shadow-none"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${emp.avatarColor || 'bg-amber-100 text-amber-800'}`}
                  >
                    {emp.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-semibold text-slate-900 truncate">{emp.name}</h2>
                    <p className="text-xs text-slate-500 truncate">{emp.designation}</p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/70 rounded-md text-xs space-y-1.5 text-amber-900 mb-4 border border-amber-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-600">Leave Type:</span>
                    <span className="font-semibold">Annual Privilege Leave</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-600">Expected Return:</span>
                    <span className="font-semibold text-amber-800">Next Monday</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-600">Handover Lead:</span>
                    <span>Assigned Team Member</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 text-xs border-t border-slate-100">
                <span className="text-slate-400 font-mono">{emp.id}</span>
                <a
                  href={`mailto:${emp.email}`}
                  className="inline-flex items-center gap-1 font-semibold text-[#01458e] hover:underline"
                >
                  <Mail size={14} />
                  <span>Email Handover</span>
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </HrmsLayout>
  )
}
