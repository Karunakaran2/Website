import { Link } from 'react-router-dom'
import ComponentDocPageShell from './ComponentDocPageShell'
import { useModuleSecondaryTab } from '@/domain/component-workbench/hooks/useModuleSecondaryTab'
import {
  navigationCodeForTab,
  navigationPreviewForTab,
  navigationUsageForTab,
} from './navigationDocTabs'

const TAB_COPY = {
  headers: { title: 'Header Navigation', lead: 'DashboardHeader, PrimaryNav (gold strip), and SecondaryNav module tabs.' },
  sidebars: { title: 'Application Shell', lead: 'MainLayout, ModuleContentShell, and page-shell gutters (20px).' },
  dropdowns: { title: 'Dropdown Menus', lead: 'Account menu, overflow More menu, and action dropdowns.' },
  breadcrumbs: { title: 'Breadcrumbs', lead: 'Wayfinding within modules and nested report workspaces.' },
  'grid-layout': { title: 'Grid & Containers', lead: 'Page sections, cards, and responsive grid patterns.' },
}

export default function NavigationDocs() {
  const secondaryTab = useModuleSecondaryTab('headers')
  const copy = TAB_COPY[secondaryTab] || TAB_COPY.headers
  const propsList = [
    { name: 'header', type: 'ReactNode', required: true, description: 'Application header bar (DashboardHeader or AccountHeader).' },
    { name: 'beforeMain', type: 'ReactNode', description: 'Navigation strips mounted above the main content area (PrimaryNav, SecondaryNav).' },
    { name: 'children', type: 'ReactNode', required: true, description: 'Main page content rendered inside the layout shell.' },
    { name: 'mainClassName', type: 'string', description: 'Custom classes passed to the HTML <main> wrapper element.' },
  ]

  const codeExample = navigationCodeForTab(secondaryTab)

  return (
    <ComponentDocPageShell
      title={copy.title}
      badge="Stable"
      lead={copy.lead}
      preview={navigationPreviewForTab(secondaryTab)}
      usage={navigationUsageForTab(secondaryTab)}
      propsList={propsList}
      codeExample={codeExample}
      accessibility={
        <ul className="list-disc pl-4 space-y-1 text-xs sm:text-sm">
          <li><strong>Landmark Regions:</strong> Layout uses semantic <code>&lt;header&gt;</code>, <code>&lt;nav aria-label="..."&gt;</code>, and <code>&lt;main&gt;</code> tags.</li>
          <li><strong>Current Page Markers:</strong> Active links mark their state with <code>aria-current="page"</code>.</li>
          <li><strong>Skip Link:</strong> An accessible "Skip to Main Content" link is built into the GIGW top accessibility bar.</li>
        </ul>
      }
      dosAndDonts={{
        dos: [
          'Preserve the standard header, primary nav, and secondary nav layout across all KRAN modules.',
          'Always provide aria-current="page" on the active navigation item.',
          'Use NavLink for shell tabs; let the URL drive DashboardContent via useDashboardRouteIds.',
          'Support keyboard arrow and Tab navigation across menus.',
        ],
        donts: [
          'Do not dispatch setDashboardNav from NavLink onClick — it breaks open-in-new-tab behavior.',
          'Do not introduce custom nested sidebars that conflict with the horizontal nav strip.',
          'Avoid changing the gold (#f5c518) or navy (#01458e) brand shell colors.',
          'Do not remove the accessibility skip link.',
        ],
      }}
      relatedComponents={[
        { title: 'Page Layout Guidelines', to: '/design-guidelines/guide-layout/overview' },
        { title: 'List Header Actions (Module 1/2)', to: '/module-1/applications/overview' },
        { title: 'Report Overview Demo', to: '/component-workbench/data-display/report-overview' },
        { title: 'Foundations & Tokens', to: '/component-workbench/lib-foundations/tokens' },
        { title: 'Accessibility Standards', to: '/component-workbench/lib-accessibility/wcag-standards' },
      ]}
    />
  )
}
