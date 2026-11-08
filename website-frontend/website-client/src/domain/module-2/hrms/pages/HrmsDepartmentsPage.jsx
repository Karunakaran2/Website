import React, { useCallback, useMemo, useState } from 'react'
import { Building2, ArrowRight } from 'lucide-react'
import HrmsLayout from '../layouts/HrmsLayout'
import { useHrms } from '../hooks/useHrms'
import { HRMS_DEPARTMENTS } from '../constants/hrmsConstants'
import { useListPageHeaderActions } from '@/shared/hooks/useListPageHeaderActions'
import { PageContentToolbar, PageToolbarSearchInput } from '@/shared/components/page'
import { exportSimpleCsv } from '@/shared/utils/exportSimpleCsv'
import { showAppToast } from '@/shared/components'

export default function HrmsDepartmentsPage() {
  const { employees } = useHrms()
  const [search, setSearch] = useState('')

  const departmentList = HRMS_DEPARTMENTS.filter((d) => d !== 'All').map((deptName) => {
    const deptEmployees = employees.filter((e) => e.department === deptName)
    const activeCount = deptEmployees.filter((e) => e.status === 'Active').length
    const onLeaveCount = deptEmployees.filter((e) => e.status === 'On Leave').length

    return {
      name: deptName,
      total: deptEmployees.length,
      active: activeCount,
      onLeave: onLeaveCount,
      lead: deptEmployees[0]?.name || 'Assigned Lead',
      leadDesignation: deptEmployees[0]?.designation || 'Department Manager',
    }
  })

  const filteredDepartments = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return departmentList
    return departmentList.filter((d) => d.name.toLowerCase().includes(q))
  }, [departmentList, search])

  const handleExport = useCallback(() => {
    const ok = exportSimpleCsv(
      filteredDepartments.map((d) => ({
        name: d.name,
        total: d.total,
        active: d.active,
        onLeave: d.onLeave,
        lead: d.lead,
      })),
      [
        { key: 'name', header: 'Department' },
        { key: 'total', header: 'Total Members' },
        { key: 'active', header: 'Active' },
        { key: 'onLeave', header: 'On Leave' },
        { key: 'lead', header: 'Lead' },
      ],
      'departments.csv',
    )
    if (ok) showAppToast('Export prepared successfully.', 'success', { action: 'export' })
    else showAppToast('No records to export.', 'warning')
  }, [filteredDepartments])

  useListPageHeaderActions({
    onExport: handleExport,
  })

  return (
    <HrmsLayout>
      <PageContentToolbar>
        <PageToolbarSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search departments…"
          className="min-w-[200px] flex-1 sm:max-w-[280px]"
        />
      </PageContentToolbar>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDepartments.map((dept) => (
          <div
            key={dept.name}
            className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-none transition hover:border-[#01458e]/40 hover:shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-[#01458e]">
                  <Building2 size={20} />
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-[#01458e] border border-sky-200">
                  {dept.total} {dept.total === 1 ? 'Member' : 'Members'}
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-900 mb-1">{dept.name}</h2>
              <p className="text-xs text-slate-500 mb-4">
                Lead: <strong className="text-slate-800">{dept.lead}</strong> ({dept.leadDesignation})
              </p>

              <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-slate-50 text-xs mb-4 border border-slate-100">
                <div>
                  <span className="text-slate-500 block">Active Now</span>
                  <span className="font-bold text-emerald-700">{dept.active}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">On Leave</span>
                  <span className="font-bold text-amber-700">{dept.onLeave}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#01458e]">
              <span>View Department Roster</span>
              <ArrowRight size={14} />
            </div>
          </div>
        ))}
      </div>
    </HrmsLayout>
  )
}
