import { useState } from 'react'
import { ActionButton, TableViewAction, TableEditAction, TableDeleteAction, GigwIconButton, TableRowActionsGroup } from '@/shared/components/buttons'
import { Plus, Download, Printer, Eye, Pencil, Trash2 } from 'lucide-react'

export default function ButtonPlayground() {
  const [variant, setVariant] = useState('primary')
  const [disabled, setDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hideIcon, setHideIcon] = useState(false)
  const [iconOnly, setIconOnly] = useState(false)
  const [customLabel, setCustomLabel] = useState('')
  const [clickCount, setClickCount] = useState(0)

  const VARIANTS = [
    'primary',
    'submit',
    'save',
    'reset',
    'cancel',
    'delete',
    'excel',
    'pdf',
    'verify',
    'approve',
    'view',
    'edit',
    'add',
  ]

  const generatedCode = `<ActionButton
  variant="${variant}"${disabled ? '\n  disabled' : ''}${loading ? '\n  loading' : ''}${
    hideIcon ? '\n  hideIcon' : ''
  }${iconOnly ? '\n  iconOnly' : ''}${customLabel ? `\n  onClick={() => {}}` : ''}
>
  ${customLabel || (variant === 'primary' ? 'Primary Action' : '')}
</ActionButton>`

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-4 rounded-xl bg-white p-5 border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">
            Playground Controls (Shared ActionButton)
          </h3>

          {/* Variant Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Semantic Variant (<code>variant</code>)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {VARIANTS.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVariant(v)}
                  className={`capitalize px-2.5 py-1.5 rounded text-xs font-medium border transition-colors ${
                    variant === v
                      ? 'bg-[#01458e] text-white border-[#01458e] font-semibold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Label Input */}
          <div>
            <label htmlFor="custom-label-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Custom Children / Label (leave blank for variant default)
            </label>
            <input
              id="custom-label-input"
              type="text"
              placeholder="e.g. Save Record"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-[#01458e] focus:outline-none focus:ring-1 focus:ring-[#01458e]"
            />
          </div>

          {/* State Toggles */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={disabled}
                onChange={(e) => setDisabled(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#01458e] focus:ring-[#01458e]"
              />
              <span>Disabled (<code>disabled</code>)</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={loading}
                onChange={(e) => setLoading(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#01458e] focus:ring-[#01458e]"
              />
              <span>Loading (<code>loading</code>)</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={hideIcon}
                onChange={(e) => setHideIcon(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#01458e] focus:ring-[#01458e]"
              />
              <span>Hide Icon (<code>hideIcon</code>)</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={iconOnly}
                onChange={(e) => setIconOnly(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#01458e] focus:ring-[#01458e]"
              />
              <span>Icon Only (<code>iconOnly</code>)</span>
            </label>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-6 flex flex-col justify-between rounded-xl bg-white p-6 border border-slate-200 shadow-xs">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-4">
              Live Preview (Real Shared ActionButton)
            </h3>

            <div className="flex min-h-[140px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50/50 p-6">
              <ActionButton
                variant={variant}
                disabled={disabled}
                loading={loading}
                hideIcon={hideIcon}
                iconOnly={iconOnly}
                onClick={() => setClickCount((c) => c + 1)}
              >
                {customLabel || (variant === 'primary' ? 'Primary Action' : undefined)}
              </ActionButton>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>Interactive clicks: <strong className="text-slate-800">{clickCount}</strong></span>
              <span>Focus with <kbd className="rounded border border-slate-200 bg-slate-100 px-1 py-0.5 text-[10px]">Tab</kbd> to test focus ring</span>
            </div>
          </div>

          {/* Generated Code */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500">JSX Output:</span>
            <pre className="mt-1.5 overflow-x-auto rounded bg-slate-900 p-3 text-[11px] font-mono text-slate-100">
              <code>{generatedCode}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Table Row Action Buttons Demonstration */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">
          Table Row Action Buttons (Probity & GIGW Standard)
        </h3>
        <p className="text-xs text-slate-600">
          Pre-styled 36px circular GIGW icon buttons used across all enterprise DataTables:
        </p>
        <div className="flex flex-wrap items-center gap-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2">
            <TableViewAction onClick={() => {}} title="View Record" />
            <span className="text-xs text-slate-700"><code>TableViewAction</code> (Eye, info tone)</span>
          </div>
          <div className="flex items-center gap-2">
            <TableEditAction onClick={() => {}} title="Edit Record" />
            <span className="text-xs text-slate-700"><code>TableEditAction</code> (Pencil, info tone)</span>
          </div>
          <div className="flex items-center gap-2">
            <TableDeleteAction onClick={() => {}} title="Delete Record" />
            <span className="text-xs text-slate-700"><code>TableDeleteAction</code> (Trash2, destructive tone)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
