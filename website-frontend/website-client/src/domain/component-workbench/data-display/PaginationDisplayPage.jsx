import { useState } from 'react'
import TablePaginationBar from '@/shared/components/DataTable/TablePaginationBar'
import { SelectField } from '@/shared/components/forms'
import { ActionButton } from '@/shared/components/buttons'

export default function PaginationDisplayPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState(148)

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* 1. Primary Interactive Pagination Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Table Pagination Bar (TablePaginationBar)</h2>
          <p className="mt-1 text-xs text-slate-500">
            Complies with GIGW & WCAG 2.2 AA: minimum 44px touch targets, accessible aria-labels, sibling page calculations, and clean range summaries.
          </p>
        </div>

        {/* Live Pagination Component */}
        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
          <TablePaginationBar
            page={page}
            pageSize={pageSize}
            total={totalRecords}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>

        {/* Controls to manipulate pagination props */}
        <div className="mt-6 border-t border-slate-100 pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            Interactive Test Controls
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SelectField
              id="pagination-size-select"
              name="pageSize"
              label="Page Size (Rows per Page)"
              value={String(pageSize)}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setPage(1)
              }}
              options={[
                { value: '5', label: '5 per page' },
                { value: '10', label: '10 per page' },
                { value: '25', label: '25 per page' },
                { value: '50', label: '50 per page' },
              ]}
            />

            <SelectField
              id="pagination-total-select"
              name="totalRecords"
              label="Simulated Total Records"
              value={String(totalRecords)}
              onChange={(e) => {
                setTotalRecords(Number(e.target.value))
                setPage(1)
              }}
              options={[
                { value: '0', label: '0 records (Empty state)' },
                { value: '8', label: '8 records (Single page)' },
                { value: '35', label: '35 records (Few pages)' },
                { value: '148', label: '148 records (Truncated with ellipsis)' },
                { value: '520', label: '520 records (High volume)' },
              ]}
            />

            <div className="flex flex-col justify-end">
              <ActionButton
                type="button"
                variant="reset"
                onClick={() => {
                  setPage(1)
                  setPageSize(10)
                  setTotalRecords(148)
                }}
              >
                Reset Default State
              </ActionButton>
            </div>
          </div>
        </div>

        {/* Telemetry Display */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-md bg-white p-3 border border-slate-200 text-xs text-slate-600">
          <span>Current Active Page: <strong className="text-slate-900">{page}</strong></span>
          <span>Calculated Total Pages: <strong className="text-slate-900">{Math.ceil(totalRecords / pageSize) || 1}</strong></span>
          <span>Index Range: <strong className="text-slate-900">{(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalRecords)}</strong></span>
        </div>
      </div>

      {/* 2. Accessibility & Behavior Spec */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Keyboard & Screen Reader Behavior</h2>
          <p className="mt-1 text-xs text-slate-500">
            How TablePaginationBar satisfies government accessibility guidelines.
          </p>
        </div>

        <div className="space-y-3 text-xs text-slate-600">
          <div className="flex items-start gap-2.5">
            <span className="font-mono font-semibold text-[#01458e] shrink-0">1.</span>
            <p><strong>First / Last Quick Jump:</strong> Dual chevrons (<kbd>«</kbd> / <kbd>»</kbd>) allow instantaneous navigation to the first or terminal page of large datasets without sequential clicking.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="font-mono font-semibold text-[#01458e] shrink-0">2.</span>
            <p><strong>Ellipsis Truncation:</strong> When total pages exceed 5, an ellipsis indicator (<kbd>…</kbd>) truncates non-adjacent sibling pages to maintain a compact, non-wrapping toolbar layout.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="font-mono font-semibold text-[#01458e] shrink-0">3.</span>
            <p><strong>Keyboard Navigation:</strong> All navigation buttons are focusable via <kbd>Tab</kbd> key with standard high-visibility focus outline and activation on <kbd>Enter</kbd> or <kbd>Space</kbd>.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
