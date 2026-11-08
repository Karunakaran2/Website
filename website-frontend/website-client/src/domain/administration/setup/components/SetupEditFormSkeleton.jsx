import FormSkeleton from '@/shared/components/skeleton/FormSkeleton'
import SkeletonBlock from '@/shared/components/skeleton/SkeletonBlock'
import {
  formProfileSectionHeaderClass,
  formProfileSectionShellClass,
} from '@/shared/components/forms/formProfileSectionStyles'

const DEFAULT_SECTION = { fields: 9, cols: 3 }

/**
 * Edit-modal placeholder — matches SetupFormSection + field grid layout.
 * @param {{ fields?: number, cols?: number }[]} [sections]
 */
export default function SetupEditFormSkeleton({
  sections = [DEFAULT_SECTION],
  showFooter = true,
  loadingMessage = 'Loading form details…',
}) {
  const blocks = sections.length ? sections : [DEFAULT_SECTION]

  return (
    <div className="space-y-4" role="status" aria-live="polite" aria-busy="true">
      {blocks.map((section, index) => (
        <section
          key={`setup-edit-skeleton-${index}`}
          className={formProfileSectionShellClass}
        >
          <div className={formProfileSectionHeaderClass}>
            <SkeletonBlock className="h-3 w-28 sm:w-36" />
          </div>
          <div className="p-4 sm:p-5">
            <FormSkeleton
              fields={section.fields ?? DEFAULT_SECTION.fields}
              cols={section.cols ?? DEFAULT_SECTION.cols}
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
