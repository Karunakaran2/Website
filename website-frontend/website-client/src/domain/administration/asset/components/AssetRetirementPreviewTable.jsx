import { useMemo } from 'react'
import { IndianAmountBareInput, SelectField, formCheckboxControlClass } from '@/shared/components/forms'
import {
  formatRetirementMoney,
  RETIREMENT_SALES_VALUE_COLUMN_HEADER,
  RETIREMENT_TYPE_OPTIONS,
} from '../constants/assetRetirement'
import ProbityDataTable from '@/shared/components/listing/ProbityDataTable'
import {
  PROBITY_TABLE_DEFAULT_EMPTY_MESSAGE,
  PROBITY_TABLE_EMPTY_CLASS,
  PROBITY_TABLE_SHELL_CLASS,
} from '@/shared/components/listing/listingTableStyles'
import { TABLE_SERIAL_HEADER, TABLE_SERIAL_WIDTH_CLASS } from '@/shared/components/listing/tableSerial'
import AssetRetirementCustomerSearch from './AssetRetirementCustomerSearch'

const PREVIEW_COLUMN_COUNT = 9

export default function AssetRetirementPreviewTable({
  lines = [],
  loading,
  salesNumberingGroups = [],
  salesNumberingIdMask,
  onSalesNumberingChange,
  onLineChange,
  onSelectAllChange,
  customers = [],
}) {
  const allSelected = useMemo(
    () => lines.length > 0 && lines.every((line) => line.selected),
    [lines],
  )

  if (loading) {
    return (
      <ProbityDataTable
        columns={[
          { header: TABLE_SERIAL_HEADER, isSerial: true },
          { header: 'Select' },
          { header: 'Asset Id' },
          { header: 'Description' },
          { header: 'Asset Value' },
          { header: 'Book Value' },
          { header: 'Retirement Type' },
          { header: RETIREMENT_SALES_VALUE_COLUMN_HEADER },
          { header: 'Customer' },
        ]}
        data={[]}
        loading
        loadingMessage="Loading preview…"
        showRowNumbers={false}
        horizontalScroll
      />
    )
  }

  const anySelectedSale = lines.some(
    (line) => line.selected && line.retirementType === 'Sale',
  )

  return (
    <div className="flex min-w-0 flex-col gap-3">
      {anySelectedSale && salesNumberingGroups.length > 0 ? (
        <SelectField
          label="Sales Numbering Group"
          name="salesNumberingIdMask"
          value={salesNumberingIdMask ?? ''}
          onChange={(event) => onSalesNumberingChange?.(event.target.value)}
          required
          className="uppercase max-w-md"
        >
          <option value="">Select sales numbering group</option>
          {salesNumberingGroups.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </SelectField>
      ) : null}

      <div className={`overflow-x-auto ${PROBITY_TABLE_SHELL_CLASS}`}>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-[#F4FAFF] text-center text-slate-700 dark:bg-slate-900">
              <th className={`px-3 py-2 text-center font-medium ${TABLE_SERIAL_WIDTH_CLASS}`}>
                {TABLE_SERIAL_HEADER}
              </th>
              <th className="w-10 px-2 py-2 text-center align-middle">
                <input
                  type="checkbox"
                  className={formCheckboxControlClass}
                  title="Select all"
                  checked={allSelected}
                  disabled={lines.length === 0}
                  aria-label="Select all assets"
                  onChange={(event) => onSelectAllChange?.(event.target.checked)}
                />
              </th>
              <th className="px-3 py-2 text-center align-middle font-medium">Asset Id</th>
              <th className="px-3 py-2 text-center align-middle font-medium">Description</th>
              <th className="px-3 py-2 text-center align-middle font-medium !text-right">Asset Value</th>
              <th className="px-3 py-2 text-center align-middle font-medium !text-right">Book Value</th>
              <th className="px-3 py-2 text-center align-middle font-medium">Retirement Type</th>
              <th className="px-3 py-2 text-center align-middle font-medium !text-right">
                {RETIREMENT_SALES_VALUE_COLUMN_HEADER}
              </th>
              <th className="px-3 py-2 text-center align-middle font-medium">Customer</th>
            </tr>
          </thead>
          <tbody>
            {lines.length === 0 ? (
              <tr>
                <td colSpan={PREVIEW_COLUMN_COUNT} className={PROBITY_TABLE_EMPTY_CLASS}>
                  {PROBITY_TABLE_DEFAULT_EMPTY_MESSAGE}
                </td>
              </tr>
            ) : (
              lines.map((line, index) => {
                const rowActive = Boolean(line.selected)
                const amountFieldEnabled = rowActive
                const customerFieldEnabled = rowActive
                return (
                  <tr key={line.assetInformationIdMask} className="border-b border-slate-100">
                    <td
                      className={`px-3 py-2 text-center align-middle tabular-nums ${TABLE_SERIAL_WIDTH_CLASS}`}
                    >
                      {index + 1}
                    </td>
                    <td className="px-2 py-2 text-center align-middle">
                      <input
                        type="checkbox"
                        className={formCheckboxControlClass}
                        title="Select asset"
                        checked={Boolean(line.selected)}
                        aria-label={`Select ${line.assetId}`}
                        onChange={(event) =>
                          onLineChange?.(line.assetInformationIdMask, 'selected', event.target.checked)
                        }
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-center align-middle">{line.assetId}</td>
                    <td className="px-3 py-2 text-center align-middle">{line.assetDescription}</td>
                    <td className="px-3 py-2 text-center align-middle !text-right tabular-nums">
                      {formatRetirementMoney(line.assetCost)}
                    </td>
                    <td className="px-3 py-2 text-center align-middle !text-right tabular-nums">
                      {formatRetirementMoney(line.bookValue)}
                    </td>
                    <td className="px-3 py-2 text-center align-middle">
                      <select
                        className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm uppercase disabled:cursor-not-allowed disabled:bg-slate-100"
                        value={line.retirementType}
                        disabled={!rowActive}
                        onChange={(event) =>
                          onLineChange?.(
                            line.assetInformationIdMask,
                            'retirementType',
                            event.target.value,
                          )
                        }
                      >
                        {RETIREMENT_TYPE_OPTIONS.filter(
                          (opt) => opt.value === 'Sale' || opt.value === 'Scrap',
                        ).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2 text-center align-middle">
                      <IndianAmountBareInput
                        value={line.saleValue}
                        readOnly={!amountFieldEnabled}
                        disabled={!amountFieldEnabled}
                        onChange={(event) =>
                          onLineChange?.(line.assetInformationIdMask, 'saleValue', event.target.value)
                        }
                        className="!h-9 !min-h-9 !max-h-9 w-full !py-1.5 text-right text-sm disabled:cursor-not-allowed disabled:bg-slate-100"
                        aria-label="Sale or scrap value"
                      />
                    </td>
                    <td className="px-3 py-2 text-center align-middle">
                      <AssetRetirementCustomerSearch
                        value={line.customerId ?? ''}
                        customers={customers}
                        disabled={!customerFieldEnabled}
                        onChange={(customerId) => {
                          onLineChange?.(line.assetInformationIdMask, 'customerId', customerId)
                        }}
                      />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
