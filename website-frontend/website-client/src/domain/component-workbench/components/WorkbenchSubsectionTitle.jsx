import FormSectionHeading from '@/shared/components/forms/FormSectionHeading'

/** Nested label inside a WorkbenchDemoSection — uses shared section title token (16px). */
export default function WorkbenchSubsectionTitle({ title, className = '' }) {
  if (!title) return null
  return <FormSectionHeading title={title} variant="plain" className={`mb-3 ${className}`.trim()} />
}
