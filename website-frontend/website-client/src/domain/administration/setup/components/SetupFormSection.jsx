import FormProfileSection from '@/shared/components/forms/FormProfileSection'
import { formProfileSectionBodyClass } from '@/shared/components/forms/formProfileSectionStyles'
import { setupFormFieldClass } from '../constants/setupStyles'

/** Nested setup form block — Org UI profile section (slate header + bordered card). */
export default function SetupFormSection({
  title,
  icon,
  children,
  className = '',
  sectionId,
  bodyClassName = '',
}) {
  return (
    <FormProfileSection
      sectionId={sectionId}
      icon={icon}
      title={title}
      className={className}
      bodyClassName={`${formProfileSectionBodyClass} ${setupFormFieldClass} ${bodyClassName}`.trim()}
    >
      {children}
    </FormProfileSection>
  )
}
