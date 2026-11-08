import { useState } from 'react'
import { Loader2, RefreshCw } from 'lucide-react'
import { GigwButton } from '@/shared/components/buttons/gigw'
import {
  SkeletonRegion,
  FormSkeleton,
  PageCardSkeleton,
  SkeletonTextLines,
  SkeletonHeading,
  SkeletonCircle,
  SkeletonButton,
  SkeletonInput,
  SkeletonImage,
  MetricCardSkeleton,
  DashboardMetricsSkeleton,
  ListItemSkeleton,
  ProfileSkeleton,
  PageHeaderSkeleton,
  TableSkeleton,
  ReportResultsSkeleton,
  SplitPanelSkeleton,
} from '@/shared/components/skeleton'

function Section({ title, lead, children }) {
  return (
    <section className="w-full min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:p-6">
      <div className="mb-4 border-b border-slate-100 pb-3 sm:pb-4">
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        {lead ? <p className="mt-1 text-xs text-slate-600 leading-relaxed">{lead}</p> : null}
      </div>
      {children}
    </section>
  )
}

export default function LoadingStatesFeedbackPage() {
  const [showLoaded, setShowLoaded] = useState(false)
  const [lineCount, setLineCount] = useState(3)

  return (
    <div className="w-full min-w-0 space-y-6 pb-12">
      <Section
        title="Overview"
        lead="Skeleton placeholders mirror the layout of incoming content so users perceive structure while async data loads. Use skeletons for page mounts and tables; use inline spinners for short button actions. Replace skeletons with empty or error states when the request completes."
      >
        <ul className="m-0 list-disc space-y-1 ps-5 text-xs text-slate-700">
          <li>Import from <code className="text-[11px]">@/shared/components/skeleton</code></li>
          <li>Wrap groups in <code className="text-[11px]">SkeletonRegion</code> for one polite status message</li>
          <li>Pulse animation respects <code className="text-[11px]">prefers-reduced-motion</code></li>
        </ul>
      </Section>

      <Section title="Primitive variants" lead="Building blocks for custom layouts.">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-800">Text & heading</p>
            <SkeletonHeading />
            <SkeletonTextLines lines={lineCount} />
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-800">Avatar & controls</p>
            <SkeletonCircle size={48} />
            <SkeletonButton />
            <SkeletonInput />
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-800">Media block</p>
            <SkeletonImage />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-slate-100 pt-4">
          <label className="text-xs text-slate-700">
            Text lines:{' '}
            <input
              type="number"
              min={1}
              max={6}
              value={lineCount}
              onChange={(e) => setLineCount(Number(e.target.value) || 1)}
              className="input-field ml-1 h-8 w-16 text-xs"
            />
          </label>
        </div>
      </Section>

      <Section title="Content variants" lead="Cards, lists, profiles, and dashboard summaries.">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <MetricCardSkeleton />
          <ListItemSkeleton />
        </div>
        <div className="mt-4">
          <DashboardMetricsSkeleton count={4} />
        </div>
        <div className="mt-4">
          <ProfileSkeleton />
        </div>
      </Section>

      <Section title="Form variants" lead="Label + field grids for modal and page forms.">
        <FormSkeleton fields={6} cols={2} />
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <SkeletonButton className="h-9 w-20" />
          <SkeletonButton className="h-9 w-24" />
        </div>
      </Section>

      <Section title="DataTable variants" lead="Scrollable table region on narrow viewports; column header + body rows.">
        <TableSkeleton rows={5} columns={5} />
      </Section>

      <Section title="Page & layout variants" lead="Header band, full listing page, report split, and generate flow.">
        <PageHeaderSkeleton className="mb-4" />
        <SplitPanelSkeleton />
        <div className="mt-6">
          <ReportResultsSkeleton />
        </div>
        <div className="mt-6">
          <PageCardSkeleton variant="table" rows={4} columns={5} message="Loading listing…" />
        </div>
      </Section>

      <Section
        title="Live dashboard demo"
        lead="Toggle between skeleton layout and loaded content — dimensions align to reduce layout shift."
      >
        <div className="mb-4 flex flex-wrap justify-end gap-2">
          <GigwButton
            type="button"
            variant={showLoaded ? 'outlineUtility' : 'primary'}
            size="sm"
            icon={RefreshCw}
            onClick={() => setShowLoaded((v) => !v)}
          >
            {showLoaded ? 'Show skeletons' : 'Show loaded content'}
          </GigwButton>
        </div>
        {showLoaded ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {['Total Capital Works', 'Sanctioned', 'Pending', 'Audits'].map((label) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-white p-4">
                <span className="text-xs text-slate-500">{label}</span>
                <p className="mt-1 text-xl font-bold text-slate-900">₹14,50,00,000</p>
              </div>
            ))}
          </div>
        ) : (
          <SkeletonRegion message="Loading dashboard summary">
            <DashboardMetricsSkeleton count={4} />
            <div className="mt-4">
              <TableSkeleton rows={4} columns={4} />
            </div>
          </SkeletonRegion>
        )}
      </Section>

      <Section title="When to use what" lead="Do / Don't">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 text-xs text-slate-700">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="font-bold text-slate-900">Skeleton</p>
            <p className="mt-1">Known layout (table, form, dashboard cards) while fetching.</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="font-bold text-slate-900">Spinner</p>
            <p className="mt-1">
              Short actions — e.g. <Loader2 className="inline h-3.5 w-3.5 animate-spin" aria-hidden /> on submit.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="font-bold text-slate-900">Empty / error</p>
            <p className="mt-1">After load completes — never leave skeletons on failed requests.</p>
          </div>
        </div>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-900 p-3 text-[11px] text-slate-100">
{`import { ReportResultsSkeleton, SkeletonRegion } from '@/shared/components/skeleton'

{isLoading ? (
  <SkeletonRegion message="Generating report">
    <ReportResultsSkeleton />
  </SkeletonRegion>
) : (
  <ReportContent data={data} />
)}`}
        </pre>
      </Section>
    </div>
  )
}
