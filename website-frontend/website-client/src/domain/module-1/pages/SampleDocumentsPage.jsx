import { useCallback, useMemo, useState } from 'react'
import SampleModuleLayout from '../layouts/SampleModuleLayout'
import { FormLabel, FieldHint, FieldError } from '@/shared/components/forms'
import StatusChip from '@/shared/components/status/StatusChip'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { showAppToast } from '@/shared/components'
import { useListPageHeaderActions } from '@/shared/hooks/useListPageHeaderActions'
import { PageContentToolbar, PageToolbarSearchInput } from '@/shared/components/page'
import { exportSimpleCsv } from '@/shared/utils/exportSimpleCsv'

const INITIAL_DOCS = [
  {
    id: 'DOC-01',
    name: 'Sanction_Proposal_INFRA-01.pdf',
    type: 'Proposal',
    status: 'Verified',
    uploadedOn: '15-09-2026',
  },
  {
    id: 'DOC-02',
    name: 'Budget_Certificate_FY26.pdf',
    type: 'Financial',
    status: 'Pending verification',
    uploadedOn: '20-09-2026',
  },
]

export default function SampleDocumentsPage() {
  const [docs, setDocs] = useState(INITIAL_DOCS)
  const [fileError, setFileError] = useState('')
  const [search, setSearch] = useState('')

  const handleUpload = (file) => {
    setFileError('')
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setFileError('Maximum file size is 5 MB.')
      return
    }
    setDocs((prev) => [
      {
        id: `DOC-${Date.now()}`,
        name: file.name,
        type: 'Attachment',
        status: 'Pending verification',
        uploadedOn: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      },
      ...prev,
    ])
    showAppToast('Document added to the register.', 'success', { action: 'upload' })
  }

  const filteredDocs = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return docs
    return docs.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q) ||
        d.status.toLowerCase().includes(q),
    )
  }, [docs, search])

  const handleExport = useCallback(() => {
    const ok = exportSimpleCsv(
      filteredDocs,
      [
        { key: 'name', header: 'Document Name' },
        { key: 'type', header: 'Document Type' },
        { key: 'status', header: 'Status' },
        { key: 'uploadedOn', header: 'Uploaded On' },
      ],
      'documents.csv',
    )
    if (ok) showAppToast('Export prepared successfully.', 'success', { action: 'export' })
    else showAppToast('No documents to export.', 'warning')
  }, [filteredDocs])

  useListPageHeaderActions({
    onExport: handleExport,
  })

  return (
    <SampleModuleLayout>
      <PageContentToolbar>
        <PageToolbarSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search documents…"
          className="min-w-[200px] flex-1 sm:max-w-[280px]"
        />
      </PageContentToolbar>
      <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3 max-w-xl">
        <FormLabel htmlFor="doc-upload">Upload Attachment</FormLabel>
        <input
          id="doc-upload"
          type="file"
          className="block w-full text-xs text-slate-700"
          onChange={(e) => handleUpload(e.target.files?.[0])}
        />
        <FieldHint>Accepted formats: PDF, images, and office documents up to 5 MB.</FieldHint>
        <FieldError message={fileError} />
      </div>
      <ul className="space-y-2">
        {filteredDocs.map((doc) => (
          <li
            key={doc.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm"
          >
            <div>
              <p className="font-semibold text-slate-900 m-0">{doc.name}</p>
              <p className="text-xs text-slate-500 m-0 mt-0.5">
                {doc.type} · {doc.uploadedOn}
              </p>
            </div>
            <StatusChip label={doc.status} />
          </li>
        ))}
      </ul>
      <GigwButton type="button" variant="outlineUtility" onClick={() => setDocs(INITIAL_DOCS)}>
        Reset Register
      </GigwButton>
    </SampleModuleLayout>
  )
}
