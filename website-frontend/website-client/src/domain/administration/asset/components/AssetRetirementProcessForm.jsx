import { FieldGrid, InputField, SelectField } from '@/shared/components/forms'
import { DomainFormFooter } from '@/shared/components/domain'
import { MODULE_FORM_ERROR_BANNER_CLASS } from '@/shared/constants/moduleLayoutStyles'
import {
  RETIREMENT_CATEGORY_OPTIONS,
  retirementCategoryRequiresList,
} from '../constants/assetRetirement'
import AssetRetirementCategorySearch from './AssetRetirementCategorySearch'
import AssetRetirementPreviewTable from './AssetRetirementPreviewTable'

export default function AssetRetirementProcessForm({
  values,
  fieldErrors = {},
  formError,
  previewLoading,
  previewLines = [],
  previewState,
  retirementGroupOptions = [],
  customers = [],
  processing,
  onChange,
  onLoadPreview,
  onProcess,
  onPreviewLineChange,
  onPreviewSelectAllChange,
  onSalesNumberingChange,
  onCancel,
}) {
  const canProcess = previewLines.length > 0
  const showCategorySearch = retirementCategoryRequiresList(values.category)

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
        if (canProcess) {
          onProcess()
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
          label="Retirement Date"
          name="retirementDateStr"
          type="date"
          value={values.retirementDateStr}
          onChange={handleField('retirementDateStr')}
          required
          error={fieldErrors.retirementDateStr}
        />
        <InputField
          label="Retirement Count No (preview)"
          name="previewCountDisposalNumber"
          value={values.previewCountDisposalNumber ?? ''}
          readOnly
        />
        <SelectField
          label="Retirement Group"
          name="retirementGroupId"
          value={values.retirementGroupId}
          onChange={handleField('retirementGroupId')}
          required
          error={fieldErrors.retirementGroupId}
          className="uppercase"
        >
          <option value="">Select retirement group</option>
          {retirementGroupOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </SelectField>
        <SelectField
          label="Depreciation Category"
          name="category"
          value={values.category}
          onChange={handleCategoryChange}
          required
          error={fieldErrors.category}
          className="uppercase"
        >
          {RETIREMENT_CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </SelectField>
        {showCategorySearch ? (
          <AssetRetirementCategorySearch
            category={values.category}
            value={values.categoryList}
            onChange={(next) => onChange('categoryList', next)}
            error={fieldErrors.categoryList}
          />
        ) : null}
      </FieldGrid>

      <AssetRetirementPreviewTable
        lines={previewLines}
        loading={previewLoading}
        salesNumberingGroups={previewState?.salesNumberingGroups ?? []}
        salesNumberingIdMask={previewState?.salesNumberingIdMask}
        onSalesNumberingChange={onSalesNumberingChange}
        onLineChange={onPreviewLineChange}
        onSelectAllChange={onPreviewSelectAllChange}
        customers={customers}
      />

      <DomainFormFooter
        onCancel={onCancel}
        submitLabel={canProcess ? 'Process' : 'Load preview'}
        submitLoading={canProcess ? processing : previewLoading}
        showSubmit
      />
    </form>
  )
}
