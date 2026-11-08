import { Link } from 'react-router-dom'
import { ClipboardList, ListTree, Upload } from 'lucide-react'
import { getModuleRoute } from '@/shared/constants/moduleRoutes'
import WorkbenchDemoSection from '../components/WorkbenchDemoSection'
const PATTERN_LINKS = [
  {
    id: 'domain-crud',
    title: 'List + form CRUD',
    description:
      'DomainListPageHeaderActions, DataTable, DomainListWithFormModal, in-form DomainFormFooter, validate → confirm → mutate.',
    icon: ListTree,
    route: getModuleRoute('patterns', 'domain-crud'),
  },
  {
    id: 'upload-import',
    title: 'Upload / import modal',
    description: 'Template download, file attach, nested confirm with stack: "nested", and upload success toasts.',
    icon: Upload,
    route: getModuleRoute('patterns', 'upload-import'),
  },
  {
    id: 'workflow-ui',
    title: 'Workflow UI',
    description: 'Verify / approve / reject icons, workflow modal, notes panels, and row action overflow rules.',
    icon: ClipboardList,
    route: getModuleRoute('patterns', 'workflow-ui'),
  },
]

export default function PatternsOverviewPage() {
  return (
    <div className="space-y-6 pb-12 w-full min-w-0">
      <WorkbenchDemoSection
        sectionId="patterns-overview-intro"
        title="Domain UI patterns"
        description="Production list screens, modals, and workflow surfaces in this module use the same shared primitives as Setup and Asset. Start here, then open each live pattern tab."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PATTERN_LINKS.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className="flex min-w-0 flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-none"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
                  <h3 className="text-[16px] font-semibold text-slate-800">{item.title}</h3>
                </div>
                <p className="mb-4 flex-1 text-[13px] leading-relaxed text-slate-600">{item.description}</p>
                <Link
                  to={item.route}
                  className="inline-flex h-[36px] items-center justify-center rounded-md border border-[#01458e] bg-[#01458e] px-4 text-[13px] font-semibold text-white hover:bg-[#003366] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#01458e] w-full sm:w-auto"
                >
                  Open pattern
                </Link>
              </div>
            )
          })}
        </div>
      </WorkbenchDemoSection>

      <WorkbenchDemoSection
        sectionId="patterns-section-heading"
        title="Section headings in demos"
        description="Every workbench preview block uses FormProfileSection (slate header band + ModuleSectionSubtitle body copy). Product forms and vouchers use the same FormProfileSectionHeader — do not hand-roll text-base font-bold h2 cards for in-page sections."
      >
        <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-[12px] leading-relaxed text-slate-800">
          {`import WorkbenchDemoSection from '@/domain/component-workbench/components/WorkbenchDemoSection'

<WorkbenchDemoSection title="Sales voucher information" description="Optional lead copy.">
  {/* fields, tables, footers */}
</WorkbenchDemoSection>`}
        </pre>
      </WorkbenchDemoSection>
    </div>
  )
}
