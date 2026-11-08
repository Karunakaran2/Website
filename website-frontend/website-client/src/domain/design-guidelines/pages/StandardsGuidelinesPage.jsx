import { Link } from 'react-router-dom'
import GuidelineCard from '../components/GuidelineCard'

const GUIDE_LINKS = [
  { title: 'Architecture & host shell', to: '/design-guidelines/guide-architecture/overview' },
  { title: 'Page Layout & Shell', to: '/design-guidelines/guide-layout/overview' },
  { title: 'Data Tables', to: '/design-guidelines/guide-datatable/overview' },
  { title: 'Interaction & Feedback', to: '/design-guidelines/guide-feedback/overview' },
  { title: 'Report Overview Demo', to: '/component-workbench/data-display/report-overview' },
]

export default function StandardsGuidelinesPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="rounded-lg border border-slate-200 bg-[#F4FAFF] px-4 py-3">
        <p className="m-0 text-xs text-slate-700">
          Deep dives and live examples:{' '}
          {GUIDE_LINKS.map((item, index) => (
            <span key={item.to}>
              {index > 0 ? ' · ' : null}
              <Link className="font-semibold text-[#01458e] hover:underline" to={item.to}>
                {item.title}
              </Link>
            </span>
          ))}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <GuidelineCard title="Form Standards" badge="Standards">
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            <li>Always provide visible, persistent labels above inputs linked via <code>htmlFor</code>.</li>
            <li>Mark required fields with a red asterisk (*) and set <code>aria-required="true"</code>.</li>
            <li>Format currency values using Indian numerical grouping (₹ lakhs and crores).</li>
            <li>Render inline validation error messages with red borders, icons, and <code>aria-invalid="true"</code>.</li>
          </ul>
        </GuidelineCard>

        <GuidelineCard title="Table & Data Grid Standards" badge="Standards">
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            <li>Provide searchable filters and column sorting indicators.</li>
            <li>Right-align numeric values and currency amounts; left-align textual names and categories.</li>
            <li>Always implement pagination bars showing total row counts and page selectors.</li>
            <li>Provide friendly empty states when zero records match the active query.</li>
          </ul>
          <p className="mt-3 text-xs">
            <Link className="font-semibold text-[#01458e] hover:underline" to="/design-guidelines/guide-datatable/overview">
              Data table guidelines
            </Link>
          </p>
        </GuidelineCard>

        <GuidelineCard title="Dialogs & Feedback Standards" badge="Standards">
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            <li>Always back destructive actions (Delete, Void) with an explicit confirmation dialog.</li>
            <li>Trap focus within active modals and restore focus to the trigger on close.</li>
            <li>Dismiss modals gracefully upon pressing the <kbd>Escape</kbd> key or clicking the backdrop.</li>
            <li>Use inline banners for non-blocking alerts; reserve modals for blocking decisions.</li>
          </ul>
          <p className="mt-3 text-xs">
            <Link className="font-semibold text-[#01458e] hover:underline" to="/design-guidelines/guide-feedback/overview">
              Interaction and feedback guidelines
            </Link>
          </p>
        </GuidelineCard>

        <GuidelineCard title="Error Handling & State Standards" badge="Standards">
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            <li>Wrap lazy route boundaries in React Error Boundaries to prevent whole-app crashes.</li>
            <li>Display pulse skeleton loaders during asynchronous data fetching instead of blank screens.</li>
            <li>Convert technical server errors to user-friendly messages via <code>apiErrorMessage()</code>.</li>
          </ul>
        </GuidelineCard>

        <GuidelineCard title="Host shell (routing & session)" badge="Mandatory">
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            <li>URL drives the active module page per tab; see Architecture guidelines and <code>docs/HOST_SHELL_INTEGRATION.md</code>.</li>
            <li>Mount session sync, scroll manager, and toast container once in the host — not per domain page.</li>
            <li>Page toolbars and primary actions align to <code>h-11</code> with form controls.</li>
          </ul>
          <p className="mt-3 text-xs">
            <Link className="font-semibold text-[#01458e] hover:underline" to="/design-guidelines/guide-architecture/overview">
              Open architecture guidelines
            </Link>
          </p>
        </GuidelineCard>
      </div>
    </div>
  )
}
