import { GigwFormIconRowActions } from '@/shared/components/buttons/gigw'
import { IndianAmountBareInput, SelectField, inputControlClass } from '@/shared/components/forms'
import {
  PROBITY_TABLE_HEAD_CLASS,
  PROBITY_TABLE_HEAD_ROW_CLASS,
  PROBITY_TABLE_SHELL_CLASS,
  PROBITY_TABLE_TH_CLASS,
} from '@/shared/components/listing/listingTableStyles'
import { DOCUMENT_TYPE_OPTIONS, createEmptyDocumentLine } from '../constants/assetInformation'

export default function AssetInformationDocumentTable({ lines, onChange }) {
  const updateLine = (index, patch) => {
    onChange(
      lines.map((line, i) => (i === index ? { ...line, ...patch } : line)),
    )
  }

  const addLine = () => {
    onChange([...lines, createEmptyDocumentLine()])
  }

  const removeLine = (index) => {
    if (lines.length <= 1) {
      onChange([createEmptyDocumentLine()])
      return
    }
    onChange(lines.filter((_, i) => i !== index))
  }

  return (
    <div className="mt-4 space-y-2">
      <div className={`${PROBITY_TABLE_SHELL_CLASS} overflow-x-auto`}>
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className={PROBITY_TABLE_HEAD_CLASS}>
            <tr className={PROBITY_TABLE_HEAD_ROW_CLASS}>
              <th colSpan={6} className={`${PROBITY_TABLE_TH_CLASS} text-center`}>
                Document Info
              </th>
            </tr>
            <tr className={PROBITY_TABLE_HEAD_ROW_CLASS}>
              <th className={`${PROBITY_TABLE_TH_CLASS} w-[4.75rem] text-center`}>Sl. No.</th>
              <th className={`${PROBITY_TABLE_TH_CLASS} w-[18%] text-center`}>Document type</th>
              <th className={`${PROBITY_TABLE_TH_CLASS} w-[18%] text-center`}>Document number</th>
              <th className={`${PROBITY_TABLE_TH_CLASS} w-[16%] text-center`}>Document amount</th>
              <th className={`${PROBITY_TABLE_TH_CLASS} w-[16%] text-center`}>Open amount</th>
              <th className={`${PROBITY_TABLE_TH_CLASS} w-[32%] text-center`}>
                Capitalization amount
              </th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, index) => (
              <tr key={line.localKey} className="border-b border-slate-100">
                <td className="px-2 py-2 text-center align-middle tabular-nums">{index + 1}</td>
                <td className="px-2 py-2 text-center align-middle">
                  <SelectField
                    name={`documentType-${index}`}
                    value={line.documentType}
                    onChange={(event) => updateLine(index, { documentType: event.target.value })}
                    wrapperClassName="!mt-0"
                    className="!mt-0 uppercase"
                  >
                    {DOCUMENT_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </SelectField>
                </td>
                <td className="px-2 py-2 text-center align-middle">
                  <input
                    type="text"
                    className="input-field !mt-0 w-full text-sm"
                    placeholder="Document number"
                    value={line.documentNumber}
                    onChange={(event) => updateLine(index, { documentNumber: event.target.value })}
                  />
                </td>
                <td className="px-2 py-2 text-center align-middle">
                  <IndianAmountBareInput
                    className={`${inputControlClass} !mt-0 !h-9 !min-h-9 !max-h-9 w-full !py-1.5 text-right text-sm`}
                    placeholder="0.00"
                    aria-label="Document amount"
                    value={line.documentAmount}
                    onChange={(event) => updateLine(index, { documentAmount: event.target.value })}
                  />
                </td>
                <td className="px-2 py-2 text-center align-middle">
                  <IndianAmountBareInput
                    className={`${inputControlClass} !mt-0 !h-9 !min-h-9 !max-h-9 w-full !py-1.5 text-right text-sm`}
                    placeholder="0.00"
                    aria-label="Open amount"
                    value={line.openAmount}
                    onChange={(event) => updateLine(index, { openAmount: event.target.value })}
                  />
                </td>
                <td className="px-2 py-2 text-center align-middle">
                  <div className="flex items-center gap-2">
                    <IndianAmountBareInput
                      className={`${inputControlClass} !mt-0 !h-9 !min-h-9 !max-h-9 min-w-0 flex-1 !py-1.5 text-right text-sm`}
                      placeholder="0.00"
                      aria-label="Capitalization amount"
                      value={line.capitalizationAmount}
                      onChange={(event) =>
                        updateLine(index, { capitalizationAmount: event.target.value })
                      }
                    />
                    <GigwFormIconRowActions
                      canRemove={lines.length > 1}
                      showAdd={index === lines.length - 1}
                      onRemove={() => removeLine(index)}
                      onAdd={addLine}
                      removeLabel={`Remove document row ${index + 1}`}
                      addLabel="Add document row"
                      className="flex shrink-0 items-center gap-1 pb-0"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
