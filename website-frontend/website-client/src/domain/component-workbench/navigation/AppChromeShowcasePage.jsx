import { useState } from 'react'
import AppFooter from '@/shared/components/common/Footer/AppFooter'
import KranMarkLogo from '@/shared/components/branding/KranMarkLogo'
import ListPageHeaderActions from '@/shared/components/page/ListPageHeaderActions'
import EnterpriseDetailTabs from '@/shared/components/page/EnterpriseDetailTabs'
import BackButton from '@/shared/components/buttons/BackButton'
import { WORKBENCH_SECTION_CARD_CLASS } from '../constants/workbenchPreviewStyles'

export default function AppChromeShowcasePage() {
  const [filter, setFilter] = useState('all')
  const [tab, setTab] = useState('details')

  return (
    <div className="space-y-6 pb-12 w-full min-w-0">
      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h2 className="text-base font-bold text-slate-900">Application chrome</h2>
        <p className="mt-1 text-[13px] text-slate-600 leading-relaxed">
          Header, footer, and shell-adjacent components. Full{' '}
          <code className="text-[12px]">DashboardHeader</code> and{' '}
          <code className="text-[12px]">AccessibilityBar</code> render in the live app shell — previews
          below show isolated pieces you can reuse or restyle.
        </p>
      </div>

      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h3 className="text-[14px] font-bold text-slate-900 mb-3">KranMarkLogo</h3>
        <KranMarkLogo className="h-8 w-auto" />
      </div>

      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h3 className="text-[14px] font-bold text-slate-900 mb-3">ListPageHeaderActions</h3>
        <p className="text-[13px] text-slate-600 mb-3">
          Filter + export in the page header band (list search stays on DataTable toolbar).
        </p>
        <ListPageHeaderActions
          filterLabel="Status"
          filterValue={filter}
          filterOptions={[
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'draft', label: 'Draft' },
          ]}
          onFilterChange={(e) => setFilter(e.target.value)}
          onExport={() => {}}
          exportLabel="Export Excel"
        />
      </div>

      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h3 className="text-[14px] font-bold text-slate-900 mb-3">EnterpriseDetailTabs</h3>
        <EnterpriseDetailTabs
          tabs={[
            { id: 'details', label: 'Details' },
            { id: 'history', label: 'History' },
            { id: 'attachments', label: 'Attachments' },
          ]}
          activeTabId={tab}
          onTabChange={setTab}
        >
          <p className="text-[13px] text-slate-700">Active tab panel: <strong>{tab}</strong></p>
        </EnterpriseDetailTabs>
      </div>

      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h3 className="text-[14px] font-bold text-slate-900 mb-2">BackButton</h3>
        <BackButton type="button">Back to list</BackButton>
      </div>

      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <p className="bg-slate-100 px-4 py-2 text-[12px] font-semibold text-slate-700">AppFooter (live component)</p>
        <AppFooter />
      </div>
    </div>
  )
}
