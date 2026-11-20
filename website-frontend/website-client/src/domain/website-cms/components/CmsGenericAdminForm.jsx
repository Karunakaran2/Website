import { useEffect, useMemo } from 'react'
import { useProbityForm } from '@/shared/utils/useProbityForm'
import { DomainFormFooter } from '@/shared/components'
import { InputField, SelectField, TextAreaField } from '@/shared/components/forms'
import CmsMediaUploadField from './CmsMediaUploadField'
import { NEWS_ACTIVE_STATUS } from '@/domain/website-content/constants/newsRequest'

const ACTIVE_OPTIONS = [
  { value: NEWS_ACTIVE_STATUS.YES, label: 'Yes' },
  { value: NEWS_ACTIVE_STATUS.NO, label: 'No' },
]

function isMediaUploadField(field) {
  if (field?.type === 'image' || field?.type === 'document' || field?.type === 'file') {
    return true
  }
  const id = String(field?.id || '')
  return /imagePath|image_path|logo|attachmentPath|attachment_path|photo/i.test(id)
}

function defaultValuesFromFields(fields) {
  const values = {}
  for (const field of fields) {
    values[field.id] = field.defaultValue ?? ''
  }
  return values
}

export default function CmsGenericAdminForm({ fields, initialValues, isEdit, saving, onCancel, onSubmit }) {
  const defaults = useMemo(() => defaultValuesFromFields(fields), [fields])
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useProbityForm({ defaultValues: defaults })

  useEffect(() => {
    reset({ ...defaults, ...initialValues })
  }, [defaults, initialValues, reset])

  return (
    <form className="flex min-w-0 flex-col gap-4" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => {
          if (field.type === 'active') {
            return (
              <SelectField
                key={field.id}
                label={field.label}
                options={ACTIVE_OPTIONS}
                {...register(field.id)}
                error={errors[field.id]?.message}
              />
            )
          }
          if (field.type === 'textarea') {
            return (
              <div key={field.id} className="md:col-span-2">
                <TextAreaField
                  label={field.label}
                  rows={4}
                  {...register(field.id, field.required ? { required: `${field.label} is required` } : {})}
                  error={errors[field.id]?.message}
                />
              </div>
            )
          }
          if (isMediaUploadField(field)) {
            return (
              <div key={field.id} className={field.type === 'document' ? 'md:col-span-2' : undefined}>
                <CmsMediaUploadField
                  control={control}
                  name={field.id}
                  fieldId={field.id}
                  fieldType={field.type}
                  label={field.label}
                  error={errors[field.id]?.message}
                />
              </div>
            )
          }
          return (
            <InputField
              key={field.id}
              label={field.label}
              required={field.required}
              type={field.type === 'number' ? 'number' : 'text'}
              {...register(field.id, field.required ? { required: `${field.label} is required` } : {})}
              error={errors[field.id]?.message}
            />
          )
        })}
      </div>
      <DomainFormFooter
        onCancel={onCancel}
        submitLabel={isEdit ? 'Update' : 'Save'}
        saving={saving}
      />
    </form>
  )
}