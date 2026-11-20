import { useEffect } from 'react'
import { useProbityForm } from '@/shared/utils/useProbityForm'
import { DomainFormFooter } from '@/shared/components'
import { InputField, SelectField, TextAreaField } from '@/shared/components/forms'
import CmsMediaUploadField from '@/domain/website-cms/components/CmsMediaUploadField'
import { NEWS_ACTIVE_STATUS } from '../constants/newsRequest'

const ACTIVE_OPTIONS = [
  { value: NEWS_ACTIVE_STATUS.YES, label: 'Yes' },
  { value: NEWS_ACTIVE_STATUS.NO, label: 'No' },
]

const DEFAULT_VALUES = {
  title: '',
  newsDescription: '',
  publishDate: '',
  imagePath: '',
  newsLink: '',
  activeStatus: NEWS_ACTIVE_STATUS.YES,
}

export default function ContentNewsForm({ initialValues, isEdit, saving, onCancel, onSubmit }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useProbityForm({ defaultValues: DEFAULT_VALUES })

  useEffect(() => {
    reset({ ...DEFAULT_VALUES, ...initialValues })
  }, [initialValues, reset])

  return (
    <form className="flex min-w-0 flex-col gap-4" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          label="Title"
          required
          {...register('title', { required: 'Title is required' })}
          error={errors.title?.message}
        />
        <InputField
          label="Publish date"
          type="datetime-local"
          {...register('publishDate')}
          error={errors.publishDate?.message}
        />
        <div className="md:col-span-2">
          <TextAreaField
            label="Description"
            rows={3}
            {...register('newsDescription')}
            error={errors.newsDescription?.message}
          />
        </div>
        <CmsMediaUploadField
          control={control}
          name="imagePath"
          fieldId="imagePath"
          fieldType="image"
          label="Cover image"
          error={errors.imagePath?.message}
        />
        <InputField label="Link" {...register('newsLink')} error={errors.newsLink?.message} />
        <SelectField
          label="Active"
          options={ACTIVE_OPTIONS}
          {...register('activeStatus')}
          error={errors.activeStatus?.message}
        />
      </div>
      <DomainFormFooter
        onCancel={onCancel}
        submitLabel={isEdit ? 'Update' : 'Save'}
        submitLoading={saving}
      />
    </form>
  )
}