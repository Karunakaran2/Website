import {
  FieldGrid,
  InputField,
  SelectField,
} from '@/shared/components/forms'
import { DomainFormFooter } from '@/shared/components/domain'
import { MODULE_FORM_ERROR_BANNER_CLASS } from '@/shared/constants/moduleLayoutStyles'
import {
  DEPRECIATION_CATEGORY_OPTIONS,
  depreciationCategoryRequiresList,
} from '../constants/assetDepreciation'
import AssetDepreciationCategorySearch from './AssetDepreciationCategorySearch'
import AssetDepreciationPreviewTable from './AssetDepreciationPreviewTable'

export default function AssetDepreciationProcessForm({
  values,
  fieldErrors = {},
  formError,
  previewLoading,
  previewLines = [],
  previewTotal = 0,
  approving,
  onChange,
  onLoadPreview,
  onApprove,
  onCancel,
}) {
  const canApprove = previewLines.length > 0
  const showCategorySearch = depreciationCategoryRequiresList(values.category)

  const handleField =
    (field) =>
    (event) => {
      onChange(field, event?.target?.value ?? event)
    }

  const handleCategoryChange = (event) => {
    const next = event.target.value
    onChange('category', next)
    onChange('categoryList', '')
  }

  return (
    <form
      className="flex min-w-0 flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        if (canApprove) {
          onApprove()
        } else {
          onLoadPreview()
        }
      }}
      noValidate
    >
      {formError ? (
        <p className={MODULE_FORM_ERROR_BANNER_CLASS} role="alert">
          {formError}
        </p>
      ) : null}

      <FieldGrid cols={3}>
        <InputField
          label="Depreciation No"
          name="depreciationNo"
          value={values.depreciationNo}
          readOnly
          placeholder="Depreciation No"
        />
        <InputField
          label="Date"
          name="depreciationDateStr"
          type="date"
          value={values.depreciationDateStr}
          onChange={handleField('depreciationDateStr')}
          required
          error={fieldErrors.depreciationDateStr}
        />
        <InputField
          label="Process upto"
          name="processUpToStr"
          type="date"
          value={values.processUpToStr}
          readOnly
        />
        <SelectField
          label="Depreciation Category"
          name="category"
          value={values.category}
          onChange={handleCategoryChange}
          required
          error={fieldErrors.category}
          className="uppercase"
        >
          {DEPRECIATION_CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </SelectField>
        {showCategorySearch ? (
          <AssetDepreciationCategorySearch
            category={values.category}
            value={values.categoryList}
            onChange={(next) => onChange('categoryList', next)}
            error={fieldErrors.categoryList}
          />
        ) : null}
      </FieldGrid>

      <AssetDepreciationPreviewTable
        lines={previewLines}
        total={previewTotal}
        loading={previewLoading}
      />

      <DomainFormFooter
        onCancel={onCancel}
        submitLabel={canApprove ? 'Approve' : 'Process'}
        submitLoading={canApprove ? approving : previewLoading}
        showSubmit
      />
    </form>
  )
}
