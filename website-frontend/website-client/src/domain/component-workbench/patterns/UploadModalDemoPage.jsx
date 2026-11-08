import { useState } from 'react'
import FormModal from '@/shared/components/modals/FormModal'
import DomainFormFooter from '@/shared/components/domain/DomainFormFooter'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { GIGW_ADD_ICON } from '@/shared/components/buttons/gigw/gigwLucideIcons'
import {
  ActionConfirmProvider,
  useActionConfirm,
  confirmBeforeAction,
} from '@/shared/components/confirm'
import { showAppToast } from '@/shared/components/toast/appToast'
import { WORKBENCH_SECTION_CARD_CLASS } from '../constants/workbenchPreviewStyles'

function UploadModalBody({ fileName, onFileChange }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-[13px] text-slate-700">
        <p className="font-semibold text-slate-900 mb-1">Template</p>
        <p className="mb-3">Download the Excel template, fill rows, then attach the completed file.</p>
        <GigwButton type="button" variant="outlineUtility" className="text-[12px]">
          Download Excel template
        </GigwButton>
      </div>
      <div>
        <label htmlFor="workbench-upload-file" className="block text-[13px] font-semibold text-slate-700 mb-1">
          Attach file
        </label>
        <input
          id="workbench-upload-file"
          type="file"
          accept=".xlsx,.xls,.csv"
          className="block w-full text-[13px] text-slate-600 file:mr-3 file:rounded-md file:border file:border-slate-200 file:bg-white file:px-3 file:py-1.5 file:text-[12px] file:font-semibold"
          onChange={(e) => onFileChange(e.target.files?.[0]?.name ?? '')}
        />
        {fileName ? (
          <p className="mt-2 text-[12px] text-slate-600">
            Selected: <strong>{fileName}</strong>
          </p>
        ) : null}
      </div>
    </div>
  )
}

function UploadDemoInner() {
  const requestConfirm = useActionConfirm()
  const [open, setOpen] = useState(false)
  const [fileName, setFileName] = useState('')

  const handleUpload = () => {
    if (!fileName) {
      showAppToast('Select a file before uploading.', 'error')
      return
    }
    confirmBeforeAction(requestConfirm, {
      action: 'upload',
      recordLabel: fileName,
      stack: 'nested',
      runAction: async () => {
        setOpen(false)
        setFileName('')
        showAppToast('Upload confirmed (demo — no file sent).', 'success', { action: 'upload' })
      },
    })
  }

  return (
    <>
      <GigwButton type="button" variant="primary" icon={GIGW_ADD_ICON} onClick={() => setOpen(true)}>
        Upload document
      </GigwButton>
      <FormModal
        open={open}
        onClose={() => setOpen(false)}
        title="Upload import file"
        size="3xl"
        showFooter={false}
      >
        <form
          className="flex flex-col gap-4"
          id="workbench-upload-form"
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            handleUpload()
          }}
        >
          <UploadModalBody fileName={fileName} onFileChange={setFileName} />
          <DomainFormFooter
            onCancel={() => setOpen(false)}
            submitLabel="Upload Document"
            form="workbench-upload-form"
          />
        </form>
      </FormModal>
    </>
  )
}

export default function UploadModalDemoPage() {
  return (
    <ActionConfirmProvider>
      <div className="space-y-6 pb-12 w-full min-w-0">
        <div className={WORKBENCH_SECTION_CARD_CLASS}>
          <h2 className="text-base font-bold text-slate-900">Upload / import modal</h2>
          <p className="mt-1 text-[13px] text-slate-600 leading-relaxed">
            Pattern used in asset import and setup upload flows: slate template panel, file input,{' '}
            <code className="text-[12px]">DomainFormFooter</code>, and{' '}
            <code className="text-[12px]">confirmBeforeAction</code> with action{' '}
            <code className="text-[12px]">upload</code>.
          </p>
        </div>
        <div className={WORKBENCH_SECTION_CARD_CLASS}>
          <UploadDemoInner />
        </div>
      </div>
    </ActionConfirmProvider>
  )
}
