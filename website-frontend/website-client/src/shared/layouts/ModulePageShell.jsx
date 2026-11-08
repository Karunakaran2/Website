import AccessibilityBar from '@/shared/components/AccessibilityBar'
import { PageSectionHeaderBar } from '@/shared/components/page'
import ModuleContentShell from '@/shared/layouts/ModuleContentShell'
import ModulePageContent from '@/shared/layouts/ModulePageContent'

/**
 * SPFO ModuleLayout chrome: accessibility bar above module header (non-dense).
 */
export function ModuleChrome({ header, children }) {
  return (
    <>
      <div className="z-[60] w-full shrink-0 overflow-visible bg-white shadow-none">
        <AccessibilityBar optionsPortal />
        {header}
      </div>
      {children}
    </>
  )
}

/** Card panel + slate-100 page header (non-dashboard MainLayout pages). */
export default function ModulePageShell({
  title,
  subtitle,
  actions,
  children,
  bodyClassName,
  hidePageHeader = false,
}) {
  return (
    <ModuleContentShell
      bodyClassName={bodyClassName}
      header={
        hidePageHeader || !title ? null : (
          <PageSectionHeaderBar title={title} subtitle={subtitle} actions={actions} />
        )
      }
    >
      <ModulePageContent>{children}</ModulePageContent>
    </ModuleContentShell>
  )
}
