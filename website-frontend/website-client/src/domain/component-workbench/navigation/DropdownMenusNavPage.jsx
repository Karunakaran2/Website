import { useState, useRef, useEffect } from 'react'
import {
  ChevronDown,
  Download,
  Share2,
  Trash2,
  Eye,
  FileSpreadsheet,
  FileText,
  Printer,
  MoreVertical,
  Check,
} from 'lucide-react'
import ActionButton from '@/shared/components/buttons/ActionButton'

export default function DropdownMenusNavPage() {
  const [actionMenuOpen, setActionMenuOpen] = useState(false)
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState('excel')
  const [lastAction, setLastAction] = useState(null)

  const actionMenuRef = useRef(null)
  const filterMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
        setActionMenuOpen(false)
      }
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target)) {
        setFilterMenuOpen(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActionMenuOpen(false)
        setFilterMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const triggerAction = (label) => {
    setLastAction(label)
    setActionMenuOpen(false)
    setFilterMenuOpen(false)
  }

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* 1. Action Dropdowns */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Action & Export Dropdown Menus</h2>
          <p className="mt-1 text-xs text-slate-500">
            Accessible popovers conforming to WAI-ARIA Menu pattern with Escape key close, click-outside dismissal, and clear semantic item hierarchy.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          {/* Export Actions Dropdown */}
          <div className="relative" ref={actionMenuRef}>
            <ActionButton
              type="button"
              variant="primary"
              onClick={() => setActionMenuOpen((v) => !v)}
              className="inline-flex items-center gap-2 text-xs"
              aria-haspopup="true"
              aria-expanded={actionMenuOpen}
            >
              <span>Export Report</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${actionMenuOpen ? 'rotate-180' : ''}`} />
            </ActionButton>

            {actionMenuOpen && (
              <ul
                role="menu"
                className="absolute left-0 top-full mt-1.5 w-52 rounded-lg border border-slate-200 bg-white py-1 shadow-xl z-50 animate-fadeIn text-xs divide-y divide-slate-100"
              >
                <div className="py-1">
                  <li role="none">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => triggerAction('Exported as Excel Workbook (XLSX)')}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-black transition-colors"
                    >
                      <FileSpreadsheet size={15} className="text-emerald-600 shrink-0" />
                      <span>Microsoft Excel (.xlsx)</span>
                    </button>
                  </li>
                  <li role="none">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => triggerAction('Exported as Official PDF Report')}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-black transition-colors"
                    >
                      <FileText size={15} className="text-rose-600 shrink-0" />
                      <span>PDF Statement (.pdf)</span>
                    </button>
                  </li>
                  <li role="none">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => triggerAction('Sent print job to default printer')}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-black transition-colors"
                    >
                      <Printer size={15} className="text-slate-500 shrink-0" />
                      <span>Print Summary</span>
                    </button>
                  </li>
                </div>

                <div className="py-1">
                  <li role="none">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => triggerAction('Shared link copied to clipboard')}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-black transition-colors"
                    >
                      <Share2 size={15} className="text-[#01458e] shrink-0" />
                      <span>Share Deep Link</span>
                    </button>
                  </li>
                </div>
              </ul>
            )}
          </div>

          {/* Quick Selection Dropdown */}
          <div className="relative" ref={filterMenuRef}>
            <ActionButton
              type="button"
              variant="cancel"
              onClick={() => setFilterMenuOpen((v) => !v)}
              className="inline-flex items-center gap-2 text-xs"
              aria-haspopup="true"
              aria-expanded={filterMenuOpen}
            >
              <span>Format: {selectedFormat === 'excel' ? 'Excel Spreadsheet' : 'PDF Document'}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${filterMenuOpen ? 'rotate-180' : ''}`} />
            </ActionButton>

            {filterMenuOpen && (
              <ul
                role="menu"
                className="absolute left-0 top-full mt-1.5 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-xl z-50 animate-fadeIn text-xs"
              >
                <li role="none">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setSelectedFormat('excel')
                      triggerAction('Set format to Excel')
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    <span>Excel Spreadsheet</span>
                    {selectedFormat === 'excel' && <Check size={14} className="text-[#01458e]" />}
                  </button>
                </li>
                <li role="none">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setSelectedFormat('pdf')
                      triggerAction('Set format to PDF')
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    <span>PDF Document</span>
                    {selectedFormat === 'pdf' && <Check size={14} className="text-[#01458e]" />}
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Telemetry Display */}
        {lastAction && (
          <div className="mt-6 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50/70 px-4 py-2.5 text-xs text-[#01458e]">
            <span>Triggered Action: <strong>{lastAction}</strong></span>
            <button
              type="button"
              onClick={() => setLastAction(null)}
              className="text-xs font-semibold underline hover:text-[#002f6c]"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* 2. Dropdown Menu Accessibility Rules */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Menu Accessibility Specifications</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-1">Aria Attributes</h4>
            <p>Trigger button must specify <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">aria-haspopup="true"</code> and dynamic <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">aria-expanded</code> state.</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-1">Escape Key Closure</h4>
            <p>Pressing <kbd className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">Escape</kbd> at any point immediately collapses the dropdown and restores focus to the trigger button.</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-1">Semantic Roles</h4>
            <p>Dropdown list uses <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">role="menu"</code> and items declare <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">role="menuitem"</code> for screen reader clarity.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
