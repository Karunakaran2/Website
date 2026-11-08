import { CheckCircle2, Clock } from 'lucide-react'

function SummaryField({ label, value, mono = false }) {
  return (
    <div>
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="min-h-10 rounded-md border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-700">
        <span className={mono ? 'font-mono' : ''}>{value || '—'}</span>
      </div>
    </div>
  )
}

function TrackTimelineEntry({ label, time, done }) {
  return (
    <li className="flex gap-3">
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
        }`}
        aria-hidden
      >
        {done ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
      </span>
      <div className="min-w-0 flex-1 pb-4">
        <p className="m-0 text-sm font-semibold text-slate-800">{label}</p>
        <p className="m-0 mt-0.5 text-xs text-slate-500">{time}</p>
      </div>
    </li>
  )
}

/** Inline tracking result (full-page tracking route). */
export default function ApplicationTrackStatusPanel({
  trackingId,
  submittedDate = '',
  applicantName = '',
  status = 'Unknown',
  statusBadgeClass = 'bg-slate-100 text-slate-600',
  remark = '',
  timeline = [],
}) {
  return (
    <div className="space-y-5 font-noto" role="region" aria-label="Application status">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryField label="Tracking ID" value={trackingId} mono />
        <SummaryField label="Submitted By" value={applicantName || '—'} />
        <SummaryField label="Submitted Date" value={submittedDate || '—'} />
        <div>
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
            Status
          </span>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${statusBadgeClass}`}
          >
            {status}
          </span>
        </div>
      </div>

      {remark ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="m-0 text-[10px] font-bold uppercase tracking-wide text-slate-500">
            Processing remark
          </p>
          <p className="m-0 mt-2 text-sm leading-relaxed text-slate-700">{remark}</p>
        </div>
      ) : null}

      {timeline.length > 0 ? (
        <div>
          <h3 className="m-0 mb-3 text-xs font-bold uppercase tracking-wide text-slate-600">
            Progress
          </h3>
          <ol className="m-0 list-none p-0">
            {timeline.map((entry, index) => (
              <TrackTimelineEntry
                key={`${entry.label}-${index}`}
                label={entry.label}
                time={entry.time}
                done={Boolean(entry.done)}
              />
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  )
}
