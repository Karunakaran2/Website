import { FormModal, OrgDataDisplay } from '@/shared/components'
import { DomainFormFooter } from '@/shared/components/domain'
import { InputField } from '@/shared/components/forms'
import { PORTAL_MODAL_TITLE_CLASS } from '@/shared/components/modals/modalChrome'
import { MODULE_FORM_ERROR_BANNER_CLASS } from '@/shared/constants/moduleLayoutStyles'
import { formatAssetDisplayDate } from '../utils/assetDateFormat'
import AssetEditFormSkeleton from './AssetModalSkeleton'

function displayValue(value) {
  if (value == null || value === '') {
    return '—'
  }
  return value
}

/**
 * Probity 2.0 {@code faInformationForwared}: approved asset — only description is editable.
 */
export default function AssetViewAllEditDescriptionModal({
  open,
  row,
  loading = false,
  formError = '',
  assetDescription = '',
  onDescriptionChange,
  onClose,
  onSubmit,
  submitLoading = false,
}) {
  const readOnlyItems = row
    ? [
        { label: 'Asset Id', value: displayValue(row.assetId), required: true },
        { label: 'Asset Type', value: displayValue(row.assetTypeLabel), required: true },
        {
          label: 'Capitalisation Date',
          value: formatAssetDisplayDate(row.capitalisationDate),
          required: true,
        },
        {
          label: 'Put to Use Date',
          value: formatAssetDisplayDate(row.putToUseDate),
          required: true,
        },
      ]
    : []

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Edit asset description"
      titleClassName={PORTAL_MODAL_TITLE_CLASS}
      showFooter={false}
      size="lg"
    >
      {loading ? (
        <AssetEditFormSkeleton
          sections={[{ fields: 5, cols: 1 }]}
          loadingMessage="Loading asset…"
        />
      ) : (
        <form
          className="flex min-w-0 flex-col gap-4"
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit?.()
          }}
        >
          {formError ? (
            <p className={MODULE_FORM_ERROR_BANNER_CLASS} role="alert">
              {formError}
            </p>
          ) : null}

          <OrgDataDisplay items={readOnlyItems} />

          <InputField
            label="Asset Description"
            name="assetDescription"
            value={assetDescription}
            onChange={(event) => onDescriptionChange?.(event.target.value)}
            required
          />

          <DomainFormFooter
            onCancel={onClose}
            submitLabel="Update"
            submitLoading={submitLoading}
          />
        </form>
      )}
    </FormModal>
  )
}
