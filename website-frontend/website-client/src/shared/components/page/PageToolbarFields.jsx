import { GigwButton } from '@/shared/components/buttons/gigw'
import { InputField, OrgDateField, SelectField } from '@/shared/components/forms'
import { PAGE_TOOLBAR_GIGW_BUTTON_CLASS } from '@/shared/components/forms/formControlDimensions'

/** GigwButton aligned to toolbar field height (h-11). */
export function PageToolbarGigwButton({ className = '', size = 'form', ...props }) {
  return (
    <GigwButton
      size={size}
      className={`${PAGE_TOOLBAR_GIGW_BUTTON_CLASS} ${className}`.trim()}
      {...props}
    />
  )
}

/** Horizontal toolbars — control only (label stays for a11y, visually hidden). */
export const PAGE_TOOLBAR_FIELD_WRAP =
  'mb-0 w-full min-w-0 sm:w-auto sm:min-w-[100px] [&_label]:sr-only [&_.field-label]:sr-only [&_.org-probity-control-slot]:!mt-0'

/** Optional visible caption above control (filter panels, not inline toolbars). */
export const PAGE_TOOLBAR_FIELD_WRAP_LABELED =
  'mb-0 w-full min-w-0 sm:w-auto sm:min-w-[100px] [&_label]:mb-0 [&_label]:shrink-0 [&_label]:text-[12px] [&_label]:font-medium [&_label]:text-slate-700'

export function PageToolbarSelect({
  label,
  name,
  value,
  options,
  onChange,
  wrapperClassName = '',
  minWidth = 'min-w-[120px]',
  showLabel = false,
}) {
  const wrapClass = showLabel ? PAGE_TOOLBAR_FIELD_WRAP_LABELED : PAGE_TOOLBAR_FIELD_WRAP

  return (
    <SelectField
      label={label}
      name={name}
      value={value ?? ''}
      options={options}
      onChange={(e) => onChange(e.target.value)}
      wrapperClassName={`${wrapClass} ${minWidth} ${wrapperClassName}`.trim()}
    />
  )
}

export function PageToolbarDate({
  label,
  name,
  value,
  onChange,
  showLabel = false,
  wrapperClassName = '',
}) {
  const wrapClass = showLabel ? PAGE_TOOLBAR_FIELD_WRAP_LABELED : PAGE_TOOLBAR_FIELD_WRAP

  return (
    <OrgDateField
      label={label}
      name={name}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      wrapperClassName={`${wrapClass} ${wrapperClassName}`.trim()}
    />
  )
}

export function PageToolbarSearchInput({
  id,
  name = 'pageToolbarSearch',
  value,
  onChange,
  placeholder = 'Search…',
  className = 'min-w-[160px] flex-1',
}) {
  return (
    <InputField
      id={id}
      name={name}
      label="Search"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      wrapperClassName={`mb-0 ${className} [&_label]:sr-only`}
    />
  )
}
