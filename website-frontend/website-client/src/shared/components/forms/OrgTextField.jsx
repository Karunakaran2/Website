import { forwardRef } from 'react'
import { Controller } from 'react-hook-form'
import { InputField } from '@/shared/components/forms'
import {
  fieldUsesUppercaseClass,
  resolveProbityRules,
} from '@/shared/utils/fieldValidationRules'

function mergeRefs(...refs) {
  return (node) => {
    refs.forEach((item) => {
      if (!item) return
      if (typeof item === 'function') item(node)
      else item.current = node
    })
  }
}

const OrgTextFieldInner = forwardRef(function OrgTextFieldInner(
  {
    register,
    name,
    label,
    required = false,
    readOnly = false,
    disabled = false,
    placeholder = '',
    type = 'text',
    className = '',
    wrapperClassName = 'min-w-0',
    id,
    hint,
    rules,
    resolvedError,
    value,
    onChange,
    onBlur,
  },
  ref,
) {
  const mergedRules = resolveProbityRules(name, { required, label, rules })
  const registration = register ? register(name, mergedRules) : {}
  const { ref: registrationRef, ...registrationProps } = registration
  const uppercaseClass = fieldUsesUppercaseClass(name) ? 'uppercase' : ''
  const mergedClassName = [uppercaseClass, className].filter(Boolean).join(' ')

  const controlledProps =
    register != null
      ? registrationProps
      : {
          value: value ?? '',
          onChange,
          onBlur,
        }

  return (
    <div className="min-w-0">
      <InputField
        ref={mergeRefs(ref, registrationRef)}
        id={id}
        name={name}
        label={label}
        required={required}
        readOnly={readOnly}
        disabled={disabled}
        placeholder={placeholder}
        type={type}
        hint={hint}
        wrapperClassName={wrapperClassName}
        className={mergedClassName || undefined}
        error={resolvedError}
        {...controlledProps}
      />
    </div>
  )
})

const OrgTextFieldWithControl = forwardRef(function OrgTextFieldWithControl(props, ref) {
  const {
    control,
    name,
    error: externalError,
    rules,
    required,
    label,
    ...rest
  } = props
  const mergedRules = resolveProbityRules(name, { required, label, rules })

  return (
    <Controller
      name={name}
      control={control}
      rules={mergedRules}
      render={({ field, fieldState }) => (
        <OrgTextFieldInner
          ref={mergeRefs(ref, field.ref)}
          name={name}
          label={label}
          required={required}
          rules={rules}
          resolvedError={externalError ?? fieldState.error?.message}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          {...rest}
        />
      )}
    />
  )
})

const OrgTextField = forwardRef(function OrgTextField(props, ref) {
  if (props.control) {
    return <OrgTextFieldWithControl ref={ref} {...props} />
  }
  return (
    <OrgTextFieldInner ref={ref} resolvedError={props.error} {...props} />
  )
})

export default OrgTextField
