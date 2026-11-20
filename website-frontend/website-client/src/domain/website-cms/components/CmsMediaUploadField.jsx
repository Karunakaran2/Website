import { useState } from 'react'
import { Controller } from 'react-hook-form'
import { uploadMediaFile, resolveMediaPublicUrl } from '@/domain/website-media/services/uploadMediaFile'
import { showAppToast } from '@/shared/components'

const ACCEPT_BY_KIND = {
  image: 'image/*,.svg',
  document: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,application/pdf',
  file: '*/*',
}

function uploadKindFromField(fieldId, fieldType) {
  if (fieldType === 'image' || fieldType === 'document' || fieldType === 'file') {
    return fieldType === 'image' ? 'image' : fieldType === 'document' ? 'document' : 'file'
  }
  const id = String(fieldId || '').toLowerCase()
  if (id.includes('attachment') || id.includes('document') || id.includes('resume') || id.includes('datasheet')) {
    return 'document'
  }
  if (id.includes('image') || id.includes('logo') || id.includes('photo') || id.includes('banner')) {
    return 'image'
  }
  return 'file'
}

export default function CmsMediaUploadField({
  control,
  name,
  label,
  fieldId,
  fieldType,
  error,
  disabled,
}) {
  const kind = uploadKindFromField(fieldId ?? name, fieldType)
  const accept = ACCEPT_BY_KIND[kind] || ACCEPT_BY_KIND.file
  const [uploading, setUploading] = useState(false)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const previewUrl = kind === 'image' ? resolveMediaPublicUrl(field.value) : ''
        const handleFile = async (event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (!file) {
            return
          }
          setUploading(true)
          try {
            const result = await uploadMediaFile(file, { kind })
            if (result.error) {
              showAppToast({ variant: 'error', message: result.error.data || 'Upload failed' })
              return
            }
            const url = result.data?.url
            if (url) {
              field.onChange(url)
              showAppToast({ variant: 'success', message: 'File uploaded.' })
            }
          } catch {
            showAppToast({ variant: 'error', message: 'Upload failed' })
          } finally {
            setUploading(false)
          }
        }

        return (
          <div className="flex min-w-0 flex-col gap-2">
            <span className="text-sm font-medium text-slate-800">{label}</span>
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex cursor-pointer items-center rounded border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50">
                {uploading ? 'Uploading…' : kind === 'image' ? 'Choose image' : 'Choose file'}
                <input
                  type="file"
                  className="sr-only"
                  accept={accept}
                  disabled={disabled || uploading}
                  onChange={handleFile}
                />
              </label>
              {field.value ? (
                <button
                  type="button"
                  className="text-sm text-rose-700 underline"
                  disabled={disabled || uploading}
                  onClick={() => field.onChange('')}
                >
                  Remove
                </button>
              ) : null}
            </div>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt=""
                className="mt-1 max-h-40 w-auto max-w-full rounded border border-slate-200 object-contain"
              />
            ) : null}
            {field.value ? (
              <p className="break-all text-xs text-slate-600">
                {kind === 'document' ? 'Document: ' : 'Stored at: '}
                <a href={resolveMediaPublicUrl(field.value)} target="_blank" rel="noreferrer" className="text-[#01458e]">
                  {field.value}
                </a>
              </p>
            ) : (
              <p className="text-xs text-slate-500">No file uploaded yet.</p>
            )}
            {error ? <p className="text-xs text-rose-700">{error}</p> : null}
          </div>
        )
      }}
    />
  )
}