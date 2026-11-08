import FormSkeleton from '@/shared/components/skeleton/FormSkeleton'
import SkeletonBlock from '@/shared/components/skeleton/SkeletonBlock'
import ProbityTableSkeletonBody from '@/shared/components/skeleton/ProbityTableSkeletonBody'
import {
  dataDisplaySectionTitleClass,
  dataDisplayShellClass,
} from '@/shared/components/display/dataDisplayStyles'
import {
  formProfileSectionHeaderClass,
  formProfileSectionShellClass,
} from '@/shared/components/forms/formProfileSectionStyles'
import {
  PROBITY_TABLE_BODY_SCROLL_CLASS,
  PROBITY_TABLE_CLASS,
  PROBITY_TABLE_HEAD_CLASS,
  PROBITY_TABLE_HEAD_ROW_CLASS,
  PROBITY_TABLE_SHELL_CLASS,
  PROBITY_TABLE_TH_CLASS,
} from '@/shared/components/listing/listingTableStyles'

/** Read-only OrgDataDisplay-style block for view modals */
export function AssetOrgDataDisplaySkeleton({
  sectionTitle = true,
  fields = 15,
  cols = 3,
  loadingMessage = 'Loading asset details…',
}) {
  return (
    <div
      className={dataDisplayShellClass}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {sectionTitle ? (
        <div className={dataDisplaySectionTitleClass}>
          <SkeletonBlock className="h-4 w-44 sm:w-56" />
        </div>
      ) : null}
      <div className="p-4 sm:p-5">
        <FormSkeleton fields={fields} cols={cols} />
      </div>
      <span className="sr-only">{loadingMessage}</span>
    </div>
  )
}

function AssetDocumentTableSkeleton({ columns = 5, rows = 3 }) {
  return (
    <div className={PROBITY_TABLE_SHELL_CLASS} aria-hidden="true">
      <div className={PROBITY_TABLE_BODY_SCROLL_CLASS}>
        <table className={PROBITY_TABLE_CLASS}>
          <caption className="sr-only">Document Info</caption>
          <thead className={PROBITY_TABLE_HEAD_CLASS}>
            <tr className={PROBITY_TABLE_HEAD_ROW_CLASS}>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={`doc-sk-head-${index}`} className={PROBITY_TABLE_TH_CLASS}>
                  <SkeletonBlock className="h-3 w-24" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <ProbityTableSkeletonBody rows={rows} columns={columns} />
          </tbody>
        </table>
      </div>
    </div>
  )
}

/** View Asset Information modal — capitalisation grid + document table */
export function AssetInformationViewSkeleton({
  loadingMessage = 'Loading asset details…',
}) {
  return (
    <div className="space-y-4">
      <AssetOrgDataDisplaySkeleton loadingMessage={loadingMessage} />
      <AssetDocumentTableSkeleton />
    </div>
  )
}

/**
 * Add/edit modal placeholder — matches FormProfileSection + field grid.
 * @param {{ fields?: number, cols?: number }[]} [sections]
 */
export default function AssetEditFormSkeleton({
  sections = [{ fields: 12, cols: 3 }],
  showFooter = true,
  loadingMessage = 'Loading form details…',
}) {
  const blocks = sections.length ? sections : [{ fields: 12, cols: 3 }]

  return (
    <div className="space-y-4" role="status" aria-live="polite" aria-busy="true">
      {blocks.map((section, index) => (
        <section
          key={`asset-edit-skeleton-${index}`}
          className={formProfileSectionShellClass}
        >
          <div className={formProfileSectionHeaderClass}>
            <SkeletonBlock className="h-3 w-28 sm:w-40" />
          </div>
          <div className="p-4 sm:p-5">
            <FormSkeleton
              fields={section.fields ?? 12}
              cols={section.cols ?? 3}
            />
          </div>
        </section>
      ))}
      {showFooter ? (
        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <SkeletonBlock className="h-10 w-20 rounded-md" />
          <SkeletonBlock className="h-10 w-24 rounded-md" />
        </div>
      ) : null}
      <span className="sr-only">{loadingMessage}</span>
    </div>
  )
}
