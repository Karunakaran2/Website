import { useRef, useState } from 'react'
import { Download } from 'lucide-react'
import { showAppToast } from '@/shared/components'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { DomainFormFooter } from '@/shared/components/domain'
import {
  FieldError,
  FieldHint,
  FormLabel,
  inputFieldClass,
} from '@/shared/components/forms/FormFields'
import { OPENING_FIXED_ASSET_ACCEPT } from '../constants/openingFixedAsset'
import { downloadOpeningFixedAssetTemplate } from '../utils/openingFixedAssetDownload'

export default function OpeningFixedAssetUploadPanel({
  uploading = false,
  onUpload,
  uploadError = '',
  onCancel,
  inputId = 'opening-fixed-asset-excel',
}) {
  const fileInputRef = useRef(null)
  const [fileName, setFileName] = useState('')
  const [localError, setLocalError] = useState('')

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    setFileName(file?.name ?? '')
    setLocalError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      setLocalError('Attach Excel is required.')
      return
    }
    setLocalError('')
    onUpload(file)
  }

  const displayError = uploadError || localError

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/40 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="m-0 text-sm font-semibold text-slate-800 dark:text-slate-100">
            Excel format
          </p>
          <p className="m-0 mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            Download the template for the required columns, fill in your opening fixed asset details
            in Excel, then attach the completed file below.
          </p>
        </div>
        <GigwButton
          type="button"
          variant="primary"
          className="shrink-0 self-start sm:self-center"
          icon={Download}
          onClick={() => {
            downloadOpeningFixedAssetTemplate().catch(() => {
              showAppToast('Unable to download template.', 'error')
            })
          }}
        >
          Download Excel
        </GigwButton>
      </div>

      <div className="min-w-0">
        <FormLabel label="Attach Excel" required htmlFor={inputId} />
        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept={OPENING_FIXED_ASSET_ACCEPT}
          className={`mt-1 ${inputFieldClass} file:mr-3 file:rounded file:border-0 file:bg-[#e6f0f7] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[#005a9c]`}
          onChange={handleFileChange}
        />
        {fileName ? (
          <FieldHint>
            Selected file:{' '}
            <span className="font-medium text-slate-700 dark:text-slate-200">{fileName}</span>
          </FieldHint>
        ) : (
          <FieldHint>Accepted formats: .xls, .xlsx</FieldHint>
        )}
        <FieldError message={displayError} />
      </div>

      {onCancel ? (
        <DomainFormFooter
          onCancel={onCancel}
          submitLabel="Upload Document"
          submitLoading={uploading}
          showSubmit
        />
      ) : null}
    </form>
  )
}
