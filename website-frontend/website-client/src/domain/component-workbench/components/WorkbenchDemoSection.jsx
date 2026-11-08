import FormProfileSection from '@/shared/components/forms/FormProfileSection'
import { ModuleSectionSubtitle } from '@/shared/components/typography'

/**
 * In-page demo block for Component Workbench — same section chrome as domain forms
 * (FormProfileSection / FormProfileSectionHeader).
 */
export default function WorkbenchDemoSection({
  title,
  description,
  children,
  icon,
  sectionId,
  className = '',
  bodyClassName,
  headerTrailing = null,
}) {
  return (
    <FormProfileSection
      sectionId={sectionId}
      title={title}
      icon={icon}
      className={className}
      bodyClassName={bodyClassName}
      headerTrailing={headerTrailing}
    >
      {description ? (
        <ModuleSectionSubtitle className="mb-4 max-w-4xl">{description}</ModuleSectionSubtitle>
      ) : null}
      {children}
    </FormProfileSection>
  )
}
