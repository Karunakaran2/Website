import ModuleInlineSubnav from '@/app/shell/components/ModuleInlineSubnav'

/**
 * Asset Approval–style detail tabs: full-width strip under the shell page header.
 */
export default function EnterpriseDetailTabs({ tabs, activeTabId, onTabChange, children, className = '' }) {
  return (
    <div className={className}>
      <div className="-mx-4 mb-4 border-b border-slate-200 bg-white sm:-mx-5 dark:border-slate-700 dark:bg-slate-900">
        <ModuleInlineSubnav items={tabs} activeId={activeTabId} onSelect={onTabChange} />
      </div>
      <div role="tabpanel">{children}</div>
    </div>
  )
}
