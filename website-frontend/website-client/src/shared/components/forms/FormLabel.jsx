import {
  formCheckboxControlClass,
  formChoiceControlClass,
  formFieldWrapperClass,
  formLabelClass,
  formLegendClass,
  formOptionLabelClass,
  formRequiredMarkClass,
} from '@/shared/components/typography/typographyStyles'

export {
  formLabelClass as formFieldLabelClass,
  formLegendClass as formFieldLegendClass,
  formCheckboxControlClass,
  formChoiceControlClass,
  formOptionLabelClass,
  formRequiredMarkClass,
  formFieldWrapperClass,
}

/**
 * GIGW form label — 13px medium, 20px line (Tailwind via {@link formLabelClass}).
 */
export default function FormLabel({
  label,
  children,
  required = false,
  htmlFor,
  as,
  className = '',
}) {
  const text = children ?? label
  if (text == null || text === '') {
    return null
  }

  const content = (
    <>
      {text}
      {required ? <span className={formRequiredMarkClass}> *</span> : null}
    </>
  )

  const extra = className.trim()
  let Tag = 'span'
  let baseClass = formLabelClass

  if (as === 'legend') {
    Tag = 'legend'
    baseClass = formLegendClass
  } else if (as === 'label' || (htmlFor && as !== 'span')) {
    Tag = 'label'
    baseClass = formLabelClass
  } else if (as === 'span') {
    Tag = 'span'
    baseClass = formLabelClass
  } else if (htmlFor) {
    Tag = 'label'
    baseClass = formLabelClass
  }

  const mergedClass = `${baseClass} ${extra}`.trim()

  if (Tag === 'label') {
    return (
      <label htmlFor={htmlFor} className={mergedClass}>
        {content}
      </label>
    )
  }

  if (Tag === 'legend') {
    return <legend className={mergedClass}>{content}</legend>
  }

  return <span className={mergedClass}>{content}</span>
}
