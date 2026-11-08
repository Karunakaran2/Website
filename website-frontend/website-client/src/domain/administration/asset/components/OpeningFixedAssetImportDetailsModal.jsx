import { useCallback, useMemo } from 'react'
import { showAppToast } from '@/shared/components'
import { FormModal } from '@/shared/components'
import { DomainFormFooter } from '@/shared/components/domain'
import { confirmBeforeAction, useActionConfirm } from '@/shared/components/confirm'
import ProbityDataTable from '@/shared/components/listing/ProbityDataTable'
import { OPENING_FIXED_ASSET_DETAIL_COLUMNS, OPENING_FIXED_ASSET_STATUS_SAVED } from '../constants/openingFixedAsset'
import {
  useGetOpeningAssetDetailsByBaseIdQuery,
  useSubmitOpeningAssetDetailsMutation,
} from '../services/assetApi'
import { formatOpeningFixedAssetError } from '../utils/openingFixedAssetApiError'

export default function OpeningFixedAssetImportDetailsModal({
  open,
  importRow,
  onClose,
  onSaved,
}) {
  const requestConfirm = useActionConfirm()
  const idMask = importRow?.idMask ?? ''
  const canSave = importRow?.status !== OPENING_FIXED_ASSET_STATUS_SAVED

  const { data: rows = [], isFetching } = useGetOpeningAssetDetailsByBaseIdQuery(idMask, {
    skip: !open || !idMask,
  })

  const [submitOpeningAssetDetails, { isLoading: saving }] =
    useSubmitOpeningAssetDetailsMutation()

  const columns = useMemo(
    () =>
      OPENING_FIXED_ASSET_DETAIL_COLUMNS.map((col) => ({
        header: col.header,
        key: col.key,
        align: col.align,
      })),
    [],
  )

  const runSave = useCallback(async () => {
    try {
      const result = await submitOpeningAssetDetails(idMask).unwrap()
      showAppToast(result.message || 'Asset information saved successfully.', 'success')
      onSaved?.()
      onClose()
    } catch (error) {
      const message = formatOpeningFixedAssetError(error)
      showAppToast(message, 'error')
    }
  }, [idMask, onClose, onSaved, submitOpeningAssetDetails])

  const handleSaveRequest = useCallback(() => {
    confirmBeforeAction(requestConfirm, {
      action: 'openingAssetSave',
      recordLabel: importRow?.fileName,
      stack: 'nested',
      showSuccessToast: false,
      runAction: runSave,
    })
  }, [importRow?.fileName, requestConfirm, runSave])

  const title = importRow?.fileName
    ? `Opening Fixed Asset — ${importRow.fileName}`
    : 'Opening Fixed Asset'

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={title}
      size="5xl"
      bodyMaxHeightClass="max-h-[80vh]"
      showFooter={false}
    >
      <div className="flex min-w-0 flex-col gap-4">
        <ProbityDataTable
          columns={columns}
          data={rows}
          keyExtractor={(row, index) => row.idMask || `opening-detail-${index}`}
          loading={isFetching}
          loadingMessage="Loading uploaded assets…"
          emptyMessage="-- No Details Found --"
          showRowNumbers
          horizontalScroll
          wrapHeaders
        />

        {canSave ? (
          <form
            className="flex flex-col"
            noValidate
            onSubmit={(event) => {
              event.preventDefault()
              handleSaveRequest()
            }}
          >
            <DomainFormFooter
              onCancel={onClose}
              submitLabel="Save"
              submitLoading={saving}
              showSubmit
            />
          </form>
        ) : (
          <p className="m-0 text-center text-sm text-slate-600 dark:text-slate-400">
            This upload has already been saved to asset information.
          </p>
        )}
      </div>
    </FormModal>
  )
}
