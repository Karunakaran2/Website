import FormProfileSection from '@/shared/components/forms/FormProfileSection'
import { formProfileSectionBodyClass } from '@/shared/components/forms/formProfileSectionStyles'

/**
 * In-form section card (slate header + icon) — use only when a page has
 * multiple distinct section types (e.g. sales voucher, setup approval bank vs party).
 * Single-block pages rely on PageSectionHeaderBar only; do not wrap tables/lists here.
 */
export default function ModuleInnerCard({
  children,
  title,
  icon,
  headerTrailing = null,
  className = '',
  bodyClassName = '',
  sectionId,
}) {
  return (
    <FormProfileSection
      title={title}
      icon={icon}
      headerTrailing={headerTrailing}
      sectionId={sectionId}
      className={className}
      bodyClassName={`${formProfileSectionBodyClass} overflow-visible ${bodyClassName}`.trim()}
    >
      {children}
    </FormProfileSection>
  )
}
