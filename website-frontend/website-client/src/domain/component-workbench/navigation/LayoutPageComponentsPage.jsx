import PageSectionHeaderBar from '@/shared/components/page/PageSectionHeaderBar'
import PageContentToolbar from '@/shared/components/page/PageContentToolbar'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { GIGW_ADD_ICON } from '@/shared/components/buttons/gigw/gigwLucideIcons'
import WorkbenchDemoSection from '../components/WorkbenchDemoSection'

export default function LayoutPageComponentsPage() {
  return (
    <div className="space-y-6 pb-12 w-full min-w-0">
      <WorkbenchDemoSection
        title="Layout & page chrome"
        description="Shared building blocks for module pages: section header band, title typography, and content toolbars. These render inside ModulePageContent in production — this page inlines them for inspection."
      />

      <div className="rounded-xl border border-dashed border-slate-300 overflow-hidden">
        <PageSectionHeaderBar
          title="Sample list screen"
          subtitle="Demonstrates PageSectionHeaderBar with primary header action slot."
          actions={
            <GigwButton type="button" variant="primary" icon={GIGW_ADD_ICON}>
              Add
            </GigwButton>
          }
        />
        <div className="px-4 sm:px-5 pt-3">
          <PageContentToolbar>
            <span className="text-[12px] text-slate-600 font-medium mr-auto">
              Filters and secondary actions live here
            </span>
            <GigwButton type="button" variant="outlineUtility" className="text-[12px]">
              Export
            </GigwButton>
          </PageContentToolbar>
        </div>
        <div className="p-4 sm:p-5 bg-[#FDFEFF] border-t border-slate-200">
          <p className="text-[13px] text-slate-600">
            Main page body (DataTable, forms, etc.) sits below the toolbar with standard module padding.
          </p>
        </div>
      </div>

      <WorkbenchDemoSection title="Related components">
        <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-1">
          <li>
            <code className="text-[12px]">ListPageHeaderActions</code> — filter, search, export on list pages
          </li>
          <li>
            <code className="text-[12px]">DomainListPageHeaderActions</code> — Add button for CRUD lists
          </li>
          <li>
            <code className="text-[12px]">ModuleContentShell</code> — wraps scroll region and chrome gutters
          </li>
        </ul>
      </WorkbenchDemoSection>
    </div>
  )
}
