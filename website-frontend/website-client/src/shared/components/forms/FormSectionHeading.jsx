import FormProfileSectionHeader from './FormProfileSectionHeader'
import { formProfileSectionTitleClass } from './formProfileSectionStyles'

/** Plain title token — prefer FormProfileSection / variant="profile" for in-page sections. */
export const formSectionHeadingClass = formProfileSectionTitleClass

/**
 * Section title — default `profile` matches Probity voucher sections (slate band + optional icon).
 * Use `plain` only inside an existing band or modal where a bare h3 is required.
 */
export default function FormSectionHeading({
  title,
  icon,
  variant = 'plain',
  className = '',
  titleClassName = '',
}) {
  if (!title) return null

  if (variant === 'profile') {
    return (
      <FormProfileSectionHeader
        title={title}
        icon={icon}
        className={className}
        titleClassName={titleClassName}
      />
    )
  }

  return <h3 className={`${formSectionHeadingClass} ${titleClassName} ${className}`.trim()}>{title}</h3>
}
