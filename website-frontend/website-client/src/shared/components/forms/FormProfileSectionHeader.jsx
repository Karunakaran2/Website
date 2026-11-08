import {
  FORM_SECTION_ICON_SIZE,
  formProfileSectionHeaderClass,
  formProfileSectionTitleClass,
  formSectionIconClass,
} from './formProfileSectionStyles'

/**
 * In-page section band — same chrome as Probity “Sales voucher information”
 * (FormProfileSection / VoucherFormSection).
 */
export default function FormProfileSectionHeader({
  title,
  icon: Icon,
  trailing = null,
  className = '',
  titleClassName = '',
}) {
  if (!title) return null

  return (
    <div className={`${formProfileSectionHeaderClass} ${className}`.trim()}>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {Icon ? (
          <Icon size={FORM_SECTION_ICON_SIZE} className={formSectionIconClass} aria-hidden />
        ) : null}
        <h3 className={`${formProfileSectionTitleClass} ${titleClassName}`.trim()}>{title}</h3>
      </div>
      {trailing ? <div className="flex shrink-0 items-center gap-2">{trailing}</div> : null}
    </div>
  )
}
