import { useCallback, useMemo, useState } from 'react'
import { Upload } from 'lucide-react'
import DashboardPageHeaderActions from '@/app/shell/components/DashboardPageHeaderActions'
import { showAppToast } from '@/shared/components'
import { confirmBeforeAction, useActionConfirm } from '@/shared/components/confirm'
import { GigwButton } from '@/shared/components/buttons/gigw'
import ProbityDataTable from '@/shared/components/listing/ProbityDataTable'
import { OPENING_FIXED_ASSET_TABLE_COLUMNS } from '../constants/openingFixedAsset'
import OpeningFixedAssetUploadModal from '../components/OpeningFixedAssetUploadModal'
import OpeningFixedAssetImportDetailsModal from '../components/OpeningFixedAssetImportDetailsModal'
import {
  useListOpeningFixedAssetImportsQuery,
  useUploadOpeningFixedAssetMutation,
} from '../services/assetApi'
import { formatOpeningFixedAssetError } from '../utils/openingFixedAssetApiError'

export default function OpeningFixedAssetScreen() {
  const requestConfirm = useActionConfirm()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadFormKey, setUploadFormKey] = useState(0)
  const [selectedImport, setSelectedImport] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const { data: rows = [], isFetching, refetch } = useListOpeningFixedAssetImportsQuery()
  const [uploadOpeningFixedAsset, { isLoading: uploading }] =
    useUploadOpeningFixedAssetMutation()

  const openImportDetails = useCallback((row) => {
    setSelectedImport(row)
    setDetailsOpen(true)
  }, [])

  const closeImportDetails = useCallback(() => {
    setDetailsOpen(false)
    setSelectedImport(null)
  }, [])

  const columns = useMemo(
    () =>
      OPENING_FIXED_ASSET_TABLE_COLUMNS.map((col) => {
        if (col.key === 'fileName') {
          return {
            header: col.header,
            key: col.key,
            render: (row) => (
              <button
                type="button"
                className="text-left font-medium text-probity-brand hover:underline"
                onClick={() => openImportDetails(row)}
              >
                {row.fileName || '—'}
              </button>
            ),
          }
        }
        return {
          header: col.header,
          key: col.key,
          align: col.key === 'totalAsset' ? 'right' : undefined,
        }
      }),
    [openImportDetails],
  )

  const openUpload = () => {
    setUploadError('')
    setUploadOpen(true)
  }

  const closeUpload = () => {
    setUploadOpen(false)
    setUploadFormKey((key) => key + 1)
  }

  const handleUpload = useCallback(
    async (file) => {
      setUploadError('')
      try {
        const result = await uploadOpeningFixedAsset({ file }).unwrap()
        const count = result.rowCount ?? result.totalAsset ?? 0
        showAppToast(`Uploaded ${count} record(s) successfully.`, 'success')
        closeUpload()
        refetch()
      } catch (error) {
        const message = formatOpeningFixedAssetError(error)
        setUploadError(message)
        showAppToast(message, 'error')
      }
    },
    [refetch, uploadOpeningFixedAsset],
  )

  const handleUploadRequest = useCallback(
    (file) => {
      confirmBeforeAction(requestConfirm, {
        action: 'upload',
        recordLabel: file.name,
        stack: 'nested',
        showSuccessToast: false,
        runAction: () => handleUpload(file),
      })
    },
    [handleUpload, requestConfirm],
  )

  return (
    <>
      <DashboardPageHeaderActions>
        <GigwButton type="button" variant="primary" icon={Upload} onClick={openUpload}>
          Upload Document
        </GigwButton>
      </DashboardPageHeaderActions>

      <ProbityDataTable
        columns={columns}
        data={rows}
        keyExtractor={(row) => row.idMask}
        loading={isFetching}
        loadingMessage="Loading records…"
        emptyMessage="No data available in table"
        className="w-full"
      />

      <OpeningFixedAssetUploadModal
        open={uploadOpen}
        onClose={closeUpload}
        formKey={uploadFormKey}
        uploading={uploading}
        uploadError={uploadError}
        onUpload={handleUploadRequest}
      />

      <OpeningFixedAssetImportDetailsModal
        open={detailsOpen}
        importRow={selectedImport}
        onClose={closeImportDetails}
        onSaved={refetch}
      />
    </>
  )
}
