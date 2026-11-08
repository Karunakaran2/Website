import PropTypes from 'prop-types'
import { FieldHint } from '@/shared/components/forms'
import { formatDisplayDateTime } from '@/shared/utils/probityFormat'

/**
 * Read-only query timeline (Probity VoucherQueryList presentation, without voucher RTK attachments).
 * Attachments: pass `attachments` on each query row when a mock/real API provides file metadata.
 */
export default function WorkflowQueryHistoryTimeline({
  queries = [],
  isLoading = false,
  showEmptyState = true,
  emptyTitle = 'No queries raised yet',
  emptyBody = 'Raise a query using the form above. Queries appear here only after you save or send them.',
}) {
  const rows = Array.isArray(queries) ? [...queries] : []
  rows.sort((a, b) => {
    const ta = a?.raisedOn || a?.queriedOn ? new Date(a.raisedOn || a.queriedOn).getTime() : 0
    const tb = b?.raisedOn || b?.queriedOn ? new Date(b.raisedOn || b.queriedOn).getTime() : 0
    return ta - tb
  })

  if (isLoading) {
    return <p className="text-sm text-slate-600">Loading query history…</p>
  }

  if (rows.length === 0) {
    if (!showEmptyState) return null
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-4">
        <p className="m-0 text-sm font-medium text-slate-700">{emptyTitle}</p>
        <p className="m-0 mt-1 text-[13px] leading-relaxed text-slate-600">{emptyBody}</p>
      </div>
    )
  }

  return (
    <div>
      <FieldHint className="mb-3 mt-0">Oldest first — saved queries only (unsaved draft text is not listed).</FieldHint>
      <ol className="m-0 list-none space-y-0 p-0">
        {rows.map((query, index) => {
          const isLast = index === rows.length - 1
          const when = query.raisedOn || query.queriedOn
          return (
            <li key={query.id || query.idMask} className="relative flex gap-3 pb-5 last:pb-0">
              <div className="relative flex w-4 shrink-0 flex-col items-center pt-1">
                <span
                  className="relative z-[1] size-2.5 shrink-0 rounded-full bg-[#01458e] ring-4 ring-slate-50/80"
                  aria-hidden
                />
                {!isLast ? (
                  <span className="absolute top-3 bottom-0 w-px bg-slate-200" aria-hidden />
                ) : null}
              </div>
              <div className="min-w-0 flex-1 pb-0.5">
                <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                  <p className="m-0 min-w-0 flex-1 whitespace-pre-wrap break-words text-sm text-slate-800">
                    {query.text || query.remarks}
                  </p>
                  {when ? (
                    <time className="shrink-0 text-xs tabular-nums text-slate-500" dateTime={when}>
                      {formatDisplayDateTime(when) || when}
                    </time>
                  ) : null}
                </div>
                {query.status ? (
                  <p className="mt-1 text-xs font-medium text-slate-600">Status: {query.status}</p>
                ) : null}
                {query.response ? (
                  <p className="mt-2 rounded-md border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">Response: </span>
                    {query.response}
                  </p>
                ) : null}
                {query.attachments?.length ? (
                  <ul className="mt-2 space-y-1 text-xs text-slate-600" aria-label="Query attachments">
                    {query.attachments.map((file) => (
                      <li key={file.id || file.name} className="truncate">
                        {file.name || file.originalFileName}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

WorkflowQueryHistoryTimeline.propTypes = {
  queries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      idMask: PropTypes.string,
      text: PropTypes.string,
      remarks: PropTypes.string,
      status: PropTypes.string,
      raisedOn: PropTypes.string,
      queriedOn: PropTypes.string,
      response: PropTypes.string,
      attachments: PropTypes.array,
    }),
  ),
  isLoading: PropTypes.bool,
  showEmptyState: PropTypes.bool,
  emptyTitle: PropTypes.string,
  emptyBody: PropTypes.string,
}
