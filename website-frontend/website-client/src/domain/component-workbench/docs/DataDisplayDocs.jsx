import { Link } from 'react-router-dom'
import ComponentDocPageShell from './ComponentDocPageShell'
import TablePlayground from '../playgrounds/TablePlayground'
import { useModuleSecondaryTab } from '@/domain/component-workbench/hooks/useModuleSecondaryTab'
import {
  dataDisplayCodeForTab,
  dataDisplayPreviewForTab,
  dataDisplayUsageForTab,
} from './dataDisplayDocTabs'

const TAB_COPY = {
  cards: { title: 'Cards & Panels', lead: 'PAGE_SECTION_SHELL_CLASS cards and metric tiles.' },
  'badges-status': { title: 'Badges & Status', lead: 'StatusChip semantic tones for workflow states.' },
  tables: { title: 'Data Tables', lead: 'Shared DataTable with search, sort, pagination, and row actions.' },
  pagination: { title: 'Pagination', lead: 'TablePaginationBar and page-size controls.' },
  'accordions-tabs': { title: 'Tabs & Sections', lead: 'Secondary nav tabs and in-page section tabs.' },
  'report-overview': { title: 'Report Overview', lead: 'ReportSplitLayout workspace pattern (Probity-aligned).' },
}

export default function DataDisplayDocs() {
  const secondaryTab = useModuleSecondaryTab('cards')
  const copy = TAB_COPY[secondaryTab] || TAB_COPY.cards
  const propsList = [
    { name: 'columns', type: 'Array<{ key: string, label: string, sortable?: boolean }>', required: true, description: 'Column headers and sorting definitions.' },
    { name: 'data', type: 'Array<Record<string, any>>', required: true, description: 'Row data items rendered into table body.' },
    { name: 'isLoading', type: 'boolean', default: 'false', description: 'Displays pulse skeleton loaders across table rows.' },
    { name: 'pageSize', type: 'number', default: '10', description: 'Number of rows rendered per page.' },
    { name: 'onRowClick', type: '(row: any) => void', description: 'Optional row selection click handler.' },
  ]

  const codeExample = dataDisplayCodeForTab(secondaryTab)

  return (
    <ComponentDocPageShell
      title={copy.title}
      badge="Stable"
      lead={copy.lead}
      preview={dataDisplayPreviewForTab(secondaryTab)}
      variants={secondaryTab === 'cards' ? dataDisplayPreviewForTab('badges-status') : null}
      playground={
        secondaryTab === 'tables' || secondaryTab === 'pagination' ? (
          <TablePlayground />
        ) : secondaryTab === 'report-overview' ? (
          <Link className="font-semibold text-[#01458e] hover:underline" to="/component-workbench/data-display/report-overview">
            Open Report Overview demo
          </Link>
        ) : (
          <Link
            className="font-semibold text-[#01458e] hover:underline"
            to={
              secondaryTab === 'badges-status'
                ? '/component-workbench/data-display/badges'
                : secondaryTab === 'accordions-tabs'
                  ? '/component-workbench/navigation/tabs'
                  : '/component-workbench/data-display/cards'
            }
          >
            Open interactive demo page
          </Link>
        )
      }
      usage={dataDisplayUsageForTab(secondaryTab)}
      propsList={propsList}
      codeExample={codeExample}
      accessibility={
        <ul className="list-disc pl-4 space-y-1 text-xs sm:text-sm">
          <li><strong>Keyboard Sorting:</strong> Sortable headers can be navigated to via <kbd>Tab</kbd> and toggled using <kbd>Enter</kbd> or <kbd>Space</kbd>.</li>
          <li><strong>Pagination Focus:</strong> Changing pages moves focus to the table caption or first row, ensuring screen reader awareness.</li>
          <li><strong>Numeric Alignment:</strong> Financial amounts and counts are right-aligned to ease vertical decimal scanning.</li>
        </ul>
      }
      dosAndDonts={{
        dos: [
          'Right-align numerical amounts and currencies.',
          'Provide clear empty states with instructions when search returns 0 results.',
          'Show total row count and current page index in the pagination bar.',
        ],
        donts: [
          'Do not paginate small lists under 10 records.',
          'Avoid hiding essential table columns on mobile without providing a drawer or card fallback.',
          'Do not use low-contrast gray text for column values.',
        ],
      }}
      relatedComponents={[
        { title: 'Report Overview Demo', to: '/component-workbench/data-display/report-overview' },
        { title: 'Report Overview (Library Tab)', to: '/component-workbench/lib-data-display/report-overview' },
        { title: 'Table Playground', to: '/component-workbench/lib-playgrounds/table-playground' },
        { title: 'Data Table Guidelines', to: '/design-guidelines/guide-datatable/overview' },
        { title: 'Feedback & Modals', to: '/component-workbench/lib-feedback/alerts' },
      ]}
    />
  )
}
