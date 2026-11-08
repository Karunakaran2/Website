import FormProfileSectionHeader from './FormProfileSectionHeader'
import {
  formProfileSectionBodyClass,
  formProfileSectionShellClass,
} from './formProfileSectionStyles'

/**
 * Probity form section card (slate-100 header + icon + body padding).
 */
export default function FormProfileSection({
  icon: Icon,
  title,
  headerTrailing = null,
  children,
  className = '',
  bodyClassName = formProfileSectionBodyClass,
  sectionId,
}) {
  if (!title && !children) return null

  return (
    <section id={sectionId} className={`${formProfileSectionShellClass} ${className}`.trim()}>
      {title ? (
        <FormProfileSectionHeader title={title} icon={Icon} trailing={headerTrailing} />
      ) : null}
      <div className={bodyClassName}>{children}</div>
    </section>
  )
}
